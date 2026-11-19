import { AppError } from "../errors/AppError.js";

export function validateRouteQuery(query) {
  const { fromCityId, toCityId } = query;

  if (!fromCityId || !/^\d+$/.test(String(fromCityId)) || Number(fromCityId) <= 0) {
    throw new AppError(422, "El parámetro fromCityId debe ser un número entero positivo");
  }

  if (!toCityId || !/^\d+$/.test(String(toCityId)) || Number(toCityId) <= 0) {
    throw new AppError(422, "El parámetro toCityId debe ser un número entero positivo");
  }

  return {
    fromCityId: Number(fromCityId),
    toCityId: Number(toCityId)
  };
}
