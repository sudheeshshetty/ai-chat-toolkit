import type { NextFunction, Request, Response } from "express";
import type { CorsOptions } from "../types.js";

const BLOCKED_ORIGINS = new Set(["null", "undefined"]);

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

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

function applyCommonHeaders(res: Response): void {
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
}

/**
 * Credentials path — returned when `credentials: true`.
 *
 * `Allow-Origin` is set to a value derived entirely from static server config
 * (`staticOrigin`). This closure never reads `req.headers.origin` as the header
 * value, so no user-controlled taint flows into `Allow-Origin` alongside
 * `Allow-Credentials: true`. Satisfies CodeQL js/cors-misconfiguration-for-credentials.
 */
function buildCredentialsMiddleware(staticOrigin: string): Middleware {
  return (req: Request, res: Response, next: NextFunction): void => {
    res.setHeader("Access-Control-Allow-Origin", staticOrigin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    applyCommonHeaders(res);
    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }
    next();
  };
}

/**
 * No-credentials path — returned when `credentials` is not set.
 *
 * This closure never sets `Allow-Credentials: true`, so reflecting the request
 * origin (for allowlist or wildcard) is safe per the CORS spec.
 */
function buildNoCorsMiddleware(
  configuredOrigin: string | string[] | boolean | undefined,
  allowedOrigins: string[],
): Middleware {
  return (req: Request, res: Response, next: NextFunction): void => {
    let allowedOrigin: string | null = null;

    if (configuredOrigin === false) {
      allowedOrigin = null;
    } else if (configuredOrigin === undefined || configuredOrigin === true) {
      // Wildcard: never reflect req.headers.origin — use "*" to avoid taint.
      allowedOrigin = "*";
    } else if (typeof configuredOrigin === "string") {
      // Static single origin from server config — not from request input.
      allowedOrigin = allowedOrigins[0] ?? null;
    } else if (Array.isArray(configuredOrigin)) {
      // Iterate the static allowlist; `configured` is never derived from the request.
      const normalizedRequest = normalizeOrigin(req.headers.origin);
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

    applyCommonHeaders(res);
    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }
    next();
  };
}

export function createCorsMiddleware(options?: CorsOptions): Middleware {
  const credentials = options?.credentials === true;
  const configuredOrigin = options?.origin;

  if (credentials) {
    // credentials: true requires a single, explicit string origin.
    // An array or boolean wildcard with credentials is a misconfiguration.
    if (typeof configuredOrigin !== "string") {
      throw new Error(
        "[ai-chat-toolkit-server] cors.credentials requires a single string origin. " +
          'Example: cors: { origin: "https://your-app.com", credentials: true }',
      );
    }
    const staticOrigin = normalizeOrigin(configuredOrigin);
    if (!staticOrigin) {
      throw new Error(
        `[ai-chat-toolkit-server] cors.origin "${configuredOrigin}" is not a valid http/https URL.`,
      );
    }
    // Return the credentials closure — completely separate from the no-credentials
    // closure so CodeQL analyses each function independently.
    return buildCredentialsMiddleware(staticOrigin);
  }

  // Pre-normalize the allowlist once at creation time (not per-request).
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

  return buildNoCorsMiddleware(configuredOrigin, allowedOrigins);
}
