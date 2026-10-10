```javascript
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/*
 * Versione ripulita e coerente dello script fornito.
 *
 * Dipendenze esterne attese dal progetto:
 * - allCelestialObjects, oppure celestialObjects e moonObjects
 * - galaxyObjects, nebulaObjects, deepSpaceObjects, cometObjects
 * - solarSystemGroup, deepSpaceGroup, galaxyGroup, nebulaGroup,
 *   blackHoleGroup, cometGroup, asteroidGroup, kuiperGroup, oortGroup
 * - animatedObjects, orbitLines, interactiveObjects, objectMap
 * - softTexture, searchInput, searchButton, searchResults,
 *   selectedStatus, infoPanel
 * - getPosition, getColor, createPlanetTexture, registerObject
 * - createAllOrbits, updateCamera, updatePosition, updateScale,
 *   finishLoading
 * - initializeWelcome, initializeInterface,
 *   initializeExplorationControls, initializeGuide,
 *   initializeInformation
 *
 * I gruppi e gli array devono essere creati prima di questo script.
 */

let scene = null;
let camera = null;
let renderer = null;
let controls = null;

let selectedObject = null;
let cameraAnimation = null;
let initialized = false;
let timeMultiplier = 1;
let currentFilter = "all";
let orbitsVisible = true;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const clock = new THREE.Clock();

function getRequiredArray(name) {
    const value = globalThis[name];
    return Array.isArray(value) ? value : [];
}

function getRequiredGroup(name) {
    const value = globalThis[name];

    if (!value?.isObject3D) {
        throw new Error(`Il gruppo "${name}" non è stato inizializzato.`);
    }

    return value;
}

function addInteractiveObject(object) {
    const targets = globalThis.interactiveObjects;

    if (Array.isArray(targets) && !targets.includes(object)) {
        targets.push(object);
    }
}

function createInvisibleHitArea(radius) {
    return new THREE.Mesh(
        new THREE.SphereGeometry(radius, 16, 16),
        new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            depthWrite: false
        })
    );
}

// ============================================================
// CORPI CELESTI
// ============================================================

function createCelestialBodies() {
    const source = Array.isArray(globalThis.allCelestialObjects)
        ? globalThis.allCelestialObjects
        : [
              ...getRequiredArray("celestialObjects"),
              ...getRequiredArray("moonObjects")
          ];

    const unique = new Map();

    for (const data of source) {
        if (data?.name) {
            unique.set(String(data.name).toLowerCase(), data);
        }
    }

    for (const data of unique.values()) {
        createCelestialBody(data);
    }
}

function createCelestialBody(data) {
    const solarSystemGroup = getRequiredGroup("solarSystemGroup");
    const radius = Math.max(Number(data.radius) || 0.3, 0.12);
    const texture = createPlanetTexture(getColor(data), data.name);

    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: data.type === "Star" ? 0.25 : 0.8,
        metalness: 0.02
    });

    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 48, 48),
        material
    );

    mesh.position.copy(getPosition(data));
    registerObject(data.name, mesh, data);
    solarSystemGroup.add(mesh);

    const animated = globalThis.animatedObjects;
    if (Array.isArray(animated)) {
        animated.push(mesh);
    }

    const objectName = String(data.name || "").toLowerCase();

    if (objectName === "sun") {
        material.emissive = new THREE.Color(0xff8a18);
        material.emissiveIntensity = 1.8;

        const glow = createGlow(radius * 1.7, 0xffb52e, 0.28);
        mesh.add(glow);
        mesh.userData.glow = glow;
    }

    if (objectName === "earth") {
        createEarthAtmosphere(mesh, radius);
    }

    if (objectName === "saturn") {
        createSaturnRings(mesh, radius);
    }
}

function createGlow(radius, color, opacity) {
    return new THREE.Mesh(
        new THREE.SphereGeometry(radius, 32, 32),
        new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );
}

function createEarthAtmosphere(earth, radius) {
    const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(radius * 1.07, 40, 40),
        new THREE.MeshBasicMaterial({
            color: 0x4aa8ff,
            transparent: true,
            opacity: 0.14,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );

    atmosphere.userData.isAtmosphere = true;
    earth.add(atmosphere);
    earth.userData.atmosphere = atmosphere;
}

function createSaturnRings(saturn, radius) {
    const rings = new THREE.Mesh(
        new THREE.RingGeometry(radius * 1.45, radius * 2.35, 128),
        new THREE.MeshStandardMaterial({
            color: 0xcbbd99,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide,
            roughness: 0.9
        })
    );

    rings.rotation.x = Math.PI / 2;
    saturn.add(rings);
    saturn.userData.rings = rings;
}

// ============================================================
// ORBITE
// ============================================================

function createOrbit(radius, targetScene = scene) {
    if (!targetScene) {
        return null;
    }

    const curve = new THREE.EllipseCurve(
        0,
        0,
        radius,
        radius,
        0,
        Math.PI * 2,
        false,
        0
    );

    const points = curve.getPoints(160);
    const geometry = new THREE.BufferGeometry().setFromPoints(
        points.map(point => new THREE.Vector3(point.x, 0, point.y))
    );

    const line = new THREE.LineLoop(
        geometry,
        new THREE.LineBasicMaterial({
            color: 0x35506b,
            transparent: true,
            opacity: 0.35
        })
    );

    targetScene.add(line);

    if (Array.isArray(globalThis.orbitLines)) {
        globalThis.orbitLines.push(line);
    }

    return line;
}

// ============================================================
// OGGETTI DI DEEP SPACE
// ============================================================

function createAllObjects() {
    if (!scene) {
        console.error("Scena non inizializzata!");
        return;
    }

    createNebulaObjects();
    createGalaxyObjects();
    createBlackHoleObjects();
    createCometObjects();
    createAsteroidRegion();
    createKuiperRegion();
    createOortRegion();
}

function createDeepObject(data) {
    if (!data?.name) {
        return null;
    }

    const group = new THREE.Group();
    group.position.copy(getPosition(data));

    const radius = Math.max(Number(data.radius) || 5, 2);
    group.add(createInvisibleHitArea(radius * 1.5));

    registerObject(data.name, group, data);
    getRequiredGroup("deepSpaceGroup").add(group);
    addInteractiveObject(group);

    return group;
}

// ============================================================
// GALASSIE
// ============================================================

function createGalaxyVisual(data) {
    const galaxyGroup = getRequiredGroup("galaxyGroup");
    const size = Math.max(Number(data.radius) || 20, 12);
    const count = window.innerWidth < 700 ? 1200 : 2400;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color(getColor(data, 0xc9b8ff));

    for (let i = 0; i < count; i++) {
        const radius = Math.random() * size;
        const arm = i % 4;
        const angle =
            radius * 0.12 +
            (arm * Math.PI) / 2 +
            (Math.random() - 0.5) * 0.8;

        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = (Math.random() - 0.5) * size * 0.08;
        positions[i * 3 + 2] = Math.sin(angle) * radius;

        const brightness = 0.45 + Math.random() * 0.55;
        colors[i * 3] = color.r * brightness;
        colors[i * 3 + 1] = color.g * brightness;
        colors[i * 3 + 2] = color.b * brightness;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const galaxy = new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
            size: 0.55,
            map: globalThis.softTexture,
            vertexColors: true,
            transparent: true,
            opacity: 0.82,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );

    galaxy.position.copy(getPosition(data));
    galaxy.add(createGlowSprite(size * 0.55, 0xffffff, 0.5));
    galaxy.add(createInvisibleHitArea(size * 0.85));

    registerObject(data.name, galaxy, data);
    galaxyGroup.add(galaxy);
    addInteractiveObject(galaxy);

    if (Array.isArray(globalThis.animatedObjects)) {
        globalThis.animatedObjects.push(galaxy);
    }
}

function createGlowSprite(size, color, opacity) {
    const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: globalThis.softTexture,
            color,
            transparent: true,
            opacity,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        })
    );

    sprite.scale.set(size, size, 1);
    return sprite;
}

function createGalaxyObjects() {
    for (const data of getRequiredArray("galaxyObjects")) {
        createGalaxyVisual(data);
    }
}

// ============================================================
// NEBULOSE
// ============================================================

function createNebulaVisual(data) {
    const nebulaGroup = getRequiredGroup("nebulaGroup");
    const size = Math.max(Number(data.radius) || 70, 50);
    const group = new THREE.Group();

    group.position.copy(getPosition(data));

    const color = getColor(data, 0x735cff);
    const layers = window.innerWidth < 700 ? 10 : 18;

    for (let i = 0; i < layers; i++) {
        const cloud = createGlowSprite(
            size * (0.65 + Math.random() * 0.8),
            color,
            0.025 + Math.random() * 0.025
        );

        cloud.position.set(
            (Math.random() - 0.5) * size,
            (Math.random() - 0.5) * size * 0.55,
            (Math.random() - 0.5) * size * 0.65
        );

        group.add(cloud);
    }

    group.add(createInvisibleHitArea(size * 0.7));
    registerObject(data.name, group, data);
    nebulaGroup.add(group);
    addInteractiveObject(group);

    if (Array.isArray(globalThis.animatedObjects)) {
        globalThis.animatedObjects.push(group);
    }
}

function createNebulaObjects() {
    for (const data of getRequiredArray("nebulaObjects")) {
        createNebulaVisual(data);
    }
}

// ============================================================
// BUCHI NERI
// ============================================================

function createBlackHoleVisual(data) {
    const blackHoleGroup = getRequiredGroup("blackHoleGroup");
    const group = new THREE.Group();
    const radius = Math.max(Number(data.radius) || 5, 3);

    group.position.copy(getPosition(data));

    group.add(
        new THREE.Mesh(
            new THREE.SphereGeometry(radius, 40, 40),
            new THREE.MeshBasicMaterial({ color: 0x000000 })
        )
    );

    const disk = new THREE.Mesh(
        new THREE.RingGeometry(radius * 1.4, radius * 3.6, 128),
        new THREE.MeshBasicMaterial({
            color: 0xff5a19,
            transparent: true,
            opacity: 0.72,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );

    disk.rotation.x = Math.PI / 2;
    group.add(disk);

    const glow = new THREE.Mesh(
        new THREE.RingGeometry(radius * 3.5, radius * 5, 128),
        new THREE.MeshBasicMaterial({
            color: 0xff9d52,
            transparent: true,
            opacity: 0.12,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );

    glow.rotation.x = Math.PI / 2;
    group.add(glow);
    group.add(createInvisibleHitArea(radius * 5));

    registerObject(data.name, group, data);
    blackHoleGroup.add(group);
    addInteractiveObject(group);

    if (Array.isArray(globalThis.animatedObjects)) {
        globalThis.animatedObjects.push(group);
    }
}

function createBlackHoleObjects() {
    for (const data of getRequiredArray("deepSpaceObjects")) {
        if (String(data.type || "").toLowerCase().includes("black")) {
            createBlackHoleVisual(data);
        }
    }
}

// ============================================================
// COMETE
// ============================================================

function createCometVisual(data) {
    const cometGroup = getRequiredGroup("cometGroup");
    const group = new THREE.Group();

    group.position.copy(getPosition(data));

    const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(
            Math.max(Number(data.radius) || 0.2, 0.15),
            24,
            24
        ),
        new THREE.MeshStandardMaterial({
            color: 0xd8e0e8,
            roughness: 0.85
        })
    );

    group.add(nucleus);

    const tail = new THREE.Mesh(
        new THREE.ConeGeometry(0.35, 6, 18, 1, true),
        new THREE.MeshBasicMaterial({
            color: 0x91ddff,
            transparent: true,
            opacity: 0.38,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );

    tail.rotation.z = Math.PI / 2;
    tail.position.x = 3;
    group.add(tail);
    group.add(createInvisibleHitArea(2.5));

    registerObject(data.name, group, data);
    cometGroup.add(group);
    addInteractiveObject(group);

    if (Array.isArray(globalThis.animatedObjects)) {
        globalThis.animatedObjects.push(group);
    }
}

function createCometObjects() {
    const comets = getRequiredArray("cometObjects");

    if (comets.length > 0) {
        comets.forEach(createCometVisual);
        return;
    }

    createCometVisual({
        name: "Comet",
        type: "Comet",
        color: 0xd8e0e8,
        radius: 0.3,
        position: [38, 2, 0],
        size: "Small icy body",
        mass: "Varies",
        temperature: "Very cold",
        gravity: "Very weak",
        composition: "Ice, dust and rock",
        atmosphere: "Coma when active",
        rotation: "Irregular",
        orbit: "Varies",
        facts:
            "Comets are icy bodies that can develop glowing comae and tails when approaching the Sun.",
        source: "NASA"
    });
}

// ============================================================
// REGIONI DI PICCOLI CORPI
// ============================================================

function createPointRegion({
    groupName,
    name,
    type,
    count,
    color,
    pointSize,
    opacity,
    positionForIndex,
    data
}) {
    const group = getRequiredGroup(groupName);
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const position = positionForIndex();
        positions[i * 3] = position.x;
        positions[i * 3 + 1] = position.y;
        positions[i * 3 + 2] = position.z;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const points = new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
            color,
            size: pointSize,
            map: globalThis.softTexture,
            transparent: true,
            opacity,
            depthWrite: false
        })
    );

    group.add(points);
    group.add(createInvisibleHitArea(data.hitRadius));
    registerObject(name, group, data);
    addInteractiveObject(group);
}

function createAsteroidRegion() {
    const data = {
        name: "Asteroid Belt",
        type: "Asteroid Belt",
        color: 0x938a80,
        size: "Main asteroid belt",
        mass: "Distributed",
        temperature: "Varies",
        gravity: "Very weak",
        composition: "Rock and metal",
        atmosphere: "None",
        rotation: "Orbital motion",
        orbit: "Between Mars and Jupiter",
        facts: "A broad region containing many rocky bodies orbiting the Sun.",
        source: "NASA",
        hitRadius: 27
    };

    createPointRegion({
        groupName: "asteroidGroup",
        name: data.name,
        type: data.type,
        count: window.innerWidth < 700 ? 650 : 1500,
        color: 0x938a80,
        pointSize: 0.13,
        opacity: 0.72,
        positionForIndex: () => {
            const radius = 23 + Math.random() * 5;
            const angle = Math.random() * Math.PI * 2;

            return new THREE.Vector3(
                Math.cos(angle) * radius,
                (Math.random() - 0.5) * 1.5,
                Math.sin(angle) * radius
            );
        },
        data
    });
}

function createKuiperRegion() {
    const data = {
        name: "Kuiper Belt",
        type: "Kuiper Belt",
        color: 0x9da8b9,
        size: "Outer Solar System region",
        mass: "Distributed",
        temperature: "Very cold",
        gravity: "Very weak",
        composition: "Ice, rock and dust",
        atmosphere: "None",
        rotation: "Orbital motion",
        orbit: "Beyond Neptune",
        facts: "A distant region of icy bodies beyond Neptune.",
        source: "NASA",
        hitRadius: 125
    };

    createPointRegion({
        groupName: "kuiperGroup",
        name: data.name,
        type: data.type,
        count: window.innerWidth < 700 ? 500 : 1200,
        color: 0x9da8b9,
        pointSize: 0.15,
        opacity: 0.55,
        positionForIndex: () => {
            const radius = 90 + Math.random() * 35;
            const angle = Math.random() * Math.PI * 2;

            return new THREE.Vector3(
                Math.cos(angle) * radius,
                (Math.random() - 0.5) * 7,
                Math.sin(angle) * radius
            );
        },
        data
    });
}

function createOortRegion() {
    const data = {
        name: "Oort Cloud",
        type: "Oort Cloud",
        color: 0x71849c,
        size: "Extremely distant spherical region",
        mass: "Distributed",
        temperature: "Very cold",
        gravity: "Very weak",
        composition: "Icy planetesimals",
        atmosphere: "None",
        rotation: "Orbital motion",
        orbit: "Far beyond the planets",
        facts:
            "A proposed distant reservoir of icy objects surrounding the Solar System.",
        source: "NASA",
        hitRadius: 900
    };

    createPointRegion({
        groupName: "oortGroup",
        name: data.name,
        type: data.type,
        count: window.innerWidth < 700 ? 700 : 1800,
        color: 0x71849c,
        pointSize: 0.11,
        opacity: 0.35,
        positionForIndex: () => {
            const radius = 400 + Math.random() * 500;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            return new THREE.Vector3(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
        },
        data
    });
}

// ============================================================
// RAYCASTING
// ============================================================

function initializeRaycaster() {
    if (!renderer || !camera) {
        return;
    }

    raycaster.params.Points.threshold = 5;

    renderer.domElement.addEventListener("pointerdown", event => {
        if (event.button !== undefined && event.button !== 0) {
            return;
        }

        const rect = renderer.domElement.getBoundingClientRect();
        if (!rect.width || !rect.height) {
            return;
        }

        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);

        const targets = Array.isArray(globalThis.interactiveObjects)
            ? globalThis.interactiveObjects
            : [];

        const hits = raycaster.intersectObjects(targets, true);
        if (!hits.length) {
            return;
        }

        let object = hits[0].object;

        while (object && !object.userData.celestial) {
            object = object.parent;
        }

        if (object?.userData?.celestial) {
            selectObject(object);
        }
    });
}

// ============================================================
// RICERCA E SELEZIONE
// ============================================================

function findObjectByName(name) {
    if (!name) {
        return null;
    }

    const normalized = String(name).trim().toLowerCase();
    const map = globalThis.objectMap;

    if (!(map instanceof Map)) {
        return null;
    }

    const exact = map.get(normalized);
    if (exact) {
        return exact;
    }

    for (const [key, object] of map.entries()) {
        if (key.includes(normalized) || normalized.includes(key)) {
            return object;
        }
    }

    const aliases = {
        andromeda: "andromeda galaxy",
        triangulum: "triangulum galaxy",
        asteroid: "asteroid belt",
        comet: "comet"
    };

    const alias = aliases[normalized];
    return alias ? map.get(alias) || null : null;
}

function selectObject(object) {
    if (!object?.userData?.celestial) {
        return;
    }

    selectedObject = object;
    const data = object.userData.celestial;

    if (globalThis.selectedStatus) {
        globalThis.selectedStatus.textContent =
            `SELECTED: ${String(data.name).toUpperCase()}`;
    }

    if (globalThis.infoPanel) {
        globalThis.infoPanel.classList.remove("hidden");
    }

    window.dispatchEvent(
        new CustomEvent("universe:objectSelected", {
            detail: { object, data }
        })
    );

    focusObject(object);
}

function performSearch() {
    const input = globalThis.searchInput;
    const resultsContainer = globalThis.searchResults;

    if (!resultsContainer) {
        return;
    }

    const query = input?.value.trim().toLowerCase() || "";
    resultsContainer.replaceChildren();

    if (!query) {
        return;
    }

    const map = globalThis.objectMap;
    const results = [];

    if (map instanceof Map) {
        map.forEach((object, key) => {
            const data = object.userData?.celestial;

            if (data && key.includes(query)) {
                results.push({ object, data });
            }
        });
    }

    if (!results.length) {
        const item = document.createElement("div");
        item.className = "search-result";
        item.textContent = "NO OBJECT FOUND";
        resultsContainer.appendChild(item);
        return;
    }

    for (const result of results.slice(0, 12)) {
        const item = document.createElement("div");
        item.className = "search-result";

        const title = document.createElement("strong");
        title.textContent = result.data.name;

        const subtitle = document.createElement("small");
        subtitle.style.display = "block";
        subtitle.style.marginTop = "3px";
        subtitle.style.opacity = "0.65";
        subtitle.textContent = result.data.type || "OBJECT";

        item.append(title, subtitle);
        item.addEventListener("click", () => {
            selectObject(result.object);
            resultsContainer.replaceChildren();

            if (input) {
                input.value = result.data.name;
            }
        });

        resultsContainer.appendChild(item);
    }
}

globalThis.searchButton?.addEventListener("click", performSearch);

globalThis.searchInput?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        performSearch();
    }
});

// ============================================================
// ANIMAZIONE DELLA CAMERA
// ============================================================

function easeInOutCubic(value) {
    return value < 0.5
        ? 4 * value * value * value
        : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function focusObject(object, duration = 1100) {
    if (!object || !camera || !controls) {
        return;
    }

    const target = new THREE.Vector3();
    object.getWorldPosition(target);

    const data = object.userData?.celestial;
    const radius = Math.max(Number(data?.radius) || 1, 1);
    const type = String(data?.type || "").toLowerCase();

    let distance = radius * 5.5;

    if (type.includes("galaxy")) distance = Math.max(radius
