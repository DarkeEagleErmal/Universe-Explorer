import * as THREE from "three";

import { initializeWelcome, showHome } from "./welcome.js";
import {
    initializeExplorationControls,
    setExplorationMode
} from "./explorationControls.js";

import {
    initializeCamera,
    focusCameraOnObject,
    updateCamera
} from "./camera.js";

import { initializeInformation } from "./information.js";
import { initializeGuide } from "./guide.js";
import { initializeEffects, updateEffects } from "./effects.js";

import {
    initializeInterface,
    updatePosition,
    updateScale,
    updateSelectedStatus
} from "./interface.js";

import {
    allCelestialObjects,
    moonObjects
} from "./celestialBodies.js";

import {
    deepSpaceObjects,
    nebulaObjects,
    galaxyObjects,
    asteroidBelt,
    kuiperBelt,
    oortCloud,
    cometObjects
} from "./universe.js";

import { COLORS } from "./colors.js";

// ============================================================
// GLOBAL STATE
// ============================================================

let scene;
let renderer;
let camera;
let controls;

let raycaster;
let mouse;

let selectedObject = null;
let selectedData = null;

const objectMeshes = [];
const objectMap = new Map();

let solarSystem;
let deepSpaceGroup;
let galaxyGroup;
let nebulaGroup;
let blackHoleGroup;
let asteroidGroup;
let cometGroup;

const orbitLines = [];

let currentFilter = "all";
let currentTimeMultiplier = 1;

// ============================================================
// TEXTURES
// ============================================================

function createSoftCircleTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;

    const context = canvas.getContext("2d");

    const gradient = context.createRadialGradient(
        64,
        64,
        0,
        64,
        64,
        64
    );

    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.25, "rgba(255,255,255,0.95)");
    gradient.addColorStop(0.55, "rgba(255,255,255,0.45)");
    gradient.addColorStop(0.8, "rgba(255,255,255,0.12)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    return texture;
}

function createNebulaTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;

    const context = canvas.getContext("2d");

    context.clearRect(0, 0, 256, 256);

    for (let i = 0; i < 18; i++) {
        const x = 40 + Math.random() * 176;
        const y = 40 + Math.random() * 176;
        const radius = 30 + Math.random() * 70;

        const gradient = context.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            radius
        );

        gradient.addColorStop(0, "rgba(255,255,255,0.18)");
        gradient.addColorStop(0.4, "rgba(255,255,255,0.08)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        context.fillStyle = gradient;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    return texture;
}

const softCircleTexture = createSoftCircleTexture();
const nebulaTexture = createNebulaTexture();

// ============================================================
// INITIALIZATION
// ============================================================

function initializeApp() {
    createScene();
    createRenderer();

    const cameraData = initializeCamera(scene, renderer);

    camera = cameraData.camera;
    controls = cameraData.controls;

    initializeEffects(scene);

    createUniverseGroups();

    createCelestialBodies();
    createDeepSpace();
    createNebulae();
    createGalaxies();
    createBlackHoles();

    createAsteroidBelt();
    createKuiperBelt();
    createOortCloud();
    createComets();

    createOrbits();

    initializeRaycaster();
    initializeEvents();

    initializeWelcome();
    initializeExplorationControls();
    initializeInformation();
    initializeGuide();
    initializeInterface();

    setExplorationMode("FREE");

    animate();

    hideLoadingScreen();
}

// ============================================================
// SCENE
// ============================================================

function createScene() {
    scene = new THREE.Scene();

    scene.background = new THREE.Color(
        COLORS.space.background
    );

    scene.fog = new THREE.FogExp2(
        COLORS.space.background,
        0.000025
    );

    const ambientLight = new THREE.AmbientLight(
        COLORS.lighting.ambient,
        0.35
    );

    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(
        COLORS.lighting.sunlight,
        4,
        0,
        2
    );

    sunLight.position.set(0, 0, 0);

    scene.add(sunLight);
}

// ============================================================
// RENDERER
// ============================================================

function createRenderer() {
    const container = document.getElementById("canvasContainer");

    if (!container) {
        console.error("canvasContainer not found.");
        return;
    }

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        container.clientWidth || window.innerWidth,
        container.clientHeight || window.innerHeight
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);
}

// ============================================================
// GROUPS
// ============================================================

