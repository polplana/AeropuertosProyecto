function isObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

export function validateCity(data) {
  const errors = [];

  if (!isObject(data)) {
    return ["El cuerpo debe ser un objeto JSON"];
  }

  if (typeof data.name !== "string" || data.name.trim() === "") {
    errors.push("El nombre de la ciudad es obligatorio");
  } else if (data.name.trim().length > 120) {
    errors.push("El nombre de la ciudad no puede superar 120 caracteres");
  }

  if (typeof data.country !== "string" || data.country.trim() === "") {
    errors.push("El país es obligatorio");
  } else if (data.country.trim().length > 120) {
    errors.push("El país no puede superar 120 caracteres");
  }

  return errors;
}

export function normalizeCityInput(data) {
  return {
    name: data.name.trim(),
    country: data.country.trim()
  };
}

