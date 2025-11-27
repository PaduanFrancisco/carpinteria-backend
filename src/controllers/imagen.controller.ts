// src/controllers/imagen.controller.ts
import { Request, Response } from 'express';
import { sql } from '../config/db'; // ← Usamos sql de @neondatabase/serverless

export const obtenerImagenes = async (_req: Request, res: Response) => {
  try {
    const imagenes = await sql`SELECT * FROM imagen ORDER BY id`;
    res.json(imagenes);
  } catch (error: any) {
    console.error('Error en obtenerImagenes:', error);
    res.status(500).json({ error: error.message || 'Error al obtener imágenes' });
  }
};

export const obtenerImagen = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [imagen] = await sql`SELECT * FROM imagen WHERE id = ${id}`;
    if (!imagen) return res.status(404).json({ error: 'Imagen no encontrada' });
    res.json(imagen);
  } catch (error: any) {
    console.error('Error en obtenerImagen:', error);
    res.status(500).json({ error: error.message });
  }
};

export const crearImagen = async (req: Request, res: Response) => {
  const { productoId, rutaArchivo, nombreArchivo, esPrincipal = false } = req.body;

  if (!productoId || !rutaArchivo || !nombreArchivo) {
    return res.status(400).json({ error: 'productoId, rutaArchivo y nombreArchivo son obligatorios' });
  }

  try {
    await sql`
      INSERT INTO imagen (productoId, rutaArchivo, nombreArchivo, esPrincipal, fechaSubida)
      VALUES (${productoId}, ${rutaArchivo}, ${nombreArchivo}, ${esPrincipal}, NOW())
    `;
    res.status(201).json({ mensaje: 'Imagen agregada correctamente' });
  } catch (error: any) {
    console.error('Error en crearImagen:', error);
    res.status(500).json({ error: error.message || 'Error al crear imagen' });
  }
};

export const actualizarImagen = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  const { productoId, rutaArchivo, nombreArchivo, esPrincipal } = req.body;

  try {
    const result = await sql`
      UPDATE imagen SET
        productoId = COALESCE(${productoId}, productoId),
        rutaArchivo = COALESCE(${rutaArchivo}, rutaArchivo),
        nombreArchivo = COALESCE(${nombreArchivo}, nombreArchivo),
        esPrincipal = COALESCE(${esPrincipal !== undefined ? esPrincipal : null}, esPrincipal),
        fechaModificacion = NOW()
      WHERE id = ${id}
    `;

    if ((result as any).count === 0) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    res.json({ mensaje: 'Imagen actualizada correctamente' });
  } catch (error: any) {
    console.error('Error en actualizarImagen:', error);
    res.status(500).json({ error: error.message });
  }
};

export const eliminarImagen = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const result = await sql`DELETE FROM imagen WHERE id = ${id}`;

    if ((result as any).count === 0) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    res.json({ mensaje: 'Imagen eliminada correctamente' });
  } catch (error: any) {
    console.error('Error en eliminarImagen:', error);
    res.status(500).json({ error: error.message || 'Error al eliminar imagen' });
  }
};