import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


// ============================================================
// UNIVERSE EXPLORER
// Main application
// ============================================================

const canvasContainer = document.getElementById("canvasContainer");

const homeScreen = document.getElementById("homeScreen");
const explorerScreen = document.getElementById("explorerScreen");

const exploreButton = document.getElementById("exploreButton");
const homeButton = document.getElementById("homeButton");

const infoPanel = document.getElementById("infoPanel");
const closeInfo = document.getElementById("closeInfo");

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchResults = document.getElementById("searchResults");

const positionText = document.getElementById("positionText");
const modeText = document.getElementById("modeText");
const selectedStatus = document.getElementById("selectedStatus");

const loadingScreen = document.getElementById("loadingScreen");


// ============================================================
// THREE.JS
// ============================================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x01030a);

const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.01,
    1000000
);

camera.position.set(0, 25, 55);


const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance"
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

canvasContainer.appendChild(renderer.domElement);


// ============================================================
// CONTROLS
// ============================================================

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.055;

controls.minDistance = 0.8;
controls.maxDistance = 100000;

controls.zoomSpeed = 1.2;
controls.rotateSpeed = 0.45;
controls.panSpeed = 0.6;

controls.target.set(0, 0, 0);


// ============================================================
// LIGHTING
// ============================================================

const ambientLight = new THREE.AmbientLight(
    0x6688aa,
    0.18
);

scene.add(ambientLight);


const sunLight = new THREE.PointLight(
    0xfff4dd,
    5,
    1000
);

sunLight.position.set(0, 0, 0);

scene.add(sunLight);


// ============================================================
// GLOBAL GROUPS
// ============================================================

const solarSystem = new THREE.Group();
scene.add(solarSystem);

const deepSpaceObjects = new THREE.Group();
scene.add(deepSpaceObjects);

const asteroidField = new THREE.Group();
scene.add(asteroidField);

const kuiperBelt = new THREE.Group();
scene.add(kuiperBelt);

const oortCloud = new THREE.Group();
scene.add(oortCloud);

const cometGroup = new THREE.Group();
scene.add(cometGroup);

const nebulaGroup = new THREE.Group();
scene.add(nebulaGroup);

const galaxyGroup = new THREE.Group();
scene.add(galaxyGroup);

const blackHoleGroup = new THREE.Group();
scene.add(blackHoleGroup);


// ============================================================
// SPACE BACKGROUND
// ============================================================

function createStars(count = 18000) {

    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {

        const radius =
            800 +
            Math.random() * 3500;

        const theta =
            Math.random() * Math.PI * 2;

        const phi =
            Math.acos(
                2 * Math.random() - 1
            );

        const x =
            radius *
            Math.sin(phi) *
            Math.cos(theta);

        const y =
            radius *
            Math.sin(phi) *
            Math.sin(theta);

        const z =
            radius *
            Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        const brightness =
            0.45 +
            Math.random() * 0.55;

        const type =
            Math.random();

        if (type < 0.72) {
            colors[i * 3] = brightness;
            colors[i * 3 + 1] = brightness;
            colors[i * 3 + 2] = brightness;
        }
        else if (type < 0.88) {
            colors[i * 3] = brightness * 0.7;
            colors[i * 3 + 1] = brightness * 0.85;
            colors[i * 3 + 2] = brightness;
        }
        else {
            colors[i * 3] = brightness;
            colors[i * 3 + 1] = brightness * 0.75;
            colors[i * 3 + 2] = brightness * 0.55;
        }
    }

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3)
    );

    const material =
        new THREE.PointsMaterial({
            size: 1.7,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: true
        });

    return new THREE.Points(
        geometry,
        material
    );
}

scene.add(createStars());


// ============================================================
// PROCEDURAL TEXTURE SYSTEM
// ============================================================

