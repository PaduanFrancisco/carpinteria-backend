// src/controllers/producto.controller.ts
import { Request, Response } from 'express';
import { getAllProductos } from '../models/producto.model';
import { pool } from '../config/db';

export const obtenerProductos = async (req: Request, res: Response) => {
  try {
    const productos = await getAllProductos();
    res.json(productos);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error al obtener productos' });
  }
};

export const obtenerProducto = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [rows]: any = await pool.query('SELECT * FROM producto WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error al obtener producto' });
  }
};

export const crearProducto = async (req: Request, res: Response) => {
  const {
    categoriaId,
    usuarioId,
    nombre,
    descripcion,
    tipomadera,
    medidas,
    precio,
    estado = 'Disponible'
  } = req.body;

  if (!categoriaId || !usuarioId || !nombre || !tipomadera || !medidas || !precio) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    await pool.query(
      `INSERT INTO producto 
       (categoriaId, usuarioId, nombre, descripcion, tipomadera, medidas, precio, estado, fechaCreacion, fechaModificacion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), CURDATE())`,
      [categoriaId, usuarioId, nombre, descripcion || null, tipomadera, medidas, precio, estado]
    );
    res.status(201).json({ mensaje: 'Producto creado correctamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error al crear producto' });
  }
};

export const actualizarProducto = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  const campos = req.body;

  try {
    const [result]: any = await pool.query(
      'UPDATE producto SET ?, fechaModificacion = CURDATE() WHERE id = ?',
      [campos, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto actualizado correctamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error al actualizar producto' });
  }
};

export const eliminarProducto = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [result]: any = await pool.query('DELETE FROM producto WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error: any) {
    // Esto pasa si el producto tiene pedidos o imágenes
    res.status(500).json({ 
      error: 'No se puede eliminar: el producto tiene pedidos o imágenes asociadas' 
    });
  }
};

export const obtenerProductoCompleto = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [producto]: any = await pool.query('SELECT * FROM producto WHERE id = ?', [id]);
    if (producto.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });

    const [imagenes]: any = await pool.query('SELECT * FROM imagen WHERE productoId = ?', [id]);

    res.json({ ...producto[0], imagenes });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};