import { pool } from '../config/db';

export const getAllCarritos = async () => {
  const [rows] = await pool.query('SELECT * FROM carrito');
  return rows;
};

export const getCarritoById = async (id: number) => {
  const [rows] = await pool.query('SELECT * FROM carrito WHERE id = ?', [id]);
  return rows;
};