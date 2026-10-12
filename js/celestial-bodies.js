
/* ============================================================
   UNIVERSE EXPLORER — CELESTIAL BODIES
   File: js/celestial-bodies.js

   Responsabilità esclusiva:
   - Sole e pianeti
   - Texture procedurali
   - Atmosfera terrestre
   - Anelli di Saturno
   - Lune principali
   - Orbite e dati dei corpi celesti

   Non gestisce app.js, telecamera o interfaccia.
   ============================================================ */

import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const PLANETS = [
    {
        name: "Mercury",
        category: "Terrestrial planet",
        radius: 1.2,
        distance: 18,
        color: "#8b8178",
        atmosphere: false,
        roughness: 0.96,
        detail: "A small, rocky world with an ancient cratered surface.",
        facts: ["Closest planet to the Sun", "Almost no atmosphere"]
    },
    {
        name: "Venus",
        category: "Terrestrial planet",
        radius: 2.1,
        distance: 27,
        color: "#d5a56b",
        atmosphere: true,
        roughness: 0.88,
        detail: "A hot world covered by thick clouds of carbon dioxide.",
        facts: ["Extremely dense atmosphere", "Surface temperatures are very high"]
    },
    {
        name: "Earth",
        category: "Terrestrial planet",
        radius: 2.25,
        distance: 38,
        color: "#287cc0",
        atmosphere: true,
        roughness: 0.82,
        detail: "Our home planet, with oceans, continents and a protective atmosphere.",
        facts: ["Liquid water on the surface", "One natural Moon"]
    },
    {
        name: "Mars",
        category: "Terrestrial planet",
        radius: 1.65,
        distance: 51,
        color: "#b95738",
        atmosphere: true,
        roughness: 0.96,
        detail: "A cold, rocky world known for its iron-rich reddish surface.",
        facts: ["Home to Olympus Mons", "Two small natural moons"]
    },
    {
        name: "Jupiter",
        category: "Gas giant",
        radius: 7.1,
        distance: 83,
        color: "#c99f79",
        atmosphere: true,
        roughness: 0.75,
        detail: "The largest planet, with turbulent clouds and enormous storms.",
        facts: ["Largest planet in the Solar System", "Great Red Spot"]
    },
    {
        name: "Saturn",
        category: "Gas giant",
        radius: 6.1,
        distance: 119,
        color: "#d6c18e",
        atmosphere: true,
        rings: true,
        roughness: 0.78,
        detail: "A gas giant famous for its spectacular system of rings.",
        facts: ["Extensive ring system", "Low average density"]
    },
    {
        name: "Uranus",
        category: "Ice giant",
        radius: 3.8,
        distance: 155,
        color: "#87d6df",
        atmosphere: true,
        roughness: 0.8,
        detail: "A pale blue ice giant with an extreme axial tilt.",
        facts: ["Rotates on a strongly tilted axis", "Very cold atmosphere"]
    },
    {
        name: "Neptune",
        category: "Ice giant",
        radius: 3.7,
        distance: 190,
        color: "#3568db",
        atmosphere: true,
        roughness: 0.8,
        detail: "A distant ice giant with powerful winds and a deep blue appearance.",
        facts: ["Far from the Sun", "Extremely fast atmospheric winds"]
    }
];

const MOONS = [
    { name: "Moon", parent: "Earth", distance: 4.2, radius: 0.62, color: "#a9a9a9" },
    { name: "Phobos", parent: "Mars", distance: 2.3, radius: 0.22, color: "#897e72" },
    { name: "Deimos", parent: "Mars", distance: 3.1, radius: 0.15, color: "#a39888" },
    { name: "Io", parent: "Jupiter", distance: 9.2, radius: 0.52, color: "#d8bd68" },
    { name: "Europa", parent: "Jupiter", distance: 11, radius: 0.42, color: "#c8b9a1" },
    { name: "Ganymede", parent: "Jupiter", distance: 13, radius: 0.7, color: "#928679" },
    { name: "Callisto", parent: "Jupiter", distance: 15, radius: 0.62, color: "#62584f" },
    { name: "Titan", parent: "Saturn", distance: 9, radius: 0.62, color: "#c68e4d" },
    { name: "Enceladus", parent: "Saturn", distance: 7.5, radius: 0.3, color: "#d8e5ed" },
    { name: "Titania", parent: "Uranus", distance: 5.8, radius: 0.38, color: "#9e9b95" },
    { name: "Triton", parent: "Neptune", distance: 5.8, radius: 0.4, color: "#c6b8ae" }
];

