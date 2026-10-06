import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


// ============================================================
// UNIVERSE EXPLORER
// MAIN APPLICATION
// ============================================================


// ============================================================
// DOM
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

const solarSystemButton =
    document.getElementById("solarSystemButton");

const freeModeButton =
    document.getElementById("freeModeButton");

const guidedModeButton =
    document.getElementById("guidedModeButton");

const tourButton =
    document.getElementById("tourButton");

const orbitsButton =
    document.getElementById("orbitsButton");

const timeButton =
    document.getElementById("timeButton");

const zoomIn =
    document.getElementById("zoomIn");

const zoomOut =
    document.getElementById("zoomOut");

const resetCamera =
    document.getElementById("resetCamera");

const previousPage =
    document.getElementById("previousPage");

const nextPage =
    document.getElementById("nextPage");

const focusObjectButton =
    document.getElementById("focusObject");

const favoriteObjectButton =
    document.getElementById("favoriteObject");

const atmosphereButton =
    document.getElementById("atmosphereButton");

const guidedPanel =
    document.getElementById("guidedPanel");

const tourTitle =
    document.getElementById("tourTitle");

const tourDescription =
    document.getElementById("tourDescription");

const tourNext =
    document.getElementById("tourNext");

const tourProgress =
    document.getElementById("tourProgress");

const tourProgressBar =
    document.getElementById("tourProgressBar");

const tourProgressText =
    document.getElementById("tourProgressText");

const scaleText =
    document.getElementById("scaleText");

const regionText =
    document.getElementById("regionText");

const spaceObjectButtons =
    document.querySelectorAll(
        ".space-object-button"
    );


// ============================================================
// THREE.JS SCENE
// ============================================================

const scene =
    new THREE.Scene();

scene.background =
    new THREE.Color(
        0x01030a
    );

const camera =
    new THREE.PerspectiveCamera(
        55,
        window.innerWidth /
        window.innerHeight,
        0.01,
        1000000
    );

camera.position.set(
    0,
    25,
    55
);


const renderer =
    new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance"
    });

renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure =
    1.15;

canvasContainer.appendChild(
    renderer.domElement
);


// ============================================================
// CAMERA CONTROLS
// ============================================================

const controls =
    new OrbitControls(
        camera,
        renderer.domElement
    );

controls.enableDamping =
    true;

controls.dampingFactor =
    0.055;

controls.minDistance =
    0.5;

controls.maxDistance =
    100000;

controls.zoomSpeed =
    1.2;

controls.rotateSpeed =
    0.45;

controls.panSpeed =
    0.6;

controls.target.set(
    0,
    0,
    0
);


// ============================================================
// LIGHTING
// ============================================================

const ambientLight =
    new THREE.AmbientLight(
        0x6688aa,
        0.18
    );

scene.add(
    ambientLight
);


const sunLight =
    new THREE.PointLight(
        0xfff4dd,
        5,
        1200
    );

sunLight.position.set(
    0,
    0,
    0
);

scene.add(
    sunLight
);


// ============================================================
// MAIN GROUPS
// ============================================================

const solarSystem =
    new THREE.Group();

scene.add(
    solarSystem
);


const asteroidField =
    new THREE.Group();

scene.add(
    asteroidField
);


const kuiperBelt =
    new THREE.Group();

scene.add(
    kuiperBelt
);


const oortCloud =
    new THREE.Group();

scene.add(
    oortCloud
);


const cometGroup =
    new THREE.Group();

scene.add(
    cometGroup
);


const nebulaGroup =
    new THREE.Group();

scene.add(
    nebulaGroup
);


const galaxyGroup =
    new THREE.Group();

scene.add(
    galaxyGroup
);


const blackHoleGroup =
    new THREE.Group();

scene.add(
    blackHoleGroup
);


// ============================================================
// GLOBAL ARRAYS
// ============================================================

const objectMeshes = [];

const objectMap =
    new Map();

const moonObjects = [];

const comets = [];

const orbitObjects = [];

const deepObjects = [];


// ============================================================
// STATE
// ============================================================

let selectedObject = null;

let currentPage = 1;

let currentMode =
    "SOLAR SYSTEM";

let timeMultiplier = 1;

let orbitsVisible = true;

let atmosphereEnabled = true;

let favoriteObjects =
    new Set();

let guidedIndex = 0;

let guidedActive = false;

let tourActive = false;


// ============================================================
// STAR FIELD
// ============================================================

