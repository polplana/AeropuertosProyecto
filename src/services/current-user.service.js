import { AppError } from "../errors/AppError.js";
import * as usersRepository
  from "../repositories/users.repository.js";

export async function getCurrentUserById(idValue) {
  const userId = Number(idValue);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new AppError(
      401,
      "El token no contiene un sujeto válido"
    );
  }

  const user =
    await usersRepository.findPublicById(userId);

  if (!user) {
    throw new AppError(
      401,
      "El usuario del token ya no existe"
    );
  }

  return user;
}