// src/routes/carrito.routes.ts
import { Router } from 'express';
import {
  obtenerCarrito,
  agregarAlCarrito,
  eliminarDelCarrito,
  actualizarCantidad
} from '../controllers/carrito.controller';

const router = Router();

router.get('/', obtenerCarrito);
router.post('/', agregarAlCarrito);
router.delete('/:id', eliminarDelCarrito);
router.put('/:id', actualizarCantidad);

export default router;