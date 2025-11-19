import { Request, Response } from 'express';
import { pool } from '../config/db';

export const obtenerCategorias = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM categoria');
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error al obtener categorías' });
  }
};

export const obtenerCategoria = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [rows]: any = await pool.query('SELECT * FROM categoria WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const crearCategoria = async (req: Request, res: Response) => {
  const { usuarioId, nombre, descripcion } = req.body;
  if (!usuarioId || !nombre) {
    return res.status(400).json({ error: 'usuarioId y nombre son obligatorios' });
  }

  try {
    await pool.query(
      'INSERT INTO categoria (usuarioId, nombre, descripcion, fechaCreacion) VALUES (?, ?, ?, CURDATE())',
      [usuarioId, nombre, descripcion || null]
    );
    res.status(201).json({ mensaje: 'Categoría creada correctamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarCategoria = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [result]: any = await pool.query('UPDATE categoria SET ? WHERE id = ?', [req.body, id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ mensaje: 'Categoría actualizada' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarCategoria = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [result]: any = await pool.query('DELETE FROM categoria WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ mensaje: 'Categoría eliminada' });
  } catch (error: any) {
    res.status(500).json({ error: 'No se puede eliminar: hay productos en esta categoría' });
  }
};