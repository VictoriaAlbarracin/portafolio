# Portafolio (GitHub Pages)

Sitio estático (HTML, CSS y JS) para publicar un portafolio de videojuegos 2D/3D. No usa APIs ni claves privadas. El visor 3D funciona con Three.js desde CDN.

## Estructura

```
index.html
styles/style.css
scripts/main.js
scripts/viewer.js
assets/2d/placeholder-2d.png
assets/3d/README.txt
```

## Cómo usar

1. **Reemplaza** `assets/2d/placeholder-2d.png` por tus capturas o artes 2D.
2. **Copia** tus modelos `.glb` a `assets/3d/`. Por ejemplo: `assets/3d/espada.glb`.
3. **Edita** la sección **Data** del archivo `scripts/main.js` para listar tus proyectos y rutas reales.
4. (Opcional) Cambia tu nombre/contacto en `index.html`.
5. **Publica en GitHub Pages**:
   - Crea un repo y sube todos los archivos.
   - En *Settings → Pages*, elige *Deploy from a branch* y selecciona la rama `main` y la carpeta `/ (root)`.
   - Abre la URL que te da GitHub Pages.

> Si prefieres no usar CDN, descarga `three.min.js`, `GLTFLoader.js` y `OrbitControls.js` y colócalos en `scripts/vendor/`, ajustando los `<script>` en `index.html`. (Esto no es necesario para GitHub Pages).
