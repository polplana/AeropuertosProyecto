import { AppError } from "../errors/AppError.js";

export function authorizeAdmin(req, res, next) {
  if (!req.user) {
    throw new AppError(401, "Se requiere autenticación");
  }

  if (req.user.role !== "admin") {
    throw new AppError(403, "No tienes permisos para realizar esta operación");
  }

  next();
}
