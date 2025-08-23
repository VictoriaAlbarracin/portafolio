// ===== Util =====
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

// ===== Year in footer =====
$("#year").textContent = new Date().getFullYear();

// ===== Tabs =====
$$(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    $$(".tab").forEach(b => b.classList.remove("active"));
    $$(".grid").forEach(g => g.classList.remove("active"));
    btn.classList.add("active");
    const id = btn.dataset.tab;
    document.getElementById(id).classList.add("active");
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
    file: "assets/3d/hora_de_aventura.glb"
    tags: ["3D", "Blender", "GLB"]
  }
];

// ===== Render cards =====
function makeCard2D(p) {
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = \`
    <a href="\${p.link}" target="_blank" rel="noopener">
      <div class="thumb"><img src="\${p.image}" alt="\${p.title}" /></div>
    </a>
    <div class="card-body">
      <h4 class="card-title">\${p.title}</h4>
      <div class="card-tags">\${p.tags.map(t => \`<span class="tag">\${t}</span>\`).join("")}</div>
    </div>
  \`;
  return el;
}

function makeCard3D(p) {
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = \`
    <button class="open-3d" data-file="\${p.file}" data-title="\${p.title}" aria-label="Abrir visor 3D">
      <div class="thumb">Abrir visor 3D</div>
    </button>
    <div class="card-body">
      <h4 class="card-title">\${p.title}</h4>
      <div class="card-tags">\${p.tags.map(t => \`<span class="tag">\${t}</span>\`).join("")}</div>
    </div>
  \`;
  return el;
}

const grid2d = $("#grid-2d");
projects2D.forEach(p => grid2d.appendChild(makeCard2D(p)));

const grid3d = $("#grid-3d");
projects3D.forEach(p => grid3d.appendChild(makeCard3D(p)));

// ===== 3D Viewer Modal =====
const backdrop = document.createElement("div");
backdrop.className = "viewer-backdrop";
backdrop.innerHTML = \`
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
\`;
document.body.appendChild(backdrop);

$("#closeViewerBtn", backdrop).addEventListener("click", () => {
  backdrop.classList.remove("open");
  window.__viewer && window.__viewer.dispose();
});

$("#resetCamBtn", backdrop).addEventListener("click", () => {
  window.__viewer && window.__viewer.resetCamera();
});
$("#wireBtn", backdrop).addEventListener("click", () => {
  window.__viewer && window.__viewer.toggleWireframe();
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
  window.__viewer = createViewer(mount, file);
});