function createUniverseGroups() {
    solarSystem = new THREE.Group();
    solarSystem.name = "Solar System";

    deepSpaceGroup = new THREE.Group();
    deepSpaceGroup.name = "Deep Space";

    galaxyGroup = new THREE.Group();
    galaxyGroup.name = "Galaxies";

    nebulaGroup = new THREE.Group();
    nebulaGroup.name = "Nebulae";

    blackHoleGroup = new THREE.Group();
    blackHoleGroup.name = "Black Holes";

    asteroidGroup = new THREE.Group();
    asteroidGroup.name = "Asteroids";

    cometGroup = new THREE.Group();
    cometGroup.name = "Comets";

    scene.add(solarSystem);
    scene.add(deepSpaceGroup);
    scene.add(galaxyGroup);
    scene.add(nebulaGroup);
    scene.add(blackHoleGroup);
    scene.add(asteroidGroup);
    scene.add(cometGroup);
}

// ============================================================
// CELESTIAL BODIES
// ============================================================

function createCelestialBodies() {
    const objects = [
        ...(Array.isArray(allCelestialObjects)
            ? allCelestialObjects
            : []),

        ...(Array.isArray(moonObjects)
            ? moonObjects
            : [])
    ];

    objects.forEach(data => {
        if (!data || !data.name) return;

        const radius = Math.max(
            Number(data.radius) || 1,
            0.3
        );

        const geometry = new THREE.SphereGeometry(
            radius,
            64,
            64
        );

        let material;

        const type = String(data.type || "").toLowerCase();

        if (type === "star" || data.name.toLowerCase() === "sun") {
            material = new THREE.MeshBasicMaterial({
                color: data.color || COLORS.sun.surface
            });
        } else {
            material = new THREE.MeshStandardMaterial({
                color: data.color || 0xffffff,
                roughness: 0.82,
                metalness: 0.02
            });
        }

        const mesh = new THREE.Mesh(
            geometry,
            material
        );

        const position = data.position || {
            x: 0,
            y: 0,
            z: 0
        };

        mesh.position.set(
            Number(position.x) || 0,
            Number(position.y) || 0,
            Number(position.z) || 0
        );

        mesh.userData = {
            type: data.type || "Planet",
            name: data.name,
            data
        };

        solarSystem.add(mesh);

        objectMeshes.push(mesh);
        objectMap.set(
            data.name.toLowerCase(),
            mesh
        );

        if (data.name.toLowerCase() === "earth") {
            createEarthAtmosphere(mesh, radius);
        }

        if (data.name.toLowerCase() === "sun") {
            createSunGlow(mesh, radius);
        }

        if (data.name.toLowerCase() === "saturn") {
            createSaturnRings(mesh, radius);
        }
    });
}

// ============================================================
// EARTH ATMOSPHERE
// ============================================================

