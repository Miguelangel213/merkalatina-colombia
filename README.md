# MerkaLatina Colombia

Tienda estática en HTML, CSS y JavaScript. El cliente explora el catálogo, guarda productos en su carrito y prepara un mensaje de pedido para enviarlo por WhatsApp. **No cobra ni registra pedidos automáticamente**: disponibilidad, valor del envío y pago se confirman con el cliente.

## Verla en local

```bash
python3 -m http.server 8000 --bind 0.0.0.0
```

Abre `http://localhost:8000/`. Es necesario servir los archivos por HTTP: el catálogo se carga desde `data/productos.json` y no funciona correctamente si se abre `index.html` directamente con `file://`.

## Actualizar la tienda

- **Productos y precios:** edita `data/productos.json`. Cada producto necesita `id`, `name`, `price`, `image` y `category`. `oldPrice` y `featured` son opcionales. Usa identificadores únicos y precios en pesos colombianos.
- **Fotos de productos:** las URL actuales del JSON son imágenes ilustrativas externas. Para publicar una tienda confiable, reemplázalas por fotos reales de cada artículo (preferiblemente archivos optimizados dentro de `assets/images/`). Si una imagen no carga, se muestra un marcador neutro.
- **Categorías:** las páginas están en `pages/` y sus nombres, descripciones e imágenes se configuran en `CATEGORY_DEFINITIONS`, al comienzo de `script.js`. Las imágenes locales de portada y de varias categorías son ilustrativas.
- **WhatsApp:** actualiza `WHATSAPP_NUMBER` en `script.js` y los enlaces directos de contacto en `index.html` y `pages/quienes-somos.html` si cambia el número.
- **Condiciones comerciales:** revisa que las indicaciones de envío y pago contra entrega coincidan con tu operación antes de publicar.

La búsqueda de la portada abarca **todos los productos** del JSON, incluso los que no aparecen entre los destacados. El carrito se guarda en el navegador con `localStorage`; al abrir WhatsApp, permanece guardado para que el comprador no pierda su selección si aún no envía el mensaje.

Los iconos y fuentes se sirven localmente desde `assets/vendor/` y `assets/fonts/`. Las licencias de terceros están en `assets/vendor/licenses/`.
