import { Request, Response } from 'express';
import { pool } from '../config/db';

export const obtenerClientes = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM cliente');
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error al obtener clientes' });
  }
};

export const obtenerCliente = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [rows]: any = await pool.query('SELECT * FROM cliente WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const crearCliente = async (req: Request, res: Response) => {
  const { usuarioId, nombre, apellido, telefono, direccion } = req.body;

   if (!usuarioId || !nombre || !apellido || !telefono || !direccion) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    await pool.query(
      'INSERT INTO cliente (usuarioId, nombre, apellido, telefono, direccion, fechaRegistro) VALUES (?, ?, ?, ?, ?, CURDATE())',
      [usuarioId, nombre, apellido, telefono, direccion]
    );
    res.status(201).json({ mensaje: 'Cliente creado correctamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error al crear cliente' });
  }
};

export const actualizarCliente = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [result]: any = await pool.query('UPDATE cliente SET ? WHERE id = ?', [req.body, id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ mensaje: 'Cliente actualizado correctamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarCliente = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [result]: any = await pool.query('DELETE FROM cliente WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (error: any) {
    res.status(500).json({ 
      error: 'No se puede eliminar: el cliente tiene pedidos asociados' 
    });
  }
};