function createStars(
    count = 18000
) {

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

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const radius =
            800 +
            Math.random() *
            3500;

        const theta =
            Math.random() *
            Math.PI * 2;

        const phi =
            Math.acos(
                2 *
                Math.random() -
                1
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


        const brightness =
            0.45 +
            Math.random() *
            0.55;

        const type =
            Math.random();

        if (type < 0.72) {

            colors[i * 3] =
                brightness;

            colors[i * 3 + 1] =
                brightness;

            colors[i * 3 + 2] =
                brightness;

        } else if (type < 0.88) {

            colors[i * 3] =
                brightness * 0.7;

            colors[i * 3 + 1] =
                brightness * 0.85;

            colors[i * 3 + 2] =
                brightness;

        } else {

            colors[i * 3] =
                brightness;

            colors[i * 3 + 1] =
                brightness * 0.75;

            colors[i * 3 + 2] =
                brightness * 0.55;
        }
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

scene.add(
    createStars()
);


// ============================================================
// PROCEDURAL PLANET TEXTURES
// ============================================================

function createPlanetTexture(
    baseColor,
    variation = 0.25
) {

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.width = 512;
    canvas.height = 256;

    const ctx =
        canvas.getContext(
            "2d"
        );

    const color =
        new THREE.Color(
            baseColor
        );

    const r =
        Math.floor(
            color.r * 255
        );

    const g =
        Math.floor(
            color.g * 255
        );

    const b =
        Math.floor(
            color.b * 255
        );

    ctx.fillStyle =
        `rgb(${r},${g},${b})`;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    for (
        let i = 0;
        i < 900;
        i++
    ) {

        const x =
            Math.random() *
            canvas.width;

        const y =
            Math.random() *
            canvas.height;

        const size =
            2 +
            Math.random() *
            18;

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
            `rgba(
                ${rr},
                ${gg},
                ${bb},
                ${0.08 + Math.random() * 0.18}
            )`;

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
        new THREE.CanvasTexture(
            canvas
        );

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
    opacity
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
            blending:
                THREE.AdditiveBlending
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

    nebulaGroup.add(
        nebula
    );

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
// CELESTIAL DATABASE
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
        facts:
            "The Sun is the star at the center of our Solar System and contains most of its mass.",
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
        facts:
            "Mercury is the smallest planet in the Solar System and the closest to the Sun.",
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
        facts:
            "Venus has a dense atmosphere and is the hottest planet in the Solar System.",
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
        facts:
            "Earth is the only known world confirmed to support life.",
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
        facts:
            "Mars has been explored by numerous robotic missions and remains one of the main targets for planetary science.",
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
        facts:
            "Jupiter is the largest planet in the Solar System and has a powerful magnetic field.",
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
        facts:
            "Saturn is famous for its extensive ring system made mostly of ice and rocky material.",
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
        facts:
            "Uranus rotates with an extreme axial tilt, essentially rolling around the Sun.",
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
        facts:
            "Neptune is the most distant major planet from the Sun.",
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
        facts:
            "Pluto is a dwarf planet in the Kuiper Belt and was studied closely by NASA's New Horizons mission.",
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
        facts:
            "The Moon is Earth's natural satellite and has been visited by human explorers.",
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
        facts:
            "Sirius is the brightest star in Earth's night sky.",
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
        facts:
            "The Andromeda Galaxy is the nearest large galaxy to the Milky Way.",
        source: "NASA / ESA"
    }

];


// ============================================================
// CREATE CELESTIAL OBJECT
// ============================================================

function createCelestialObject(
    data
) {

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

    mesh.userData.celestial =
        data;

    solarSystem.add(
        mesh
    );

    objectMeshes.push(
        mesh
    );

    objectMap.set(
        data.name.toLowerCase(),
        mesh
    );


    // Star glow

    if (
        data.type === "Star" ||
        data.name === "Sun"
    ) {

        const glow =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    data.radius * 1.45,
                    32,
                    32
                ),
                new THREE.MeshBasicMaterial({
                    color: data.color,
                    transparent: true,
                    opacity: 0.12,
                    blending:
                        THREE.AdditiveBlending,
                    depthWrite: false
                })
            );

        mesh.add(
            glow
        );

        mesh.userData.glow =
            glow;
    }

    return mesh;
}


celestialObjects.forEach(
    createCelestialObject
);


// ============================================================
// PLANET REFERENCES
// ============================================================

const earth =
    objectMap.get("earth");

const saturn =
    objectMap.get("saturn");


// ============================================================
// EARTH ATMOSPHERE
// ============================================================

if (earth) {

    const atmosphere =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                1.08,
                64,
                64
            ),
            new THREE.MeshBasicMaterial({
                color: 0x4ba3ff,
                transparent: true,
                opacity: 0.13,
                side: THREE.BackSide,
                blending:
                    THREE.AdditiveBlending,
                depthWrite: false
            })
        );

    earth.add(
        atmosphere
    );

    earth.userData.atmosphere =
        atmosphere;
}


// ============================================================
// SATURN RINGS
// ============================================================

if (saturn) {

    const rings =
        new THREE.Mesh(
            new THREE.RingGeometry(
                3.2,
                5,
                128
            ),
            new THREE.MeshStandardMaterial({
                color: 0xc5b68e,
                transparent: true,
                opacity: 0.72,
                side: THREE.DoubleSide,
                roughness: 0.9
            })
        );

    rings.rotation.x =
        Math.PI / 2;

    saturn.add(
        rings
    );

    saturn.userData.rings =
        rings;
}
// ============================================================
// MOONS
// ============================================================

function createMoon(
    name,
    parent,
    distance,
    radius,
    color,
    speed
) {

    const moon =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                radius,
                32,
                32
            ),
            new THREE.MeshStandardMaterial({
                color,
                roughness: 0.95
            })
        );

    moon.userData.moonName =
        name;

    moon.userData.angle =
        Math.random() *
        Math.PI * 2;

    moon.userData.distance =
        distance;

    moon.userData.speed =
        speed;

    parent.add(
        moon
    );

    moonObjects.push(
        moon
    );

    return moon;
}


if (earth) {

    createMoon(
        "Moon",
        earth,
        2.3,
        0.27,
        0xaaaaaa,
        0.7
    );
}


