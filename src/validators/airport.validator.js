const IATA_PATTERN = /^[A-Za-z]{3}$/;

function isObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

export function validateAirport(data) {
  const errors = [];

  if (!isObject(data)) {
    return ["El cuerpo debe ser un objeto JSON"];
  }

  if (typeof data.iataCode !== "string" || !IATA_PATTERN.test(data.iataCode.trim())) {
    errors.push("El código IATA debe contener exactamente tres letras");
  }

  if (typeof data.name !== "string" || data.name.trim() === "") {
    errors.push("El nombre del aeropuerto es obligatorio");
  } else if (data.name.trim().length > 180) {
    errors.push("El nombre del aeropuerto no puede superar 180 caracteres");
  }

  const cityId = Number(data.cityId);
  if (!Number.isInteger(cityId) || cityId <= 0) {
    errors.push("El campo cityId debe ser un número entero positivo");
  }

  return errors;
}

export function normalizeAirportInput(data) {
  return {
    iataCode: data.iataCode.trim().toUpperCase(),
    name: data.name.trim(),
    cityId: Number(data.cityId)
  };
}

