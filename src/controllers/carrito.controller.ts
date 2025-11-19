import { Request, Response } from 'express';
import { pool } from '../config/db';

export const obtenerCarritos = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM carrito');
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerCarrito = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [rows]: any = await pool.query('SELECT * FROM carrito WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const crearCarrito = async (req: Request, res: Response) => {
  const { clienteId, sessionId } = req.body;

  try {
    await pool.query(
      'INSERT INTO carrito (clienteId, sessionId, fechaCreacion, fechaModiciacion) VALUES (?, ?, CURDATE(), CURDATE())',
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

  try {
    const [result]: any = await pool.query('UPDATE carrito SET ? WHERE id = ?', [req.body, id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json({ mensaje: 'Carrito actualizado' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarCarrito = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [result]: any = await pool.query('DELETE FROM carrito WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json({ mensaje: 'Carrito eliminado' });
  } catch (error: any) {
    res.status(500).json({ error: 'Puede tener items asociados' });
  }
};