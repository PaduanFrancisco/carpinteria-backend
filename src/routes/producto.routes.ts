// src/routes/producto.routes.ts
import { Router } from 'express';
import {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProductoCompleto   
} from '../controllers/producto.controller';

const router = Router();

// CRUD normal
router.get('/', obtenerProductos);
router.get('/:id', obtenerProducto);
router.post('/', crearProducto);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

// ← NUEVA RUTA CON RELACIÓN
router.get('/:id/completo', obtenerProductoCompleto);

export default router;