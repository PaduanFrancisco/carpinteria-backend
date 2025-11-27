// src/controllers/producto.controller.ts
import { Request, Response } from 'express';
import { sql } from '../config/db'; // ← IMPORTANTE: usa sql directo (Neon)

export const obtenerProductos = async (_req: Request, res: Response) => {
  try {
    const productos = await sql`SELECT * FROM producto ORDER BY id`;
    res.json(productos); // Neon devuelve array directo → listo
  } catch (error: any) {
    console.error('Error en obtenerProductos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

export const obtenerProducto = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [producto] = await sql`SELECT * FROM producto WHERE id = ${id}`;
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (error: any) {
    console.error('Error en obtenerProducto:', error);
    res.status(500).json({ error: 'Error al obtener el producto' });
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
    await sql`
      INSERT INTO producto (
        categoriaId, usuarioId, nombre, descripcion, tipomadera, 
        medidas, precio, estado, fechaCreacion, fechaModificacion
      ) VALUES (
        ${categoriaId}, ${usuarioId}, ${nombre}, ${descripcion || null}, ${tipomadera},
        ${medidas}, ${precio}, ${estado}, NOW(), NOW()
      )
    `;
    res.status(201).json({ mensaje: 'Producto creado correctamente' });
  } catch (error: any) {
    console.error('Error en crearProducto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

export const actualizarProducto = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  const { nombre, descripcion, tipomadera, medidas, precio, estado } = req.body;

  // Solo actualiza los campos que vengan
  try {
    const result = await sql`
      UPDATE producto SET
        nombre = COALESCE(${nombre}, nombre),
        descripcion = COALESCE(${descripcion}, descripcion),
        tipomadera = COALESCE(${tipomadera}, tipomadera),
        medidas = COALESCE(${medidas}, medidas),
        precio = COALESCE(${precio}, precio),
        estado = COALESCE(${estado}, estado),
        fechaModificacion = NOW()
      WHERE id = ${id}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto actualizado correctamente' });
  } catch (error: any) {
    console.error('Error en actualizarProducto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

export const eliminarProducto = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const result = await sql`DELETE FROM producto WHERE id = ${id}`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error: any) {
    console.error('Error en eliminarProducto:', error);
    res.status(500).json({ error: 'No se puede eliminar: tiene pedidos o imágenes asociadas' });
  }
};

export const obtenerProductoCompleto = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [producto] = await sql`SELECT * FROM producto WHERE id = ${id}`;
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    const imagenes = await sql`SELECT * FROM imagen WHERE productoId = ${id}`;

    res.json({ ...producto, imagenes });
  } catch (error: any) {
    console.error('Error en obtenerProductoCompleto:', error);
    res.status(500).json({ error: 'Error al obtener producto completo' });
  }
};