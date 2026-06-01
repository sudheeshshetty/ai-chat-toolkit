import type { NextFunction, Request, Response } from "express";
import type { CorsOptions } from "../types.js";

/** Origins that must never be used with credentials (CodeQL / browser safety). */
const BLOCKED_CREDENTIAL_ORIGINS = new Set(["null", "undefined"]);

/**
 * When credentials are enabled, returns a value from the configured allowlist only
 * (never echoes the raw request Origin header).
 */
function matchAllowlistedOrigin(
  configured: string | string[] | undefined,
  requestOrigin: string | undefined,
): string | null {
  if (!configured || !requestOrigin || BLOCKED_CREDENTIAL_ORIGINS.has(requestOrigin)) {
    return null;
  }

  if (typeof configured === "string") {
    return configured === requestOrigin ? configured : null;
  }

  for (const allowed of configured) {
    if (allowed === requestOrigin) {
      return allowed;
    }
  }

  return null;
}

function resolveOriginWithoutCredentials(
  origin: string | string[] | boolean | undefined,
  requestOrigin: string | undefined,
): string | null {
  if (origin === false) {
    return null;
  }
  if (origin === undefined || origin === true) {
    return requestOrigin ?? "*";
  }
  if (typeof origin === "string") {
    return origin;
  }
  if (Array.isArray(origin)) {
    if (!requestOrigin) {
      return null;
    }
    return origin.includes(requestOrigin) ? requestOrigin : null;
  }
  return null;
}

export function createCorsMiddleware(options?: CorsOptions) {
  const credentials = options?.credentials === true;
  const configuredOrigin = options?.origin;
  const configuredOriginList =
    typeof configuredOrigin === "string"
      ? configuredOrigin
      : Array.isArray(configuredOrigin)
        ? configuredOrigin
        : undefined;

  return (req: Request, res: Response, next: NextFunction): void => {
    const requestOrigin = req.headers.origin;

    if (credentials) {
      const allowlisted = matchAllowlistedOrigin(
        configuredOriginList,
        requestOrigin,
      );
      if (allowlisted) {
        res.setHeader("Access-Control-Allow-Origin", allowlisted);
        res.setHeader("Vary", "Origin");
        res.setHeader("Access-Control-Allow-Credentials", "true");
      }
    } else {
      const allowedOrigin = resolveOriginWithoutCredentials(
        configuredOrigin,
        requestOrigin,
      );
      if (allowedOrigin) {
        res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
        res.setHeader("Vary", "Origin");
      }
    }

    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Accept",
    );

    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }

    next();
  };
}
