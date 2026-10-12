
/* ============================================================
   UNIVERSE EXPLORER — 3D UNIVERSE ENGINE
   File: js/universe.js

   Gestisce esclusivamente:
   - Scena 3D e renderer
   - Stelle, nebulose e galassia distante
   - Collegamento illuminazione e navigazione
   - Animazione, ridimensionamento e pulizia
   ============================================================ */

import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

import { createSpaceLighting } from "./lighting.js";
import { createNavigation } from "./navigation.js";

const instances = new WeakMap();

const CONFIG = {
    background: 0x02030a,
    fov: 60,
    near: 0.1,
    far: 12000,
    starCount: 16000,
    pixelRatioLimit: 1.75
};

const NEBULA_SHADER = {
    vertexShader: `
        attribute float aSize;
        attribute vec3 aColor;

        varying vec3 vColor;
        varying float vDepth;

        void main() {
            vColor = aColor;

            vec4 viewPosition =
                modelViewMatrix * vec4(position, 1.0);

            vDepth = -viewPosition.z;
            gl_Position = projectionMatrix * viewPosition;

            gl_PointSize = clamp(
                aSize * (260.0 / max(vDepth, 1.0)),
                1.0,
                30.0
            );
        }
    `,

    fragmentShader: `
        varying vec3 vColor;
        varying float vDepth;

        void main() {
            vec2 centered = gl_PointCoord - vec2(0.5);
            float d = length(centered);

            if (d > 0.5) discard;

            float glow = exp(-d * 8.0);
            float edge = 1.0 - smoothstep(0.04, 0.5, d);
            float depthFade = 1.0 - smoothstep(900.0, 3000.0, vDepth);

            float alpha = glow * edge * 0.26 * depthFade;

            gl_FragColor = vec4(
                vColor * (0.55 + glow * 1.5),
                alpha
            );

            #include <tonemapping_fragment>
            #include <colorspace_fragment>
        }
    `
};

function randomRange(min, max) {
    return min + Math.random() * (max - min);
}

function randomGaussian() {
    const u = Math.max(Math.random(), 0.000001);
    const v = Math.random();

    return Math.sqrt(-2 * Math.log(u)) *
        Math.cos(2 * Math.PI * v);
}

function reportProgress(callback, value, message) {
    if (typeof callback === "function") {
        callback(value, message);
    }
}

/* ------------------------------------------------------------
   RENDERER
   ------------------------------------------------------------ */

function createRenderer(container) {
    if (!container) {
        throw new Error("Universe container not found.");
    }

    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, CONFIG.pixelRatioLimit)
    );

    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Necessario per le ombre dei futuri corpi celesti.
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.domElement.className = "universe-canvas";
    renderer.domElement.setAttribute(
        "aria-label",
        "Interactive three-dimensional universe"
    );

    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    container.appendChild(renderer.domElement);

    return renderer;
}

/* ------------------------------------------------------------
   STARS
   ------------------------------------------------------------ */

function createStarfield() {
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(CONFIG.starCount * 3);
    const colors = new Float32Array(CONFIG.starCount * 3);

    const palette = [
        new THREE.Color(0xffffff),
        new THREE.Color(0xb9d8ff),
        new THREE.Color(0xffe2c0),
        new THREE.Color(0xc6baff),
        new THREE.Color(0x8de5ff)
    ];

    for (let i = 0; i < CONFIG.starCount; i++) {
        const i3 = i * 3;

        const radius = randomRange(700, 5500);
        const theta = randomRange(0, Math.PI * 2);
        const phi = Math.acos(randomRange(-1, 1));

        positions[i3] =
            radius * Math.sin(phi) * Math.cos(theta);

        positions[i3 + 1] = radius * Math.cos(phi);

        positions[i3 + 2] =
            radius * Math.sin(phi) * Math.sin(theta);

        const color =
            palette[Math.floor(Math.random() * palette.length)];

        const brightness = randomRange(0.55, 1.15);

        colors[i3] = color.r * brightness;
        colors[i3 + 1] = color.g * brightness;
        colors[i3 + 2] = color.b * brightness;
    }

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3)
    );

    const material = new THREE.PointsMaterial({
        size: 1.8,
        sizeAttenuation: false,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const stars = new THREE.Points(geometry, material);
    stars.name = "DeepSpaceStarfield";

    return stars;
}

/* ------------------------------------------------------------
   NEBULAE
   Separate clouds with dark space between them.
   ------------------------------------------------------------ */

function createNebulaCloud({
    count,
    center,
    spread,
    colors,
    sizeMin = 4,
    sizeMax = 13
}) {
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const particleColors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const palette = colors.map(color => new THREE.Color(color));

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        positions[i3] = randomGaussian() * spread.x;
        positions[i3 + 1] = randomGaussian() * spread.y;
        positions[i3 + 2] = randomGaussian() * spread.z;

        const color =
            palette[Math.floor(Math.random() * palette.length)];

        const variation = randomRange(0.65, 1.1);

        particleColors[i3] = color.r * variation;
        particleColors[i3 + 1] = color.g * variation;
        particleColors[i3 + 2] = color.b * variation;

        sizes[i] = randomRange(sizeMin, sizeMax);
    }

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
        "aColor",
        new THREE.BufferAttribute(particleColors, 3)
    );

    geometry.setAttribute(
        "aSize",
        new THREE.BufferAttribute(sizes, 1)
    );

    const material = new THREE.ShaderMaterial({
        vertexShader: NEBULA_SHADER.vertexShader,
        fragmentShader: NEBULA_SHADER.fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {}
    });

    const cloud = new THREE.Points(geometry, material);

    cloud.position.set(center.x, center.y, center.z);
    cloud.name = "NebulaRegion";

    return cloud;
}