function createPlanetTexture(baseColor, variation = 0.25) {

    const canvas =
        document.createElement("canvas");

    canvas.width = 512;
    canvas.height = 256;

    const ctx = canvas.getContext("2d");

    const color =
        new THREE.Color(baseColor);

    const r = Math.floor(color.r * 255);
    const g = Math.floor(color.g * 255);
    const b = Math.floor(color.b * 255);

    ctx.fillStyle =
        `rgb(${r},${g},${b})`;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    for (let i = 0; i < 900; i++) {

        const x =
            Math.random() *
            canvas.width;

        const y =
            Math.random() *
            canvas.height;

        const size =
            2 +
            Math.random() * 18;

        const change =
            Math.floor(
                (Math.random() - 0.5) *
                variation *
                255
            );

        const rr =
            Math.max(
                0,
                Math.min(
                    255,
                    r + change
                )
            );

        const gg =
            Math.max(
                0,
                Math.min(
                    255,
                    g + change
                )
            );

        const bb =
            Math.max(
                0,
                Math.min(
                    255,
                    b + change
                )
            );

        ctx.fillStyle =
            `rgba(${rr},${gg},${bb},${0.08 + Math.random() * 0.18})`;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            size,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    const texture =
        new THREE.CanvasTexture(canvas);

    texture.colorSpace =
        THREE.SRGBColorSpace;

    return texture;
}


// ============================================================
// NEBULAE
// ============================================================

function createNebula(
    position,
    scale,
    color,
    opacity = 0.045
) {

    const geometry =
        new THREE.SphereGeometry(
            1,
            32,
            32
        );

    const material =
        new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity,
            side: THREE.BackSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

    const nebula =
        new THREE.Mesh(
            geometry,
            material
        );

    nebula.position.set(
        position[0],
        position[1],
        position[2]
    );

    nebula.scale.set(
        scale[0],
        scale[1],
        scale[2]
    );

    nebulaGroup.add(nebula);

    return nebula;
}


createNebula(
    [-500, 150, -600],
    [500, 260, 350],
    0x4b1d8a,
    0.045
);

createNebula(
    [600, -250, -800],
    [600, 300, 450],
    0x123f8c,
    0.035
);

createNebula(
    [-800, -350, 500],
    [450, 250, 500],
    0x6b1d45,
    0.03
);

createNebula(
    [300, 450, 600],
    [350, 220, 400],
    0x183f70,
    0.035
);


// ============================================================
// OBJECT DATABASE
// ============================================================

const celestialObjects = [
    {
        name: "Sun",
        type: "Star",
        position: [0, 0, 0],
        radius: 3.5,
        color: 0xffb52e,
        size: "1,392,700 km",
        mass: "1.989 × 10³⁰ kg",
        temperature: "5,500 °C surface",
        gravity: "274 m/s²",
        composition: "Hydrogen and helium",
        atmosphere: "Plasma",
        rotation: "25–35 days",
        orbit: "Galactic orbit",
        facts: "The Sun is the star at the center of our Solar System and contains most of its mass.",
        source: "NASA"
    },

    {
        name: "Mercury",
        type: "Planet",
        position: [7, 0, 0],
        radius: 0.45,
        color: 0x9b8f82,
        size: "4,879 km",
        mass: "3.301 × 10²³ kg",
        temperature: "−173 to 427 °C",
        gravity: "3.70 m/s²",
        composition: "Rock and metal",
        atmosphere: "Very thin exosphere",
        rotation: "58.6 days",
        orbit: "88 days",
        facts: "Mercury is the smallest planet in the Solar System and the closest to the Sun.",
        source: "NASA"
    },

    {
        name: "Venus",
        type: "Planet",
        position: [11, 0, 0],
        radius: 0.85,
        color: 0xd7b875,
        size: "12,104 km",
        mass: "4.867 × 10²⁴ kg",
        temperature: "≈ 465 °C",
        gravity: "8.87 m/s²",
        composition: "Rock and metal",
        atmosphere: "Carbon dioxide and nitrogen",
        rotation: "243 days",
        orbit: "224.7 days",
        facts: "Venus has a dense atmosphere and is the hottest planet in the Solar System.",
        source: "NASA"
    },

    {
        name: "Earth",
        type: "Planet",
        position: [15, 0, 0],
        radius: 1,
        color: 0x2f78d1,
        size: "12,742 km",
        mass: "5.972 × 10²⁴ kg",
        temperature: "≈ 15 °C average",
        gravity: "9.81 m/s²",
        composition: "Rock, metal and water",
        atmosphere: "Nitrogen and oxygen",
        rotation: "23.93 hours",
        orbit: "365.25 days",
        facts: "Earth is the only known world confirmed to support life.",
        source: "NASA"
    },

    {
        name: "Mars",
        type: "Planet",
        position: [20, 0, 0],
        radius: 0.53,
        color: 0xc04c32,
        size: "6,779 km",
        mass: "6.39 × 10²³ kg",
        temperature: "≈ −63 °C average",
        gravity: "3.71 m/s²",
        composition: "Rock and iron",
        atmosphere: "Carbon dioxide dominant",
        rotation: "24.6 hours",
        orbit: "687 days",
        facts: "Mars has been explored by numerous robotic missions and remains one of the main targets for planetary science.",
        source: "NASA / ESA"
    },

    {
        name: "Jupiter",
        type: "Gas Giant",
        position: [32, 0, 0],
        radius: 2.6,
        color: 0xc99b6d,
        size: "139,820 km",
        mass: "1.898 × 10²⁷ kg",
        temperature: "≈ −110 °C cloud tops",
        gravity: "24.79 m/s²",
        composition: "Hydrogen and helium",
        atmosphere: "Hydrogen and helium",
        rotation: "9.9 hours",
        orbit: "11.86 years",
        facts: "Jupiter is the largest planet in the Solar System and has a powerful magnetic field.",
        source: "NASA"
    },

    {
        name: "Saturn",
        type: "Gas Giant",
        position: [45, 0, 0],
        radius: 2.2,
        color: 0xd6c18d,
        size: "116,460 km",
        mass: "5.683 × 10²⁶ kg",
        temperature: "≈ −140 °C",
        gravity: "10.44 m/s²",
        composition: "Hydrogen and helium",
        atmosphere: "Hydrogen and helium",
        rotation: "10.7 hours",
        orbit: "29.45 years",
        facts: "Saturn is famous for its extensive ring system made mostly of ice and rocky material.",
        source: "NASA"
    },

    {
        name: "Uranus",
        type: "Ice Giant",
        position: [57, 0, 0],
        radius: 1.5,
        color: 0x78cbd0,
        size: "50,724 km",
        mass: "8.681 × 10²⁵ kg",
        temperature: "≈ −195 °C",
        gravity: "8.69 m/s²",
        composition: "Water, methane and ammonia ices",
        atmosphere: "Hydrogen, helium and methane",
        rotation: "17.2 hours",
        orbit: "84 years",
        facts: "Uranus rotates with an extreme axial tilt, essentially rolling around the Sun.",
        source: "NASA"
    },

    {
        name: "Neptune",
        type: "Ice Giant",
        position: [69, 0, 0],
        radius: 1.48,
        color: 0x3158d6,
        size: "49,244 km",
        mass: "1.024 × 10²⁶ kg",
        temperature: "≈ −200 °C",
        gravity: "11.15 m/s²",
        composition: "Water, methane and ammonia ices",
        atmosphere: "Hydrogen, helium and methane",
        rotation: "16.1 hours",
        orbit: "164.8 years",
        facts: "Neptune is the most distant major planet from the Sun.",
        source: "NASA"
    },

    {
        name: "Moon",
        type: "Natural Satellite",
        position: [16.8, 0, 0],
        radius: 0.27,
        color: 0xa9a9a9,
        size: "3,475 km",
        mass: "7.342 × 10²² kg",
        temperature: "≈ −173 to 127 °C",
        gravity: "1.62 m/s²",
        composition: "Rock and minerals",
        atmosphere: "Extremely thin exosphere",
        rotation: "27.3 days",
        orbit: "27.3 days",
        facts: "The Moon is Earth's natural satellite and has been visited by human explorers.",
        source: "NASA"
    },

    {
        name: "Pluto",
        type: "Dwarf Planet",
        position: [82, 0, 0],
        radius: 0.3,
        color: 0xb89d86,
        size: "2,377 km",
        mass: "1.303 × 10²² kg",
        temperature: "≈ −229 °C",
        gravity: "0.62 m/s²",
        composition: "Rock and ice",
        atmosphere: "Nitrogen, methane and carbon monoxide",
        rotation: "6.4 days",
        orbit: "248 years",
        facts: "Pluto is a dwarf planet in the Kuiper Belt and was studied closely by NASA's New Horizons mission.",
        source: "NASA"
    },

    {
        name: "Sirius",
        type: "Star System",
        position: [-160, 60, -100],
        radius: 4,
        color: 0xd9e9ff,
        size: "≈ 2.4 solar radii for Sirius A",
        mass: "≈ 2 solar masses",
        temperature: "≈ 9,900 °C surface",
        gravity: "Varies",
        composition: "Hydrogen and helium",
        atmosphere: "Stellar plasma",
        rotation: "Varies",
        orbit: "Binary system",
        facts: "Sirius is the brightest star in Earth's night sky.",
        source: "ESA / Astronomical Catalogues"
    },

    {
        name: "Andromeda Galaxy",
        type: "Galaxy",
        position: [-400, 180, -300],
        radius: 30,
        color: 0xc9b8ff,
        size: "≈ 260,000 light-years",
        mass: "≈ 1 trillion solar masses",
        temperature: "Varies",
        gravity: "Galactic",
        composition: "Stars, gas and dust",
        atmosphere: "Not applicable",
        rotation: "≈ hundreds of millions of years",
        orbit: "Local Group",
        facts: "The Andromeda Galaxy is the nearest large galaxy to the Milky Way.",
        source: "NASA / ESA"
    }
];


// ============================================================
// CREATE CELESTIAL OBJECTS
// ============================================================

const objectMeshes = [];
const objectMap = new Map();

function createCelestialObject(data) {

    const geometry =
        new THREE.SphereGeometry(
            data.radius,
            64,
            64
        );

    const texture =
        createPlanetTexture(
            data.color,
            data.type === "Planet"
                ? 0.38
                : 0.20
        );

    const material =
        new THREE.MeshStandardMaterial({
            map: texture,
            color: 0xffffff,
            roughness:
                data.type === "Star"
                    ? 0.25
                    : 0.82,
            metalness: 0.03
        });

    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );

    mesh.position.set(
        data.position[0],
        data.position[1],
        data.position[2]
    );

    mesh.userData.celestial = data;

    solarSystem.add(mesh);

    objectMeshes.push(mesh);

    objectMap.set(
        data.name.toLowerCase(),
        mesh
    );

    // Glow for stars
    if (
        data.type === "Star" ||
        data.name === "Sun"
    ) {

        const glowGeometry =
            new THREE.SphereGeometry(
                data.radius * 1.45,
                32,
                32
            );

        const glowMaterial =
            new THREE.MeshBasicMaterial({
                color: data.color,
                transparent: true,
                opacity: 0.12,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

        const glow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            );

        mesh.add(glow);
        mesh.userData.glow = glow;
    }

    return mesh;
}


celestialObjects.forEach(
    createCelestialObject
);


// ============================================================
// EARTH ATMOSPHERE
// ============================================================

const earth =
    objectMap.get("earth");

if (earth) {

    const atmosphereGeometry =
        new THREE.SphereGeometry(
            1.08,
            64,
            64
        );

    const atmosphereMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x4ba3ff,
            transparent: true,
            opacity: 0.13,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

    const atmosphere =
        new THREE.Mesh(
            atmosphereGeometry,
            atmosphereMaterial
        );

    earth.add(atmosphere);

    earth.userData.atmosphere =
        atmosphere;
}


// ============================================================
// SATURN RINGS
// ============================================================

const saturn =
    objectMap.get("saturn");

if (saturn) {

    const ringGeometry =
        new THREE.RingGeometry(
            3.2,
            5,
            128
        );

    const ringMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xc5b68e,
            transparent: true,
            opacity: 0.72,
            side: THREE.DoubleSide,
            roughness: 0.9
        });

    const rings =
        new THREE.Mesh(
            ringGeometry,
            ringMaterial
        );

    rings.rotation.x =
        Math.PI / 2;

    saturn.add(rings);

    saturn.userData.rings =
        rings;
}


