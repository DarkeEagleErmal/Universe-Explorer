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
    100000
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

controls.minDistance = 2;
controls.maxDistance = 5000;

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
    0xffffff,
    4,
    500
);

sunLight.position.set(0, 0, 0);

scene.add(sunLight);


// ============================================================
// SPACE BACKGROUND
// ============================================================

function createStars(count = 10000) {

    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {

        const radius =
            700 +
            Math.random() * 2500;

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
            0.55 +
            Math.random() * 0.45;

        colors[i * 3] = brightness;
        colors[i * 3 + 1] = brightness;
        colors[i * 3 + 2] = 1;
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
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true
    });

    return new THREE.Points(
        geometry,
        material
    );
}

scene.add(createStars());


// ============================================================
// NEBULA
// ============================================================

function createNebula() {

    const geometry =
        new THREE.SphereGeometry(
            450,
            32,
            32
        );

    const material =
        new THREE.MeshBasicMaterial({
            color: 0x29104a,
            transparent: true,
            opacity: 0.025,
            side: THREE.BackSide,
            depthWrite: false
        });

    const nebula =
        new THREE.Mesh(
            geometry,
            material
        );

    scene.add(nebula);
}

createNebula();


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
            48,
            48
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: data.color,
            roughness: 0.78,
            metalness: 0.05
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

    scene.add(mesh);

    objectMeshes.push(mesh);
    objectMap.set(
        data.name.toLowerCase(),
        mesh
    );

    return mesh;
}


celestialObjects.forEach(createCelestialObject);


// ============================================================
// SATURN RINGS
// ============================================================

const saturn = objectMap.get("saturn");

