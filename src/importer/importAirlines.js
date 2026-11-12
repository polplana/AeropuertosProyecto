import { leerCsv, limpiar } from "./csv.helper.js";

export async function importAirlines(pool) {
  const filas = leerCsv("data/openflights/airlines.dat");

  let insertados = 0;
  let existentes = 0;
  let descartados = 0;

  for (const fila of filas) {
    const openflightsId = Number(limpiar(fila[0]));
    const nombre = limpiar(fila[1]);
    const iata = limpiar(fila[3]);
    const icao = limpiar(fila[4]);
    const pais = limpiar(fila[6]);
    const activa = limpiar(fila[7]);

    if (!openflightsId || openflightsId <= 0 || !nombre) {
      descartados++;
      continue;
    }

    // Comprobar si la aerolínea ya existe
    const [aerolineas] = await pool.query(
      "SELECT id FROM airlines WHERE openflights_id = ? LIMIT 1",
      [openflightsId]
    );

    if (aerolineas.length > 0) {
      existentes++;
      continue;
    }

    const iataValido = iata && iata.length <= 2 ? iata.toUpperCase() : null;
    const icaoValido = icao && icao.length <= 3 ? icao.toUpperCase() : null;

    await pool.query(
      "INSERT INTO airlines (openflights_id, name, iata_code, icao_code, country, active) VALUES (?, ?, ?, ?, ?, ?)",
      [openflightsId, nombre, iataValido, icaoValido, pais, activa]
    );
    insertados++;
  }

  return { leidos: filas.length, insertados, existentes, descartados };
}
