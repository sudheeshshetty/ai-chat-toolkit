import type { NextFunction, Request, Response } from "express";
import type { CorsOptions } from "../types.js";

/** Origins that must never be accepted (browser sends these for opaque/null origins). */
const BLOCKED_ORIGINS = new Set(["null", "undefined"]);

/**
 * Normalize an origin string to its canonical scheme+host+port form.
 * Returns null for anything that is not a safe http/https origin.
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

  // Pre-normalize the configured allowlist once at creation time.
  // These are static, server-side values — never derived from request input.
  const allowedOrigins: string[] = [];
  if (typeof configuredOrigin === "string") {
    const n = normalizeOrigin(configuredOrigin);
    if (n) allowedOrigins.push(n);
  } else if (Array.isArray(configuredOrigin)) {
    for (const o of configuredOrigin) {
      const n = normalizeOrigin(o);
      if (n) allowedOrigins.push(n);
    }
  }

  return (req: Request, res: Response, next: NextFunction): void => {
    const requestOrigin = req.headers.origin;

    if (credentials) {
      // Iterate the static allowlist. `configured` is always a pre-computed
      // server-side string — it never originates from request input.
      // req.headers.origin is used ONLY for the boolean equality check;
      // it never flows into the response header value.
      const normalizedRequest = normalizeOrigin(requestOrigin);
      for (const configured of allowedOrigins) {
        if (configured === normalizedRequest) {
          // `configured` comes from the static allowedOrigins array, NOT from the
          // request — this breaks the taint chain CodeQL traces for credentials CORS.
          res.setHeader("Access-Control-Allow-Origin", configured);
          res.setHeader("Vary", "Origin");
          res.setHeader("Access-Control-Allow-Credentials", "true");
          break;
        }
      }
    } else {
      let allowedOrigin: string | null = null;

      if (configuredOrigin === false) {
        allowedOrigin = null;
      } else if (configuredOrigin === undefined || configuredOrigin === true) {
        // Wildcard — do NOT reflect req.headers.origin into the header value.
        allowedOrigin = "*";
      } else if (typeof configuredOrigin === "string") {
        // Static single origin — derived from config, not from request.
        allowedOrigin = normalizeOrigin(configuredOrigin);
      } else if (Array.isArray(configuredOrigin)) {
        // Same pattern: iterate static list, compare with request (boolean only),
        // use the static `configured` value — never the request value.
        const normalizedRequest = normalizeOrigin(requestOrigin);
        for (const configured of allowedOrigins) {
          if (configured === normalizedRequest) {
            allowedOrigin = configured;
            break;
          }
        }
      }

      if (allowedOrigin) {
        res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
        // Vary is only meaningful when the value differs per request (not for "*").
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
