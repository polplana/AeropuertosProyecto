import crypto from "node:crypto";
import { leerCsv, limpiar } from "./csv.helper.js";

export async function importRoutes(pool) {
  const filas = leerCsv("data/openflights/routes.dat");

  const [aeropuertos] = await pool.query("SELECT id, openflights_id FROM airports WHERE openflights_id IS NOT NULL");
  const mapaAeropuertos = new Map();
  for (const a of aeropuertos) {
    mapaAeropuertos.set(a.openflights_id, a.id);
  }

  const [aerolineas] = await pool.query("SELECT id, openflights_id FROM airlines WHERE openflights_id IS NOT NULL");
  const mapaAerolineas = new Map();
  for (const al of aerolineas) {
    mapaAerolineas.set(al.openflights_id, al.id);
  }

  let insertados = 0;
  let existentes = 0;
  let descartados = 0;

  const lote = [];

  for (const fila of filas) {
    const airlineOfId = Number(limpiar(fila[1]));
    const sourceOfId = Number(limpiar(fila[3]));
    const destinationOfId = Number(limpiar(fila[5]));
    const codeshare = limpiar(fila[6]) === "Y" ? 1 : 0;
    const stops = Number(limpiar(fila[7])) || 0;
    const equipment = limpiar(fila[8]);

    const sourceAirportId = mapaAeropuertos.get(sourceOfId);
    const destAirportId = mapaAeropuertos.get(destinationOfId);

    if (!sourceAirportId || !destAirportId || sourceAirportId === destAirportId) {
      descartados++;
      continue;
    }

    const airlineId = mapaAerolineas.get(airlineOfId) || null;

    const textoFila = fila.map((c) => (c ? c.trim() : "")).join(",");
    const sourceKey = crypto.createHash("sha256").update(textoFila).digest("hex");

    lote.push([
      airlineId,
      sourceAirportId,
      destAirportId,
      codeshare,
      stops,
      equipment ? equipment.slice(0, 100) : null,
      sourceKey
    ]);

    if (lote.length >= 1000) {
      const [resultado] = await pool.query(
        "INSERT IGNORE INTO flights (airline_id, source_airport_id, destination_airport_id, codeshare, stops, equipment, source_key) VALUES ?",
        [lote]
      );
      insertados += resultado.affectedRows;
      existentes += lote.length - resultado.affectedRows;
      lote.length = 0;
    }
  }

  if (lote.length > 0) {
    const [resultado] = await pool.query(
      "INSERT IGNORE INTO flights (airline_id, source_airport_id, destination_airport_id, codeshare, stops, equipment, source_key) VALUES ?",
      [lote]
    );
    insertados += resultado.affectedRows;
    existentes += lote.length - resultado.affectedRows;
  }

  return { leidos: filas.length, insertados, existentes, descartados };
}