const BODY_NAME = "universeExplorerBodyData";

/* ------------------------------------------------------------
   PROCEDURAL TEXTURES
   ------------------------------------------------------------ */

function createSurfaceTexture(baseColor, type) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Could not create a canvas for planet textures.");
    }

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const base = new THREE.Color(baseColor);

    // Genera fasce per i giganti e macchie irregolari per i pianeti rocciosi.
    if (["Jupiter", "Saturn", "Uranus", "Neptune"].includes(type)) {
        for (let i = 0; i < 95; i++) {
            const y = Math.random() * canvas.height;
            const height = 2 + Math.random() * 12;
            const lightness = Math.random() > 0.5 ? 1.16 : 0.72;

            const bandColor = base.clone().multiplyScalar(lightness);

            ctx.globalAlpha = 0.12 + Math.random() * 0.2;
            ctx.fillStyle = `#${bandColor.getHexString()}`;
            ctx.fillRect(0, y, canvas.width, height);
        }

        // Variazioni atmosferiche allungate.
        for (let i = 0; i < 350; i++) {
            ctx.globalAlpha = 0.08 + Math.random() * 0.13;
            ctx.fillStyle = Math.random() > 0.5 ? "#ffffff" : "#17151b";

            ctx.beginPath();
            ctx.ellipse(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                3 + Math.random() * 35,
                1 + Math.random() * 4,
                0,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        // Grande tempesta visibile su Giove.
        if (type === "Jupiter") {
            ctx.globalAlpha = 0.75;
            ctx.fillStyle = "#a95738";
            ctx.beginPath();
            ctx.ellipse(690, 300, 65, 27, -0.1, 0, Math.PI * 2);
            ctx.fill();

            ctx.globalAlpha = 0.4;
            ctx.strokeStyle = "#f1c4a0";
            ctx.lineWidth = 7;

            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.ellipse(
                    690,
                    300,
                    25 + i * 12,
                    10 + i * 5,
                    -0.1,
                    0,
                    Math.PI * 2
                );
                ctx.stroke();
            }
        }
    } else {
        // Terreni irregolari, macchie e variazioni di colore.
        for (let i = 0; i < 14000; i++) {
            const brightness = 0.58 + Math.random() * 0.8;
            const color = base.clone().multiplyScalar(brightness);

            ctx.globalAlpha = 0.08 + Math.random() * 0.32;
            ctx.fillStyle = `#${color.getHexString()}`;

            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const r = 1 + Math.random() * 8;

            ctx.beginPath();
            ctx.ellipse(
                x, y,
                r * (1 + Math.random() * 3),
                r,
                Math.random() * Math.PI,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        // Continenti stilizzati per la Terra.
        if (type === "Earth") {
            ctx.globalAlpha = 0.88;
            ctx.fillStyle = "#4c9b61";

            const continents = [
                [250, 170, 75, 45],
                [330, 300, 45, 85],
                [520, 170, 95, 55],
                [600, 300, 55, 75],
                [790, 190, 45, 30]
            ];

            for (const [x, y, rx, ry] of continents) {
                ctx.beginPath();
                ctx.ellipse(x, y, rx, ry, Math.random(), 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalAlpha = 0.2;
            ctx.fillStyle = "#ffffff";

            for (let i = 0; i < 250; i++) {
                ctx.beginPath();
                ctx.ellipse(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height,
                    4 + Math.random() * 20,
                    1 + Math.random() * 4,
                    0,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }
    }

    ctx.globalAlpha = 1;

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;

    return texture;
}

/* ------------------------------------------------------------
   SUN
   ------------------------------------------------------------ */

function createSun() {
    const group = new THREE.Group();
    group.name = "Sun";

    const geometry = new THREE.SphereGeometry(9, 96, 64);

    const material = new THREE.MeshBasicMaterial({
        color: 0xffc45c,
        map: createSunTexture(),
        toneMapped: false
    });

    const sun = new THREE.Mesh(geometry, material);
    sun.name = "SunSurface";
    sun.userData[BODY_NAME] = {
        name: "Sun",
        category: "Star",
        description: "The star at the center of our Solar System.",
        facts: [
            "Produces energy through nuclear fusion",
            "Its light takes about 8 minutes to reach Earth"
        ]
    };

    group.add(sun);

    const glowMaterial = new THREE.SpriteMaterial({
        map: createGlowTexture(),
        color: 0xffa83b,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false
    });

    const glow = new THREE.Sprite(glowMaterial);
    glow.scale.set(38, 38, 1);
    glow.name = "SunGlow";
    group.add(glow);

    return group;
}

function createSunTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not create Sun texture.");

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#ff9e36");
    gradient.addColorStop(0.45, "#fff2a0");
    gradient.addColorStop(1, "#ffb13d");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 18000; i++) {
        ctx.globalAlpha = Math.random() * 0.32;
        ctx.fillStyle = Math.random() > 0.5 ? "#ffffff" : "#e85b17";

        ctx.beginPath();
        ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            1 + Math.random() * 5,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    ctx.globalAlpha = 1;

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

function createGlowTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not create glow texture.");

    const gradient = ctx.createRadialGradient(64, 64, 2, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255,245,200,1)");
    gradient.addColorStop(0.18, "rgba(255,190,70,0.65)");
    gradient.addColorStop(0.48, "rgba(255,120,30,0.2)");
    gradient.addColorStop(1, "rgba(255,90,20,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    return new THREE.CanvasTexture(canvas);
}

/* ------------------------------------------------------------
   PLANET ATMOSPHERES
   ------------------------------------------------------------ */

function createAtmosphere(radius, color, opacity = 0.15) {
    const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(radius * 1.045, 48, 32),
        material
    );

    atmosphere.name = "Atmosphere";
    return atmosphere;
}

/* ------------------------------------------------------------
   SATURN RINGS
   ------------------------------------------------------------ */

function createSaturnRings(radius) {
    const group = new THREE.Group();
    group.name = "SaturnRings";

    const ringGeometry = new THREE.RingGeometry(
        radius * 1.35,
        radius * 2.35,
        160
    );

    // RingGeometry parte nel piano XY.
    const positions = ringGeometry.attributes.position;
    const colors = [];

    const inner = radius * 1.35;
    const outer = radius * 2.35;

    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const distance = Math.sqrt(x * x + y * y);

        const t = (distance - inner) / (outer - inner);
        const variation = 0.55 + 0.35 * Math.sin(t * 150);

        colors.push(
            variation * 1.0,
            variation * 0.87,
            variation * 0.64
        );
    }

    ringGeometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3)
    );

    const ringMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        vertexColors: true,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.88,
        roughness: 1,
        metalness: 0,
        depthWrite: false
    });

    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
    rings.rotation.x = -Math.PI / 2.35;
    rings.name = "SaturnRingMesh";

    group.add(rings);
    return group;
}

