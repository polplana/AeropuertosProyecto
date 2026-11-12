import { leerCsv, limpiar } from "./csv.helper.js";

export async function importAirports(pool) {
  const filas = leerCsv("data/openflights/airports.dat");

  let insertados = 0;
  let actualizados = 0;
  let existentes = 0;
  let descartados = 0;

  for (const fila of filas) {
    const openflightsId = Number(limpiar(fila[0]));
    const nombre = limpiar(fila[1]);
    const ciudad = limpiar(fila[2]);
    const pais = limpiar(fila[3]);
    const iata = limpiar(fila[4]);
    const icao = limpiar(fila[5]);
    const tipo = limpiar(fila[12]);

    // Descartar si no es un aeropuerto válido o no tiene IATA de 3 letras
    if (tipo !== "airport" || !openflightsId || !nombre || !ciudad || !pais || !iata || iata.length !== 3) {
      descartados++;
      continue;
    }

    const iataMayus = iata.toUpperCase();
    const icaoMayus = icao && icao.length === 4 ? icao.toUpperCase() : null;

    // 1. Buscar ciudad o crearla si no existe
    const [ciudades] = await pool.query(
      "SELECT id FROM cities WHERE name = ? AND country = ? LIMIT 1",
      [ciudad, pais]
    );

    let cityId;
    if (ciudades.length > 0) {
      cityId = ciudades[0].id;
    } else {
      const [nuevaCiudad] = await pool.query(
        "INSERT INTO cities (name, country) VALUES (?, ?)",
        [ciudad, pais]
      );
      cityId = nuevaCiudad.insertId;
    }

    // 2. Comprobar si el aeropuerto ya existe por su código IATA
    const [aeropuertos] = await pool.query(
      "SELECT id, openflights_id FROM airports WHERE iata_code = ? LIMIT 1",
      [iataMayus]
    );

    if (aeropuertos.length > 0) {
      if (aeropuertos[0].openflights_id === null) {
        await pool.query(
          "UPDATE airports SET openflights_id = ?, icao_code = ? WHERE id = ?",
          [openflightsId, icaoMayus, aeropuertos[0].id]
        );
        actualizados++;
      } else {
        existentes++;
      }
      continue;
    }

    // 3. Insertar el aeropuerto nuevo
    await pool.query(
      "INSERT IGNORE INTO airports (iata_code, name, city_id, openflights_id, icao_code) VALUES (?, ?, ?, ?, ?)",
      [iataMayus, nombre, cityId, openflightsId, icaoMayus]
    );
    insertados++;
  }

  return { leidos: filas.length, insertados, actualizados, existentes, descartados };
}
