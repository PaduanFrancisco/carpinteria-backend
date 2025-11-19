import { pool } from '../config/db';

export const getAllPedidos = async () => {
  const [rows] = await pool.query('SELECT * FROM pedido');
  return rows;
};

export const getPedidoById = async (id: number) => {
  const [rows] = await pool.query('SELECT * FROM pedido WHERE id = ?', [id]);
  return rows;
};