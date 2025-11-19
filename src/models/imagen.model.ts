import { pool } from '../config/db';

export const getAllImagenes = async () => {
  const [rows] = await pool.query('SELECT * FROM imagen');
  return rows;
};

export const getImagenesByProductoId = async (productoId: number) => {
  const [rows] = await pool.query('SELECT * FROM imagen WHERE productoId = ?', [productoId]);
  return rows;
};