if (saturn) {

    createMoon(
        "Titan",
        saturn,
        6.2,
        0.42,
        0xc49d68,
        0.25
    );

    createMoon(
        "Rhea",
        saturn,
        4.8,
        0.18,
        0xb5b0a5,
        0.4
    );

    createMoon(
        "Enceladus",
        saturn,
        3.8,
        0.12,
        0xdde5e8,
        0.6
    );
}


// ============================================================
// ORBITS
// ============================================================

function createOrbit(
    radius
) {

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
        curve.getPoints(
            180
        );

    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(
                points.map(
                    point =>
                        new THREE.Vector3(
                            point.x,
                            0,
                            point.y
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

    solarSystem.add(
        line
    );

    orbitObjects.push(
        line
    );
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
    count = 1800
) {

    const geometry =
        new THREE.BufferGeometry();

    const positions =
        new Float32Array(
            count * 3
        );

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const radius =
            23 +
            Math.random() * 5;

        const angle =
            Math.random() *
            Math.PI * 2;

        const y =
            (Math.random() - 0.5) *
            1.6;

        positions[i * 3] =
            Math.cos(angle) *
            radius;

        positions[i * 3 + 1] =
            y;

        positions[i * 3 + 2] =
            Math.sin(angle) *
            radius;
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
            size: 0.13,
            transparent: true,
            opacity: 0.8
        });

    const belt =
        new THREE.Points(
            geometry,
            material
        );

    asteroidField.add(
        belt
    );
}


createAsteroidBelt();


// ============================================================
// KUIPER BELT
// ============================================================

function createKuiperBelt(
    count = 1400
) {

    const geometry =
        new THREE.BufferGeometry();

    const positions =
        new Float32Array(
            count * 3
        );

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const radius =
            90 +
            Math.random() *
            35;

        const angle =
            Math.random() *
            Math.PI * 2;

        const y =
            (Math.random() - 0.5) *
            8;

        positions[i * 3] =
            Math.cos(angle) *
            radius;

        positions[i * 3 + 1] =
            y;

        positions[i * 3 + 2] =
            Math.sin(angle) *
            radius;
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
            size: 0.17,
            transparent: true,
            opacity: 0.6
        });

    const belt =
        new THREE.Points(
            geometry,
            material
        );

    kuiperBelt.add(
        belt
    );
}


createKuiperBelt();


// ============================================================
// OORT CLOUD
// ============================================================

