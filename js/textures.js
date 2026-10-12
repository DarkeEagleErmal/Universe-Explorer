
/* ============================================================
   UNIVERSE EXPLORER — TEXTURE ENGINE
   File: js/textures.js

   RESPONSABILITÀ:
   - Texture procedurali dei pianeti
   - Superficie del Sole
   - Texture delle lune
   - Texture degli anelli
   - Bagliore del Sole
   - Gestione delle texture generate

   NON crea corpi celesti, luci o interfaccia.
   ============================================================ */

import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const CONFIG = Object.freeze({
    width: 1024,
    height: 512,
    sunSize: 1024,
    glowSize: 256,
    ringSize: 1024
});

const textureCache = new Map();

function createCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Unable to create a texture canvas.");
    }

    return { canvas, context };
}

function createTexture(canvas, name) {
    const texture = new THREE.CanvasTexture(canvas);

    texture.name = name;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    return texture;
}

function seededRandom(seed) {
    let value = seed >>> 0;

    return function () {
        value = (value * 1664525 + 1013904223) >>> 0;
        return value / 4294967296;
    };
}

function colorToHex(color) {
    return new THREE.Color(color).getHexString();
}

/* ============================================================
   PLANET SURFACES
   ============================================================ */

function drawRockySurface(context, baseColor, random, type) {
    const base = new THREE.Color(baseColor);

    context.fillStyle = baseColor;
    context.fillRect(0, 0, CONFIG.width, CONFIG.height);

    // Variazioni di colore distribuite sulla superficie.
    for (let i = 0; i < 18000; i++) {
        const brightness = 0.58 + random() * 0.8;
        const color = base.clone().multiplyScalar(brightness);
        const radius = 1 + random() * 5;

        context.globalAlpha = 0.06 + random() * 0.24;
        context.fillStyle = `#${colorToHex(color)}`;

        context.beginPath();
        context.ellipse(
            random() * CONFIG.width,
            random() * CONFIG.height,
            radius * (1 + random() * 2.5),
            radius,
            random() * Math.PI,
            0,
            Math.PI * 2
        );
        context.fill();
    }

    // Crateri procedurali per i corpi rocciosi.
    if (["Mercury", "Moon", "Mars"].includes(type)) {
        for (let i = 0; i < 700; i++) {
            const x = random() * CONFIG.width;
            const y = random() * CONFIG.height;
            const radius = 2 + random() * 15;

            context.globalAlpha = 0.12 + random() * 0.25;
            context.fillStyle = "#211d1a";

            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2);
            context.fill();

            context.globalAlpha = 0.1;
            context.strokeStyle = "#ffffff";
            context.lineWidth = 1.5;

            context.beginPath();
            context.arc(
                x - radius * 0.12,
                y - radius * 0.12,
                radius * 0.82,
                Math.PI,
                Math.PI * 1.8
            );
            context.stroke();
        }
    }

    context.globalAlpha = 1;
}

function drawEarthSurface(context, random) {
    // Oceani.
    const ocean = context.createLinearGradient(
        0, 0, CONFIG.width, CONFIG.height
    );

    ocean.addColorStop(0, "#12538d");
    ocean.addColorStop(0.5, "#247eb8");
    ocean.addColorStop(1, "#092f68");

    context.fillStyle = ocean;
    context.fillRect(0, 0, CONFIG.width, CONFIG.height);

    // Continenti stilizzati: base visiva procedurale.
    const continents = [
        [220, 145, 90, 48],
        [295, 220, 55, 95],
        [465, 145, 110, 60],
        [530, 255, 65, 85],
        [680, 155, 105, 52],
        [810, 225, 55, 34],
        [920, 325, 35, 45]
    ];

    context.fillStyle = "#498957";

    for (const [x, y, rx, ry] of continents) {
        context.beginPath();
        context.ellipse(
            x, y, rx, ry, random() * 0.6, 0, Math.PI * 2
        );
        context.fill();
    }

    // Variazioni verdi e desertiche.
    for (let i = 0; i < 1600; i++) {
        context.globalAlpha = 0.08 + random() * 0.2;
        context.fillStyle = random() > 0.65 ? "#d2b16c" : "#8ab86d";

        context.beginPath();
        context.ellipse(
            random() * CONFIG.width,
            random() * CONFIG.height,
            2 + random() * 12,
            1 + random() * 6,
            random() * Math.PI,
            0,
            Math.PI * 2
        );
        context.fill();
    }

    // Nuvole.
    for (let i = 0; i < 1400; i++) {
        context.globalAlpha = 0.05 + random() * 0.18;
        context.fillStyle = "#ffffff";

        context.beginPath();
        context.ellipse(
            random() * CONFIG.width,
            random() * CONFIG.height,
            3 + random() * 25,
            1 + random() * 4,
            0,
            0,
            Math.PI * 2
        );
        context.fill();
    }

    context.globalAlpha = 1;
}

