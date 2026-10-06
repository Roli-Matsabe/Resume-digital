import * as THREE from "three";

// Two lightweight, locally rendered scenes. No remote 3D models or textures.
// All resume content remains readable if WebGL is unavailable.
export function mountScenes({ reducedMotion, onFallback }) {
  const scenes = [];
  let paused = reducedMotion;
  let frame = 0;
  let previousTime = 0;
  let elapsed = 0;
  let phase = 0;
  const pointer = new THREE.Vector2();
  const disposables = [];
  const palette = [0xb8472d, 0x87966d, 0xd5b173];

  function createScene(host) {
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      host.dataset.sceneState = "fallback";
      onFallback?.(host);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      host.dataset.sceneState = "fallback";
      item.visible = false;
      onFallback?.(host);
    });
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 30);
    camera.position.set(0, 0.35, 7.5);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight(0xfff7e8, 0x41583f, 3));
    const light = new THREE.DirectionalLight(0xffffff, 4.5);
    light.position.set(-3, 5, 4);
    scene.add(light);
    const rim = new THREE.DirectionalLight(0xffc28e, 3);
    rim.position.set(4, -1, -1);
    scene.add(rim);

    const system = new THREE.Group();
    system.rotation.set(0.35, -0.28, -0.28);
    scene.add(system);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x294d3b,
      metalness: 0.45,
      roughness: 0.3,
      flatShading: true,
    });
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.77, 1),
      coreMaterial,
    );
    system.add(core);
    const coreEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(core.geometry),
      new THREE.LineBasicMaterial({
        color: 0xbdcda9,
        transparent: true,
        opacity: 0.18,
      }),
    );
    core.add(coreEdges);

    const rings = [];
    const satellites = [];
    for (let index = 0; index < 3; index++) {
      const orbit = new THREE.Group();
      orbit.rotation.set(index * 0.65 + 0.35, index * 0.45, index * 0.62);
      const radius = 1.19 + index * 0.29;
      const material = new THREE.MeshStandardMaterial({
        color: palette[index],
        metalness: 0.55,
        roughness: 0.29,
      });
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, index === 0 ? 0.032 : 0.021, 8, 96),
        material,
      );
      orbit.add(ring);
      const node = new THREE.Mesh(
        index === 1
          ? new THREE.BoxGeometry(0.31, 0.31, 0.31)
          : new THREE.SphereGeometry(index === 0 ? 0.18 : 0.13, 24, 16),
        material,
      );
      orbit.add(node);
      node.position.set(radius, 0, 0);
      satellites.push({
        node,
        radius,
        speed: 0.21 + index * 0.07,
        offset: index * 2.3,
      });
      rings.push(orbit);
      system.add(orbit);
    }

    // A dotted outer orbit adds depth without loading images or fonts in WebGL.
    const dotGeometry = new THREE.SphereGeometry(0.014, 6, 4);
    const dotMaterial = new THREE.MeshBasicMaterial({
      color: 0x8e977b,
      transparent: true,
      opacity: 0.55,
    });
    for (let index = 0; index < 60; index++) {
      const angle = (index / 60) * Math.PI * 2;
      const dot = new THREE.Mesh(dotGeometry, dotMaterial);
      dot.position.set(Math.cos(angle) * 2.06, Math.sin(angle) * 2.06, 0);
      system.add(dot);
    }
    const item = {
      host,
      renderer,
      scene,
      camera,
      system,
      core,
      rings,
      satellites,
      visible: false,
      isStory: host.id === "story-canvas",
      dirty: true,
    };
    scenes.push(item);
    const resize = new ResizeObserver(() => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.position.z = camera.aspect < 1 ? 8.6 : 7.5;
      camera.updateProjectionMatrix();
      item.dirty = true;
      requestFrame();
    });
    resize.observe(host);
    const visibility = new IntersectionObserver(
      ([entry]) => {
        item.visible = entry.isIntersecting;
        if (item.visible) {
          item.dirty = true;
          requestFrame();
        }
      },
      { rootMargin: "80px" },
    );
    visibility.observe(host);
    disposables.push(
      () => resize.disconnect(),
      () => visibility.disconnect(),
    );
    host.dataset.sceneState = "ready";
  }

  function render(time) {
    frame = 0;
    const delta = previousTime
      ? Math.min((time - previousTime) / 1000, 0.05)
      : 0;
    previousTime = time;
    if (!paused) elapsed += delta;
    for (const item of scenes) {
      if ((!item.visible && !item.dirty) || document.hidden) continue;
      if (paused && !item.dirty) continue;
      const phaseRotation = item.isStory ? phase * 0.55 : 0;
      item.system.rotation.y =
        -0.28 +
        elapsed * 0.075 +
        phaseRotation +
        (paused ? 0 : pointer.x * 0.16);
      item.system.rotation.x = 0.35 + (paused ? 0 : pointer.y * 0.1);
      item.core.rotation.y = elapsed * 0.12;
      item.core.rotation.z = elapsed * 0.055;
      item.satellites.forEach(({ node, radius, speed, offset }, index) => {
        const angle =
          elapsed * speed + offset + (item.isStory ? phase * 0.4 : 0);
        node.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          0,
        );
        node.rotation.set(elapsed * 0.2, elapsed * 0.3, index);
        node.scale.setScalar(item.isStory && index === phase ? 1.45 : 1);
      });
      item.renderer.render(item.scene, item.camera);
      item.dirty = false;
    }
    if (!paused && !document.hidden && scenes.some((item) => item.visible))
      requestFrame();
  }
  function requestFrame() {
    if (!frame) frame = requestAnimationFrame(render);
  }
  function visibilityChanged() {
    previousTime = 0;
    scenes.forEach((item) => {
      item.dirty = true;
    });
    requestFrame();
  }
  function pointerMoved(event) {
    pointer.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -((event.clientY / window.innerHeight) * 2 - 1),
    );
  }
  document.querySelectorAll(".webgl-scene").forEach(createScene);
  document.addEventListener("visibilitychange", visibilityChanged);
  if (matchMedia("(pointer:fine)").matches)
    document.addEventListener("pointermove", pointerMoved, { passive: true });
  requestFrame();

  return {
    setPaused(value) {
      paused = value;
      previousTime = 0;
      scenes.forEach((item) => {
        item.dirty = true;
      });
      requestFrame();
    },
    setPhase(value) {
      phase = value;
      scenes.forEach((item) => {
        item.dirty = true;
      });
      requestFrame();
    },
    rotate(direction) {
      elapsed += direction * 4;
      scenes.forEach((item) => {
        item.dirty = true;
      });
      requestFrame();
    },
    dispose() {
      cancelAnimationFrame(frame);
      disposables.forEach((dispose) => dispose());
      document.removeEventListener("visibilitychange", visibilityChanged);
      document.removeEventListener("pointermove", pointerMoved);
      const geometries = new Set();
      const materials = new Set();
      scenes.forEach(({ scene, renderer }) => {
        scene.traverse((object) => {
          if (object.geometry) geometries.add(object.geometry);
          if (object.material) materials.add(object.material);
        });
        renderer.dispose();
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
    },
  };
}