/* ------------------------------------------------------------
   PLANET CREATION
   ------------------------------------------------------------ */

function createPlanet(data) {
    const group = new THREE.Group();
    group.name = data.name;
    group.position.x = data.distance;

    const geometry = new THREE.SphereGeometry(
        data.radius,
        64,
        48
    );

    const texture = createSurfaceTexture(data.color, data.name);

    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: texture,
        roughness: data.roughness,
        metalness: 0
    });

    const planet = new THREE.Mesh(geometry, material);
    planet.name = `${data.name}Surface`;
    planet.castShadow = true;
    planet.receiveShadow = true;

    planet.userData[BODY_NAME] = {
        name: data.name,
        category: data.category,
        description: data.detail,
        facts: data.facts,
        radius: data.radius,
        distanceFromSun: data.distance
    };

    group.add(planet);

    if (data.atmosphere) {
        const atmosphereColor =
            data.name === "Earth" ? 0x4caaff :
            data.name === "Venus" ? 0xe8b56c :
            data.name === "Mars" ? 0xd96b49 :
            data.name === "Uranus" ? 0x8beaff :
            data.name === "Neptune" ? 0x467bff :
            0xd7c9a8;

        const atmosphere = createAtmosphere(
            data.radius,
            atmosphereColor,
            data.name === "Earth" ? 0.2 : 0.09
        );

        atmosphere.name = `${data.name}Atmosphere`;
        group.add(atmosphere);
    }

    if (data.rings) {
        group.add(createSaturnRings(data.radius));
    }

    return group;
}

/* ------------------------------------------------------------
   ORBIT PATHS
   ------------------------------------------------------------ */