function drawGasGiant(context, baseColor, random, type) {
    const base = new THREE.Color(baseColor);

    context.fillStyle = baseColor;
    context.fillRect(0, 0, CONFIG.width, CONFIG.height);

    const bandCount = type === "Jupiter" ? 95 : 65;

    // Fasce atmosferiche orizzontali.
    for (let i = 0; i < bandCount; i++) {
        const y = random() * CONFIG.height;
        const height = 2 + random() * 12;
        const brightness = random() > 0.5 ? 1.18 : 0.72;

        context.globalAlpha = 0.1 + random() * 0.24;
        context.fillStyle =
            `#${colorToHex(base.clone().multiplyScalar(brightness))}`;

        context.fillRect(0, y, CONFIG.width, height);
    }

    // Turbolenze e dettagli atmosferici.
    for (let i = 0; i < 1800; i++) {
        context.globalAlpha = 0.06 + random() * 0.14;
        context.fillStyle = random() > 0.5 ? "#ffffff" : "#201b23";

        context.beginPath();
        context.ellipse(
            random() * CONFIG.width,
            random() * CONFIG.height,
            4 + random() * 35,
            1 + random() * 5,
            0,
            0,
            Math.PI * 2
        );
        context.fill();
    }

    // Grande tempesta di Giove.
    if (type === "Jupiter") {
        context.globalAlpha = 0.8;
        context.fillStyle = "#a95035";

        context.beginPath();
        context.ellipse(690, 300, 56, 24, -0.1, 0, Math.PI * 2);
        context.fill();

        context.globalAlpha = 0.45;
        context.strokeStyle = "#f4c5a0";
        context.lineWidth = 5;

        for (let i = 0; i < 4; i++) {
            context.beginPath();
            context.ellipse(
                690, 300,
                18 + i * 12,
                8 + i * 4,
                -0.1,
                0,
                Math.PI * 2
            );
            context.stroke();
        }
    }

    context.globalAlpha = 1;
}

/**
 * Genera una texture procedurale per la superficie di un corpo.
 *
 * @param {Object} options
 * @param {string} options.name Nome del corpo celeste.
 * @param {string|number} options.color Colore di base.
 * @param {number} [options.seed=1] Seme per risultati ripetibili.
 */
export function createPlanetTexture({
    name = "Planet",
    color = "#71849b",
    seed = 1
} = {}) {
    const cacheKey = `${name}:${color}:${seed}`;

    if (textureCache.has(cacheKey)) {
        return textureCache.get(cacheKey);
    }

    const { canvas, context } = createCanvas(
        CONFIG.width,
        CONFIG.height
    );

    const random = seededRandom(seed);
    const baseColor = typeof color === "number"
        ? `#${colorToHex(color)}`
        : color;

    if (name === "Earth") {
        drawEarthSurface(context, random);
    } else if (
        ["Jupiter", "Saturn", "Uranus", "Neptune"].includes(name)
    ) {
        drawGasGiant(context, baseColor, random, name);
    } else {
        drawRockySurface(context, baseColor, random, name);
    }

    const texture = createTexture(canvas, `${name}-Surface`);
    textureCache.set(cacheKey, texture);

    return texture;
}

/* ============================================================
   SUN SURFACE
   ============================================================ */

export function createSunTexture(seed = 42) {
    const { canvas, context } = createCanvas(
        CONFIG.sunSize,
        CONFIG.sunSize / 2
    );

    const random = seededRandom(seed);

    const gradient = context.createLinearGradient(
        0, 0, 0, canvas.height
    );

    gradient.addColorStop(0, "#ff8d2b");
    gradient.addColorStop(0.35, "#ffd45e");
    gradient.addColorStop(0.65, "#fff0a1");
    gradient.addColorStop(1, "#ff9a2e");

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Granulazione solare stilizzata.
    for (let i = 0; i < 24000; i++) {
        context.globalAlpha = 0.05 + random() * 0.3;
        context.fillStyle = random() > 0.48 ? "#fff7c7" : "#e65c19";

        context.beginPath();
        context.arc(
            random() * canvas.width,
            random() * canvas.height,
            1 + random() * 5,
            0,
            Math.PI * 2
        );
        context.fill();
    }

    context.globalAlpha = 1;

    return createTexture(canvas, "Sun-Photosphere");
}

/* ============================================================
   SUN GLOW
   ============================================================ */

export function createSunGlowTexture() {
    const { canvas, context } = createCanvas(
        CONFIG.glowSize,
        CONFIG.glowSize
    );

    const center = CONFIG.glowSize / 2;

    const gradient = context.createRadialGradient(
        center, center, 2,
        center, center, center
    );

    gradient.addColorStop(0, "rgba(255,248,210,1)");
    gradient.addColorStop(0.12, "rgba(255,202,95,0.9)");
    gradient.addColorStop(0.32, "rgba(255,135,35,0.35)");
    gradient.addColorStop(0.65, "rgba(255,85,20,0.08)");
    gradient.addColorStop(1, "rgba(255,70,10,0)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    return createTexture(canvas, "Sun-Glow");
}

/* ============================================================
   SATURN RINGS
   ============================================================ */

export function createRingTexture(seed = 17) {
    const { canvas, context } = createCanvas(
        CONFIG.ringSize,
        64
    );

    const random = seededRandom(seed);
    const gradient = context.createLinearGradient(
        0, 0, 0, canvas.height
    );

    gradient.addColorStop(0, "#7e694b");
    gradient.addColorStop(0.5, "#d4c29a");
    gradient.addColorStop(1, "#66523c");

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Divisioni radiali e bande degli anelli.
    for (let i = 0; i < 220; i++) {
        const x = random() * canvas.width;
        const width = 1 + random() * 5;

        context.globalAlpha = 0.12 + random() * 0.45;
        context.fillStyle = random() > 0.5 ? "#f1e5c6" : "#30271e";

        context.fillRect(x, 0, width, canvas.height);
    }

    context.globalAlpha = 1;

    return createTexture(canvas, "Saturn-Rings");
}

/* ============================================================
   RESOURCE MANAGEMENT
   ============================================================ */

/**
 * Libera le texture create da questo modulo.
 * Chiamare soltanto quando non sono più utilizzate nella scena.
 */
export function disposeGeneratedTextures() {
    for (const texture of textureCache.values()) {
        texture.dispose();
    }

    textureCache.clear();
}