function createEarthAtmosphere(parent, radius) {
    const geometry = new THREE.SphereGeometry(
        radius * 1.06,
        64,
        64
    );

    const material = new THREE.MeshBasicMaterial({
        color:
            COLORS.planets?.earth?.atmosphere ||
            0x55aaff,
        transparent: true,
        opacity: 0.16,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const atmosphere = new THREE.Mesh(
        geometry,
        material
    );

    parent.add(atmosphere);
}

// ============================================================
// SUN GLOW
// ============================================================

function createSunGlow(parent, radius) {
    const geometry = new THREE.SphereGeometry(
        radius * 1.25,
        48,
        48
    );

    const material = new THREE.MeshBasicMaterial({
        color:
            COLORS.sun.glow ||
            0xffaa33,
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const glow = new THREE.Mesh(
        geometry,
        material
    );

    parent.add(glow);
}

// ============================================================
// SATURN RINGS
// ============================================================

function createSaturnRings(parent, radius) {
    const geometry = new THREE.RingGeometry(
        radius * 1.35,
        radius * 2.25,
        128
    );

    const material = new THREE.MeshBasicMaterial({
        color:
            COLORS.planets?.saturn?.rings ||
            0xd8c6a2,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const rings = new THREE.Mesh(
        geometry,
        material
    );

    rings.rotation.x = Math.PI / 2;

    parent.add(rings);
}

// ============================================================
// DEEP SPACE
// ============================================================

function createDeepSpace() {
    if (!Array.isArray(deepSpaceObjects)) return;

    deepSpaceObjects.forEach(data => {
        if (!data || !data.name) return;

        const type = String(
            data.type || ""
        ).toLowerCase();

        // Black holes are created separately.
        if (
            type.includes("black") &&
            type.includes("hole")
        ) {
            return;
        }

        const position = data.position || {
            x: 0,
            y: 0,
            z: 0
        };

        const size = Number(data.radius || data.size) || 10;

        const geometry = new THREE.SphereGeometry(
            size,
            32,
            32
        );

        const material = new THREE.MeshBasicMaterial({
            color: data.color || 0xffffff,
            transparent: true,
            opacity: 0.08,
            depthWrite: false
        });

        const mesh = new THREE.Mesh(
            geometry,
            material
        );

        mesh.position.set(
            Number(position.x) || 0,
            Number(position.y) || 0,
            Number(position.z) || 0
        );

        mesh.userData = {
            type: data.type || "Deep Space Object",
            name: data.name,
            data
        };

        deepSpaceGroup.add(mesh);

        objectMeshes.push(mesh);
        objectMap.set(
            data.name.toLowerCase(),
            mesh
        );
    });
}

// ============================================================
// NEBULAE
// ============================================================

function createNebulae() {
    if (!Array.isArray(nebulaObjects)) return;

    nebulaObjects.forEach(data => {
        if (!data || !data.name) return;

        const position = data.position || {
            x: 0,
            y: 0,
            z: 0
        };

        const size = Number(data.size) || 300;

        const group = new THREE.Group();

        group.name = data.name;

        group.position.set(
            Number(position.x) || 0,
            Number(position.y) || 0,
            Number(position.z) || 0
        );

        group.userData = {
            type: data.type || "Nebula",
            name: data.name,
            data
        };

        const color = data.color || 0x8b5cff;

        // Cloud layers
        for (let i = 0; i < 42; i++) {
            const material = new THREE.SpriteMaterial({
                map: nebulaTexture,
                color,
                transparent: true,
                opacity:
                    0.035 +
                    Math.random() * 0.035,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });

            const cloud = new THREE.Sprite(
                material
            );

            const layerSize =
                size *
                (0.25 + Math.random() * 0.45);

            cloud.scale.set(
                layerSize,
                layerSize *
                    (0.65 + Math.random() * 0.7),
                1
            );

            cloud.position.set(
                (Math.random() - 0.5) * size,
                (Math.random() - 0.5) * size * 0.55,
                (Math.random() - 0.5) * size
            );

            cloud.material.rotation =
                Math.random() * Math.PI;

            group.add(cloud);
        }

        // Invisible clickable volume
        const hitGeometry =
            new THREE.SphereGeometry(
                size * 0.9,
                24,
                24
            );

        const hitMaterial =
            new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0,
                depthWrite: false
            });

        const hitMesh = new THREE.Mesh(
            hitGeometry,
            hitMaterial
        );

        hitMesh.userData = group.userData;

        group.add(hitMesh);

        nebulaGroup.add(group);

        objectMeshes.push(hitMesh);

        objectMap.set(
            data.name.toLowerCase(),
            hitMesh
        );
    });
}

// ============================================================
// GALAXIES
// ============================================================

function createGalaxies() {
    if (!Array.isArray(galaxyObjects)) return;

    galaxyObjects.forEach(data => {
        if (!data || !data.name) return;

        const position = data.position || {
            x: 0,
            y: 0,
            z: 0
        };

        const size = Number(data.size) || 500;

        const group = new THREE.Group();

        group.name = data.name;

        group.position.set(
            Number(position.x) || 0,
            Number(position.y) || 0,
            Number(position.z) || 0
        );

        group.userData = {
            type: data.type || "Galaxy",
            name: data.name,
            data
        };

        // ----------------------------------------------------
        // CENTRAL CORE
        // ----------------------------------------------------

        const coreMaterial =
            new THREE.SpriteMaterial({
                map: softCircleTexture,
                color:
                    data.coreColor ||
                    0xffe8b0,
                transparent: true,
                opacity: 0.85,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });

        const core = new THREE.Sprite(
            coreMaterial
        );

        core.scale.set(
            size * 0.22,
            size * 0.22,
            1
        );

        group.add(core);

        // ----------------------------------------------------
        // SPIRAL STARS
        // ----------------------------------------------------

        const particleCount =
            Number(data.count) || 6000;

        const positions =
            new Float32Array(
                particleCount * 3
            );

        const colors =
            new Float32Array(
                particleCount * 3
            );

        const galaxyColors = [
            new THREE.Color(0xffffff),
            new THREE.Color(0xffe9bd),
            new THREE.Color(0xaed8ff),
            new THREE.Color(0x9fc5ff),
            new THREE.Color(0xffc7a0)
        ];

        const arms = 4;

        for (let i = 0; i < particleCount; i++) {
            const index = i * 3;

            const arm =
                i % arms;

            const radius =
                Math.pow(
                    Math.random(),
                    0.55
                ) *
                size *
                0.48;

            const armAngle =
                (arm / arms) *
                Math.PI *
                2;

            const spiralAngle =
                armAngle +
                radius *
                0.018;

            const spread =
                (Math.random() - 0.5) *
                Math.max(
                    4,
                    radius * 0.13
                );

            const x =
                Math.cos(
                    spiralAngle
                ) *
                    radius +
                spread;

            const z =
                Math.sin(
                    spiralAngle
                ) *
                    radius +
                spread;

            const y =
                (Math.random() - 0.5) *
                Math.max(
                    4,
                    size * 0.025
                ) *
                (1 - radius / size);

            positions[index] = x;
            positions[index + 1] = y;
            positions[index + 2] = z;

            const starColor =
                galaxyColors[
                    Math.floor(
                        Math.random() *
                            galaxyColors.length
                    )
                ];

            const brightness =
                0.45 +
                Math.random() * 0.55;

            colors[index] =
                starColor.r *
                brightness;

            colors[index + 1] =
                starColor.g *
                brightness;

            colors[index + 2] =
                starColor.b *
                brightness;
        }

        const geometry =
            new THREE.BufferGeometry();

        geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(
                positions,
                3
            )
        );

        geometry.setAttribute(
            "color",
            new THREE.BufferAttribute(
                colors,
                3
            )
        );

        const material =
            new THREE.PointsMaterial({
                map: softCircleTexture,
                size:
                    Number(data.particleSize) ||
                    2.4,
                vertexColors: true,
                transparent: true,
                opacity: 0.85,
                depthWrite: false,
                blending:
                    THREE.AdditiveBlending,
                sizeAttenuation: true
            });

        const stars =
            new THREE.Points(
                geometry,
                material
            );

        group.add(stars);

        // ----------------------------------------------------
        // GALAXY GLOW
        // ----------------------------------------------------

        const glowMaterial =
            new THREE.SpriteMaterial({
                map: softCircleTexture,
                color:
                    data.glowColor ||
                    0x9fc8ff,
                transparent: true,
                opacity: 0.12,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });

        const glow =
            new THREE.Sprite(
                glowMaterial
            );

        glow.scale.set(
            size * 0.8,
            size * 0.8,
            1
        );

        group.add(glow);

        // ----------------------------------------------------
        // CLICKABLE HIT AREA
        // ----------------------------------------------------

        const hitGeometry =
            new THREE.SphereGeometry(
                size * 0.55,
                24,
                24
            );

        const hitMaterial =
            new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0,
                depthWrite: false
            });

        const hitMesh =
            new THREE.Mesh(
                hitGeometry,
                hitMaterial
            );

        hitMesh.userData =
            group.userData;

        group.add(hitMesh);

        galaxyGroup.add(group);

        objectMeshes.push(hitMesh);

        objectMap.set(
            data.name.toLowerCase(),
            hitMesh
        );
    });
}

// ============================================================
// BLACK HOLES
// ============================================================

function createBlackHoles() {
    if (!Array.isArray(deepSpaceObjects)) return;

    deepSpaceObjects.forEach(data => {
        if (!data || !data.name) return;

        const type =
            String(
                data.type || ""
            ).toLowerCase();

        if (
            !type.includes("black") ||
            !type.includes("hole")
        ) {
            return;
        }

        const position =
            data.position || {
                x: 0,
                y: 0,
                z: 0
            };

        const radius =
            Number(data.radius) || 12;

        const group =
            new THREE.Group();

        group.name = data.name;

        group.position.set(
            Number(position.x) || 0,
            Number(position.y) || 0,
            Number(position.z) || 0
        );

        group.userData = {
            type: data.type || "Black Hole",
            name: data.name,
            data
        };

        // ----------------------------------------------------
        // DARK CORE
        // ----------------------------------------------------

        const coreGeometry =
            new THREE.SphereGeometry(
                radius,
                48,
                48
            );

        const coreMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x000000
            });

        const core =
            new THREE.Mesh(
                coreGeometry,
                coreMaterial
            );

        group.add(core);

        // ----------------------------------------------------
        // ACCRETION DISK
        // ----------------------------------------------------

        const diskGeometry =
            new THREE.RingGeometry(
                radius * 1.35,
                radius * 3.8,
                128
            );

        const diskMaterial =
            new THREE.MeshBasicMaterial({
                color:
                    data.accretionColor ||
                    COLORS.blackHoles?.accretionDisk ||
                    0xff6b22,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide,
                depthWrite: false,
                blending:
                    THREE.AdditiveBlending
            });

        const disk =
            new THREE.Mesh(
                diskGeometry,
                diskMaterial
            );

        disk.rotation.x =
            Math.PI / 2;

        group.add(disk);

        // ----------------------------------------------------
        // OUTER GLOW
        // ----------------------------------------------------

        const glowGeometry =
            new THREE.RingGeometry(
                radius * 3.4,
                radius * 4.8,
                128
            );

        const glowMaterial =
            new THREE.MeshBasicMaterial({
                color:
                    COLORS.blackHoles?.glow ||
                    0xff8a3d,
                transparent: true,
                opacity: 0.16,
                side: THREE.DoubleSide,
                depthWrite: false,
                blending:
                    THREE.AdditiveBlending
            });

        const glow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            );

        glow.rotation.x =
            Math.PI / 2;

        group.add(glow);

        // ----------------------------------------------------
        // CLICK AREA
        // ----------------------------------------------------

        const hitGeometry =
            new THREE.SphereGeometry(
                radius * 5,
                24,
                24
            );

        const hitMaterial =
            new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0,
                depthWrite: false
            });

        const hitMesh =
            new THREE.Mesh(
                hitGeometry,
                hitMaterial
            );

        hitMesh.userData =
            group.userData;

        group.add(hitMesh);

        blackHoleGroup.add(group);

        objectMeshes.push(hitMesh);

        objectMap.set(
            data.name.toLowerCase(),
            hitMesh
        );
    });
}

