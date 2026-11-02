import { env } from "../config/env.js";
import * as authService from "../services/auth.service.js";

export async function register(req, res) {
  const user = await authService.register(req.body);

  return res
    .status(201)
    .location(`/users/${user.id}`)
    .json(user);
}

export async function login(req, res) {
  const result = await authService.login(req.body);

  return res.status(200).json({
    tokenType: "Bearer",
    expiresIn: env.jwt.expiresIn,
    ...result
  });
}

export async function me(req, res) {
  return res.status(200).json(req.user);
}
