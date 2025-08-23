window.createViewer = function(mount, glbPath) {
  const el = document.createElement('div');
  el.style.padding = '1rem';
  el.textContent = `Aquí iría el visor 3D. Cargaría: ${glbPath}`;
  mount.appendChild(el);

  return {
    dispose() { mount.innerHTML = ''; },
    resetCamera() {},
    toggleWireframe() {}
  };
};