// ============================================================
// ASTEROID BELT
// ============================================================

function createAsteroidBelt() {
    if (!asteroidBelt) return;

    const count =
        Math.min(
            Number(asteroidBelt.count) || 500,
            600
        );

    const minRadius =
        Number(
            asteroidBelt.minRadius
        ) || 60;

    const maxRadius =
        Number(
            asteroidBelt.maxRadius
        ) || 85;

    for (let i = 0; i < count; i++) {
        const radius =
            THREE.MathUtils.lerp(
                minRadius,
                maxRadius,
                Math.random()
            );

        const angle =
            Math.random() *
            Math.PI *
            2;

        const y =
            (Math.random() - 0.5) *
            5;

        const geometry =
            new THREE.IcosahedronGeometry(
                1,
                0
            );

        const material =
            new THREE.MeshStandardMaterial({
                color:
                    0x77736c +
                    Math.floor(
                        Math.random() *
                        0x252525
                    ),
                roughness: 1
            });

        const asteroid =
            new THREE.Mesh(
                geometry,
                material
            );

        const size =
            0.15 +
            Math.random() *
            0.65;

        asteroid.scale.set(
            size *
                (0.7 + Math.random() * 0.6),
            size *
                (0.7 + Math.random() * 0.6),
            size *
                (0.7 + Math.random() * 0.6)
        );

        asteroid.position.set(
            Math.cos(angle) *
                radius,
            y,
            Math.sin(angle) *
                radius
        );

        asteroid.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        asteroidGroup.add(
            asteroid
        );
    }
}