// ============================================================
// PLANET MOONS
// ============================================================

function createMoon(
    name,
    parent,
    distance
    function createMoon(
    name,
    parent,
    distance,
    radius,
    color,
    speed
) {

    const geometry =
        new THREE.SphereGeometry(
            radius,
            24,
            24
        );

    const material =
        new THREE.MeshStandardMaterial({
            color,
            roughness: 0.95
        });

    const moon =
        new THREE.Mesh(
            geometry,
            material
        );

    moon.userData.moonName =
        name;

    moon.userData.angle =
        Math.random() * Math.PI * 2;

    moon.userData.distance =
        distance;

    moon.userData.speed =
        speed;

    parent.add(moon);

    return moon;
}


const moonObjects = [];

if (earth) {

    const moon =
        createMoon(
            "Moon",
            earth,
            2.3,
            0.27,
            0xaaaaaa,
            0.7
        );

    moonObjects.push(moon);
}


if (saturn) {

    const titan =
        createMoon(
            "Titan",
            saturn,
            6.2,
            0.42,
            0xc49d68,
            0.25
        );

    const rhea =
        createMoon(
            "Rhea",
            saturn,
            4.8,
            0.18,
            0xb5b0a5,
            0.4
        );

    const enceladus =
        createMoon(
            "Enceladus",
            saturn,
            3.8,
            0.12,
            0xdde5e8,
            0.6
        );

    moonObjects.push(
        titan,
        rhea,
        enceladus
    );
}


// ============================================================
// ORBIT LINES
// ============================================================

const orbitObjects = [];

function createOrbit(radius) {

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
        curve.getPoints(180);

    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(
                points.map(
                    p =>
                        new THREE.Vector3(
                            p.x,
                            0,
                            p.y
                        )
                )
            );

    const material =
        new THREE.LineBasicMaterial({
            color: 0x385878,
            transparent: true,
            opacity: 0.45
        });

    const line =
        new THREE.LineLoop(
            geometry,
            material
        );

    solarSystem.add(line);

    orbitObjects.push(line);
}

[
    7,
    11,
    15,
    20,
    32,
    45,
    57,
    69,
    82
].forEach(
    createOrbit
);


// ============================================================
// ASTEROID BELT
// ============================================================

function createAsteroidBelt(
    count = 1600,
    innerRadius = 23,
    outerRadius = 28
) {

    const geometry =
        new THREE.BufferGeometry();

    const positions =
        new Float32Array(
            count * 3
        );

    for (let i = 0; i < count; i++) {

        const radius =
            innerRadius +
            Math.random() *
            (outerRadius - innerRadius);

        const angle =
            Math.random() *
            Math.PI *
            2;

        const y =
            (Math.random() - 0.5) *
            1.5;

        positions[i * 3] =
            Math.cos(angle) * radius;

        positions[i * 3 + 1] =
            y;

        positions[i * 3 + 2] =
            Math.sin(angle) * radius;
    }

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );

    const material =
        new THREE.PointsMaterial({
            color: 0x8e857b,
            size: 0.12,
            transparent: true,
            opacity: 0.8
        });

    const belt =
        new THREE.Points(
            geometry,
            material
        );

    asteroidField.add(belt);

    return belt;
}