if (saturn) {

    const ringGeometry =
        new THREE.RingGeometry(
            3.2,
            5,
            64
        );

    const ringMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xbcae8d,
            transparent: true,
            opacity: 0.65,
            side: THREE.DoubleSide
        });

    const rings =
        new THREE.Mesh(
            ringGeometry,
            ringMaterial
        );

    rings.rotation.x =
        Math.PI / 2;

    saturn.add(rings);

    saturn.userData.rings = rings;
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
        curve.getPoints(128);

    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(
                points.map(
                    p => new THREE.Vector3(
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

    scene.add(line);

    orbitObjects.push(line);
}

[7, 11, 15, 20, 32, 45, 57, 69].forEach(
    createOrbit
);


// ============================================================
// RAYCASTING
// ============================================================

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener(
    "pointerdown",
    event => {

        if (
            event.target !== renderer.domElement
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
                objectMeshes
            );

        if (intersections.length > 0) {

            const selected =
                intersections[0].object;

            selectObject(selected);
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

    if (!mesh || !mesh.userData.celestial) {
        return;
    }

    selectedObject = mesh;

    const data =
        mesh.userData.celestial;

    currentPage = 1;

    updateInfoPanel(data);

    infoPanel.classList.remove("hidden");

    selectedStatus.textContent =
        `SELECTED: ${data.name.toUpperCase()}`;

    focusOnObject(mesh);
}


// ============================================================
// INFO PANEL
// ============================================================

function updateInfoPanel(data) {

    document.getElementById("objectType")
        .textContent =
        data.type.toUpperCase();

    document.getElementById("objectName")
        .textContent =
        data.name;

    document.getElementById("infoType")
        .textContent =
        data.type;

    document.getElementById("infoName")
        .textContent =
        data.name;

    document.getElementById("infoSize")
        .textContent =
        data.size;

    document.getElementById("infoMass")
        .textContent =
        data.mass;

    document.getElementById("infoTemperature")
        .textContent =
        data.temperature;

    document.getElementById("infoGravity")
        .textContent =
        data.gravity;

    document.getElementById("infoComposition")
        .textContent =
        data.composition;

    document.getElementById("infoAtmosphere")
        .textContent =
        data.atmosphere;

    document.getElementById("infoRotation")
        .textContent =
        data.rotation;

    document.getElementById("infoOrbit")
        .textContent =
        data.orbit;

    document.getElementById("infoFacts")
        .textContent =
        data.facts;

    updatePage();

    updatePreview(data);
}


function updatePreview(data) {

    const preview =
        document.getElementById(
            "objectPreviewSphere"
        );

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


function lightenColor(color, amount) {

    const r =
        Math.min(
            255,
            ((color >> 16) & 255) + amount
        );

    const g =
        Math.min(
            255,
            ((color >> 8) & 255) + amount
        );

    const b =
        Math.min(
            255,
            (color & 255) + amount
        );

    return (
        (r << 16) |
        (g << 8) |
        b
    );
}


// ============================================================
// PAGE NAVIGATION
// ============================================================

function updatePage() {

    document
        .querySelectorAll(".info-page")
        .forEach(page => {

            page.classList.toggle(
                "active",
                Number(page.dataset.page) ===
                currentPage
            );
        });

    document.getElementById(
        "pageNumber"
    ).textContent =
        String(currentPage)
            .padStart(2, "0");
}


document.getElementById(
    "nextPage"
).addEventListener(
    "click",
    () => {

        currentPage++;

        if (currentPage > 4) {
            currentPage = 1;
        }

        updatePage();
    }
);


document.getElementById(
    "previousPage"
).addEventListener(
    "click",
    () => {

        currentPage--;

        if (currentPage < 1) {
         currentPage = 4;
    }

    updatePage();
});


// ============================================================
// CAMERA FOCUS
// ============================================================

function focusOnObject(mesh) {

    const target = mesh.position.clone();

    const direction = camera.position
        .clone()
        .sub(target)
        .normalize();

    const radius =
        mesh.geometry.parameters.radius || 1;

    const distance = Math.max(radius * 5, 7);

    const destination = target
        .clone()
        .add(direction.multiplyScalar(distance));

    animateCamera(destination, target);
}


function animateCamera(destination, target) {

    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();

    const duration = 900;
    const startTime = performance.now();

    function moveCamera(now) {

        const progress = Math.min(
            1,
            (now - startTime) / duration
        );

        const eased =
            1 - Math.pow(1 - progress, 3);

        camera.position.lerpVectors(
            startPosition,
            destination,
            eased
        );

        controls.target.lerpVectors(
            startTarget,
            target,
            eased
        );

        if (progress < 1) {
            requestAnimationFrame(moveCamera);
        }
    }

    requestAnimationFrame(moveCamera);
}


// ============================================================
// EXPLORE / HOME
// ============================================================

exploreButton.addEventListener("click", () => {

    homeScreen.classList.remove("active");
    explorerScreen.classList.add("active");

    loadingScreen.classList.remove("hidden");

    setTimeout(() => {
        loadingScreen.classList.add("hidden");
    }, 900);
});


homeButton.addEventListener("click", () => {

    explorerScreen.classList.remove("active");
    homeScreen.classList.add("active");
});


closeInfo.addEventListener("click", () => {

    infoPanel.classList.add("hidden");

    selectedObject = null;

    selectedStatus.textContent =
        "NO OBJECT SELECTED";
});


// ============================================================
// SEARCH
// ============================================================

function performSearch() {

    const query =
        searchInput.value.trim().toLowerCase();

    searchResults.innerHTML = "";

    if (!query) {

        searchResults.style.display = "none";
        return;
    }

    const matches = celestialObjects
        .filter(object =>
            object.name
                .toLowerCase()
                .includes(query)
        )
        .slice(0, 8);

    if (matches.length === 0) {

        searchResults.innerHTML =
            `<div class="search-result">
                NO OBJECT FOUND
            </div>`;

        searchResults.style.display = "block";

        return;
    }

    matches.forEach(object => {

        const item =
            document.createElement("div");

        item.className = "search-result";

        item.textContent =
            `${object.name} · ${object.type}`;

        item.addEventListener("click", () => {

            const mesh =
                objectMap.get(
                    object.name.toLowerCase()
                );

            if (mesh) {
                selectObject(mesh);
            }

            searchResults.style.display = "none";
            searchInput.value = object.name;
        });

        searchResults.appendChild(item);
    });

    searchResults.style.display = "block";
}


searchButton.addEventListener(
    "click",
    performSearch
);


searchInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            performSearch();
        }
    }
);


searchInput.addEventListener(
    "input",
    performSearch
);


// ============================================================
// ZOOM
// ============================================================

document.getElementById("zoomIn")
    .addEventListener("click", () => {

        const direction =
            camera.position
                .clone()
                .sub(controls.target)
                .normalize();

        camera.position.sub(
            direction.multiplyScalar(8)
        );
    });


document.getElementById("zoomOut")
    .addEventListener("click", () => {

        const direction =
            camera.position
                .clone()
                .sub(controls.target)
                .normalize();

        camera.position.add(
            direction.multiplyScalar(8)
        );
    });


// ============================================================
// RESET CAMERA
// ============================================================

document.getElementById("resetCamera")
    .addEventListener("click", () => {

        animateCamera(
            new THREE.Vector3(0, 25, 55),
            new THREE.Vector3(25, 0, 0)
        );
    });


// ============================================================
// SOLAR SYSTEM
// ============================================================

document.getElementById("solarSystemButton")
    .addEventListener("click", () => {

        modeText.textContent =
            "SOLAR SYSTEM";

        animateCamera(
            new THREE.Vector3(0, 25, 55),
            new THREE.Vector3(25, 0, 0)
        );
    });


// ============================================================
// FREE MODE
// ============================================================

document.getElementById("freeModeButton")
    .addEventListener("click", () => {

        modeText.textContent =
            "FREE EXPLORATION";

        controls.enablePan = true;
        controls.enableRotate = true;
        controls.enableZoom = true;
    });


// ============================================================
// ORBITS
// ============================================================

document.getElementById("orbitsButton")
    .addEventListener("click", event => {

        const currentlyVisible =
            orbitObjects.length > 0 &&
            orbitObjects[0].visible;

        orbitObjects.forEach(orbit => {
            orbit.visible = !currentlyVisible;
        });

        event.currentTarget.classList.toggle(
            "active",
            !currentlyVisible
        );
    });


// ============================================================
// ATMOSPHERE
// ============================================================

document.getElementById("atmosphereButton")
    .addEventListener("click", () => {

        atmosphereEnabled =
            !atmosphereEnabled;

        const preview =
            document.getElementById(
                "objectPreviewSphere"
            );

        preview.style.filter =
            atmosphereEnabled
                ? "brightness(1.05)"
                : "brightness(0.8)";
    });


// ============================================================
// FAVORITES
// ============================================================

const favorites = new Set();

document.getElementById("favoriteObject")
    .addEventListener("click", event => {

        if (!selectedObject) {
            return;
        }

        const name =
            selectedObject.userData
                .celestial.name;

        if (favorites.has(name)) {

            favorites.delete(name);
            event.currentTarget.textContent = "☆";

        } else {

            favorites.add(name);
            event.currentTarget.textContent = "★";
        }
    });


// ============================================================
// FOCUS BUTTON
// ============================================================

document.getElementById("focusObject")
    .addEventListener("click", () => {

        if (selectedObject) {
            focusOnObject(selectedObject);
        }
    });


// ============================================================
// GUIDED TOUR
// ============================================================

const tourStops = [
    {
        title: "The Sun",
        description:
            "Start at the center of our Solar System.",
        object: "Sun"
    },
    {
        title: "Mars",
        description:
            "Visit the Red Planet and explore its scientific history.",
        object: "Mars"
    },
    {
        title: "Jupiter",
        description:
            "Approach the largest planet in our Solar System.",
        object: "Jupiter"
    },
    {
        title: "Saturn",
        description:
            "Discover the planet famous for its spectacular rings.",
        object: "Saturn"
    },
    {
        title: "Pluto",
        description:
            "Travel to the distant Kuiper Belt.",
        object: "Pluto"
    },
    {
        title: "Andromeda Galaxy",
        description:
            "Travel far beyond the Solar System.",
        object: "Andromeda Galaxy"
    }
];

let tourIndex = 0;

const guidedPanel =
    document.getElementById("guidedPanel");


function showTourStop() {

    const stop = tourStops[tourIndex];

    document.getElementById("tourTitle")
        .textContent = stop.title;

    document.getElementById("tourDescription")
        .textContent = stop.description;

    const mesh =
        objectMap.get(
            stop.object.toLowerCase()
        );

    if (mesh) {
        selectObject(mesh);
    }
}


document.getElementById("guidedModeButton")
    .addEventListener("click", () => {

        modeText.textContent =
            "GUIDED MODE";

        guidedPanel.classList.remove("hidden");

        tourIndex = 0;

        showTourStop();
    });


document.getElementById("tourButton")
    .addEventListener("click", () => {

        guidedPanel.classList.remove("hidden");

        tourIndex = 0;

        modeText.textContent =
            "SPACE TOUR";

        showTourStop();
    });


document.getElementById("tourNext")
    .addEventListener("click", () => {

        tourIndex++;

        if (tourIndex >= tourStops.length) {
            tourIndex = 0;
        }

        showTourStop();
    });


// ============================================================
// TIME SIMULATION
// ============================================================

let timeMultiplier = 1;

document.getElementById("timeButton")
    .addEventListener("click", event => {

        const values = [
            1,
            10,
            100,
            1000
        ];

        const currentIndex =
            values.indexOf(timeMultiplier);

        timeMultiplier =
            values[
                (currentIndex + 1) %
                values.length
            ];

        event.currentTarget.textContent =
            `◷ TIME ×${timeMultiplier}`;
    });


// ============================================================
// ANIMATION
// ============================================================

const clock = new THREE.Clock();


function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsed = clock.elapsedTime;

    controls.update();


    objectMeshes.forEach(mesh => {

        const data =
            mesh.userData.celestial;

        if (
            data.type === "Planet" ||
            data.type === "Gas Giant" ||
            data.type === "Ice Giant" ||
            data.type === "Dwarf Planet"
        ) {

            mesh.rotation.y +=
                delta *
                0.08 *
                timeMultiplier;
        }
    });


    scene.children.forEach(child => {

        if (child instanceof THREE.Points) {

            child.rotation.y =
                elapsed * 0.002;
        }
    });


    positionText.textContent =
        `X ${camera.position.x.toFixed(2)} / ` +
        `Y ${camera.position.y.toFixed(2)} / ` +
        `Z ${camera.position.z.toFixed(2)}`;


    renderer.render(
        scene,
        camera
    );
}


animate();


// ============================================================
// RESIZE
// ============================================================

window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});


// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================

window.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        infoPanel.classList.add("hidden");
        guidedPanel.classList.add("hidden");
    }


    if (
        event.key === "ArrowRight" &&
        !infoPanel.classList.contains("hidden")
    ) {

        currentPage++;

        if (currentPage > 4) {
            currentPage = 1;
        }

        updatePage();
    }


    if (
        event.key === "ArrowLeft" &&
        !infoPanel.classList.contains("hidden")
    ) {

        currentPage--;

        if (currentPage < 1) {
            currentPage = 4;
        }

        updatePage();
    }
});


// ============================================================
// INITIALIZATION
// ============================================================

window.addEventListener("load", () => {

    setTimeout(() => {

        loadingScreen.classList.add(
            "hidden"
        );

    }, 1000);
});
