import { AppError } from "../errors/AppError.js";
import * as airportRepository from "../repositories/airport.repository.js";
import * as cityRepository from "../repositories/city.repository.js";
import {
  validateAirport,
  normalizeAirportInput
} from "../validators/airport.validator.js";

export async function listAirports(cityIdValue) {
  if (cityIdValue !== undefined && cityIdValue !== null && String(cityIdValue).trim() !== "") {
    const cityId = Number(cityIdValue);
    if (!Number.isInteger(cityId) || cityId <= 0) {
      return [];
    }
    return await airportRepository.findAll(cityId);
  }

  return await airportRepository.findAll();
}

export async function getAirportById(idValue) {
  const airportId = Number(idValue);

  if (!Number.isInteger(airportId) || airportId <= 0) {
    throw new AppError(404, "Aeropuerto no encontrado");
  }

  const airport = await airportRepository.findById(airportId);

  if (!airport) {
    throw new AppError(404, "Aeropuerto no encontrado");
  }

  return airport;
}

export async function createAirport(data) {
  const errors = validateAirport(data);

  if (errors.length > 0) {
    throw new AppError(422, "Datos de aeropuerto no válidos", errors);
  }

  const input = normalizeAirportInput(data);

  const city = await cityRepository.findById(input.cityId);
  if (!city) {
    throw new AppError(404, "La ciudad especificada no existe");
  }

  const existingIata = await airportRepository.findByIataCode(input.iataCode);
  if (existingIata) {
    throw new AppError(409, "El código IATA ya existe");
  }

  return await airportRepository.create(input);
}

export async function updateAirport(idValue, data) {
  const airportId = Number(idValue);

  if (!Number.isInteger(airportId) || airportId <= 0) {
    throw new AppError(404, "Aeropuerto no encontrado");
  }

  const existingAirport = await airportRepository.findById(airportId);
  if (!existingAirport) {
    throw new AppError(404, "Aeropuerto no encontrado");
  }

  const errors = validateAirport(data);
  if (errors.length > 0) {
    throw new AppError(422, "Datos de aeropuerto no válidos", errors);
  }

  const input = normalizeAirportInput(data);

  const city = await cityRepository.findById(input.cityId);
  if (!city) {
    throw new AppError(404, "La ciudad especificada no existe");
  }

  const existingIata = await airportRepository.findByIataCode(input.iataCode);
  if (existingIata && existingIata.id !== airportId) {
    throw new AppError(409, "El código IATA ya existe");
  }

  return await airportRepository.update(airportId, input);
}