createAsteroidBelt();


// ============================================================
// KUIPER BELT
// ============================================================

function createKuiperBelt(count = 1200) {

    const geometry =
        new THREE.BufferGeometry();

    const positions =
        new Float32Array(
            count * 3
        );

    for (let i = 0; i < count; i++) {

        const radius =
            90 +
            Math.random() * 35;

        const angle =
            Math.random() *
            Math.PI * 2;

        const y =
            (Math.random() - 0.5) *
            8;

        positions[i * 3] =
            Math.cos(angle) * radius;

        positions[i * 3 + 1] =
            y;

        positions[i * 3 + 2] =
            Math.sin(angle) * radius;
    }

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );

    const material =
        new THREE.PointsMaterial({
            color: 0x9ca5b5,
            size: 0.18,
            transparent: true,
            opacity: 0.6
        });

    const belt =
        new THREE.Points(
            geometry,
            material
        );

    kuiperBelt.add(belt);
}

createKuiperBelt();


// ============================================================
// OORT CLOUD
// ============================================================

function createOortCloud(count = 2500) {

    const geometry =
        new THREE.BufferGeometry();

    const positions =
        new Float32Array(
            count * 3
        );

    for (let i = 0; i < count; i++) {

        const radius =
            400 +
            Math.random() * 500;

        const theta =
            Math.random() *
            Math.PI * 2;

        const phi =
            Math.acos(
                2 * Math.random() - 1
            );

        positions[i * 3] =
            radius *
            Math.sin(phi) *
            Math.cos(theta);

        positions[i * 3 + 1] =
            radius *
            Math.sin(phi) *
            Math.sin(theta);

        positions[i * 3 + 2] =
            radius *
            Math.cos(phi);
    }

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );

    const material =
        new THREE.PointsMaterial({
            color: 0x768aa5,
            size: 0.12,
            transparent: true,
            opacity: 0.38
        });

    const cloud =
        new THREE.Points(
            geometry,
            material
        );

    oortCloud.add(cloud);
}

