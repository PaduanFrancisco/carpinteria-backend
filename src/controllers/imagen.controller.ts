import { Request, Response } from 'express';
import { pool } from '../config/db';

export const obtenerImagenes = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM imagen');
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerImagen = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [rows]: any = await pool.query('SELECT * FROM imagen WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Imagen no encontrada' });
    res.json(rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const crearImagen = async (req: Request, res: Response) => {
  const { productoId, rutaArchivo, nombreArchivo, esPrincipal = false } = req.body;
  if (!productoId || !rutaArchivo || !nombreArchivo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    await pool.query(
      'INSERT INTO imagen (productoId, rutaArchivo, nombreArchivo, esPrincipal, fechaSubida) VALUES (?, ?, ?, ?, CURDATE())',
      [productoId, rutaArchivo, nombreArchivo, esPrincipal ? 1 : 0]
    );
    res.status(201).json({ mensaje: 'Imagen agregada' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarImagen = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [result]: any = await pool.query('UPDATE imagen SET ? WHERE id = ?', [req.body, id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Imagen no encontrada' });
    res.json({ mensaje: 'Imagen actualizada' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarImagen = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [result]: any = await pool.query('DELETE FROM imagen WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Imagen no encontrada' });
    res.json({ mensaje: 'Imagen eliminada' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};