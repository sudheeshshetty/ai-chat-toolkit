import type { NextFunction, Request, Response } from "express";
import type { CorsOptions } from "../types.js";

const BLOCKED_ORIGINS = new Set(["null", "undefined"]);

/**
 * Normalizes a CONFIGURED origin (static server config only).
 * This function is NEVER called with req.headers.origin or any other
 * user-controlled input, so CodeQL does not model it as a taint propagator.
 * Keep it completely separate from normalizeRequestOrigin.
 */
function normalizeConfiguredOrigin(origin: string): string | null {
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

/**
 * Normalizes a REQUEST origin (user-controlled input).
 * Return value is tainted. Never use it as the value of Allow-Origin
 * alongside Allow-Credentials: true.
 * Keep it completely separate from normalizeConfiguredOrigin.
 */
function normalizeRequestOrigin(origin: string | undefined): string | null {
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

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export function createCorsMiddleware(options?: CorsOptions): Middleware {
  const credentials = options?.credentials === true;
  const configuredOrigin = options?.origin;

  // ── CREDENTIALS PATH ────────────────────────────────────────────────────────
  // Returned early as its own closure. It never calls normalizeRequestOrigin
  // and never reads req.headers.origin, so no user-controlled taint can reach
  // Allow-Origin. CodeQL js/cors-misconfiguration-for-credentials requires a
  // taint flow from a RemoteFlowSource to the Allow-Origin header value — that
  // flow does not exist in this closure.
  if (credentials) {
    if (typeof configuredOrigin !== "string") {
      throw new Error(
        "[ai-chat-toolkit-server] cors.credentials requires a single string origin. " +
          'Example: cors: { origin: "https://your-app.com", credentials: true }',
      );
    }
    // normalizeConfiguredOrigin is only ever called with static server config.
    // It is never called with req.headers.origin anywhere in this file.
    const staticOrigin = normalizeConfiguredOrigin(configuredOrigin);
    if (!staticOrigin) {
      throw new Error(
        `[ai-chat-toolkit-server] cors.origin "${configuredOrigin}" is not a valid http/https URL.`,
      );
    }
    // Inline closure — no shared helper with the no-credentials path below.
    // staticOrigin is a creation-time constant from server config.
    return (req: Request, res: Response, next: NextFunction): void => {
      res.setHeader("Access-Control-Allow-Origin", staticOrigin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
      if (req.method === "OPTIONS") {
        res.status(204).end();
        return;
      }
      next();
    };
  }

  // ── NO-CREDENTIALS PATH ─────────────────────────────────────────────────────
  // This closure never sets Allow-Credentials: true.
  // normalizeRequestOrigin (user-tainted) is only used here for boolean matching;
  // the value written to Allow-Origin always comes from the static allowedOrigins
  // array, never from the request.

  // Pre-normalize the allowlist at creation time using normalizeConfiguredOrigin
  // (never called with user input).
  const allowedOrigins: string[] = [];
  if (typeof configuredOrigin === "string") {
    const n = normalizeConfiguredOrigin(configuredOrigin);
    if (n) allowedOrigins.push(n);
  } else if (Array.isArray(configuredOrigin)) {
    for (const o of configuredOrigin) {
      const n = normalizeConfiguredOrigin(o);
      if (n) allowedOrigins.push(n);
    }
  }

  return (req: Request, res: Response, next: NextFunction): void => {
    let allowedOrigin: string | null = null;

    if (configuredOrigin === false) {
      allowedOrigin = null;
    } else if (configuredOrigin === undefined || configuredOrigin === true) {
      // Wildcard — use literal "*", never reflect req.headers.origin.
      allowedOrigin = "*";
    } else if (typeof configuredOrigin === "string") {
      // Static single origin from config — not derived from request input.
      allowedOrigin = allowedOrigins[0] ?? null;
    } else if (Array.isArray(configuredOrigin)) {
      // normalizeRequestOrigin result is only used for the boolean equality check.
      // The value assigned to allowedOrigin is `configured` — from the static
      // allowedOrigins array — never from req.headers.origin.
      const normalizedRequest = normalizeRequestOrigin(req.headers.origin);
      for (const configured of allowedOrigins) {
        if (configured === normalizedRequest) {
          allowedOrigin = configured;
          break;
        }
      }
    }

    if (allowedOrigin) {
      res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
      if (allowedOrigin !== "*") {
        res.setHeader("Vary", "Origin");
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
