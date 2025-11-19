import { Router } from 'express';
import {
  obtenerPedidos,
  obtenerPedido,
  crearPedido,
  actualizarPedido,
  eliminarPedido,
  obtenerPedidoCompleto   
} from '../controllers/pedido.controller';

const router = Router();

router.get('/', obtenerPedidos);
router.get('/:id', obtenerPedido);
router.post('/', crearPedido);
router.put('/:id', actualizarPedido);
router.delete('/:id', eliminarPedido);

router.get('/:id/completo', obtenerPedidoCompleto);  

export default router;