createOortCloud();


// ============================================================
// COMETS
// ============================================================

const comets = [];

function createComet(
    name,
    radius,
    inclination,
    speed
) {

    const comet =
        new THREE.Group();

    const nucleusGeometry =
        new THREE.SphereGeometry(
            0.18,
            20,
            20
        );

    const nucleusMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xcfd8df,
            roughness: 0.8
        });

    const nucleus =
        new THREE.Mesh(
            nucleusGeometry,
            nucleusMaterial
        );

    comet.add(nucleus);

    const tailGeometry =
        new THREE.ConeGeometry(
            0.22,
            6,
            16,
            1,
            true
        );

    const tailMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x8ddcff,
            transparent: true,
            opacity: 0.42,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

    const tail =
        new THREE.Mesh(
            tailGeometry,
            tailMaterial
        );

    tail.rotation.z =
        Math.PI / 2;

    tail.position.x =
        3;

    comet.add(tail);

    comet.position.set(
        radius,
        0,
        0
    );

    comet.rotation.z =
        inclination;

    comet.userData.name =
        name;

    comet.userData.angle =
        Math.random() * Math.PI * 2;

    comet.userData.radius =
        radius;

    comet.userData.speed =
        speed;

    cometGroup.add(comet);

    comets.push(comet);
}

createComet(
    "Halley-like Comet",
    105,
    0.35,
    0.012
);

createComet(
    "Explorer Comet",
    145,
    -0.22,
    0.008
);

createComet(
    "Long Period Comet",
    210,
    0.5,
    0.004
);


// ============================================================
// GALAXIES
// ============================================================

function createGalaxy(
    name,
    position,
    size,
    color
) {

    const count = 3000;

    const geometry =
        new THREE.BufferGeometry();

    const positions =
        new Float32Array(
            count * 3
        );

    const colors =
        new Float32Array(
            count * 3
        );

    const galaxyColor =
        new THREE.Color(color);

    for (let i = 0; i < count; i++) {

        const arm =
            i % 4;

        const radius =
            Math.random() *
            size;

        const angle =
            radius * 0.13 +
            arm *
            (Math.PI * 2 / 4) +
            (Math.random() - 0.5) *
            0.7;

        positions[i * 3] =
            Math.cos(angle) *
            radius;

        positions[i * 3 + 1] =
            (Math.random() - 0.5) *
            (size * 0.08);

        positions[i * 3 + 2] =
            Math.sin(angle) *
            radius;

        const brightness =
            0.45 +
            Math.random() *
            0.55;

        colors[i * 3] =
            galaxyColor.r *
            brightness;

        colors[i * 3 + 1] =
            galaxyColor.g *
            brightness;

        colors[i * 3 + 2] =
            galaxyColor.b *
            brightness;
    }

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
            size: 0.55,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

    const galaxy =
        new THREE.Points(
            geometry,
            material
        );

    galaxy.position.set(
        position[0],
        position[1],
        position[2]
    );

    galaxy.rotation.x =
        Math.random();

    galaxy.rotation.z =
        Math.random();

    galaxy.userData.name =
        name;

    galaxyGroup.add(galaxy);

    return galaxy;
}

