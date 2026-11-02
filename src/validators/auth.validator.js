const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REGISTER_FIELDS = new Set([
  "name",
  "email",
  "password"
]);

const LOGIN_FIELDS = new Set([
  "email",
  "password"
]);

function isObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function findUnknownFields(data, allowedFields) {
  return Object.keys(data).filter(
    (field) => !allowedFields.has(field)
  );
}

function validateEmail(email, errors) {
  if (
    typeof email !== "string" ||
    email.trim() === ""
  ) {
    errors.push("El correo es obligatorio");
    return;
  }

  const normalized = email.trim().toLowerCase();

  if (normalized.length > 255) {
    errors.push(
      "El correo no puede superar 255 caracteres"
    );
  }

  if (!EMAIL_PATTERN.test(normalized)) {
    errors.push("El formato del correo no es válido");
  }
}

function validatePassword(password, errors) {
  if (
    typeof password !== "string" ||
    password === ""
  ) {
    errors.push("La contraseña es obligatoria");
    return;
  }

  if (password.length < 10) {
    errors.push(
      "La contraseña debe tener al menos 10 caracteres"
    );
  }

  if (password.length > 72) {
    errors.push(
      "La contraseña no puede superar 72 caracteres"
    );
  }
}

export function validateRegister(data) {
  const errors = [];

  if (!isObject(data)) {
    return ["El cuerpo debe ser un objeto JSON"];
  }

  const unknownFields = findUnknownFields(
    data,
    REGISTER_FIELDS
  );

  if (unknownFields.length > 0) {
    errors.push(
      `Campos no admitidos: ${unknownFields.join(", ")}`
    );
  }

  if (
    typeof data.name !== "string" ||
    data.name.trim() === ""
  ) {
    errors.push("El nombre es obligatorio");
  } else if (data.name.trim().length > 100) {
    errors.push(
      "El nombre no puede superar 100 caracteres"
    );
  }

  validateEmail(data.email, errors);
  validatePassword(data.password, errors);

  return errors;
}

export function validateLogin(data) {
  const errors = [];

  if (!isObject(data)) {
    return ["El cuerpo debe ser un objeto JSON"];
  }

  const unknownFields = findUnknownFields(
    data,
    LOGIN_FIELDS
  );

  if (unknownFields.length > 0) {
    errors.push(
      `Campos no admitidos: ${unknownFields.join(", ")}`
    );
  }

  validateEmail(data.email, errors);

  if (
    typeof data.password !== "string" ||
    data.password === ""
  ) {
    errors.push("La contraseña es obligatoria");
  }

  return errors;
}

export function normalizeRegisterInput(data) {
  return {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    password: data.password
  };
}

export function normalizeLoginInput(data) {
  return {
    email: data.email.trim().toLowerCase(),
    password: data.password
  };
}