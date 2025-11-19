import { pool } from '../config/db';

export const getAllClientes = async () => {
  const [rows] = await pool.query('SELECT * FROM cliente');
  return rows;
};

export const getClienteById = async (id: number) => {
  const [rows] = await pool.query('SELECT * FROM cliente WHERE id = ?', [id]);
  return rows;
};