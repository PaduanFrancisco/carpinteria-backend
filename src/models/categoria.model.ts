import { pool } from '../config/db';

export const getAllCategorias = async () => {
  const [rows] = await pool.query('SELECT * FROM categoria');
  return rows;
};

export const getCategoriaById = async (id: number) => {
  const [rows] = await pool.query('SELECT * FROM categoria WHERE id = ?', [id]);
  return rows;
};