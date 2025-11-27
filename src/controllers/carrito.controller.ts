// src/controllers/carrito.controller.ts
import { Request, Response } from 'express';
import { sql } from '../config/db'; // ← AHORA SÍ ESTÁ BIEN

// GET /api/carrito → obtener todo el carrito del usuario
export const obtenerCarrito = async (req: Request, res: Response) => {
  // Asumiendo que tenés un middleware de auth que pone req.user
  const usuarioId = (req as any).user?.id || req.body.usuarioId;

  if (!usuarioId) {
    return res.status(400).json({ error: 'usuarioId es requerido' });
  }

  try {
    const items = await sql`
      SELECT 
        c.id AS carritoId,
        c.cantidad,
        p.id AS productoId,
        p.nombre,
        p.precio,
        p.tipomadera,
        p.medidas,
        p.estado
      FROM carrito c
      JOIN producto p ON c.productoId = p.id
      WHERE c.usuarioId = ${usuarioId}
      ORDER BY c.id
    `;
    res.json(items);
  } catch (error: any) {
    console.error('Error en obtenerCarrito:', error);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

// POST /api/carrito → agregar o actualizar item
export const agregarAlCarrito = async (req: Request, res: Response) => {
  const usuarioId = (req as any).user?.id || req.body.usuarioId;
  const { productoId, cantidad = 1 } = req.body;

  if (!usuarioId || !productoId) {
    return res.status(400).json({ error: 'Faltan usuarioId o productoId' });
  }

  try {
    // Si ya existe, suma cantidad. Si no, inserta nuevo.
    const existe = await sql`SELECT id FROM carrito WHERE usuarioId = ${usuarioId} AND productoId = ${productoId}`;

    if (existe.length > 0) {
      await sql`
        UPDATE carrito 
        SET cantidad = cantidad + ${cantidad}
        WHERE usuarioId = ${usuarioId} AND productoId = ${productoId}
      `;
    } else {
      await sql`
        INSERT INTO carrito (usuarioId, productoId, cantidad)
        VALUES (${usuarioId}, ${productoId}, ${cantidad})
      `;
    }

    res.status(201).json({ mensaje: 'Producto agregado al carrito' });
  } catch (error: any) {
    console.error('Error en agregarAlCarrito:', error);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
};

// DELETE /api/carrito/:id → eliminar item del carrito
export const eliminarDelCarrito = async (req: Request, res: Response) => {
  const carritoId = parseInt(req.params.id);
  if (isNaN(carritoId)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const result = await sql`DELETE FROM carrito WHERE id = ${carritoId}`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Item no encontrado en el carrito' });
    }
    res.json({ mensaje: 'Item eliminado del carrito' });
  } catch (error: any) {
    console.error('Error en eliminarDelCarrito:', error);
    res.status(500).json({ error: 'Error al eliminar del carrito' });
  }
};

// PUT /api/carrito/:id → actualizar cantidad
export const actualizarCantidad = async (req: Request, res: Response) => {
  const carritoId = parseInt(req.params.id);
  const { cantidad } = req.body;

  if (isNaN(carritoId) || !cantidad || cantidad < 1) {
    return res.status(400).json({ error: 'Cantidad inválida' });
  }

  try {
    const result = await sql`
      UPDATE carrito SET cantidad = ${cantidad}
      WHERE id = ${carritoId}
    `;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.json({ mensaje: 'Cantidad actualizada' });
  } catch (error: any) {
    console.error('Error en actualizarCantidad:', error);
    res.status(500).json({ error: 'Error al actualizar cantidad' });
  }
};