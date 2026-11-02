import { pool } from "../config/database.js";

export async function findAll(cityId) {
  if (cityId) {
    const [rows] = await pool.execute(
      `
        SELECT
          a.id,
          a.iata_code AS iataCode,
          a.name,
          a.city_id AS cityId,
          c.name AS cityName,
          c.country
        FROM airports a
        INNER JOIN cities c ON a.city_id = c.id
        WHERE a.city_id = ?
        ORDER BY a.id ASC
      `,
      [cityId]
    );
    return rows;
  }

  const [rows] = await pool.execute(
    `
      SELECT
        a.id,
        a.iata_code AS iataCode,
        a.name,
        a.city_id AS cityId,
        c.name AS cityName,
        c.country
      FROM airports a
      INNER JOIN cities c ON a.city_id = c.id
      ORDER BY a.id ASC
    `
  );
  return rows;
}

export async function findById(id) {
  const [rows] = await pool.execute(
    `
      SELECT
        a.id,
        a.iata_code AS iataCode,
        a.name,
        a.city_id AS cityId,
        c.name AS cityName,
        c.country
      FROM airports a
      INNER JOIN cities c ON a.city_id = c.id
      WHERE a.id = ?
      LIMIT 1
    `,
    [id]
  );

  return rows[0] ?? null;
}

export async function findByIataCode(iataCode) {
  const [rows] = await pool.execute(
    `
      SELECT id, iata_code AS iataCode, name, city_id AS cityId
      FROM airports
      WHERE iata_code = ?
      LIMIT 1
    `,
    [iataCode]
  );

  return rows[0] ?? null;
}

export async function create({ iataCode, name, cityId }) {
  const [result] = await pool.execute(
    `
      INSERT INTO airports (iata_code, name, city_id)
      VALUES (?, ?, ?)
    `,
    [iataCode, name, cityId]
  );

  return {
    id: result.insertId,
    iataCode,
    name,
    cityId
  };
}

export async function update(id, { iataCode, name, cityId }) {
  await pool.execute(
    `
      UPDATE airports
      SET iata_code = ?, name = ?, city_id = ?
      WHERE id = ?
    `,
    [iataCode, name, cityId, id]
  );

  return {
    id: Number(id),
    iataCode,
    name,
    cityId
  };
}

