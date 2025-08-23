function createViewer(mountEl, glbPath) {
  const state = { mounted: true, wireframe: false };
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0d12);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  camera.position.set(1.2, 1.2, 1.8);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(mountEl.clientWidth, mountEl.clientHeight);
  mountEl.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(3, 5, 2);
  scene.add(dir);

  // Grid & floor
  const grid = new THREE.GridHelper(6, 24, 0x3b82f6, 0x1f2937);
  grid.position.y = -0.001;
  scene.add(grid);

  // Load GLB
  const loader = new THREE.GLTFLoader();
  loader.load(glbPath, (gltf) => {
    const root = gltf.scene;
    scene.add(root);

    // Compute bounding box to center & frame
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());
    root.position.sub(center); // center the model

    // Position camera to frame the object
    const dist = Math.max(2, size * 0.8);
    camera.position.set(dist, dist * 0.7, dist);
    camera.lookAt(0, 0, 0);
    controls.target.set(0, 0, 0);
  }, undefined, (err) => {
    const msg = document.createElement('div');
    msg.style.color = 'white';
    msg.style.padding = '10px';
    msg.textContent = 'No se pudo cargar el modelo 3D. Verifica la ruta del archivo .glb.';
    mountEl.appendChild(msg);
    console.error(err);
  });

  // Handle resize
  function onResize() {
    if (!state.mounted) return;
    const { clientWidth: w, clientHeight: h } = mountEl;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(onResize);
  ro.observe(mountEl);

  // Animate
  let raf;
  function tick() {
    controls.update();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }
  tick();

  // API
  return {
    resetCamera() {
      controls.reset();
    },
    toggleWireframe() {
      state.wireframe = !state.wireframe;
      scene.traverse(obj => {
        if (obj.isMesh && obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.wireframe = state.wireframe);
          } else {
            obj.material.wireframe = state.wireframe;
          }
        }
      });
    },
    dispose() {
      state.mounted = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
    }
  };
}
