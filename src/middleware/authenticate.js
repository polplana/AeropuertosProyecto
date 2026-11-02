import { AppError } from "../errors/AppError.js";
import {
  verifyAccessToken
} from "../services/token.service.js";
import {
  getCurrentUserById
} from "../services/current-user.service.js";
import {
  extractBearerToken
} from "../utils/bearer-token.js";

export async function authenticate(req, res, next) {
  const token = extractBearerToken(
    req.headers.authorization
  );

  if (!token) {
    throw new AppError(
      401,
      "Se requiere un token Bearer"
    );
  }

  let payload;

  try {
    payload = verifyAccessToken(token);
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      throw new AppError(
        401,
        "Token no válido o caducado"
      );
    }

    throw error;
  }

  const user =
    await getCurrentUserById(payload.sub);

  req.auth = {
    tokenPayload: payload
  };

  req.user = user;

  next();
}