function createNebulae() {
    const group = new THREE.Group();
    group.name = "DistantNebulae";

    // Nebulosa viola: una regione lontana, non a tutto schermo.
    group.add(createNebulaCloud({
        count: 4500,
        center: { x: -330, y: 150, z: -1050 },
        spread: { x: 115, y: 65, z: 35 },
        colors: [0x5930c8, 0x9138d5, 0x1c4cbd, 0x211052]
    }));

    // Nebulosa blu: separata dalla prima.
    group.add(createNebulaCloud({
        count: 3500,
        center: { x: 390, y: -180, z: -1550 },
        spread: { x: 120, y: 70, z: 40 },
        colors: [0x087bba, 0x2854db, 0x6638ba, 0x112c77]
    }));

    // Nebulosa rossa e magenta.
    group.add(createNebulaCloud({
        count: 3200,
        center: { x: -500, y: -320, z: -2100 },
        spread: { x: 140, y: 55, z: 45 },
        colors: [0x9c286e, 0x592fba, 0x283eaa, 0x401b70]
    }));

    // Piccola regione azzurro-dorata molto distante.
    group.add(createNebulaCloud({
        count: 2600,
        center: { x: 650, y: 350, z: -2700 },
        spread: { x: 150, y: 85, z: 50 },
        colors: [0x175b9e, 0x4932a3, 0x197d91, 0x8b6840]
    }));

    return group;
}

/* ------------------------------------------------------------
   DISTANT SPIRAL GALAXY
   ------------------------------------------------------------ */

function createDistantGalaxy() {
    const count = 9000;
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const palette = [
        new THREE.Color(0x9fc9ff),
        new THREE.Color(0x637dff),
        new THREE.Color(0xd6c5ff),
        new THREE.Color(0xffd3d9),
        new THREE.Color(0xffffff)
    ];

    const arms = 4;
    const radiusMax = 115;

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        const radius = Math.pow(Math.random(), 0.65) * radiusMax;
        const arm = Math.floor(Math.random() * arms);

        const angle =
            radius * 0.055 +
            arm * (Math.PI * 2 / arms) +
            randomGaussian() * 0.18;

        positions[i3] =
            Math.cos(angle) * radius +
            randomGaussian() * (radius * 0.035 + 1);

        positions[i3 + 1] =
            Math.sin(angle) * radius * 0.38 +
            randomGaussian() * (radius * 0.025 + 1);

        positions[i3 + 2] =
            randomGaussian() * (radius * 0.06 + 2);

        const color =
            palette[Math.floor(Math.random() * palette.length)];

        const centerGlow = 1 - Math.min(radius / radiusMax, 1);

        colors[i3] = color.r * (0.55 + centerGlow * 0.8);
        colors[i3 + 1] = color.g * (0.55 + centerGlow * 0.8);
        colors[i3 + 2] = color.b * (0.55 + centerGlow * 0.8);

        sizes[i] = randomRange(1.5, 4.5);
    }

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
        "aColor",
        new THREE.BufferAttribute(colors, 3)
    );

    geometry.setAttribute(
        "aSize",
        new THREE.BufferAttribute(sizes, 1)
    );

    const material = new THREE.ShaderMaterial({
        vertexShader: NEBULA_SHADER.vertexShader,
        fragmentShader: NEBULA_SHADER.fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {}
    });

    const galaxy = new THREE.Points(geometry, material);

    galaxy.position.set(800, 300, -3200);
    galaxy.rotation.z = -0.25;
    galaxy.rotation.x = 0.15;
    galaxy.name = "DistantSpiralGalaxy";

    return galaxy;
}

