import jwt from "jsonwebtoken";
import type { EnvConfig } from "./env.js";

export interface JwtPayload {
  userId: string;
  githubId: string;
  username: string;
  provider: string;
}

let _secret: string;

export function initJwt(config: EnvConfig): void {
  _secret = config.jwtSecret;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, _secret, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, _secret) as JwtPayload;
}
