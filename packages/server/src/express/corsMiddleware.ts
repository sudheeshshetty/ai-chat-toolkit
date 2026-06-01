import type { NextFunction, Request, Response } from "express";
import type { CorsOptions } from "../types.js";

/**
 * Resolves Access-Control-Allow-Origin for the request.
 * With credentials, only explicit allowlisted origins are returned (never "*" or blind reflection).
 */
function resolveAllowedOrigin(
  origin: string | string[] | boolean | undefined,
  requestOrigin: string | undefined,
  credentials: boolean,
): string | null {
  if (origin === false) {
    return null;
  }

  if (credentials) {
    if (typeof origin === "string") {
      return requestOrigin === origin ? origin : null;
    }
    if (Array.isArray(origin)) {
      return requestOrigin && origin.includes(requestOrigin) ? requestOrigin : null;
    }
    // origin: true / undefined cannot be used safely with credentials
    return null;
  }

  if (origin === undefined || origin === true) {
    return requestOrigin ?? "*";
  }
  if (typeof origin === "string") {
    return origin;
  }
  if (Array.isArray(origin)) {
    return requestOrigin && origin.includes(requestOrigin) ? requestOrigin : null;
  }

  return null;
}

export function createCorsMiddleware(options?: CorsOptions) {
  const credentials = options?.credentials === true;

  return (req: Request, res: Response, next: NextFunction): void => {
    const requestOrigin = req.headers.origin;
    const allowedOrigin = resolveAllowedOrigin(
      options?.origin,
      requestOrigin,
      credentials,
    );

    if (allowedOrigin) {
      res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
      res.setHeader("Vary", "Origin");

      if (credentials && allowedOrigin !== "*") {
        res.setHeader("Access-Control-Allow-Credentials", "true");
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
