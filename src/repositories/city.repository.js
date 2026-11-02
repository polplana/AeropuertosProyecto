import { pool } from "../config/database.js";

export async function findAll(search) {
  if (search) {
    const [rows] = await pool.execute(
      `
        SELECT id, name, country
        FROM cities
        WHERE name LIKE ?
        ORDER BY id ASC
      `,
      [`%${search}%`]
    );
    return rows;
  }

  const [rows] = await pool.execute(
    `
      SELECT id, name, country
      FROM cities
      ORDER BY id ASC
    `
  );
  return rows;
}

export async function findWithAirports() {
  const [rows] = await pool.execute(
    `
      SELECT c.id, c.name, c.country, COUNT(a.id) AS airportCount
      FROM cities c
      INNER JOIN airports a ON a.city_id = c.id
      GROUP BY c.id, c.name, c.country
      ORDER BY c.id ASC
    `
  );

  return rows.map((row) => ({
    ...row,
    airportCount: Number(row.airportCount)
  }));
}

export async function findById(id) {
  const [rows] = await pool.execute(
    `
      SELECT id, name, country
      FROM cities
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  );

  return rows[0] ?? null;
}

export async function findAirportsByCityId(cityId) {
  const [rows] = await pool.execute(
    `
      SELECT id, iata_code AS iataCode, name, city_id AS cityId
      FROM airports
      WHERE city_id = ?
      ORDER BY id ASC
    `,
    [cityId]
  );

  return rows;
}

export async function create({ name, country }) {
  const [result] = await pool.execute(
    `
      INSERT INTO cities (name, country)
      VALUES (?, ?)
    `,
    [name, country]
  );

  return findById(result.insertId);
}

export async function update(id, { name, country }) {
  await pool.execute(
    `
      UPDATE cities
      SET name = ?, country = ?
      WHERE id = ?
    `,
    [name, country, id]
  );

  return findById(id);
}

