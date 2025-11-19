// src/models/producto.model.ts
import { pool } from '../config/db';

export const getAllProductos = async () => {
  const [rows] = await pool.query('SELECT * FROM producto');
  return rows;
};

export const getProductoById = async (id: number) => {
  const [rows] = await pool.query('SELECT * FROM producto WHERE id = ?', [id]);
  return rows;
};