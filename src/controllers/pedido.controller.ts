// src/controllers/pedido.controller.ts
import { Request, Response } from 'express';
import { sql } from '../config/db'; // ← Usando Neon sql tag

export const obtenerPedidos = async (_req: Request, res: Response) => {
  try {
    const pedidos = await sql`SELECT * FROM pedido ORDER BY fechaPedido DESC`;
    res.json(pedidos);
  } catch (error: any) {
    console.error('Error en obtenerPedidos:', error);
    res.status(500).json({ error: error.message || 'Error al obtener pedidos' });
  }
};

export const obtenerPedido = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [pedido] = await sql`SELECT * FROM pedido WHERE id = ${id}`;
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(pedido);
  } catch (error: any) {
    console.error('Error en obtenerPedido:', error);
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
    await sql`
      INSERT INTO pedido (
        clienteId, numeroPedido, total, estadoPago, 
        metodoPago, direccionEntrega, fechaPedido
      ) VALUES (
        ${clienteId}, ${numeroPedido}, ${total}, ${estadoPago},
        ${metodoPago || null}, ${direccionEntrega}, NOW()
      )
    `;
    res.status(201).json({ mensaje: 'Pedido creado correctamente' });
  } catch (error: any) {
    console.error('Error en crearPedido:', error);
    res.status(500).json({ error: error.message || 'Error al crear pedido' });
  }
};

export const actualizarPedido = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  const { clienteId, numeroPedido, total, estadoPago, metodoPago, direccionEntrega } = req.body;

  try {
    const result = await sql`
      UPDATE pedido SET
        clienteId = COALESCE(${clienteId}, clienteId),
        numeroPedido = COALESCE(${numeroPedido}, numeroPedido),
        total = COALESCE(${total}, total),
        estadoPago = COALESCE(${estadoPago}, estadoPago),
        metodoPago = COALESCE(${metodoPago}, metodoPago),
        direccionEntrega = COALESCE(${direccionEntrega}, direccionEntrega),
        fechaModificacion = NOW()
      WHERE id = ${id}
    `;

    if ((result as any).count === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json({ mensaje: 'Pedido actualizado correctamente' });
  } catch (error: any) {
    console.error('Error en actualizarPedido:', error);
    res.status(500).json({ error: error.message });
  }
};

export const eliminarPedido = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const result = await sql`DELETE FROM pedido WHERE id = ${id}`;

    if ((result as any).count === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json({ mensaje: 'Pedido eliminado correctamente' });
  } catch (error: any) {
    console.error('Error en eliminarPedido:', error);
    res.status(500).json({
      error: 'No se puede eliminar: el pedido tiene ítems o pagos asociados'
    });
  }
};

export const obtenerPedidoCompleto = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const [pedido] = await sql`
      SELECT 
        p.*, 
        c.nombre AS nombreCliente, 
        c.apellido AS apellidoCliente, 
        c.telefono 
      FROM pedido p
      LEFT JOIN cliente c ON p.clienteId = c.id
      WHERE p.id = ${id}
    `;

    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });

    const items = await sql`
      SELECT 
        ip.*, 
        pr.nombre AS nombreProducto,
        pr.precio
      FROM itempedido ip
      JOIN producto pr ON ip.productoId = pr.id
      WHERE ip.pedidoId = ${id}
    `;

    res.json({ ...pedido, items });
  } catch (error: any) {
    console.error('Error en obtenerPedidoCompleto:', error);
    res.status(500).json({ error: error.message || 'Error al obtener detalle del pedido' });
  }
};