
/* ============================================================
   UNIVERSE EXPLORER
   MODULE: UNIVERSE ENGINE
   Version: 1.0

   Responsibilities:
   - 3D scene and WebGL renderer
   - Deep-space starfield
   - Volumetric-style nebula particles
   - Distant spiral galaxy
   - Smooth rendering and window resizing

   Planets, navigation, interface and advanced effects
   will live in separate modules.
   ============================================================ */

import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const instances = new WeakMap();

const CONFIG = {
    background: 0x02030a,
    fov: 60,
    near: 0.1,
    far: 12000,
    starCount: 16000,
    nebulaParticleCount: 18000,
    galaxyParticleCount: 12000,
    pixelRatioLimit: 2
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

            gl_Position =
                projectionMatrix * viewPosition;

            gl_PointSize = clamp(
                aSize * (260.0 / max(vDepth, 1.0)),
                1.0,
                36.0
            );
        }
    `,

    fragmentShader: `
        varying vec3 vColor;
        varying float vDepth;

        void main() {
            vec2 centered =
                gl_PointCoord - vec2(0.5);

            float distanceFromCenter =
                length(centered);

            if (distanceFromCenter > 0.5) {
                discard;
            }

            float glow =
                exp(-distanceFromCenter * 9.0);

            float edge =
                smoothstep(0.5, 0.04, distanceFromCenter);

            float depthFade =
                1.0 - smoothstep(900.0, 3000.0, vDepth);

            float alpha =
                glow * edge * 0.32 * depthFade;

            gl_FragColor = vec4(
                vColor * (0.65 + glow * 1.8),
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

function createRenderer(container) {
    if (!container) {
        throw new Error(
            "The universe container is missing."
        );
    }

    if (!window.WebGLRenderingContext &&
        !window.WebGL2RenderingContext) {
        throw new Error(
            "This browser does not support WebGL."
        );
    }

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
    });

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio || 1,
            CONFIG.pixelRatioLimit
        )
    );

    renderer.setSize(
        Math.max(container.clientWidth, 1),
        Math.max(container.clientHeight, 1)
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

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
   STARFIELD
   A large three-dimensional field of distant stars.
   ------------------------------------------------------------ */

function createStarfield() {
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(
        CONFIG.starCount * 3
    );

    const colors = new Float32Array(
        CONFIG.starCount * 3
    );

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

        positions[i3 + 1] =
            radius * Math.cos(phi);

        positions[i3 + 2] =
            radius * Math.sin(phi) * Math.sin(theta);

        const color =
            palette[Math.floor(Math.random() * palette.length)];

        const brightness = randomRange(0.45, 1.4);

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
        size: 2.0,
        sizeAttenuation: false,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    return new THREE.Points(geometry, material);
}

/* ------------------------------------------------------------
   NEBULAE
   Layered colored particles create a soft cosmic-cloud effect.
   ------------------------------------------------------------ */

function createNebulaCloud({
    count,
    center,
    spread,
    colors,
    sizeMin = 5,
    sizeMax = 18
}) {
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const particleColors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const colorPalette = colors.map(
        color => new THREE.Color(color)
    );

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        positions[i3] =
            randomGaussian() * spread.x;

        positions[i3 + 1] =
            randomGaussian() * spread.y;

        positions[i3 + 2] =
            randomGaussian() * spread.z;

        const color =
            colorPalette[
                Math.floor(Math.random() * colorPalette.length)
            ];

        const variation = randomRange(0.65, 1.25);

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

    cloud.position.set(
        center.x,
        center.y,
        center.z
    );

    return cloud;
}

function createNebulae() {
    const group = new THREE.Group();

    group.add(createNebulaCloud({
        count: 6500,
        center: { x: -160, y: 80, z: -340 },
        spread: { x: 190, y: 100, z: 45 },
        colors: [0x5930c8, 0x9138d5, 0x1c4cbd, 0x211052]
    }));

    group.add(createNebulaCloud({
        count: 4500,
        center: { x: 180, y: -100, z: -470 },
        spread: { x: 170, y: 110, z: 55 },
        colors: [0x087bba, 0x2854db, 0x6638ba, 0x112c77]
    }));

    group.add(createNebulaCloud({
        count: 4000,
        center: { x: -40, y: -180, z: -620 },
        spread: { x: 240, y: 80, z: 70 },
        colors: [0x9c286e, 0x592fba, 0x283eaa, 0x401b70]
    }));

    group.add(createNebulaCloud({
        count: 3000,
        center: { x: 280, y: 170, z: -800 },
        spread: { x: 220, y: 130, z: 75 },
        colors: [0x175b9e, 0x4932a3, 0x197d91, 0x241b64]
    }));

    return group;
}

/* ------------------------------------------------------------
   DISTANT SPIRAL GALAXY
   A separate distant structure, not a navigable galaxy model.
   ------------------------------------------------------------ */

function createDistantGalaxy() {
    const count = CONFIG.galaxyParticleCount;
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

        const radius =
            Math.pow(Math.random(), 0.65) * radiusMax;

        const arm =
            Math.floor(Math.random() * arms);

        const spiralAngle =
            radius * 0.055 +
            arm * (Math.PI * 2 / arms);

        const angle =
            spiralAngle + randomGaussian() * 0.18;

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

        const centerGlow =
            1 - Math.min(radius / radiusMax, 1);

        colors[i3] = color.r * (0.55 + centerGlow * 0.8);
        colors[i3 + 1] = color.g * (0.55 + centerGlow * 0.8);
        colors[i3 + 2] = color.b * (0.55 + centerGlow * 0.8);

        sizes[i] = randomRange(1.5, 5.0);
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

    galaxy.position.set(230, 75, -1050);
    galaxy.rotation.z = -0.25;
    galaxy.rotation.x = 0.15;

    return galaxy;
}

/* ------------------------------------------------------------
   MAIN INITIALIZATION
   This function is called by app.js.
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

    // Prevent duplicate renderers and animation loops.
    const existing = instances.get(container);

    if (existing) {
        existing.resize();
        existing.start();
        return existing;
    }

    reportProgress(
        onProgress,
        62,
        "Creating the three-dimensional space..."
    );

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

    let renderer;

    try {
        renderer = createRenderer(container);

        reportProgress(
            onProgress,
            70,
            "Mapping distant stars..."
        );

        scene.add(createStarfield());

        reportProgress(
            onProgress,
            79,
            "Forming cosmic nebulae..."
        );

        const nebulae = createNebulae();
        scene.add(nebulae);

        reportProgress(
            onProgress,
            88,
            "Discovering a distant galaxy..."
        );

        const galaxy = createDistantGalaxy();
        scene.add(galaxy);

        // Very faint ambient light for future 3D objects.
        const ambientLight = new THREE.AmbientLight(
            0x8ba5ff,
            0.15
        );

        scene.add(ambientLight);

        let animationFrame = null;
        let running = false;
        let disposed = false;

        const clock = new THREE.Clock();

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

            // Extremely slow motion keeps the scene alive
            // without making the environment feel artificial.
            nebulae.rotation.z += delta * 0.0007;
            galaxy.rotation.z += delta * 0.00035;

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

            window.removeEventListener("resize", resize);

            scene.traverse(object => {
                if (object.geometry) {
                    object.geometry.dispose();
                }

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
            start,
            stop,
            resize,
            dispose
        };

        instances.set(container, instance);

        window.addEventListener("resize", resize);

        reportProgress(
            onProgress,
            96,
            "Finalizing the cosmic environment..."
        );

        start();

        reportProgress(
            onProgress,
            99,
            "Preparing your journey..."
        );

        console.info(
            "[Universe Explorer] 3D universe initialized."
        );

        return instance;

    } catch (error) {
        if (renderer) {
            renderer.dispose();

            if (renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
        }

        throw error;
    }
}
