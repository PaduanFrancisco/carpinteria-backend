// src/controllers/categoria.controller.ts
import { Request, Response } from 'express';
import { sql } from '../config/db'; // ← CAMBIADO: usa sql en vez de pool

export const obtenerCategorias = async (_req: Request, res: Response) => {
  try {
    const categorias = await sql`SELECT * FROM categoria ORDER BY id`;
    res.json(categorias); // Neon devuelve array directo
  } catch (error: any) {
    console.error('Error en obtenerCategorias:', error);
    res.status(500).json({ error: error.message || 'Error al obtener categorías' });
  }
};

export const obtenerCategoria = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [categoria] = await sql`SELECT * FROM categoria WHERE id = ${id}`;
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(categoria);
  } catch (error: any) {
    console.error('Error en obtenerCategoria:', error);
    res.status(500).json({ error: error.message });
  }
};

export const crearCategoria = async (req: Request, res: Response) => {
  const { usuarioId, nombre, descripcion } = req.body;
  if (!usuarioId || !nombre) {
    return res.status(400).json({ error: 'usuarioId y nombre son obligatorios' });
  }

  try {
    await sql`
      INSERT INTO categoria (usuarioId, nombre, descripcion, fechaCreacion)
      VALUES (${usuarioId}, ${nombre}, ${descripcion || null}, NOW())
    `;
    res.status(201).json({ mensaje: 'Categoría creada correctamente' });
  } catch (error: any) {
    console.error('Error en crearCategoria:', error);
    res.status(500).json({ error: error.message });
  }
};

export const actualizarCategoria = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  const { usuarioId, nombre, descripcion } = req.body; // Solo actualiza estos campos

  try {
    const result = await sql`
      UPDATE categoria SET
        usuarioId = COALESCE(${usuarioId}, usuarioId),
        nombre = COALESCE(${nombre}, nombre),
        descripcion = COALESCE(${descripcion}, descripcion),
        fechaCreacion = COALESCE(${req.body.fechaCreacion}, fechaCreacion),
        fechaModificacion = NOW()
      WHERE id = ${id}
    `;

    if (result.length === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ mensaje: 'Categoría actualizada' });
  } catch (error: any) {
    console.error('Error en actualizarCategoria:', error);
    res.status(500).json({ error: error.message });
  }
};

export const eliminarCategoria = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const result = await sql`DELETE FROM categoria WHERE id = ${id}`;
    if (result.length === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ mensaje: 'Categoría eliminada' });
  } catch (error: any) {
    console.error('Error en eliminarCategoria:', error);
    res.status(500).json({ error: 'No se puede eliminar: hay productos en esta categoría' });
  }
};