createGalaxy(
    "Andromeda Galaxy",
    [-400, 180, -300],
    30,
    0xc9b8ff
);

createGalaxy(
    "Triangulum Galaxy",
    [650, 250, -450],
    22,
    0x78b8ff
);

createGalaxy(
    "Distant Galaxy",
    [-700, -200, 650],
    18,
    0xff9fcf
);


// ============================================================
// BLACK HOLES
// ============================================================

function createBlackHole(
    name,
    position,
    size = 4
) {

    const group =
        new THREE.Group();

    group.position.set(
        position[0],
        position[1],
        position[2]
    );

    const blackGeometry =
        new THREE.SphereGeometry(
            size,
            48,
            48
        );

    const blackMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x000000
        });

    const blackSphere =
        new THREE.Mesh(
            blackGeometry,
            blackMaterial
        );

    group.add(
        blackSphere
    );

    const diskGeometry =
        new THREE.RingGeometry(
            size * 1.3,
            size * 3.8,
            128
        );

    const diskMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xff5a18,
            transparent: true,
            opacity: 0.72,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

    const disk =
        new THREE.Mesh(
            diskGeometry,
            diskMaterial
        );

    disk.rotation.x =
        Math.PI / 2;

    group.add(disk);

    const outerGlow =
        new THREE.Mesh(
            new THREE.RingGeometry(
                size * 3.6,
                size * 5,
                128
            ),
            new THREE.MeshBasicMaterial({
                color: 0xff9b4d,
                transparent: true,
                opacity: 0.14,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            })
        );

    outerGlow.rotation.x =
        Math.PI / 2;

    group.add(
        outerGlow
    );

    group.userData.name =
        name;

    blackHoleGroup.add(
        group
    );

    return group;
}

createBlackHole(
    "Black Hole",
    [350, 100, -500],
    5
);

createBlackHole(
    "Deep Space Black Hole",
    [-600, -250, -400],
    7
);


// ============================================================
// RAYCASTING
// ============================================================

const raycaster =
    new THREE.Raycaster();

const mouse =
    new THREE.Vector2();

renderer.domElement.addEventListener(
    "pointerdown",
    event => {

        if (
            event.target !==
            renderer.domElement
        ) {
            return;
        }

        mouse.x =
            (event.clientX /
                window.innerWidth) *
                2 - 1;

        mouse.y =
            -(event.clientY /
                window.innerHeight) *
                2 + 1;

        raycaster.setFromCamera(
            mouse,
            camera
        );

        const intersections =
            raycaster.intersectObjects(
                objectMeshes,
                true
            );

        if (
            intersections.length >
            0
        ) {

            let selected =
                intersections[0].object;

            while (
                selected &&
                !selected.userData.celestial
            ) {
                selected =
                    selected.parent;
            }

            if (
                selected &&
                selected.userData.celestial
            ) {
                selectObject(
                    selected
                );
            }
        }
    }
);


// ============================================================
// SELECT OBJECT
// ============================================================

let selectedObject = null;
let currentPage = 1;
let atmosphereEnabled = true;

function selectObject(mesh) {

    if (
        !mesh ||
        !mesh.userData.celestial
    ) {
        return;
    }

    selectedObject =
        mesh;

    const data =
        mesh.userData.celestial;

    currentPage = 1;

    updateInfoPanel(
        data
    );

    if (infoPanel) {
        infoPanel.classList.remove(
            "hidden"
        );
    }

    if (selectedStatus) {
        selectedStatus.textContent =
            `SELECTED: ${data.name.toUpperCase()}`;
    }

    focusOnObject(
        mesh
    );
}


// ============================================================
// INFO PANEL
// ============================================================

function updateInfoPanel(data) {

    const fields = {
        objectType: data.type.toUpperCase(),
        objectName: data.name,
        infoType: data.type,
        infoName: data.name,
        infoSize: data.size,
        infoMass: data.mass,
        infoTemperature: data.temperature,
        infoGravity: data.gravity,
        infoComposition: data.composition,
        infoAtmosphere: data.atmosphere,
        infoRotation: data.rotation,
        infoOrbit: data.orbit,
        infoFacts: data.facts
    };

    Object.entries(fields)
        .forEach(
            ([id, value]) => {

                const element =
                    document.getElementById(id);

                if (element) {
                    element.textContent =
                        value;
                }
            }
        );

    updatePage();
    updatePreview(data);
}


function updatePreview(data) {

    const preview =
        document.getElementById(
            "objectPreviewSphere"
        );

    if (!preview) {
        return;
    }

    preview.style.background =
        `radial-gradient(
            circle at 35% 30%,
            ${colorToHex(
                lightenColor(
                    data.color,
                    70
                )
            )},
            ${colorToHex(data.color)} 50%,
            #02040a 100%
        )`;

    preview.style.boxShadow =
        `inset -22px -18px 30px rgba(0,0,0,.7),
         0 0 35px ${colorToHex(data.color)}55`;
}