// ============================================================
// KUIPER BELT
// ============================================================

function createKuiperBelt() {
    if (!kuiperBelt) return;

    const count =
        Math.min(
            Number(kuiperBelt.count) || 350,
            400
        );

    const minRadius =
        Number(
            kuiperBelt.minRadius
        ) || 180;

    const maxRadius =
        Number(
            kuiperBelt.maxRadius
        ) || 230;

    const positions =
        new Float32Array(
            count * 3
        );

    for (let i = 0; i < count; i++) {
        const radius =
            THREE.MathUtils.lerp(
                minRadius,
                maxRadius,
                Math.random()
            );

        const angle =
            Math.random() *
            Math.PI *
            2;

        const index = i * 3;

        positions[index] =
            Math.cos(angle) *
            radius;

        positions[index + 1] =
            (Math.random() - 0.5) *
            8;

        positions[index + 2] =
            Math.sin(angle) *
            radius;
    }

    const geometry =
        new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );

    const material =
        new THREE.PointsMaterial({
            map: softCircleTexture,
            color:
                COLORS.asteroids?.dark ||
                0x8f8f8f,
            size: 1.3,
            transparent: true,
            opacity: 0.38,
            depthWrite: false
        });

    const points =
        new THREE.Points(
            geometry,
            material
        );

    deepSpaceGroup.add(points);
}

// ============================================================
// OORT CLOUD
// ============================================================

function createOortCloud() {
    if (!oortCloud) return;

    const count =
        Math.min(
            Number(oortCloud.count) || 180,
            220
        );

    const minRadius =
        Number(
            oortCloud.minRadius
        ) || 350;

    const maxRadius =
        Number(
            oortCloud.maxRadius
        ) || 500;

    const positions =
        new Float32Array(
            count * 3
        );

    for (let i = 0; i < count; i++) {
        const radius =
            THREE.MathUtils.lerp(
                minRadius,
                maxRadius,
                Math.random()
            );

        const theta =
            Math.random() *
            Math.PI *
            2;

        const phi =
            Math.acos(
                THREE.MathUtils.randFloatSpread(2)
            );

        const index = i * 3;

        positions[index] =
            radius *
            Math.sin(phi) *
            Math.cos(theta);

        positions[index + 1] =
            radius *
            Math.cos(phi);

        positions[index + 2] =
            radius *
            Math.sin(phi) *
            Math.sin(theta);
    }

    const geometry =
        new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );

    const material =
        new THREE.PointsMaterial({
            map: softCircleTexture,
            color:
                COLORS.oortCloud?.main ||
                0x9fc8ff,
            size: 1.2,
            transparent: true,
            opacity: 0.2,
            depthWrite: false
        });

    const points =
        new THREE.Points(
            geometry,
            material
        );

    deepSpaceGroup.add(points);
}

