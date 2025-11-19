import { Request, Response } from 'express';
import { pool } from '../config/db';

export const obtenerPedidos = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM pedido');
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error al obtener pedidos' });
  }
};

export const obtenerPedido = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [rows]: any = await pool.query('SELECT * FROM pedido WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const crearPedido = async (req: Request, res: Response) => {
  const {
    clienteId,
    numeroPedido,
    total,
    estadoPago = 'Pendiente',
    metodoPago,
    direccionEntrega
  } = req.body;

  if (!clienteId || !numeroPedido || !total || !direccionEntrega) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    await pool.query(
      `INSERT INTO pedido 
       (clienteId, numeroPedido, total, estadoPago, metodoPago, direccionEntrega, fechaPedido)
       VALUES (?, ?, ?, ?, ?, ?, CURDATE())`,
      [clienteId, numeroPedido, total, estadoPago, metodoPago || null, direccionEntrega]
    );
    res.status(201).json({ mensaje: 'Pedido creado correctamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error al crear pedido' });
  }
};

export const actualizarPedido = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [result]: any = await pool.query('UPDATE pedido SET ? WHERE id = ?', [req.body, id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json({ mensaje: 'Pedido actualizado correctamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarPedido = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [result]: any = await pool.query('DELETE FROM pedido WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json({ mensaje: 'Pedido eliminado correctamente' });
  } catch (error: any) {
    res.status(500).json({ error: 'No se puede eliminar: tiene items o pagos asociados' });
  }
};

export const obtenerPedidoCompleto = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [pedido]: any = await pool.query(`
      SELECT p.*, c.nombre, c.apellido, c.telefono
      FROM pedido p
      LEFT JOIN cliente c ON p.clienteId = c.id
      WHERE p.id = ?`, [id]);

    if (pedido.length === 0) return res.status(404).json({ error: 'Pedido no encontrado' });

    const [items]: any = await pool.query(`
      SELECT ip.*, pr.nombre as nombreProducto
      FROM itempedido ip
      JOIN producto pr ON ip.productoId = pr.id
      WHERE ip.pedidoId = ?`, [id]);

    res.json({ ...pedido[0], items });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};