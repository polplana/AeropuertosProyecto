import { pool } from "../config/database.js";

export async function findDirectRoutes(fromCityId, toCityId) {
  const [rows] = await pool.execute(
    `
      SELECT 
        f.id AS flightId,
        al.name AS airlineName,
        sa.iata_code AS fromIataCode,
        sa.name AS fromAirportName,
        sc.name AS fromCityName,
        da.iata_code AS toIataCode,
        da.name AS toAirportName,
        dc.name AS toCityName
      FROM flights f
      LEFT JOIN airlines al ON f.airline_id = al.id
      INNER JOIN airports sa ON f.source_airport_id = sa.id
      INNER JOIN cities sc ON sa.city_id = sc.id
      INNER JOIN airports da ON f.destination_airport_id = da.id
      INNER JOIN cities dc ON da.city_id = dc.id
      WHERE sa.city_id = ? AND da.city_id = ? AND f.stops = 0
      ORDER BY f.id ASC
    `,
    [fromCityId, toCityId]
  );
  return rows;
}