function createOrbit(distance) {
    const points = [];
    const segments = 256;

    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;

        points.push(
            new THREE.Vector3(
                Math.cos(angle) * distance,
                0,
                Math.sin(angle) * distance
            )
        );
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({
        color: 0x7f91ba,
        transparent: true,
        opacity: 0.26,
        depthWrite: false
    });

    const orbit = new THREE.LineLoop(geometry, material);
    orbit.name = `Orbit-${distance}`;

    return orbit;
}

/* ------------------------------------------------------------
   MOONS
   ------------------------------------------------------------ */

function createMoon(data) {
    const geometry = new THREE.SphereGeometry(
        data.radius,
        32,
        24
    );

    const material = new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: 0.96
    });

    const moon = new THREE.Mesh(geometry, material);

    moon.name = data.name;
    moon.userData[BODY_NAME] = {
        name: data.name,
        category: "Natural satellite",
        description: `A natural satellite orbiting ${data.parent}.`,
        facts: [`Orbits ${data.parent}`]
    };

    moon.castShadow = true;
    moon.receiveShadow = true;

    return moon;
}

/* ------------------------------------------------------------
   PUBLIC API
   ------------------------------------------------------------ */

/**
 * Crea il Sistema Solare dentro la scena esistente.
 *
 * @param {THREE.Scene} scene
 * @param {Object} options
 * @returns {Object} Riferimenti e controlli dei corpi celesti.
 */
export function createCelestialBodies(scene, options = {}) {
    if (!scene?.isScene) {
        throw new Error(
            "createCelestialBodies() requires a valid THREE.Scene."
        );
    }

    const root = new THREE.Group();
    root.name = "SolarSystem";

    const sun = createSun();
    root.add(sun);

    const planets = new Map();
    const moons = new Map();
    const orbitGroup = new THREE.Group();
    orbitGroup.name = "PlanetaryOrbits";

    for (const data of PLANETS) {
        const planet = createPlanet(data);

        planets.set(data.name, planet);
        root.add(planet);

        orbitGroup.add(createOrbit(data.distance));
    }

    root.add(orbitGroup);

    for (const data of MOONS) {
        const parent = planets.get(data.parent);

        if (!parent) continue;

        const moon = createMoon(data);
        moon.position.set(data.distance, 0, 0);

        const moonPivot = new THREE.Group();
        moonPivot.name = `${data.name}OrbitPivot`;
        moonPivot.add(moon);

        parent.add(moonPivot);
        moons.set(data.name, moonPivot);
    }

    scene.add(root);

    let disposed = false;
    let orbitsVisible = options.showOrbits !== false;

    orbitGroup.visible = orbitsVisible;

    function update(deltaSeconds) {
        if (disposed) return;

        const delta = Math.min(Math.max(deltaSeconds || 0, 0), 0.05);

        sun.rotation.y += delta * 0.025;

        for (const [name, planet] of planets) {
            planet.rotation.y +=
                delta * (name === "Jupiter" ? 0.15 : 0.25);
        }

        for (const [name, moonPivot] of moons) {
            moonPivot.rotation.y +=
                delta * (name === "Moon" ? 0.35 : 0.2);
        }
    }

    function setOrbitsVisible(visible) {
        if (disposed) return;

        orbitsVisible = Boolean(visible);
        orbitGroup.visible = orbitsVisible;
    }

    function getBody(name) {
        if (name === "Sun") return sun;

        return planets.get(name) || moons.get(name) || null;
    }

    function getCatalog() {
        return [
            {
                name: "Sun",
                category: "Star",
                description: "The star at the center of our Solar System."
            },
            ...PLANETS.map(planet => ({
                name: planet.name,
                category: planet.category,
                description: planet.detail
            })),
            ...MOONS.map(moon => ({
                name: moon.name,
                category: "Natural satellite",
                description: `A natural satellite orbiting ${moon.parent}.`
            }))
        ];
    }

    function dispose() {
        if (disposed) return;

        disposed = true;
        scene.remove(root);

        root.traverse(object => {
            object.geometry?.dispose();

            if (object.material) {
                const materials = Array.isArray(object.material)
                    ? object.material
                    : [object.material];

                for (const material of materials) {
                    material.map?.dispose();
                    material.dispose();
                }
            }
        });

        planets.clear();
        moons.clear();
    }

    return {
        root,
        sun,
        planets,
        moons,
        update,
        getBody,
        getCatalog,
        setOrbitsVisible,
        dispose
    };
}
