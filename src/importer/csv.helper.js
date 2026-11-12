import fs from "node:fs";
import { parse } from "csv-parse/sync";

// Convierte "\N" o textos vacíos en null
export function limpiar(valor) {
  if (!valor || valor.trim() === "" || valor.trim() === "\\N") {
    return null;
  }
  return valor.trim();
}

// Lee un archivo .dat de OpenFlights y devuelve sus filas
export function leerCsv(ruta) {
  const texto = fs.readFileSync(ruta, "utf8");
  return parse(texto, {
    columns: false,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
    trim: true
  });
}
