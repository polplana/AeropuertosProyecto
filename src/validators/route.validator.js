import { AppError } from "../errors/AppError.js";

export function validateRouteQuery(query, isDirectOnly = false) {
  const { fromCityId, toCityId, maxStops } = query;

  if (!fromCityId || !/^\d+$/.test(String(fromCityId)) || Number(fromCityId) <= 0) {
    throw new AppError(422, "El parámetro fromCityId debe ser un número entero positivo");
  }

  if (!toCityId || !/^\d+$/.test(String(toCityId)) || Number(toCityId) <= 0) {
    throw new AppError(422, "El parámetro toCityId debe ser un número entero positivo");
  }

  let stops = 0;
  if (!isDirectOnly && maxStops !== undefined && maxStops !== null && String(maxStops).trim() !== "") {
    if (!/^\d+$/.test(String(maxStops)) || Number(maxStops) < 0 || Number(maxStops) > 3) {
      throw new AppError(422, "El parámetro maxStops debe ser un número entero entre 0 y 3");
    }
    stops = Number(maxStops);
  }

  return {
    fromCityId: Number(fromCityId),
    toCityId: Number(toCityId),
    maxStops: stops
  };
}
