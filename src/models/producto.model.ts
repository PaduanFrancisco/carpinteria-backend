import { sql } from '../config/db';

export const getAllProductos = async () => {
  const result = await sql`SELECT * FROM producto`;
  return result;  // Neon devuelve array directo → perfecto para res.json(result)
};

export const getProductoById = async (id: number) => {
  const result = await sql`SELECT * FROM producto WHERE id = ${id}`;
  return result[0] ?? null;
};