function colorToHex(color) {

    return "#" +
        color
            .toString(16)
            .padStart(6, "0");
}


function lightenColor(
    color,
    amount
) {

    const r =
        Math.min(
            255,
            ((color >> 16) & 255) +
            amount
        );

    const g =
        Math.min(
            255,
            ((color >> 8) & 255) +
            amount
        );

    const b =
        Math.min(
            255,
            (color & 255) +
            amount
        );

    return (
        (r << 16) |
        (g << 8) |
        b
    );
}


// ============================================================
// CAMERA FOCUS
// ============================================================

function focusOnObject(
    object
) {

    if (!object) {
        return;
    }

    const target =
        new THREE.Vector3();

    object.getWorldPosition(
        target
    );

    const data =
        object.userData.celestial;

    const distance =
        Math.max(
            data.radius * 7,
            6
        );

    const direction =
        new THREE.Vector3(
            1,
            0.45,
            1
        ).normalize();

    const destination =
        target.clone()
            .add(
                direction.multiplyScalar(
                    distance
                )
            );

    camera.position.copy(
        destination
    );

    controls.target.copy(
        target
    );

    controls.update();
}


// ============================================================
// SEARCH SYSTEM
// ============================================================

function searchUniverse() {

    if (!searchInput) {
        return;
    }

    const query =
        searchInput.value
            .trim()
            .toLowerCase();

    if (!query) {
        return;
    }

    const results =
        celestialObjects.filter(
            object =>
                object.name
                    .toLowerCase()
                    .includes(query) ||
                object.type
                    .toLowerCase()
                    .includes(query)
        );

    if (searchResults) {

        searchResults.innerHTML = "";

        if (
            results.length === 0
        ) {

            searchResults.innerHTML =
                `<div class="search-result">
                    No object found
                </div>`;

            return;
        }

        results.forEach(
            object => {

                const result =
                    document.createElement(
                        "div"
                    );

                result.className =
                    "search-result";

                result.textContent =
                    object.name;

                result.addEventListener(
                    "click",
                    () => {

                        const mesh =
                            objectMap.get(
                                object.name
               .toLowerCase()
                            );

                        if (mesh) {
                            selectObject(
                                mesh
                            );
                        }

                        searchResults.innerHTML =
                            "";
                    }
                );

                searchResults.appendChild(
                    result
                );
            }
        );
    }
}


if (searchButton) {

    searchButton.addEventListener(
        "click",
        searchUniverse
    );
}

if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {
                searchUniverse();
            }
        }
    );
}


// ============================================================
// PAGE NAVIGATION
// ============================================================

function updatePage() {

    document
        .querySelectorAll(
            ".info-page"
        )
        .forEach(
            page => {

                page.classList.toggle(
                    "active",
                    Number(
                        page.dataset.page
                    ) ===
                    currentPage
                );
            }
        );

    const pageNumber =
        document.getElementById(
            "pageNumber"
        );

    if (pageNumber) {

        pageNumber.textContent =
            String(
                currentPage
            ).padStart(
                2,
                "0"
            );
    }
}


const nextPage =
    document.getElementById(
        "nextPage"
    );

if (nextPage) {

    nextPage.addEventListener(
        "click",
        () => {

            currentPage++;

            if (
                currentPage > 4
            ) {
                currentPage = 1;
            }

            updatePage();
        }
    );
}


const previousPage =
    document.getElementById(
        "previousPage"
    );

if (previousPage) {

    previousPage.addEventListener(
        "click",
        () => {

            currentPage--;

            if (
                currentPage < 1
            ) {
                currentPage = 4;
            }

            updatePage();
        }
    );
}


// ============================================================
// HOME / EXPLORER
// ============================================================

if (exploreButton) {

    exploreButton.addEventListener(
        "click",
        () => {

            if (homeScreen) {
                homeScreen.classList.add(
                    "hidden"
                );
            }

            if (explorerScreen) {
                explorerScreen.classList.remove(
                    "hidden"
                );
            }
        }
    );
}


if (homeButton) {

    homeButton.addEventListener(
        "click",
        () => {

            if (explorerScreen) {
                explorerScreen.classList.add(
                    "hidden"
                );
            }

            if (homeScreen) {
                homeScreen.classList.remove(
                    "hidden"
                );
            }
        }
    );
}


if (closeInfo) {

    closeInfo.addEventListener(
        "click",
        () => {

            if (infoPanel) {
                infoPanel.classList.add(
                    "hidden"
                );
            }

            selectedObject =
                null;

            if (selectedStatus) {
                selectedStatus.textContent =
                    "SELECTED: NONE";
            }
        }
    );
}


// ============================================================
// FREE / GUIDED MODE
// ============================================================

let explorationMode =
    "FREE";

