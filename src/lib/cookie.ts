import { CookieOptions } from "express";

export function getRefreshTokenCookieOptions(): CookieOptions {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
  };
}
