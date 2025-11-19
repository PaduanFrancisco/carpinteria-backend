import { Router } from 'express';
import {
  obtenerCarritos,
  obtenerCarrito,
  crearCarrito,
  actualizarCarrito,
  eliminarCarrito
} from '../controllers/carrito.controller';

const router = Router();

router.get('/', obtenerCarritos);
router.get('/:id', obtenerCarrito);
router.post('/', crearCarrito);
router.put('/:id', actualizarCarrito);
router.delete('/:id', eliminarCarrito);

export default router;