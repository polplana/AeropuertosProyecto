import { AppError } from "../errors/AppError.js";
import * as cityRepository from "../repositories/city.repository.js";
import {
  validateCity,
  normalizeCityInput
} from "../validators/city.validator.js";

export async function listCities(search) {
  const searchTerm = typeof search === "string" && search.trim() !== "" ? search.trim() : null;
  return await cityRepository.findAll(searchTerm);
}

export async function listCitiesWithAirports() {
  return await cityRepository.findWithAirports();
}

export async function listAirportsByCity(idValue) {
  const cityId = Number(idValue);

  if (!/^\d+$/.test(String(idValue)) || cityId <= 0) {
    throw new AppError(422, "El identificador de ciudad debe ser un número entero positivo");
  }

  const city = await cityRepository.findById(cityId);

  if (!city) {
    throw new AppError(404, "Ciudad no encontrada");
  }

  return await cityRepository.findAirportsByCityId(cityId);
}

export async function createCity(data) {
  const errors = validateCity(data);

  if (errors.length > 0) {
    throw new AppError(422, "Datos de ciudad no válidos", errors);
  }

  const input = normalizeCityInput(data);
  return await cityRepository.create(input);
}

export async function updateCity(idValue, data) {
  const cityId = Number(idValue);

  if (!Number.isInteger(cityId) || cityId <= 0) {
    throw new AppError(404, "Ciudad no encontrada");
  }

  const existingCity = await cityRepository.findById(cityId);

  if (!existingCity) {
    throw new AppError(404, "Ciudad no encontrada");
  }

  const errors = validateCity(data);

  if (errors.length > 0) {
    throw new AppError(422, "Datos de ciudad no válidos", errors);
  }

  const input = normalizeCityInput(data);
  return await cityRepository.update(cityId, input);
}

