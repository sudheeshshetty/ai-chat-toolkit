import type { NextFunction, Request, Response } from "express";
import type { CorsOptions } from "../types.js";

/** Origins that must never be used with credentials (CodeQL / browser safety). */
const BLOCKED_CREDENTIAL_ORIGINS = new Set(["null", "undefined"]);

function normalizeOrigin(origin: string | undefined): string | null {
  if (!origin || BLOCKED_CREDENTIAL_ORIGINS.has(origin)) {
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

/**
 * When credentials are enabled, returns a value from the configured allowlist only
 * (never echoes the raw request Origin header).
 */
function matchAllowlistedOrigin(
  configured: string[] | undefined,
  requestOrigin: string | undefined,
): string | null {
  const normalizedRequestOrigin = normalizeOrigin(requestOrigin);
  if (!configured || !normalizedRequestOrigin) {
    return null;
  }

  for (const allowed of configured) {
    if (allowed === normalizedRequestOrigin) {
      return allowed;
    }
  }

  return null;
}

function resolveOriginWithoutCredentials(
  origin: string | string[] | boolean | undefined,
  requestOrigin: string | undefined,
): string | null {
  const normalizedRequestOrigin = normalizeOrigin(requestOrigin);

  if (origin === false) {
    return null;
  }
  if (origin === undefined || origin === true) {
    return normalizedRequestOrigin ?? "*";
  }
  if (typeof origin === "string") {
    return normalizeOrigin(origin);
  }
  if (Array.isArray(origin)) {
    if (!normalizedRequestOrigin) {
      return null;
    }

    for (const allowed of origin) {
      const normalizedAllowed = normalizeOrigin(allowed);
      if (normalizedAllowed === normalizedRequestOrigin) {
        return normalizedAllowed;
      }
    }

    return null;
  }
  return null;
}

export function createCorsMiddleware(options?: CorsOptions) {
  const credentials = options?.credentials === true;
  const configuredOrigin = options?.origin;
  const configuredOriginList =
    typeof configuredOrigin === "string"
      ? [configuredOrigin]
      : Array.isArray(configuredOrigin)
        ? configuredOrigin
        : undefined;
  const normalizedConfiguredOriginList = configuredOriginList
    ?.map((origin) => normalizeOrigin(origin))
    .filter((origin): origin is string => origin !== null);

  return (req: Request, res: Response, next: NextFunction): void => {
    const requestOrigin = req.headers.origin;

    if (credentials) {
      const allowlisted = matchAllowlistedOrigin(
        normalizedConfiguredOriginList,
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
