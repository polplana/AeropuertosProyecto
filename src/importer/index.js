import { pool } from "../config/database.js";
import { importAirports } from "./importAirports.js";
import { importAirlines } from "./importAirlines.js";

async function main() {
  try {
    console.log("Iniciando importación...\n");

    const resumenAeropuertos = await importAirports(pool);
    console.log("Aeropuertos:", resumenAeropuertos);

    const resumenAerolineas = await importAirlines(pool);
    console.log("Aerolíneas:", resumenAerolineas);

    console.log("\nImportación finalizada.");
  } catch (error) {
    console.error("Error al importar:", error.message);
  } finally {
    await pool.end();
  }
}

main();