// ============================================================
// COMETS
// ============================================================

function createComets() {
    if (!Array.isArray(cometObjects)) return;

    cometObjects.forEach(data => {
        if (!data || !data.name) return;

        const position =
            data.position || {
                x: 0,
                y: 0,
                z: 0
            };

        const radius =
            Number(data.radius) || 2;

        const group =
            new THREE.Group();

        group.name = data.name;

        group.position.set(
            Number(position.x) || 0,
            Number(position.y) || 0,
            Number(position.z) || 0
        );

        group.userData = {
            type: data.type || "Comet",
            name: data.name,
            data
        };

        const nucleus =
            new THREE.Mesh(
                new THREE.IcosahedronGeometry(
                    radius,
                    1
                ),
                new THREE.MeshStandardMaterial({
                    color:
                        COLORS.comets?.nucleus ||
                        0xbab7ae,
                    roughness: 1
                })
            );

        group.add(nucleus);

        const tailLength =
            Number(data.tailLength) ||
            radius * 8;

        const tail =
            new THREE.Mesh(
                new THREE.ConeGeometry(
                    radius * 1.8,
                    tailLength,
                    32,
                    1,
                    true
                ),
                new THREE.MeshBasicMaterial({
                    color:
                        COLORS.comets?.tail ||
                        0xaed8ff,
                    transparent: true,
                    opacity: 0.16,
                    depthWrite: false,
                    side: THREE.DoubleSide,
                    blending:
                        THREE.AdditiveBlending
                })
            );

        tail.rotation.z =
            Math.PI / 2;

        tail.position.x =
            -tailLength / 2;

        group.add(tail);

        const hit =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    radius * 5,
                    20,
                    20
                ),
                new THREE.MeshBasicMaterial({
                    transparent: true,
                    opacity: 0,
                    depthWrite: false
                })
            );

        hit.userData =
            group.userData;

        group.add(hit);

        cometGroup.add(group);

        objectMeshes.push(hit);

        objectMap.set(
            data.name.toLowerCase(),
            hit
        );
    });
}

// ============================================================
// ORBITS
// ============================================================

function createOrbits() {
    if (!Array.isArray(allCelestialObjects)) {
        return;
    }

    allCelestialObjects.forEach(data => {
        if (!data || !data.orbit) return;

        const position =
            data.position || {
                x: 0,
                z: 0
            };

        const radius =
            Number(
                data.orbit.radius
            ) ||
            Math.sqrt(
                (Number(position.x) || 0) ** 2 +
                (Number(position.z) || 0) ** 2
            );

        if (!radius) return;

        const curve =
            new THREE.EllipseCurve(
                0,
                0,
                radius,
                radius,
                0,
                Math.PI * 2,
                false,
                0
            );

        const points =
            curve.getPoints(256);

        const geometry =
            new THREE.BufferGeometry().setFromPoints(
                points.map(point =>
                    new THREE.Vector3(
                        point.x,
                        0,
                        point.y
                    )
                )
            );

        const material =
            new THREE.LineBasicMaterial({
                color:
                    COLORS.orbits?.default ||
                    0x315a7a,
                transparent: true,
                opacity: 0.25
            });

        const line =
            new THREE.LineLoop(
                geometry,
                material
            );

        line.userData = {
            type: "Orbit",
            planet: data.name
        };

        solarSystem.add(line);

        orbitLines.push(line);
    });
}

// ============================================================
// RAYCASTER
// ============================================================

function initializeRaycaster() {
    raycaster =
        new THREE.Raycaster();

    raycaster.params.Points.threshold = 8;

    mouse =
        new THREE.Vector2();
}

// ============================================================
// EVENTS
// ============================================================

