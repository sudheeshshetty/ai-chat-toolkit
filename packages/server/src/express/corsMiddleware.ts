import type { NextFunction, Request, Response } from "express";
import type { CorsOptions } from "../types.js";

/** Origins that must never be accepted (browser sends these for opaque/null origins). */
const BLOCKED_ORIGINS = new Set(["null", "undefined"]);

/**
 * Normalize an origin string to its canonical form (scheme + host + port).
 * Returns null if the value is not a safe http/https origin.
 */
function normalizeOrigin(origin: string | undefined): string | null {
  if (!origin || BLOCKED_ORIGINS.has(origin)) {
    return null;
  }
  try {
    const parsed = new URL(origin);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.origin;
  } catch {
    return null;
  }
}

export function createCorsMiddleware(options?: CorsOptions) {
  const credentials = options?.credentials === true;
  const configuredOrigin = options?.origin;

  // Pre-compute the allowlist at middleware-creation time (not per-request).
  // Values come entirely from static server config — never from request input.
  // Using Map.get() at request time returns these static values, which prevents
  // user-controlled taint from flowing into Access-Control-Allow-Origin headers
  // (satisfies CodeQL js/cors-misconfiguration-for-credentials).
  const allowedOriginMap = new Map<string, string>();
  if (typeof configuredOrigin === "string") {
    const normalized = normalizeOrigin(configuredOrigin);
    if (normalized) {
      allowedOriginMap.set(normalized, normalized);
    }
  } else if (Array.isArray(configuredOrigin)) {
    for (const o of configuredOrigin) {
      const normalized = normalizeOrigin(o);
      if (normalized) {
        allowedOriginMap.set(normalized, normalized);
      }
    }
  }

  return (req: Request, res: Response, next: NextFunction): void => {
    const requestOrigin = req.headers.origin;

    if (credentials) {
      // Credentials require an explicit origin allowlist (not origin: true).
      // Look up the request origin in the pre-built static map.
      // The value returned by Map.get() is a pre-computed static string —
      // it is never the raw request origin — so it is safe to use with credentials.
      const normalizedRequest = normalizeOrigin(requestOrigin);
      const matched = normalizedRequest
        ? (allowedOriginMap.get(normalizedRequest) ?? null)
        : null;

      if (matched !== null) {
        res.setHeader("Access-Control-Allow-Origin", matched);
        res.setHeader("Vary", "Origin");
        res.setHeader("Access-Control-Allow-Credentials", "true");
      }
    } else {
      let allowedOrigin: string | null = null;

      if (configuredOrigin === false) {
        // CORS disabled — set no Allow-Origin header.
        allowedOrigin = null;
      } else if (configuredOrigin === undefined || configuredOrigin === true) {
        // Allow all origins: use the "*" wildcard.
        // Do NOT reflect req.headers.origin — using "*" avoids writing
        // user-controlled input into the response header.
        allowedOrigin = "*";
      } else if (typeof configuredOrigin === "string") {
        allowedOrigin = normalizeOrigin(configuredOrigin);
      } else if (Array.isArray(configuredOrigin)) {
        // Same pre-built static map — Map.get() returns a static config value.
        const normalizedRequest = normalizeOrigin(requestOrigin);
        allowedOrigin = normalizedRequest
          ? (allowedOriginMap.get(normalizedRequest) ?? null)
          : null;
      }

      if (allowedOrigin) {
        res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
        // Vary is only meaningful when the response differs by origin (not for "*").
        if (allowedOrigin !== "*") {
          res.setHeader("Vary", "Origin");
        }
      }
    }

    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");

    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }

    next();
  };
}
