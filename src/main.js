import * as THREE from 'three';

/* =========================================================
   UNIVERSE EXPLORER
   Main application entry point
   ========================================================= */

const CONFIG = {
  background: 0x02040b,
  starCount: 6500,
  starRadius: 900,
  cameraFov: 65,
  cameraNear: 0.1,
  cameraFar: 3000,
  cameraStartZ: 45,
  exposure: 1.15,
  minPixelRatio: 1,
  maxPixelRatio: 2
};

class UniverseExplorer {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.starField = null;
    this.clock = new THREE.Clock();

    this.animationFrame = null;
    this.isRunning = false;

    this.pointer = new THREE.Vector2();
    this.targetRotation = new THREE.Vector2();
    this.currentRotation = new THREE.Vector2();

    this.resizeObserver = null;
    this.reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    this.onResize = this.onResize.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.animate = this.animate.bind(this);
  }

  /* -------------------------------------------------------
     APPLICATION INITIALIZATION
     ------------------------------------------------------- */

  init() {
    this.createApplicationRoot();
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createLights();
    this.createStarField();
    this.createAmbientDust();
    this.createEventListeners();

    this.isRunning = true;
    this.animate();

    console.info(
      '%cUNIVERSE EXPLORER',
      'color:#5bbcff;font-size:20px;font-weight:bold;'
    );

    console.info('Three.js scene initialized successfully.');
  }

  createApplicationRoot() {
    this.root = document.querySelector('#app');

    if (!this.root) {
      this.root = document.createElement('div');
      this.root.id = 'app';
      document.body.appendChild(this.root);
    }

    this.root.style.width = '100%';
    this.root.style.height = '100%';
    this.root.style.minHeight = '100vh';
    this.root.style.position = 'relative';
    this.root.style.overflow = 'hidden';
    this.root.style.background = '#02040b';
  }

  /* -------------------------------------------------------
     THREE.JS SCENE
     ------------------------------------------------------- */

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(CONFIG.background);

    this.scene.fog = new THREE.FogExp2(
      CONFIG.background,
      0.00035
    );
  }

  /* -------------------------------------------------------
     CAMERA
     ------------------------------------------------------- */

  createCamera() {
    const aspect = window.innerWidth / window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(
      CONFIG.cameraFov,
      aspect,
      CONFIG.cameraNear,
      CONFIG.cameraFar
    );

    this.camera.position.set(0, 0, CONFIG.cameraStartZ);
    this.camera.lookAt(0, 0, 0);
  }

  /* -------------------------------------------------------
     WEBGL RENDERER
     ------------------------------------------------------- */

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });

    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      CONFIG.maxPixelRatio
    );

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = CONFIG.exposure;

    this.renderer.domElement.id = 'universe-canvas';
    this.renderer.domElement.setAttribute(
      'aria-label',
      'Scena tridimensionale interattiva dell’universo'
    );

    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.inset = '0';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.zIndex = '0';

    this.root.appendChild(this.renderer.domElement);
  }

  /* -------------------------------------------------------
     LIGHTING
     ------------------------------------------------------- */

  createLights() {
    const ambientLight = new THREE.AmbientLight(
      0x526a9d,
      0.45
    );

    this.scene.add(ambientLight);

    const blueLight = new THREE.PointLight(
      0x237bff,
      24,
      450
    );

    blueLight.position.set(35, 20, 20);
    this.scene.add(blueLight);

    const violetLight = new THREE.PointLight(
      0x8b45ff,
      18,
      350
    );

    violetLight.position.set(-40, -15, -30);
    this.scene.add(violetLight);
  }

  /* -------------------------------------------------------
     PROCEDURAL STAR FIELD
     ------------------------------------------------------- */

  createStarField() {
    const count = CONFIG.starCount;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const colorPalette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0x8ecbff),
      new THREE.Color(0x7194ff),
      new THREE.Color(0xc4a0ff),
      new THREE.Color(0xffe5d1)
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const radius = THREE.MathUtils.randFloat(
        80,
        CONFIG.starRadius
      );

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(
        THREE.MathUtils.randFloatSpread(2)
      );

      positions[i3] =
        radius * Math.sin(phi) * Math.cos(theta);

      positions[i3 + 1] =
        radius * Math.sin(phi) * Math.sin(theta);

      positions[i3 + 2] =
        radius * Math.cos(phi);

      const color = colorPalette[
        Math.floor(Math.random() * colorPalette.length)
      ];

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = THREE.MathUtils.randFloat(0.5, 2.2);
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3)
    );

    geometry.setAttribute(
      'size',
      new THREE.BufferAttribute(sizes, 1)
    );

    const material = new THREE.PointsMaterial({
      size: 1.15,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.starField = new THREE.Points(
      geometry,
      material
    );

    this.scene.add(this.starField);
  }

  /* -------------------------------------------------------
     DISTANT AMBIENT DUST
     ------------------------------------------------------- */

  createAmbientDust() {
    const count = 900;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      positions[i3] = THREE.MathUtils.randFloatSpread(500);
      positions[i3 + 1] = THREE.MathUtils.randFloatSpread(300);
      positions[i3 + 2] = THREE.MathUtils.randFloatSpread(400);
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
      color: 0x729eff,
      size: 0.65,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.dustField = new THREE.Points(
      geometry,
      material
    );

    this.scene.add(this.dustField);
  }

  /* -------------------------------------------------------
     USER INPUT
     ------------------------------------------------------- */

  createEventListeners() {
    window.addEventListener('resize', this.onResize);

    this.renderer.domElement.addEventListener(
      'pointermove',
      this.onPointerMove
    );

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }

  onPointerMove(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();

    this.pointer.x =
      ((event.clientX - rect.left) / rect.width) * 2 - 1;

    this.pointer.y =
      -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.targetRotation.x = this.pointer.y * 0.025;
    this.targetRotation.y = this.pointer.x * 0.04;
  }

  onResize() {
    if (!this.camera || !this.renderer) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        CONFIG.maxPixelRatio
      )
    );

    this.renderer.setSize(width, height);
  }

  /* -------------------------------------------------------
     ANIMATION LOOP
     ------------------------------------------------------- */

  animate() {
    if (!this.isRunning) return;

    this.animationFrame = requestAnimationFrame(this.animate);

    const elapsed = this.clock.getElapsedTime();
    const delta = Math.min(this.clock.getDelta(), 0.05);

    if (!this.reducedMotion) {
      this.updateStarField(elapsed, delta);
      this.updateDust(elapsed, delta);
      this.updateCameraMotion(delta);
    }

    this.renderer.render(this.scene, this.camera);
  }

  updateStarField(elapsed, delta) {
    if (!this.starField) return;

    this.starField.rotation.y += delta * 0.002;
    this.starField.rotation.x += delta * 0.0005;

    this.starField.rotation.x = THREE.MathUtils.lerp(
      this.starField.rotation.x,
      this.targetRotation.x,
      0.02
    );

    this.starField.rotation.y = THREE.MathUtils.lerp(
      this.starField.rotation.y,
      this.targetRotation.y,
      0.02
    );

    this.starField.material.opacity =
      0.84 + Math.sin(elapsed * 0.5) * 0.08;
  }

  updateDust(elapsed, delta) {
    if (!this.dustField) return;

    this.dustField.rotation.y += delta * 0.001;
    this.dustField.rotation.z =
      Math.sin(elapsed * 0.08) * 0.025;
  }

  updateCameraMotion(delta) {
    const targetX = this.targetRotation.x * 1.5;
    const targetY = this.targetRotation.y * 1.5;

    this.camera.rotation.x = THREE.MathUtils.lerp(
      this.camera.rotation.x,
      targetX,
      delta * 0.8
    );

    this.camera.rotation.y = THREE.MathUtils.lerp(
      this.camera.rotation.y,
      targetY,
      delta * 0.8
    );
  }

  /* -------------------------------------------------------
     PAUSE AND RESUME
     ------------------------------------------------------- */

  pause() {
    if (!this.isRunning) return;

    this.isRunning = false;

    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  resume() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.clock.start();
    this.animate();
  }

  /* -------------------------------------------------------
     CLEANUP
     ------------------------------------------------------- */

  dispose() {
    this.pause();

    window.removeEventListener('resize', this.onResize);

    if (this.starField) {
      this.starField.geometry.dispose();
      this.starField.material.dispose();
    }

    if (this.dustField) {
      this.dustField.geometry.dispose();
      this.dustField.material.dispose();
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }
  }
}

/* =========================================================
   START APPLICATION
   ========================================================= */

function startUniverseExplorer() {
  const application = new UniverseExplorer();

  try {
    application.init();

    window.universeExplorer = application;
  } catch (error) {
    console.error(
      'Universe Explorer could not be initialized:',
      error
    );

    const app = document.querySelector('#app');

    if (app) {
      app.innerHTML = `
        <div style="
          display:flex;
          align-items:center;
          justify-content:center;
          min-height:100vh;
          padding:32px;
          color:#ffffff;
          background:#02040b;
          font-family:Arial,sans-serif;
          text-align:center;
        ">
          <div>
            <h1>Universe Explorer</h1>
            <p>Impossibile inizializzare la scena 3D.</p>
            <p>Controlla la console del browser per i dettagli.</p>
          </div>
        </div>
      `;
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    startUniverseExplorer,
    { once: true }
  );
} else {
  startUniverseExplorer();
}
