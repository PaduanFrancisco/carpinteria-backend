import { pool } from '../config/db';

export const getAllProductos = async () => {
  const result = await pool.query('SELECT * FROM producto');
  return result;                     // devuelve directamente el array
};

export const getProductoById = async (id: number) => {
  const result = await pool.query('SELECT * FROM producto WHERE id = $1', [id]);
  return result[0] ?? null;          // devuelve el primer objeto o null
};