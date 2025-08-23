(() => {
  'use strict';
  const log = (...a) => console.log('[main.js]:', ...a);
  const err = (...a) => console.error('[main.js ERROR]:', ...a);

  // ===== Utils =====
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // ===== Sanity checks =====
  const grid2d = $("#grid-2d");
  const grid3d = $("#grid-3d");
  if (!grid2d || !grid3d) {
    return err('No encontré #grid-2d o #grid-3d. ¿Los IDs coinciden con el HTML?');
  }
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== Tabs =====
  $$(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".tab").forEach(b => b.classList.remove("active"));
      $$(".grid").forEach(g => g.classList.remove("active"));
      btn.classList.add("active");
      const id = btn.dataset.tab;
      const pane = document.getElementById(id);
      if (pane) pane.classList.add("active");
    });
  });

  // ===== Data (edita esto con tus proyectos) =====
  const projects2D = [
    {
      title: "Pixel Runner",
      image: "assets/2d/foto.png",
      tags: ["2D", "Pixel Art", "Unity"],
      link: "#"
    },
    {
      title: "UI Mockup HUD",
      image: "assets/2d/placeholder-2d.png",
      tags: ["UI", "Figma"],
      link: "#"
    }
  ];

  const projects3D = [
    {
      title: "Espada Low-Poly",
      file: "assets/3d/hora_de_aventura.glb", // 👈 la coma era obligatoria
      tags: ["3D", "Blender", "GLB"]
    }
  ];

  // ===== Render cards =====
  function makeCard2D(p) {
    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `
      <a href="${p.link}" target="_blank" rel="noopener">
        <div class="thumb"><img src="${p.image}" alt="${p.title}" /></div>
      </a>
      <div class="card-body">
        <h4 class="card-title">${p.title}</h4>
        <div class="card-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
      </div>
    `;
    return el;
  }

  function makeCard3D(p) {
    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `
      <button class="open-3d" data-file="${p.file}" data-title="${p.title}" aria-label="Abrir visor 3D">
        <div class="thumb">Abrir visor 3D</div>
      </button>
      <div class="card-body">
        <h4 class="card-title">${p.title}</h4>
        <div class="card-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
      </div>
    `;
    return el;
  }

  projects2D.forEach(p => grid2d.appendChild(makeCard2D(p)));
  projects3D.forEach(p => grid3d.appendChild(makeCard3D(p)));

  log('Inicializado. Cards 2D:', projects2D.length, 'Cards 3D:', projects3D.length);

  // ===== 3D Viewer Modal =====
  // (Se crea on-demand para evitar errores si falta el visor)
  let backdrop = $(".viewer-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "viewer-backdrop";
    backdrop.innerHTML = `
      <div class="viewer-modal">
        <div class="viewer-header">
          <div class="viewer-title">Visor 3D</div>
          <div class="viewer-actions">
            <button id="resetCamBtn" title="Reset cámara">Reset</button>
            <button id="wireBtn" title="Wireframe">Wire</button>
            <button class="close-btn" id="closeViewerBtn" title="Cerrar">Cerrar</button>
          </div>
        </div>
        <div class="viewer-canvas" id="viewerCanvas"></div>
      </div>
    `;
    document.body.appendChild(backdrop);
  }

  backdrop.addEventListener("click", (e) => {
    if (e.target.matches(".close-btn")) {
      backdrop.classList.remove("open");
      if (window.__viewer && typeof window.__viewer.dispose === 'function') {
        window.__viewer.dispose();
      }
    }
    if (e.target.matches("#resetCamBtn")) {
      window.__viewer && typeof window.__viewer.resetCamera === 'function' && window.__viewer.resetCamera();
    }
    if (e.target.matches("#wireBtn")) {
      window.__viewer && typeof window.__viewer.toggleWireframe === 'function' && window.__viewer.toggleWireframe();
    }
  });

  grid3d.addEventListener("click", e => {
    const btn = e.target.closest(".open-3d");
    if (!btn) return;
    const file = btn.dataset.file;
    const title = btn.dataset.title;
    $(".viewer-title", backdrop).textContent = title;
    backdrop.classList.add("open");
    const mount = $("#viewerCanvas", backdrop);
    mount.innerHTML = "";
    if (typeof window.createViewer === 'function') {
      window.__viewer = window.createViewer(mount, file);
    } else {
      // Fallback si viewer.js no cargó: solo muestra el nombre del archivo
      mount.innerHTML = `<p style="padding:1rem">No se encontró <code>createViewer</code>. Verifica <code>scripts/viewer.js</code>.<br>Archivo: <code>${file}</code></p>`;
      err('createViewer no definido. ¿viewer.js cargó bien?');
    }
  });
})();

