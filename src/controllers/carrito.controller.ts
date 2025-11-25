import { Request, Response } from 'express';
import { pool } from '../config/db';

export const obtenerCarritos = async (req: Request, res: Response) => {
  try {
    const result: any = await pool.query('SELECT * FROM carrito');
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerCarrito = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const result: any = await pool.query('SELECT * FROM carrito WHERE id = $1', [id]);
    if (result.length === 0) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(result[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const crearCarrito = async (req: Request, res: Response) => {
  const { clienteId, sessionId } = req.body;

  try {
    await pool.query(
      'INSERT INTO carrito (cliente_id, session_id, fecha_creacion, fecha_modificacion) VALUES ($1, $2, NOW(), NOW())',
      [clienteId || null, sessionId || null]
    );
    res.status(201).json({ mensaje: 'Carrito creado' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarCarrito = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  const { clienteId, sessionId } = req.body;

  try {
    const result: any = await pool.query(
      'UPDATE carrito SET cliente_id = $1, session_id = $2, fecha_modificacion = NOW() WHERE id = $3 RETURNING *',
      [clienteId || null, sessionId || null, id]
    );
    if (result.length === 0) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(result[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarCarrito = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const result: any = await pool.query('DELETE FROM carrito WHERE id = $1 RETURNING *', [id]);
    if (result.length === 0) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json({ mensaje: 'Carrito eliminado' });
  } catch (error: any) {
    res.status(500).json({ error: 'Puede tener items asociados' });
  }
};