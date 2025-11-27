// src/controllers/cliente.controller.ts
import { Request, Response } from 'express';
import { sql } from '../config/db'; // ← Usa sql de Neon (igual que en categorías)

export const obtenerClientes = async (_req: Request, res: Response) => {
  try {
    const clientes = await sql`SELECT * FROM cliente ORDER BY id`;
    res.json(clientes); // Neon devuelve el array directamente
  } catch (error: any) {
    console.error('Error en obtenerClientes:', error);
    res.status(500).json({ error: error.message || 'Error al obtener clientes' });
  }
};

export const obtenerCliente = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [cliente] = await sql`SELECT * FROM cliente WHERE id = ${id}`;
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (error: any) {
    console.error('Error en obtenerCliente:', error);
    res.status(500).json({ error: error.message });
  }
};

export const crearCliente = async (req: Request, res: Response) => {
  const { usuarioId, nombre, apellido, telefono, direccion } = req.body;

  if (!usuarioId || !nombre || !apellido || !telefono || !direccion) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    await sql`
      INSERT INTO cliente (usuarioId, nombre, apellido, telefono, direccion, fechaRegistro)
      VALUES (${usuarioId}, ${nombre}, ${apellido}, ${telefono}, ${direccion}, NOW())
    `;
    res.status(201).json({ mensaje: 'Cliente creado correctamente' });
  } catch (error: any) {
    console.error('Error en crearCliente:', error);
    res.status(500).json({ error: error.message || 'Error al crear cliente' });
  }
};

export const actualizarCliente = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  const { usuarioId, nombre, apellido, telefono, direccion } = req.body;

  try {
    const result = await sql`
      UPDATE cliente SET
        usuarioId = COALESCE(${usuarioId}, usuarioId),
        nombre = COALESCE(${nombre}, nombre),
        apellido = COALESCE(${apellido}, apellido),
        telefono = COALESCE(${telefono}, telefono),
        direccion = COALESCE(${direccion}, direccion),
        fechaModificacion = NOW()
      WHERE id = ${id}
    `;

    // Neon devuelve un objeto con .count (número de filas afectadas)
    if ((result as any).count === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ mensaje: 'Cliente actualizado correctamente' });
  } catch (error: any) {
    console.error('Error en actualizarCliente:', error);
    res.status(500).json({ error: error.message });
  }
};

export const eliminarCliente = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const result = await sql`DELETE FROM cliente WHERE id = ${id}`;

    if ((result as any).count === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (error: any) {
    console.error('Error en eliminarCliente:', error);
    // Esto suele dispararse por FK (pedidos asociados)
    res.status(500).json({
      error: 'No se puede eliminar: el cliente tiene pedidos asociados',
    });
  }
};