function initializeEvents() {
    if (renderer) {
        renderer.domElement.addEventListener(
            "pointerdown",
            handleCanvasClick
        );
    }

    window.addEventListener(
        "resize",
        handleResize
    );

    window.addEventListener(
        "universe:objectSelected",
        event => {
            selectedData =
                event.detail?.data ||
                event.detail ||
                null;
        }
    );

    window.addEventListener(
        "universe:search",
        event => {
            searchObject(
                event.detail?.query ||
                event.detail ||
                ""
            );
        }
    );

    window.addEventListener(
        "universe:focusObjectByName",
        event => {
            focusObjectByName(
                event.detail?.name ||
                event.detail
            );
        }
    );

    window.addEventListener(
        "universe:tourObject",
        event => {
            focusObjectByName(
                event.detail?.name ||
                event.detail
            );
        }
    );

    window.addEventListener(
        "universe:resetCamera",
        resetExplorer
    );

    window.addEventListener(
        "universe:objectFilterChanged",
        event => {
            const filter =
                event.detail?.filter ||
                event.detail ||
                "all";

            applyObjectFilter(filter);
        }
    );

    window.addEventListener(
        "universe:orbitsChanged",
        event => {
            const visible =
                event.detail?.visible ??
                event.detail ??
                true;

            setOrbitsVisible(
                Boolean(visible)
            );
        }
    );

    window.addEventListener(
        "universe:timeChanged",
        event => {
            currentTimeMultiplier =
                Number(
                    event.detail?.multiplier ??
                    event.detail
                ) || 1;
        }
    );

    window.addEventListener(
        "universe:timeMultiplierChanged",
        event => {
            currentTimeMultiplier =
                Number(
                    event.detail?.multiplier ??
                    event.detail
                ) || 1;
        }
    );

    window.addEventListener(
        "universe:solarSystem",
        () => {
            showSolarSystemMode();
        }
    );

    window.addEventListener(
        "universe:freeMode",
        () => {
            showFreeMode();
        }
    );

    window.addEventListener(
        "universe:guidedMode",
        () => {
            showGuidedMode();
        }
    );

    window.addEventListener(
        "universe:home",
        () => {
            selectedObject = null;
            selectedData = null;
        }
    );
}

// ============================================================
// CLICK
// ============================================================

function handleCanvasClick(event) {
    if (!renderer || !camera || !raycaster) {
        return;
    }

    const rect =
        renderer.domElement.getBoundingClientRect();

    mouse.x =
        ((event.clientX - rect.left) /
            rect.width) *
            2 -
        1;

    mouse.y =
        -(
            (event.clientY - rect.top) /
            rect.height
        ) *
            2 +
        1;

    raycaster.setFromCamera(
        mouse,
        camera
    );

    const intersections =
        raycaster.intersectObjects(
            objectMeshes,
            true
        );

    if (!intersections.length) {
        return;
    }

    let target =
        intersections[0].object;

    while (
        target &&
        !target.userData?.data
    ) {
        target =
            target.parent;
    }

    if (
        target &&
        target.userData?.data
    ) {
        selectObject(target);
    }
}

// ============================================================
// SELECT OBJECT
// ============================================================

function selectObject(object) {
    if (!object) return;

    selectedObject = object;

    selectedData =
        object.userData?.data ||
        null;

    window.dispatchEvent(
        new CustomEvent(
            "universe:objectSelected",
            {
                detail: {
                    object,
                    data: selectedData
                }
            }
        )
    );

    updateSelectedStatus(
        object.userData?.name ||
        "Unknown"
    );
}

// ============================================================
// SEARCH
// ============================================================

function searchObject(query) {
    if (!query) return;

    const search =
        String(query)
            .trim()
            .toLowerCase();

    if (!search) return;

    const matches = [];

    objectMap.forEach(
        (object, key) => {
            if (
                key.includes(search)
            ) {
                matches.push({
                    name:
                        object.userData?.name ||
                        key,
                    type:
                        object.userData?.type ||
                        "Object"
                });
            }
        }
    );

    window.dispatchEvent(
        new CustomEvent(
            "universe:searchResults",
            {
                detail: {
                    results: matches
                }
            }
        )
    );

    if (matches.length > 0) {
        const first =
            objectMap.get(
                matches[0].name.toLowerCase()
            );

        if (first) {
            selectObject(first);

            focusCameraOnObject(
                first,
                getObjectFocusDistance(
                    first
                ),
                1000
            );
        }
    }
}

// ============================================================
// FOCUS
// ============================================================

function focusObjectByName(name) {
    if (!name) return;

    const key =
        String(name)
            .trim()
            .toLowerCase();

    const object =
        objectMap.get(key);

    if (!object) {
        searchObject(key);
        return;
    }

    selectObject(object);

    focusCameraOnObject(
        object,
        getObjectFocusDistance(
            object
        ),
        1200
    );
}

function getObjectFocusDistance(object) {
    const radius =
        Number(
            object.userData?.data?.radius
        ) || 10;

    return Math.max(
        radius * 4,
        12
    );
}

// ============================================================
// FILTERS
// ============================================================

