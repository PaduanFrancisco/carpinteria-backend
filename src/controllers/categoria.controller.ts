// src/controllers/categoria.controller.ts
import { Request, Response } from 'express';
import { sql } from '../config/db';

// GET /api/categorias → devuelve todas las categorías
export const obtenerCategorias = async (_req: Request, res: Response) => {
  try {
    const categorias = await sql`SELECT * FROM categoria ORDER BY id`;
    res.json(categorias);
  } catch (error: any) {
    console.error('Error en obtenerCategorias:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

// GET /api/categorias/:id → devuelve una categoría por ID
export const obtenerCategoriaPorId = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [categoria] = await sql`SELECT * FROM categoria WHERE id = ${id}`;
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(categoria);
  } catch (error: any) {
    console.error('Error en obtenerCategoriaPorId:', error);
    res.status(500).json({ error: 'Error al obtener la categoría' });
  }
};

// (Opcional) Si también tenés POST, PUT, DELETE → decime y te los paso igual de limpios

export default {
  obtenerCategorias,
  obtenerCategoriaPorId
};