/* ------------------------------------------------------------
   UNIVERSE INITIALIZATION
   ------------------------------------------------------------ */

export async function initializeUniverse({
    container,
    onProgress
} = {}) {
    if (!container) {
        throw new Error(
            "initializeUniverse() requires a container element."
        );
    }

    const existing = instances.get(container);

    if (existing) {
        existing.resize();
        existing.start();
        return existing;
    }

    let renderer = null;
    let lighting = null;
    let navigation = null;
    let resizeHandler = null;
    let animationFrame = null;
    let running = false;
    let disposed = false;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(CONFIG.background);

    const camera = new THREE.PerspectiveCamera(
        CONFIG.fov,
        Math.max(container.clientWidth, 1) /
            Math.max(container.clientHeight, 1),
        CONFIG.near,
        CONFIG.far
    );

    camera.position.set(0, 0, 45);
    camera.lookAt(0, 0, -100);

    const clock = new THREE.Clock();

    try {
        reportProgress(
            onProgress, 62, "Creating the 3D universe..."
        );

        renderer = createRenderer(container);

        reportProgress(
            onProgress, 70, "Mapping distant stars..."
        );

        scene.add(createStarfield());

        reportProgress(
            onProgress, 78, "Positioning distant nebulae..."
        );

        const nebulae = createNebulae();
        scene.add(nebulae);

        reportProgress(
            onProgress, 85, "Discovering a distant galaxy..."
        );

        const galaxy = createDistantGalaxy();
        scene.add(galaxy);

        reportProgress(
            onProgress, 90, "Calibrating cosmic lighting..."
        );

        // Collegamento al modulo lighting.js.
        lighting = createSpaceLighting(scene);

        reportProgress(
            onProgress, 94, "Activating space navigation..."
        );

        // Collegamento al modulo navigation.js.
        navigation = createNavigation(camera, renderer, scene);

        function resize() {
            if (disposed) return;

            const width = Math.max(container.clientWidth, 1);
            const height = Math.max(container.clientHeight, 1);

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height, false);
            renderer.setPixelRatio(
                Math.min(
                    window.devicePixelRatio || 1,
                    CONFIG.pixelRatioLimit
                )
            );
        }

        function animate() {
            if (!running || disposed) return;

            animationFrame = requestAnimationFrame(animate);

            const delta = Math.min(clock.getDelta(), 0.05);

            // Animazione quasi impercettibile delle regioni lontane.
            nebulae.rotation.z += delta * 0.00012;
            galaxy.rotation.z += delta * 0.0002;

            // Aggiorna i controlli e il movimento della telecamera.
            navigation.update(delta);

            renderer.render(scene, camera);
        }

        function start() {
            if (disposed || running) return;

            running = true;
            clock.start();
            animate();
        }

        function stop() {
            running = false;

            if (animationFrame !== null) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
        }

        function dispose() {
            if (disposed) return;

            stop();
            disposed = true;

            window.removeEventListener("resize", resizeHandler);

            navigation?.dispose();
            lighting?.dispose();

            scene.traverse(object => {
                object.geometry?.dispose();

                if (object.material) {
                    const materials = Array.isArray(object.material)
                        ? object.material
                        : [object.material];

                    for (const material of materials) {
                        material.dispose();
                    }
                }
            });

            renderer.dispose();

            if (renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }

            instances.delete(container);
        }

        const instance = {
            scene,
            camera,
            renderer,
            lighting,
            navigation,
            start,
            stop,
            resize,
            dispose
        };

        resizeHandler = resize;
        window.addEventListener("resize", resizeHandler);

        instances.set(container, instance);

        reportProgress(
            onProgress, 98, "Finalizing the universe..."
        );

        start();

        console.info(
            "[Universe Explorer] Universe, lighting and navigation ready."
        );

        return instance;

    } catch (error) {
        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame);
        }

        navigation?.dispose();
        lighting?.dispose();

        if (resizeHandler) {
            window.removeEventListener("resize", resizeHandler);
        }

        if (renderer) {
            renderer.dispose();

            if (renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
        }

        throw error;
    }
}