function applyObjectFilter(filter) {
    currentFilter =
        String(filter || "all")
            .toLowerCase();

    objectMeshes.forEach(object => {
        if (!object) return;

        const type =
            String(
                object.userData?.type ||
                ""
            ).toLowerCase();

        if (
            currentFilter === "all"
        ) {
            object.visible = true;
            return;
        }

        object.visible =
            type === currentFilter ||
            type.includes(
                currentFilter
            );
    });

    // Groups without direct userData
    // remain visible so their contents work.
    if (currentFilter === "all") {
        solarSystem.visible = true;
        deepSpaceGroup.visible = true;
        galaxyGroup.visible = true;
        nebulaGroup.visible = true;
        blackHoleGroup.visible = true;
        asteroidGroup.visible = true;
        cometGroup.visible = true;
    }
}

// ============================================================
// MODES
// ============================================================

function showSolarSystemMode() {
    solarSystem.visible = true;

    deepSpaceGroup.visible = false;
    galaxyGroup.visible = false;
    nebulaGroup.visible = false;
    blackHoleGroup.visible = false;

    asteroidGroup.visible = true;
    cometGroup.visible = true;

    if (camera) {
        camera.position.set(
            0,
            80,
            180
        );
    }

    if (controls) {
        controls.target.set(
            0,
            0,
            0
        );

        controls.update();
    }
}

function showFreeMode() {
    solarSystem.visible = true;
    deepSpaceGroup.visible = true;
    galaxyGroup.visible = true;
    nebulaGroup.visible = true;
    blackHoleGroup.visible = true;
    asteroidGroup.visible = true;
    cometGroup.visible = true;
}

function showGuidedMode() {
    solarSystem.visible = true;
    deepSpaceGroup.visible = true;
    galaxyGroup.visible = true;
    nebulaGroup.visible = true;
    blackHoleGroup.visible = true;
    asteroidGroup.visible = true;
    cometGroup.visible = true;
}

// ============================================================
// ORBITS VISIBILITY
// ============================================================

function setOrbitsVisible(visible) {
    orbitLines.forEach(
        line => {
            line.visible = visible;
        }
    );
}

// ============================================================
// RESET
// ============================================================

function resetExplorer() {
    if (!camera || !controls) {
        return;
    }

    camera.position.set(
        0,
        80,
        180
    );

    controls.target.set(
        0,
        0,
        0
    );

    controls.update();

    selectedObject = null;
    selectedData = null;

    window.dispatchEvent(
        new CustomEvent(
            "universe:closeInfo"
        )
    );
}

// ============================================================
// RESIZE
// ============================================================

function handleResize() {
    if (!camera || !renderer) {
        return;
    }

    const container =
        document.getElementById(
            "canvasContainer"
        );

    const width =
        container?.clientWidth ||
        window.innerWidth;

    const height =
        container?.clientHeight ||
        window.innerHeight;

    camera.aspect =
        width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(
        width,
        height
    );
}

// ============================================================
// ANIMATION
// ============================================================

function animate() {
    requestAnimationFrame(
        animate
    );

    const delta =
        0.01 *
        currentTimeMultiplier;

    objectMeshes.forEach(
        object => {
            const type =
                String(
                    object.userData?.type ||
                    ""
                ).toLowerCase();

            if (
                type === "planet" ||
                type === "moon" ||
                type === "star"
            ) {
                if (
                    object.geometry instanceof
                    THREE.SphereGeometry
                ) {
                    object.rotation.y +=
                        delta * 0.15;
                }
            }
        }
    );

    if (galaxyGroup) {
        galaxyGroup.rotation.y +=
            delta * 0.004;
    }

    if (nebulaGroup) {
        nebulaGroup.rotation.y +=
            delta * 0.001;
    }

    if (blackHoleGroup) {
        blackHoleGroup.rotation.y +=
            delta * 0.02;
    }

    if (cometGroup) {
        cometGroup.rotation.y +=
            delta * 0.003;
    }

    updateEffects();
    updateCamera();

    updatePosition();
    updateScale();

    renderer.render(
        scene,
        camera
    );
}

// ============================================================
// LOADING
// ============================================================

function hideLoadingScreen() {
    const loadingScreen =
        document.getElementById(
            "loadingScreen"
        );

    if (!loadingScreen) return;

    setTimeout(() => {
        loadingScreen.classList.add(
            "hidden"
        );
    }, 700);
}

// ============================================================
// START
// ============================================================

if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        initializeApp
    );
} else {
    initializeApp();
}

// ============================================================
// EXPORTS
// ============================================================

export {
    scene,
    renderer,
    camera,
    controls,
    selectedObject,
    selectedData
};
