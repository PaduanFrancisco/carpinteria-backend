import { Router } from 'express';
import {
  obtenerImagenes,
  obtenerImagen,
  crearImagen,
  actualizarImagen,
  eliminarImagen
} from '../controllers/imagen.controller';

const router = Router();

router.get('/', obtenerImagenes);
router.get('/:id', obtenerImagen);
router.post('/', crearImagen);
router.put('/:id', actualizarImagen);
router.delete('/:id', eliminarImagen);

export default router;