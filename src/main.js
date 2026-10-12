```javascript
import * as THREE from 'three';
import './styles/main.css';
import Homepage from './interface/homepage.js';

/* =========================================
   UNIVERSE EXPLORER
   Motore 3D e gestione dell'interfaccia
========================================= */

const CONFIG = {
  background: 0x02040b,
  starCount: 6500,
  dustCount: 900,
  cameraStartZ: 45,
  cameraFov: 60,
  minPixelRatio: 1,
  maxPixelRatio: 2,
  starfieldRadius: 220,
  dustRadius: 100,
  movementStrength: 0.018,
  rotationSpeed: 0.0007,
  targetFpsDelta: 0.05
};

class UniverseExplorer {
  constructor() {
    this.app = document.querySelector('#app');

    if (!this.app) {
      throw new Error(
        'Universe Explorer: elemento #app non trovato in index.html.'
      );
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();

    this.starField = null;
    this.dustField = null;
    this.homepage = null;

    this.pointer = { x: 0, y: 0 };
    this.targetRotation = { x: 0, y: 0 };
    this.cameraTarget = new THREE.Vector3(0, 0, 0);

    this.isRunning = false;
    this.isDisposed = false;
    this.isExploring = false;
    this.animationFrame = null;

    this.handleResize = this.handleResize.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handleVisibilityChange =
      this.handleVisibilityChange.bind(this);

    this.init();
  }

  /* =========================================
     INIZIALIZZAZIONE
  ========================================= */

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createLights();
    this.createStarField();
    this.createDustField();
    this.createHomepage();
    this.addEventListeners();

    this.app.classList.add('universe-ready');

    this.isRunning = true;
    this.clock.start();
    this.animate();

    window.universeExplorer = this;

    console.info('Universe Explorer inizializzato.');
  }

  /* =========================================
     SCENA 3D
  ========================================= */

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(CONFIG.background);

    this.scene.fog = new THREE.FogExp2(
      CONFIG.background,
      0.0008
    );
  }

  /* =========================================
     CAMERA
  ========================================= */

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      CONFIG.cameraFov,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );

    this.camera.position.set(0, 0, CONFIG.cameraStartZ);
    this.camera.lookAt(0, 0, 0);
  }

  /* =========================================
     RENDERER WEBGL
  ========================================= */

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });

    this.renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        CONFIG.maxPixelRatio
      )
    );

    this.renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    this.renderer.domElement.id = 'universe-canvas';
    this.renderer.domElement.setAttribute(
      'aria-label',
      'Visualizzazione tridimensionale dello spazio'
    );

    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.inset = '0';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.zIndex = '0';
    this.renderer.domElement.style.pointerEvents = 'none';

    this.app.prepend(this.renderer.domElement);
  }

  /* =========================================
     ILLUMINAZIONE
  ========================================= */

  createLights() {
    const ambientLight = new THREE.AmbientLight(
      0x8090c8,
      0.65
    );

    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(
      0x8db8ff,
      0.45
    );

    directionalLight.position.set(20, 30, 25);
    this.scene.add(directionalLight);

    const purpleLight = new THREE.PointLight(
      0x702cff,
      1.1,
      180
    );

    purpleLight.position.set(-45, 15, -35);
    this.scene.add(purpleLight);
  }

  /* =========================================
     CAMPO STELLARE
  ========================================= */

  createStarField() {
    const positions = new Float32Array(
      CONFIG.starCount * 3
    );

    const colors = new Float32Array(
      CONFIG.starCount * 3
    );

    const colorChoices = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xaac8ff),
      new THREE.Color(0x86a8ff),
      new THREE.Color(0xd9b8ff),
      new THREE.Color(0x8ff4ff)
    ];

    for (let i = 0; i < CONFIG.starCount; i++) {
      const i3 = i * 3;

      const radius = CONFIG.starfieldRadius *
        (0.35 + Math.random() * 0.65);

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(
        2 * Math.random() - 1
      );

      positions[i3] =
        radius * Math.sin(phi) * Math.cos(theta);

      positions[i3 + 1] =
        radius * Math.sin(phi) * Math.sin(theta);

      positions[i3 + 2] =
        radius * Math.cos(phi);

      const chosenColor = colorChoices[
        Math.floor(Math.random() * colorChoices.length)
      ];

      const brightness = 0.55 + Math.random() * 0.45;

      colors[i3] = chosenColor.r * brightness;
      colors[i3 + 1] = chosenColor.g * brightness;
      colors[i3 + 2] = chosenColor.b * brightness;
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

    const material = new THREE.PointsMaterial({
      size: 0.24,
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

  /* =========================================
     POLVERE COSMICA
  ========================================= */

  createDustField() {
    const positions = new Float32Array(
      CONFIG.dustCount * 3
    );

    for (let i = 0; i < CONFIG.dustCount; i++) {
      const i3 = i * 3;

      positions[i3] =
        (Math.random() - 0.5) * CONFIG.dustRadius * 2;

      positions[i3 + 1] =
        (Math.random() - 0.5) * CONFIG.dustRadius * 2;

      positions[i3 + 2] =
        (Math.random() - 0.5) * CONFIG.dustRadius * 2;
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
      color: 0x6d8dff,
      size: 0.045,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.dustField = new THREE.Points(
      geometry,
      material
    );

    this.scene.add(this.dustField);
  }

  /* =========================================
     HOMEPAGE
  ========================================= */

  createHomepage() {
    this.homepage = new Homepage({
      root: this.app,
      onExplore: () => this.startExploration()
    });

    this.homepage.render();
  }

  /* =========================================
     PULSANTE EXPLORE
  ========================================= */

  startExploration() {
    if (this.isExploring) return;

    this.isExploring = true;

    this.app.classList.add('exploration-active');

    window.dispatchEvent(
      new CustomEvent('universe:exploration-started')
    );

    /*
      In questo passaggio attiviamo la modalità
      esplorazione. Il Sistema Solare interattivo
      verrà aggiunto in un passaggio successivo.
    */

    console.info('Modalità esplorazione attivata.');
  }

  /* =========================================
     EVENTI DEL BROWSER
  ========================================= */

  addEventListeners() {
    window.addEventListener(
      'resize',
      this.handleResize,
      { passive: true }
    );

    window.addEventListener(
      'pointermove',
      this.handlePointerMove,
      { passive: true }
    );

    document.addEventListener(
      'visibilitychange',
      this.handleVisibilityChange
    );
  }

  handleResize() {
    if (!this.camera || !this.renderer) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);

    this.renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        CONFIG.maxPixelRatio
      )
    );
  }

  handlePointerMove(event) {
    this.pointer.x =
      (event.clientX / window.innerWidth) * 2 - 1;

    this.pointer.y =
      (event.clientY / window.innerHeight) * 2 - 1;

    this.targetRotation.x =
      this.pointer.y * CONFIG.movementStrength;

    this.targetRotation.y =
      this.pointer.x * CONFIG.movementStrength;
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.stop();
    } else {
      this.resume();
    }
  }

  /* =========================================
     ANIMAZIONE
  ========================================= */

  animate() {
    if (!this.isRunning || this.isDisposed) return;

    this.animationFrame = requestAnimationFrame(
      () => this.animate()
    );

    const delta = Math.min(
      this.clock.getDelta(),
      CONFIG.targetFpsDelta
    );

    this.updateScene(delta);

    this.renderer.render(
      this.scene,
      this.camera
    );
  }

  updateScene(delta) {
    if (this.starField) {
      this.starField.rotation.y +=
        CONFIG.rotationSpeed * delta * 60;

      this.starField.rotation.x +=
        CONFIG.rotationSpeed * delta * 12;

      this.starField.rotation.x +=
        (this.targetRotation.x -
          this.starField.rotation.x) *
        Math.min(delta * 0.25, 0.015);

      this.starField.rotation.y +=
        this.targetRotation.y *
        delta * 0.025;
    }

    if (this.dustField) {
      this.dustField.rotation.y += delta * 0.003;
      this.dustField.rotation.x += delta * 0.001;
    }
  }

  /* =========================================
     PAUSA E RIPRESA
  ========================================= */

  stop() {
    if (!this.isRunning) return;

    this.isRunning = false;

    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  resume() {
    if (this.isDisposed || this.isRunning) return;

    this.isRunning = true;
    this.clock.start();
    this.animate();
  }

  /* =========================================
     PULIZIA RISORSE
  ========================================= */

  dispose() {
    this.stop();
    this.isDisposed = true;

    window.removeEventListener(
      'resize',
      this.handleResize
    );

    window.removeEventListener(
      'pointermove',
      this.handlePointerMove
    );

    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange
    );

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

    if (window.universeExplorer === this) {
      delete window.universeExplorer;
    }
  }
}

/* =========================================
   AVVIO APPLICAZIONE
========================================= */

function startUniverseExplorer() {
  try {
    new UniverseExplorer();
  } catch (error) {
    console.error(
      'Impossibile avviare Universe Explorer:',
      error
    );

    const app = document.querySelector('#app');

    if (app) {
      app.innerHTML = `
        <main style="
          min-height: 100vh;
          display: grid;
          place-content: center;
          padding: 32px;
          background: #030611;
          color: #eaf0ff;
          font-family: sans-serif;
          text-align: center;
        ">
          <h1>Universe Explorer</h1>
          <p>Si è verificato un problema durante l'avvio.</p>
          <p style="color: #9caed0;">
            Controlla i file e la console del browser.
          </p>
        </main>
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
```
