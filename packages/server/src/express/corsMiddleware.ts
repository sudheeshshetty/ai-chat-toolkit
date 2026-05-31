import type { NextFunction, Request, Response } from "express";
import type { CorsOptions } from "../types.js";

function normalizeOriginHeader(
  origin: string | string[] | boolean | undefined,
  requestOrigin: string | undefined,
): string | null {
  if (origin === undefined || origin === true) {
    return requestOrigin ?? "*";
  }
  if (origin === false) {
    return null;
  }
  if (typeof origin === "string") {
    return origin;
  }
  if (Array.isArray(origin) && requestOrigin && origin.includes(requestOrigin)) {
    return requestOrigin;
  }
  if (Array.isArray(origin) && origin.length > 0) {
    return origin[0];
  }
  return requestOrigin ?? null;
}

export function createCorsMiddleware(options?: CorsOptions) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const requestOrigin = req.headers.origin;
    const allowed = normalizeOriginHeader(options?.origin, requestOrigin);

    if (allowed) {
      res.setHeader("Access-Control-Allow-Origin", allowed);
      res.setHeader("Vary", "Origin");
    }

    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Accept",
    );

    if (options?.credentials) {
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }

    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }

    next();
  };
}
