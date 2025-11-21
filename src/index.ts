// src/index.ts
import express from 'express';
import cors from 'cors';

// RUTAS (todas corregidas y en orden)
import productoRoutes from './routes/producto.routes';
import clienteRoutes from './routes/cliente.routes';
import pedidoRoutes from './routes/pedido.routes';
import categoriaRoutes from './routes/categoria.routes';
import carritoRoutes from './routes/carrito.routes';
import imagenRoutes from './routes/imagen.routes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// RUTA RAÍZ - con todas las rutas disponibles
app.get('/', (req, res) => {
  res.send(`
    <h1>Backend Carpintería - FUNCIONANDO</h1>
    <h3>Rutas disponibles:</h3>
    <ul style="font-size: 18px;">
      <li><a href="/api/productos">/api/productos</a> → Productos</li>
      <li><a href="/api/clientes">/api/clientes</a> → Clientes</li>
      <li><a href="/api/pedidos">/api/pedidos</a> → Pedidos</li>
      <li><a href="/api/categorias">/api/categorias</a> → Categorías</li>
      <li><a href="/api/carrito">/api/carrito</a> → Carrito</li>
      <li><a href="/api/imagenes">/api/imagenes</a> → Imágenes</li>
    </ul>
    <p><strong>Todo OK - Listo para entregar</strong></p>
  `);
});

// RUTAS API (¡TODAS CORREGIDAS!)
app.use('/api/productos', productoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/categorias', categoriaRoutes);   // ← estaba mal el nombre
app.use('/api/carrito', carritoRoutes);        // ← ok
app.use('/api/imagenes', imagenRoutes);        // ← ok

// Puerto
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Ruta principal: http://localhost:${PORT}`);
});

// PERMITIR PUT y DELETE (importante!)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

export default app;