function setExplorationMode(
    mode
) {

    explorationMode =
        mode;

    if (modeText) {
        modeText.textContent =
            `MODE: ${mode}`;
    }

    if (
        mode === "GUIDED"
    ) {

        const sun =
            objectMap.get(
                "sun"
            );

        if (sun) {
            focusOnObject(
                sun
            );
        }
    }
}


// ============================================================
// KEYBOARD CONTROLS
// ============================================================

const keys = {};

window.addEventListener(
    "keydown",
    event => {

        keys[
            event.key.toLowerCase()
        ] = true;

        if (
            event.key === "Escape" &&
            infoPanel
        ) {
            infoPanel.classList.add(
                "hidden"
            );
        }

        if (
            event.key.toLowerCase() ===
            "g"
        ) {
            setExplorationMode(
                "GUIDED"
            );
        }

        if (
            event.key.toLowerCase() ===
            "f"
        ) {
            setExplorationMode(
                "FREE"
            );
        }
    }
);

window.addEventListener(
    "keyup",
    event => {

        keys[
            event.key.toLowerCase()
        ] = false;
    }
);


// ============================================================
// ANIMATION
// ============================================================

const clock =
    new THREE.Clock();

function animate() {

    requestAnimationFrame(
        animate
    );

    const delta =
        clock.getDelta();

    const elapsed =
        clock.elapsedTime;

    controls.update();


    // ----------------------------------------
    // Planet rotation
    // ----------------------------------------

    objectMeshes.forEach(
        mesh => {

            const data =
                mesh.userData.celestial;

            if (!data) {
                return;
            }

            if (
                data.type ===
                "Planet"
            ) {

                mesh.rotation.y +=
                    0.0018;
            }

            if (
                data.type ===
                "Dwarf Planet"
            ) {

                mesh.rotation.y +=
                    0.0012;
            }

            if (
                data.name ===
                "Sun"
            ) {

                mesh.rotation.y +=
                    0.0008;
            }

            if (
                mesh.userData.glow
            ) {

                const pulse =
                    1 +
                    Math.sin(
                        elapsed * 1.5
                    ) *
                    0.035;

                mesh.userData.glow.scale.set(
                    pulse,
                    pulse,
                    pulse
                );
            }
        }
    );


    // ----------------------------------------
    // Moons
    // ----------------------------------------

    moonObjects.forEach(
        moon => {

            moon.userData.angle +=
                moon.userData.speed *
                delta;

            moon.position.x =
                Math.cos(
                    moon.userData.angle
                ) *
                moon.userData.distance;

            moon.position.z =
                Math.sin(
                    moon.userData.angle
                ) *
                moon.userData.distance;

            moon.rotation.y +=
                0.002;
        }
    );


    // ----------------------------------------
    // Comets
    // ----------------------------------------

    comets.forEach(
        comet => {

            comet.userData.angle +=
                comet.userData.speed *
                delta;

            const angle =
                comet.userData.angle;

            const radius =
                comet.userData.radius;

            comet.position.x =
                Math.cos(angle) *
                radius;

            comet.position.z =
                Math.sin(angle) *
                radius;

            comet.position.y =
                Math.sin(
                    angle * 1.7
                ) *
                12;
        }
    );


    // ----------------------------------------
    // Asteroid belt
    // ----------------------------------------

    asteroidField.rotation.y +=
        0.00012;


    // ----------------------------------------
    // Kuiper Belt
    // ----------------------------------------

    kuiperBelt.rotation.y +=
        0.000045;


    // ----------------------------------------
    // Oort Cloud
    // ----------------------------------------

    oortCloud.rotation.y +=
        0.000008;


    // ----------------------------------------
    // Nebula movement
    // ----------------------------------------

    nebulaGroup.rotation.y +=
        0.00001;


    // ----------------------------------------
    // Galaxies
    // ----------------------------------------

    galaxyGroup.children.forEach(
        galaxy => {

            galaxy.rotation.y +=
                0.00008;
        }
    );


    // ----------------------------------------
    // Black holes
    // ----------------------------------------

    blackHoleGroup.children.forEach(
        blackHole => {

            blackHole.rotation.y +=
                0.002;

            blackHole.children.forEach(
                child => {

                    if (
                        child.geometry &&
                        child.geometry.type ===
                        "RingGeometry"
                    ) {

                        child.rotation.z +=
                            0.004;
                    }
                }
            );
        }
    );


    // ----------------------------------------
    // Position HUD
    // ----------------------------------------

    if (positionText) {

        positionText.textContent =
            `X: ${camera.position.x.toFixed(1)}
             Y: ${camera.position.y.toFixed(1)}
             Z: ${camera.position.z.toFixed(1)}`;
    }


    renderer.render(
        scene,
        camera
    );
}

animate();


// ============================================================
// RESIZE
// ============================================================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );
    }
);


// ============================================================
// LOADING
// ============================================================

window.addEventListener(
    "load",
    () => {

        setTimeout(
            () => {

                if (loadingScreen) {

                    loadingScreen.classList.add(
                        "hidden"
                    );
                }

            },
            1000
        );
    }
);