function createOortCloud(
    count = 2500
) {

    const geometry =
        new THREE.BufferGeometry();

    const positions =
        new Float32Array(
            count * 3
        );

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const radius =
            400 +
            Math.random() *
            500;

        const theta =
            Math.random() *
            Math.PI * 2;

        const phi =
            Math.acos(
                2 *
                Math.random() -
                1
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

    oortCloud.add(
        cloud
    );
}


createOortCloud();


// ============================================================
// COMETS
// ============================================================

function createComet(
    name,
    radius,
    inclination,
    speed
) {

    const comet =
        new THREE.Group();

    const nucleus =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.18,
                24,
                24
            ),
            new THREE.MeshStandardMaterial({
                color: 0xcfd8df,
                roughness: 0.8
            })
        );

    comet.add(
        nucleus
    );


    const tail =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                0.22,
                6,
                16,
                1,
                true
            ),
            new THREE.MeshBasicMaterial({
                color: 0x8ddcff,
                transparent: true,
                opacity: 0.42,
                blending:
                    THREE.AdditiveBlending,
                depthWrite: false
            })
        );

    tail.rotation.z =
        Math.PI / 2;

    tail.position.x =
        3;

    comet.add(
        tail
    );


    comet.userData.name =
        name;

    comet.userData.angle =
        Math.random() *
        Math.PI * 2;

    comet.userData.radius =
        radius;

    comet.userData.speed =
        speed;

    comet.userData.inclination =
        inclination;

    cometGroup.add(
        comet
    );

    comets.push(
        comet
    );

    return comet;
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

    const count =
        3000;

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
        new THREE.Color(
            color
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

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


    const galaxy =
        new THREE.Points(
            geometry,
            new THREE.PointsMaterial({
                size: 0.55,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending:
                    THREE.AdditiveBlending
            })
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

    galaxy.userData.type =
        "Galaxy";

    galaxyGroup.add(
        galaxy
    );

    deepObjects.push(
        galaxy
    );

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
    size
) {

    const group =
        new THREE.Group();

    group.position.set(
        position[0],
        position[1],
        position[2]
    );


    const blackSphere =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                size,
                48,
                48
            ),
            new THREE.MeshBasicMaterial({
                color: 0x000000
            })
        );

    group.add(
        blackSphere
    );


    const disk =
        new THREE.Mesh(
            new THREE.RingGeometry(
                size * 1.3,
                size * 3.8,
                128
            ),
            new THREE.MeshBasicMaterial({
                color: 0xff5a18,
                transparent: true,
                opacity: 0.72,
                side: THREE.DoubleSide,
                blending:
                    THREE.AdditiveBlending,
                depthWrite: false
            })
        );

    disk.rotation.x =
        Math.PI / 2;

    group.add(
        disk
    );


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
                blending:
                    THREE.AdditiveBlending,
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

    group.userData.type =
        "Black Hole";

    blackHoleGroup.add(
        group
    );

    deepObjects.push(
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
// DEEP SPACE INFORMATION
// ============================================================

const deepSpaceInfo = {

    "andromeda galaxy": {
        type: "Galaxy",
        size: "≈ 260,000 light-years",
        mass: "≈ 1 trillion solar masses",
        temperature: "Varies",
        gravity: "Galactic",
        composition: "Stars, gas and dust",
        atmosphere: "Not applicable",
        rotation: "Hundreds of millions of years",
        orbit: "Local Group",
        facts:
            "The Andromeda Galaxy is the nearest large galaxy to the Milky Way."
    },

    "triangulum galaxy": {
        type: "Galaxy",
        size: "≈ 60,000 light-years",
        mass: "≈ 50 billion solar masses",
        temperature: "Varies",
        gravity: "Galactic",
        composition: "Stars, gas and dust",
        atmosphere: "Not applicable",
        rotation: "Hundreds of millions of years",
        orbit: "Local Group",
        facts:
            "The Triangulum Galaxy is one of the major galaxies of the Local Group."
    },

    "distant galaxy": {
        type: "Galaxy",
        size: "Unknown",
        mass: "Unknown",
        temperature: "Varies",
        gravity: "Galactic",
        composition: "Stars, gas and dust",
        atmosphere: "Not applicable",
        rotation: "Unknown",
        orbit: "Deep space",
        facts:
            "A distant spiral galaxy represented as part of the deep-space exploration environment."
    },

    "black hole": {
        type: "Black Hole",
        size: "Event horizon varies",
        mass: "Varies",
        temperature: "Accretion disk can be extremely hot",
        gravity: "Extreme",
        composition: "Collapsed matter",
        atmosphere: "None",
        rotation: "May rotate",
        orbit: "Deep space",
        facts:
            "A black hole is an object whose gravity is so strong that beyond its event horizon, light cannot escape."
    },

    "deep space black hole": {
        type: "Black Hole",
        size: "Event horizon varies",
        mass: "Unknown",
        temperature: "Accretion disk can be extremely hot",
        gravity: "Extreme",
        composition: "Collapsed matter",
        atmosphere: "None",
        rotation: "May rotate",
        orbit: "Deep space",
        facts:
            "A simulated deep-space black hole included for exploration of extreme cosmic environments."
    }

};


// ============================================================
// RAYCASTING
// ============================================================

const raycaster =
    new THREE.Raycaster();

const mouse =
    new THREE.Vector2();


function updateMouse(
    event
) {

    const rect =
        renderer.domElement.getBoundingClientRect();

    mouse.x =
        (
            (event.clientX - rect.left) /
            rect.width
        ) * 2 - 1;

    mouse.y =
        -(
            (event.clientY - rect.top) /
            rect.height
        ) * 2 + 1;
}


renderer.domElement.addEventListener(
    "pointerdown",
    event => {

        if (
            event.target !==
            renderer.domElement
        ) {
            return;
        }

        updateMouse(
            event
        );

        raycaster.setFromCamera(
            mouse,
            camera
        );


        const planetHits =
            raycaster.intersectObjects(
                objectMeshes,
                true
            );


        if (
            planetHits.length > 0
        ) {

            let object =
                planetHits[0].object;

            while (
                object &&
                !object.userData.celestial
            ) {
                object =
                    object.parent;
            }

            if (
                object &&
                object.userData.celestial
            ) {

                selectObject(
                    object
                );

                return;
            }
        }


        const deepHits =
            raycaster.intersectObjects(
                deepObjects,
                true
            );


        if (
            deepHits.length > 0
        ) {

            let object =
                deepHits[0].object;

            while (
                object &&
                !object.userData.name
            ) {
                object =
                    object.parent;
            }

            if (
                object &&
                object.userData.name
            ) {

                selectDeepObject(
                    object
                );
            }
        }

    }
);


// ============================================================
// SELECT NORMAL OBJECT
// ============================================================

function selectObject(
    mesh
) {

    if (
        !mesh ||
        !mesh.userData.celestial
    ) {
        return;
    }

    selectedObject =
        mesh;

    currentPage =
        1;

    updateInfoPanel(
        mesh.userData.celestial
    );

    infoPanel?.classList.remove(
        "hidden"
    );

    selectedStatus.textContent =
        `SELECTED: ${mesh.userData.celestial.name.toUpperCase()}`;

    focusOnObject(
        mesh
    );
}


// ============================================================
// SELECT DEEP OBJECT
// ============================================================

function selectDeepObject(
    object
) {

    selectedObject =
        object;

    const key =
        object.userData.name.toLowerCase();

    const info =
        deepSpaceInfo[key];

    if (!info) {
        return;
    }


    const data = {

        name:
            object.userData.name,

        type:
            info.type,

        color:
            info.type === "Black Hole"
                ? 0xff6a2a
                : 0x9c8cff,

        size:
            info.size,

        mass:
            info.mass,

        temperature:
            info.temperature,

        gravity:
            info.gravity,

        composition:
            info.composition,

        atmosphere:
            info.atmosphere,

        rotation:
            info.rotation,

        orbit:
            info.orbit,

        facts:
            info.facts
    };


    currentPage =
        1;

    updateInfoPanel(
        data
    );

    infoPanel?.classList.remove(
        "hidden"
    );

    selectedStatus.textContent =
        `SELECTED: ${data.name.toUpperCase()}`;

    focusOnObject(
        object
    );
}


// ============================================================
// INFO PANEL
// ============================================================

function updateInfoPanel(
    data
) {

    const fields = {

        objectType:
            data.type?.toUpperCase() ||
            "OBJECT",

        objectName:
            data.name,

        infoType:
            data.type,

        infoName:
            data.name,

        infoSize:
            data.size || "Unknown",

        infoMass:
            data.mass || "Unknown",

        infoTemperature:
            data.temperature || "Unknown",

        infoGravity:
            data.gravity || "Unknown",

        infoComposition:
            data.composition || "Unknown",

        infoAtmosphere:
            data.atmosphere || "Unknown",

        infoRotation:
            data.rotation || "Unknown",

        infoOrbit:
            data.orbit || "Unknown",

        infoFacts:
            data.facts || "No information available."
    };


    Object.entries(
        fields
    ).forEach(
        ([id, value]) => {

            const element =
                document.getElementById(
                    id
                );

            if (element) {
                element.textContent =
                    value;
            }
        }
    );


    updatePage();

    updatePreview(
        data
    );
}


// ============================================================
// PREVIEW
// ============================================================

function updatePreview(
    data
) {

    const preview =
        document.getElementById(
            "objectPreviewSphere"
        );

    if (!preview) {
        return;
    }


    const color =
        typeof data.color ===
        "number"
            ? data.color
            : 0x65eaff;


    const light =
        lightenColor(
            color,
            70
        );


    preview.style.background =
        `radial-gradient(
            circle at 35% 30%,
            ${colorToHex(light)},
            ${colorToHex(color)} 50%,
            #02040a 100%
        )`;


    preview.style.boxShadow =
        `inset -22px -18px 30px rgba(0,0,0,.7),
         0 0 35px ${colorToHex(color)}66`;
}


function colorToHex(
    color
) {

    return "#" +
        color
            .toString(16)
            .padStart(
                6,
                "0"
            );
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


    let distance =
        8;


    if (
        object.userData.celestial
    ) {

        distance =
            Math.max(
                object.userData.celestial.radius * 7,
                6
            );

    } else if (
        object.userData.type ===
        "Black Hole"
    ) {

        distance =
            45;

    } else {

        distance =
            70;
    }


    const direction =
        new THREE.Vector3(
            1,
            0.45,
            1
        ).normalize();


    const destination =
        target.clone().add(
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
// SEARCH
// ============================================================

function getAllSearchObjects() {

    return [
        ...celestialObjects.map(
            object => ({
                name: object.name,
                type: object.type,
                mesh:
                    objectMap.get(
                        object.name.toLowerCase()
                    )
            })
        ),

        ...deepObjects.map(
            object => ({
                name:
                    object.userData.name,

                type:
                    object.userData.type,

                mesh:
                    object
            })
        )
    ];
}


function searchUniverse() {

    const query =
        searchInput.value
            .trim()
            .toLowerCase();


    if (!query) {

        searchResults.innerHTML =
            "";

        return;
    }


    const results =
        getAllSearchObjects()
            .filter(
                object =>
                    object.name
                        .toLowerCase()
                        .includes(query) ||

                    object.type
                        .toLowerCase()
                        .includes(query)
            );


    searchResults.innerHTML =
        "";


    if (
        results.length === 0
    ) {

        searchResults.innerHTML =
            `<div class="search-result">
                NO OBJECT FOUND
            </div>`;

        return;
    }


    results
        .slice(0, 12)
        .forEach(
            result => {

                const element =
                    document.createElement(
                        "div"
                    );

                element.className =
                    "search-result";

                element.innerHTML =
                    `<strong>${result.name}</strong>
                     <small style="
                        display:block;
                        margin-top:3px;
                        color:#71849d;
                        font-size:8px;
                     ">
                        ${result.type}
                     </small>`;


                element.addEventListener(
                    "click",
                    () => {

                        if (
                            result.mesh
                        ) {

                            if (
                                result.mesh.userData.celestial
                            ) {

                                selectObject(
                                    result.mesh
                                );

                            } else {

                                selectDeepObject(
                                    result.mesh
                                );
                            }
                        }


                        searchResults.innerHTML =
                            "";

                        searchInput.value =
                            result.name;
                    }
                );


                searchResults.appendChild(
                    element
                );
            }
        );
}


searchButton?.addEventListener(
    "click",
    searchUniverse
);


searchInput?.addEventListener(
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


document.addEventListener(
    "click",
    event => {

        if (
            !event.target.closest(
                ".search-wrapper"
            )
        ) {

            searchResults.innerHTML =
                "";
        }
    }
);


// ============================================================
// INFO PAGES
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


nextPage?.addEventListener(
    "click",
    () => {

        currentPage++;

        if (
            currentPage > 4
        ) {
            currentPage =
                1;
        }

        updatePage();
    }
);


previousPage?.addEventListener(
    "click",
    () => {

        currentPage--;

        if (
            currentPage < 1
        ) {
            currentPage =
                4;
        }

        updatePage();
    }
);


// ============================================================
// HOME / EXPLORER
// ============================================================

exploreButton?.addEventListener(
    "click",
    () => {

        homeScreen.classList.add(
            "hidden"
        );

        explorerScreen.classList.remove(
            "hidden"
        );

        setTimeout(
            () => {

                camera.aspect =
                    window.innerWidth /
                    window.innerHeight;

                camera.updateProjectionMatrix();

                renderer.setSize(
                    window.innerWidth,
                    window.innerHeight
                );

            },
            50
        );
    }
);


homeButton?.addEventListener(
    "click",
    () => {

        explorerScreen.classList.add(
            "hidden"
        );

        homeScreen.classList.remove(
            "hidden"
        );

        closeInfoPanel();
    }
);


closeInfo?.addEventListener(
    "click",
    closeInfoPanel
);


function closeInfoPanel() {

    infoPanel?.classList.add(
        "hidden"
    );

    selectedObject =
        null;

    selectedStatus.textContent =
        "NO OBJECT SELECTED";
}


// ============================================================
// MODE BUTTONS
// ============================================================

function updateModeButtons() {

    solarSystemButton?.classList.toggle(
        "active",
        currentMode ===
        "SOLAR SYSTEM"
    );

    freeModeButton?.classList.toggle(
        "active",
        currentMode ===
        "FREE"
    );

    guidedModeButton?.classList.toggle(
        "active",
        currentMode ===
        "GUIDED"
    );
}


function setMode(
    mode
) {

    currentMode =
        mode;

    modeText.textContent =
        mode;

    updateModeButtons();


    if (
        mode ===
        "GUIDED"
    ) {

        guidedActive =
            true;

        guidedPanel?.classList.remove(
            "hidden"
        );

        showGuidedStep();

    } else {

        guidedActive =
            false;

        guidedPanel?.classList.add(
            "hidden"
        );
    }
}


solarSystemButton?.addEventListener(
    "click",
    () => {

        setMode(
            "SOLAR SYSTEM"
        );

        focusSolarSystem();
    }
);


freeModeButton?.addEventListener(
    "click",
    () => {

        setMode(
            "FREE"
        );
    }
);


guidedModeButton?.addEventListener(
    "click",
    () => {

        setMode(
            "GUIDED"
        );
    }
);
// ============================================================
// GUIDED TOUR
// ============================================================

const guidedDestinations = [

    {
        name: "Welcome to the Solar System",
        description:
            "Begin your journey from the Sun and explore the worlds orbiting our star.",
        object: "sun"
    },

    {
        name: "Earth",
        description:
            "Our home world, covered by oceans and protected by a life-supporting atmosphere.",
        object: "earth"
    },

    {
        name: "Mars",
        description:
            "The Red Planet, one of the most studied worlds beyond Earth.",
        object: "mars"
    },

    {
        name: "Jupiter",
        description:
            "The largest planet in the Solar System, surrounded by dozens of moons.",
        object: "jupiter"
    },

    {
        name: "Saturn",
        description:
            "A giant planet famous for its spectacular system of rings.",
        object: "saturn"
    },

    {
        name: "Kuiper Belt",
        description:
            "A distant region beyond Neptune containing icy worlds and smaller bodies.",
        object: "pluto"
    },

    {
        name: "Deep Space",
        description:
            "Leave the Solar System and discover galaxies, nebulae and extreme cosmic objects.",
        object: "andromeda galaxy"
    },

    {
        name: "Andromeda Galaxy",
        description:
            "One of the great galaxies of the Local Group and a future neighbor of the Milky Way.",
        object: "andromeda galaxy"
    },

    {
        name: "Black Hole",
        description:
            "Explore one of the most extreme environments known in the Universe.",
        object: "black hole"
    },

    {
        name: "The Universe",
        description:
            "Your exploration has reached the deepest regions of the Universe.",
        object: null
    }

];


function showGuidedStep() {

    if (
        !guidedPanel ||
        !tourTitle ||
        !tourDescription
    ) {
        return;
    }


    const step =
        guidedDestinations[
            guidedIndex
        ];


    tourTitle.textContent =
        step.name;

    tourDescription.textContent =
        step.description;


    if (
        step.object
    ) {

        const normalObject =
            objectMap.get(
                step.object
            );

        if (
            normalObject
        ) {

            focusOnObject(
                normalObject
            );

        } else {

            const deepObject =
                deepObjects.find(
                    object =>
                        object.userData.name
                            ?.toLowerCase() ===
                        step.object
                );

            if (
                deepObject
            ) {

                focusOnObject(
                    deepObject
                );
            }
        }
    }


    if (
        guidedIndex ===
        guidedDestinations.length - 1
    ) {

        tourNext.textContent =
            "RESTART JOURNEY →";

    } else {

        tourNext.textContent =
            "NEXT DESTINATION →";
    }
}


tourNext?.addEventListener(
    "click",
    () => {

        guidedIndex++;

        if (
            guidedIndex >=
            guidedDestinations.length
        ) {

            guidedIndex =
                0;
        }

        showGuidedStep();
    }
);


// ============================================================
// SPACE TOUR
// ============================================================

tourButton?.addEventListener(
    "click",
    () => {

        tourActive =
            !tourActive;

        tourButton.classList.toggle(
            "active",
            tourActive
        );


        if (tourActive) {

            guidedIndex =
                0;

            setMode(
                "GUIDED"
            );

            tourProgress?.classList.remove(
                "hidden"
            );

            showGuidedStep();

        } else {

            tourProgress?.classList.add(
                "hidden"
            );
        }
    }
);


// ============================================================
// TOUR PROGRESS
// ============================================================

function updateTourProgress() {

    if (
        !tourProgressBar ||
        !tourProgressText
    ) {
        return;
    }


    const total =
        guidedDestinations.length;

    const current =
        guidedIndex + 1;

    const percentage =
        (current / total) *
        100;


    tourProgressBar.style.width =
        `${percentage}%`;

    tourProgressText.textContent =
        `${String(current).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
}


// ============================================================
// ORBITS
// ============================================================

orbitsButton?.addEventListener(
    "click",
    () => {

        orbitsVisible =
            !orbitsVisible;

        orbitsButton.classList.toggle(
            "active",
            orbitsVisible
        );


        orbitObjects.forEach(
            orbit => {

                orbit.visible =
                    orbitsVisible;
            }
        );
    }
);


// ============================================================
// TIME
// ============================================================

const timeSteps =
    [
        1,
        5,
        20,
        100
    ];


let timeIndex =
    0;


function updateTimeButton() {

    if (
        timeButton
    ) {

        timeButton.textContent =
            `◷ TIME ×${timeMultiplier}`;
    }
}


timeButton?.addEventListener(
    "click",
    () => {

        timeIndex++;

        if (
            timeIndex >=
            timeSteps.length
        ) {

            timeIndex =
                0;
        }

        timeMultiplier =
            timeSteps[
                timeIndex
            ];

        updateTimeButton();
    }
);


// ============================================================
// CAMERA BUTTONS
// ============================================================

zoomIn?.addEventListener(
    "click",
    () => {

        const direction =
            new THREE.Vector3();

        camera.getWorldDirection(
            direction
        );

        camera.position.add(
            direction.multiplyScalar(
                10
            )
        );
    }
);


zoomOut?.addEventListener(
    "click",
    () => {

        const direction =
            new THREE.Vector3();

        camera.getWorldDirection(
            direction
        );

        camera.position.add(
            direction.multiplyScalar(
                -10
            )
        );
    }
);


resetCamera?.addEventListener(
    "click",
    () => {

        focusSolarSystem();
    }
);


function focusSolarSystem() {

    camera.position.set(
        0,
        25,
        55
    );

    controls.target.set(
        0,
        0,
        0
    );

    controls.update();
}


// ============================================================
// FAVORITES
// ============================================================

favoriteObjectButton?.addEventListener(
    "click",
    () => {

        if (
            !selectedObject
        ) {
            return;
        }


        let name;


        if (
            selectedObject.userData.celestial
        ) {

            name =
                selectedObject.userData.celestial.name;

        } else {

            name =
                selectedObject.userData.name;
        }


        if (
            favoriteObjects.has(
                name
            )
        ) {

            favoriteObjects.delete(
                name
            );

            favoriteObjectButton.textContent =
                "☆";

        } else {

            favoriteObjects.add(
                name
            );

            favoriteObjectButton.textContent =
                "★";
        }
    }
);


// ============================================================
// ATMOSPHERE
// ============================================================

atmosphereButton?.addEventListener(
    "click",
    () => {

        if (
            !earth ||
            !earth.userData.atmosphere
        ) {
            return;
        }


        atmosphereEnabled =
            !atmosphereEnabled;

        earth.userData.atmosphere.visible =
            atmosphereEnabled;


        atmosphereButton.classList.toggle(
            "active",
            atmosphereEnabled
        );
    }
);


// ============================================================
// DEEP SPACE FILTERS
// ============================================================

spaceObjectButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                spaceObjectButtons.forEach(
                    other => {

                        other.classList.remove(
                            "active"
                        );
                    }
                );

                button.classList.add(
                    "active"
                );


                const type =
                    button.dataset.objectType;

                applyObjectFilter(
                    type
                );
            }
        );
    }
);


function applyObjectFilter(
    type
) {

    const normalObjects =
        objectMeshes;


    normalObjects.forEach(
        mesh => {

            const data =
                mesh.userData.celestial;

            if (!data) {
                return;
            }


            let visible =
                true;


            if (
                type === "planet"
            ) {

                visible =
                    data.type ===
                    "Planet";

            } else if (
                type === "moon"
            ) {

                visible =
                    data.type ===
                    "Natural Satellite";

            } else if (
                type === "star"
            ) {

                visible =
                    data.type ===
                        "Star" ||
                    data.type ===
                        "Star System";

            } else if (
                type === "galaxy"
            ) {

                visible =
                    false;

            } else if (
                type === "blackhole"
            ) {

                visible =
                    false;

            } else if (
                type === "comet"
            ) {

                visible =
                    false;

            } else if (
                type === "asteroid"
            ) {

                visible =
                    false;
            }


            mesh.visible =
                visible;
        }
    );


    galaxyGroup.visible =
        type === "all" ||
        type === "galaxy";


    blackHoleGroup.visible =
        type === "all" ||
        type === "blackhole";


    cometGroup.visible =
        type === "all" ||
        type === "comet";


    asteroidField.visible =
        type === "all" ||
        type === "asteroid";


    kuiperBelt.visible =
        type === "all" ||
        type === "asteroid";


    oortCloud.visible =
        type === "all" ||
        type === "comet";


    nebulaGroup.visible =
        true;


    orbitObjects.forEach(
        orbit => {

            orbit.visible =
                orbitsVisible &&
                (
                    type === "all" ||
                    type === "planet"
                );
        }
    );
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
            event.key ===
            "Escape"
        ) {

            closeInfoPanel();

            guidedPanel?.classList.add(
                "hidden"
            );
        }


        if (
            event.key.toLowerCase() ===
            "g"
        ) {

            setMode(
                "GUIDED"
            );
        }


        if (
            event.key.toLowerCase() ===
            "f"
        ) {

            setMode(
                "FREE"
            );
        }


        if (
            event.key.toLowerCase() ===
            "r"
        ) {

            focusSolarSystem();
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


    // --------------------------------------------------------
    // PLANETS
    // --------------------------------------------------------

    objectMeshes.forEach(
        mesh => {

            const data =
                mesh.userData.celestial;

            if (!data) {
                return;
            }


            const rotationSpeed =
                data.type === "Star"
                    ? 0.0008
                    : 0.0018;


            mesh.rotation.y +=
                rotationSpeed *
                timeMultiplier;


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


    // --------------------------------------------------------
    // MOONS
    // --------------------------------------------------------

    moonObjects.forEach(
        moon => {

            moon.userData.angle +=
                moon.userData.speed *
                delta *
                timeMultiplier;


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
                0.002 *
                timeMultiplier;
        }
    );


    // --------------------------------------------------------
    // COMETS
    // --------------------------------------------------------

    comets.forEach(
        comet => {

            comet.userData.angle +=
                comet.userData.speed *
                delta *
                timeMultiplier;


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

            comet.rotation.z =
                comet.userData.inclination;
        }
    );


    // --------------------------------------------------------
    // BELTS
    // --------------------------------------------------------

    asteroidField.rotation.y +=
        0.00012 *
        timeMultiplier;

    kuiperBelt.rotation.y +=
        0.000045 *
        timeMultiplier;

    oortCloud.rotation.y +=
        0.000008 *
        timeMultiplier;


    // --------------------------------------------------------
    // NEBULAE
    // --------------------------------------------------------

    nebulaGroup.rotation.y +=
        0.00001 *
        timeMultiplier;


    // --------------------------------------------------------
    // GALAXIES
    // --------------------------------------------------------

    galaxyGroup.children.forEach(
        galaxy => {

            galaxy.rotation.y +=
                0.00008 *
                timeMultiplier;
        }
    );


    // --------------------------------------------------------
    // BLACK HOLES
    // --------------------------------------------------------

    blackHoleGroup.children.forEach(
        blackHole => {

            blackHole.rotation.y +=
                0.002 *
                timeMultiplier;


            blackHole.children.forEach(
                child => {

                    if (
                        child.geometry &&
                        child.geometry.type ===
                        "RingGeometry"
                    ) {

                        child.rotation.z +=
                            0.004 *
                            timeMultiplier;
                    }
                }
            );
        }
    );


    // --------------------------------------------------------
    // GUIDED TOUR
    // --------------------------------------------------------

    if (
        tourActive
    ) {

        updateTourProgress();
    }


    // --------------------------------------------------------
    // HUD POSITION
    // --------------------------------------------------------

    if (
        positionText
    ) {

        positionText.textContent =
            `X ${camera.position.x.toFixed(1)} / ` +
            `Y ${camera.position.y.toFixed(1)} / ` +
            `Z ${camera.position.z.toFixed(1)}`;
    }


    // --------------------------------------------------------
    // REGION / SCALE
    // --------------------------------------------------------

    updateRegionHUD();


    // --------------------------------------------------------
    // RENDER
    // --------------------------------------------------------

    renderer.render(
        scene,
        camera
    );
}


// ============================================================
// REGION HUD
// ============================================================

function updateRegionHUD() {

    const distance =
        camera.position.length();


    if (
        distance < 120
    ) {

        regionText.textContent =
            "SOLAR SYSTEM";

        scaleText.textContent =
            "PLANETARY SCALE";

    } else if (
        distance < 500
    ) {

        regionText.textContent =
            "OUTER SOLAR SYSTEM";

        scaleText.textContent =
            "KUIPER REGION";

    } else if (
        distance < 1200
    ) {

        regionText.textContent =
            "DEEP SPACE";

        scaleText.textContent =
            "OORT CLOUD";

    } else {

        regionText.textContent =
            "INTERSTELLAR SPACE";

        scaleText.textContent =
            "DEEP UNIVERSE";
    }
}


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
// LOADING SCREEN
// ============================================================

function hideLoadingScreen() {

    if (!loadingScreen) {
        return;
    }


    loadingScreen.style.opacity =
        "0";

    loadingScreen.style.pointerEvents =
        "none";


    setTimeout(
        () => {

            loadingScreen.classList.add(
                "hidden"
            );

        },
        550
    );
}


// Aspetta che Three.js abbia creato
// completamente l'ambiente 3D.

window.addEventListener(
    "load",
    () => {

        setTimeout(
            hideLoadingScreen,
            900
        );
    }
);


// ============================================================
// INITIAL STATE
// ============================================================

homeScreen.classList.remove(
    "hidden"
);

explorerScreen.classList.add(
    "hidden"
);

guidedPanel?.classList.add(
    "hidden"
);

tourProgress?.classList.add(
    "hidden"
);

updateModeButtons();

updateTimeButton();

updatePage();

updateTourProgress();


// ============================================================
// START
// ============================================================

animate();
