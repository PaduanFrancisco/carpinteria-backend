// src/controllers/producto.controller.ts
import { Request, Response } from 'express';
import { sql } from '../config/db';

export const obtenerProductos = async (_req: Request, res: Response) => {
  try {
    const productos = await sql`SELECT * FROM producto`;
    res.json(productos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerProducto = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  const productos = await sql`SELECT * FROM producto WHERE id = ${id}`;
  if (productos.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(productos[0]);
};

export const crearProducto = async (req: Request, res: Response) => {
  const { categoriaId, usuarioId, nombre, descripcion, tipomadera, medidas, precio, estado = 'Disponible' } = req.body;

  if (!categoriaId || !usuarioId || !nombre || !tipomadera || !medidas || !precio) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    await sql`
      INSERT INTO producto (categoriaId, usuarioId, nombre, descripcion, tipomadera, medidas, precio, estado, fechaCreacion, fechaModificacion)
      VALUES (${categoriaId}, ${usuarioId}, ${nombre}, ${descripcion || null}, ${tipomadera}, ${medidas}, ${precio}, ${estado}, NOW(), NOW())
    `;
    res.status(201).json({ mensaje: 'Producto creado correctamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarProducto = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  const { nombre, descripcion, tipomadera, medidas, precio, estado } = req.body;

  try {
    const result = await sql`
      UPDATE producto SET 
        nombre = ${nombre ?? sql`nombre`},
        descripcion = ${descripcion ?? sql`descripcion`},
        tipomadera = ${tipomadera ?? sql`tipomadera`},
        medidas = ${medidas ?? sql`medidas`},
        precio = ${precio ?? sql`precio`},
        estado = ${estado ?? sql`estado`},
        fechaModificacion = NOW()
      WHERE id = ${id}
    `;

    if (result.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto actualizado correctamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarProducto = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const result = await sql`DELETE FROM producto WHERE id = ${id}`;
    if (result.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error: any) {
    res.status(500).json({ error: 'No se puede eliminar: tiene pedidos o imágenes' });
  }
};

export const obtenerProductoCompleto = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  const [producto] = await sql`SELECT * FROM producto WHERE id = ${id}`;
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

  const imagenes = await sql`SELECT * FROM imagen WHERE productoId = ${id}`;

  res.json({ ...producto, imagenes });
};