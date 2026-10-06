// ============================================================
// CELESTIAL BODIES
// Pianeti, lune, Sole e orbite di Universe Explorer
// ============================================================

import * as THREE from "three";

// ------------------------------------------------------------
// UTILITÀ
// ------------------------------------------------------------

function seededRandom(seed) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function createCanvasTexture(width, height, drawFunction) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    drawFunction(ctx, width, height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    return texture;
}

// ------------------------------------------------------------
// TEXTURE MERCURIO
// ------------------------------------------------------------

function createMercuryTexture() {
    return createCanvasTexture(1024, 512, (ctx, w, h) => {
        const image = ctx.createImageData(w, h);

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const index = (y * w + x) * 4;

                let noise =
                    seededRandom(x * 0.17 + y * 0.31) * 35 +
                    seededRandom(x * 0.071 + y * 0.113) * 20;

                let value = 105 + noise;

                image.data[index] = value;
                image.data[index + 1] = value * 0.96;
                image.data[index + 2] = value * 0.90;
                image.data[index + 3] = 255;
            }
        }

        ctx.putImageData(image, 0, 0);

        // Crateri
        for (let i = 0; i < 160; i++) {
            const x = seededRandom(i * 4.1) * w;
            const y = seededRandom(i * 7.3) * h;
            const radius = 2 + seededRandom(i * 2.7) * 15;

            const gradient = ctx.createRadialGradient(
                x - radius * 0.25,
                y - radius * 0.25,
                radius * 0.1,
                x,
                y,
                radius
            );

            gradient.addColorStop(0, "rgba(190,190,180,0.8)");
            gradient.addColorStop(0.65, "rgba(90,90,85,0.6)");
            gradient.addColorStop(1, "rgba(30,30,30,0)");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// ------------------------------------------------------------
// TEXTURE VENERE
// ------------------------------------------------------------

function createVenusTexture() {
    return createCanvasTexture(1024, 512, (ctx, w, h) => {
        ctx.fillStyle = "#c9a66b";
        ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < 120; i++) {
            const y = (i / 120) * h;
            const height = 3 + seededRandom(i * 4) * 18;

            const gradient = ctx.createLinearGradient(0, y, w, y + height);
            gradient.addColorStop(0, "rgba(255,220,150,0.05)");
            gradient.addColorStop(
                0.5,
                `rgba(115,75,35,${0.08 + seededRandom(i) * 0.15})`
            );
            gradient.addColorStop(1, "rgba(255,235,180,0.03)");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, y, w, height);
        }

        // Nuvole atmosferiche
        for (let i = 0; i < 70; i++) {
            const x = seededRandom(i * 5.1) * w;
            const y = seededRandom(i * 2.3) * h;
            const rx = 20 + seededRandom(i * 7) * 100;

            ctx.fillStyle = `rgba(255,235,180,${
                0.08 + seededRandom(i * 8) * 0.15
            })`;

            ctx.beginPath();
            ctx.ellipse(x, y, rx, 8 + seededRandom(i) * 15, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// ------------------------------------------------------------
// TEXTURE TERRA
// ------------------------------------------------------------

function createEarthTexture() {
    return createCanvasTexture(2048, 1024, (ctx, w, h) => {
        const image = ctx.createImageData(w, h);

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const index = (y * w + x) * 4;

                const n =
                    seededRandom(x * 0.011 + y * 0.017) +
                    seededRandom(x * 0.031 + y * 0.043) * 0.5;

                const ocean = clamp(0.35 + n * 0.15, 0, 1);

                image.data[index] = 8 + ocean * 8;
                image.data[index + 1] = 55 + ocean * 55;
                image.data[index + 2] = 105 + ocean * 100;
                image.data[index + 3] = 255;
            }
        }

        ctx.putImageData(image, 0, 0);

        // Continenti stilizzati
        const continents = [
            [0.28, 0.32, 0.15, 0.12],
            [0.48, 0.28, 0.12, 0.18],
            [0.68, 0.38, 0.14, 0.10],
            [0.74, 0.68, 0.12, 0.16],
            [0.38, 0.70, 0.08, 0.18],
            [0.58, 0.58, 0.16, 0.09],
            [0.16, 0.55, 0.09, 0.16]
        ];

        continents.forEach((c, index) => {
            const x = c[0] * w;
            const y = c[1] * h;
            const rx = c[2] * w;
            const ry = c[3] * h;

            ctx.fillStyle = index % 2 === 0
                ? "#46783d"
                : "#5f7d3e";

            ctx.beginPath();

            for (let a = 0; a <= Math.PI * 2; a += 0.2) {
                const variation =
                    0.75 +
                    seededRandom(index * 100 + Math.floor(a * 20)) * 0.5;

                const px = x + Math.cos(a) * rx * variation;
                const py = y + Math.sin(a) * ry * variation;

                if (a === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }

            ctx.closePath();
            ctx.fill();

            // Zone desertiche
            ctx.fillStyle = "rgba(155,125,65,0.55)";
            ctx.beginPath();
            ctx.ellipse(
                x + rx * 0.15,
                y - ry * 0.1,
                rx * 0.25,
                ry * 0.20,
                0,
                0,
                Math.PI * 2
            );
            ctx.fill();
        });

        // Ghiacci polari
        ctx.fillStyle = "rgba(245,250,255,0.95)";
        ctx.fillRect(0, 0, w, h * 0.035);
        ctx.fillRect(0, h * 0.965, w, h * 0.035);
    });
}

// ------------------------------------------------------------
// NUVOLE DELLA TERRA
// ------------------------------------------------------------

function createEarthCloudTexture() {
    return createCanvasTexture(2048, 1024, (ctx, w, h) => {
        ctx.clearRect(0, 0, w, h);

        for (let i = 0; i < 230; i++) {
            const x = seededRandom(i * 2.31) * w;
            const y = seededRandom(i * 4.77) * h;

            const width = 15 + seededRandom(i * 3.7) * 90;
            const height = 2 + seededRandom(i * 5.1) * 14;

            ctx.fillStyle = `rgba(255,255,255,${
                0.10 + seededRandom(i * 8.2) * 0.30
            })`;

            ctx.beginPath();
            ctx.ellipse(
                x,
                y,
                width,
                height,
                seededRandom(i) * Math.PI,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    });
}

// ------------------------------------------------------------
// TEXTURE MARTE
// ------------------------------------------------------------

function createMarsTexture() {
    return createCanvasTexture(1024, 512, (ctx, w, h) => {
        ctx.fillStyle = "#9e3e25";
        ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < 1000; i++) {
            const x = seededRandom(i * 2.7) * w;
            const y = seededRandom(i * 4.1) * h;
            const size = 1 + seededRandom(i * 6.3) * 12;

            ctx.fillStyle = `rgba(${
                70 + seededRandom(i) * 80
            }, ${
                20 + seededRandom(i * 2) * 50
            }, ${
                12 + seededRandom(i * 3) * 30
            },0.3)`;

            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }

        // Calotte polari
        ctx.fillStyle = "rgba(240,235,220,0.9)";
        ctx.fillRect(0, 0, w, h * 0.025);
        ctx.fillRect(0, h * 0.975, w, h * 0.025);
    });
}
// ============================================================
// TEXTURE GIGANTI GASSOSI
// ============================================================

// ------------------------------------------------------------
// GIOVE
// ------------------------------------------------------------

function createJupiterTexture() {
    return createCanvasTexture(2048, 1024, (ctx, w, h) => {
        const bands = [
            "#b98d68",
            "#e2c09a",
            "#8e6047",
            "#d9b58c",
            "#f0d4aa",
            "#9b7050",
            "#d6ae82",
            "#82553e"
        ];

        for (let i = 0; i < bands.length; i++) {
            const y = (i / bands.length) * h;
            const height = h / bands.length + 10;

            ctx.fillStyle = bands[i];
            ctx.fillRect(0, y, w, height);
        }

        // Turbolenze
        for (let i = 0; i < 180; i++) {
            const x = seededRandom(i * 4.2) * w;
            const y = seededRandom(i * 7.1) * h;

            ctx.fillStyle = `rgba(255,255,255,${
                0.03 + seededRandom(i) * 0.10
            })`;

            ctx.beginPath();
            ctx.ellipse(
                x,
                y,
                20 + seededRandom(i * 3) * 80,
                3 + seededRandom(i * 5) * 14,
                0,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        // Grande Macchia Rossa
        ctx.fillStyle = "#a84f36";
        ctx.beginPath();
        ctx.ellipse(
            w * 0.69,
            h * 0.63,
            w * 0.095,
            h * 0.045,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.strokeStyle = "rgba(255,210,170,0.4)";
        ctx.lineWidth = 8;
        ctx.stroke();
    });
}

// ------------------------------------------------------------
// SATURNO
// ------------------------------------------------------------

function createSaturnTexture() {
    return createCanvasTexture(1024, 512, (ctx, w, h) => {
        const bands = [
            "#d7c09b",
            "#b99f78",
            "#e5d2ae",
            "#a88f6d",
            "#d4bb92",
            "#f0dbb5"
        ];

        for (let i = 0; i < bands.length; i++) {
            const y = (i / bands.length) * h;

            ctx.fillStyle = bands[i];
            ctx.fillRect(0, y, w, h / bands.length + 3);
        }

        for (let i = 0; i < 80; i++) {
            const y = seededRandom(i * 3.4) * h;

            ctx.strokeStyle = `rgba(100,80,55,${
                0.05 + seededRandom(i) * 0.12
            })`;

            ctx.lineWidth = 1 + seededRandom(i * 2);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y + (seededRandom(i * 5) - 0.5) * 20);
            ctx.stroke();
        }
    });
}

// ------------------------------------------------------------
// URANO
// ------------------------------------------------------------

function createUranusTexture() {
    return createCanvasTexture(1024, 512, (ctx, w, h) => {
        ctx.fillStyle = "#75cbd1";
        ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < 50; i++) {
            const y = seededRandom(i * 4.2) * h;

            ctx.fillStyle = `rgba(210,255,255,${
                0.03 + seededRandom(i) * 0.10
            })`;

            ctx.fillRect(0, y, w, 2 + seededRandom(i * 2) * 8);
        }
    });
}

// ------------------------------------------------------------
// NETTUNO
// ------------------------------------------------------------

function createNeptuneTexture() {
    return createCanvasTexture(1024, 512, (ctx, w, h) => {
        ctx.fillStyle = "#2456a6";
        ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < 80; i++) {
            const y = seededRandom(i * 3.2) * h;

            ctx.fillStyle = `rgba(120,190,255,${
                0.04 + seededRandom(i * 2) * 0.12
            })`;

            ctx.fillRect(0, y, w, 2 + seededRandom(i) * 8);
        }

        // Tempeste
        for (let i = 0; i < 12; i++) {
            const x = seededRandom(i * 5) * w;
            const y = seededRandom(i * 8) * h;

            ctx.fillStyle = "rgba(20,35,80,0.5)";
            ctx.beginPath();
            ctx.ellipse(
                x,
                y,
                20 + seededRandom(i) * 60,
                8 + seededRandom(i * 2) * 20,
                0,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    });
}

// ------------------------------------------------------------
// LUNA
// ------------------------------------------------------------

function createMoonTexture() {
    return createCanvasTexture(1024, 512, (ctx, w, h) => {
        ctx.fillStyle = "#a9a9a5";
        ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < 350; i++) {
            const x = seededRandom(i * 3.2) * w;
            const y = seededRandom(i * 7.4) * h;
            const radius = 1 + seededRandom(i * 2.1) * 18;

            ctx.fillStyle = `rgba(45,45,45,${
                0.15 + seededRandom(i * 5) * 0.35
            })`;

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "rgba(220,220,215,0.25)";
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.arc(x - radius * 0.2, y - radius * 0.2, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    });
}

// ------------------------------------------------------------
// PLUTONE
// ------------------------------------------------------------

function createPlutoTexture() {
    return createCanvasTexture(1024, 512, (ctx, w, h) => {
        ctx.fillStyle = "#a88d78";
        ctx.fillRect(0, 0, w, h);

        // Cuore di Plutone
        ctx.fillStyle = "#e2d3c1";
        ctx.beginPath();
        ctx.ellipse(
            w * 0.54,
            h * 0.43,
            w * 0.18,
            h * 0.14,
            -0.15,
            0,
            Math.PI * 2
        );
        ctx.fill();

        for (let i = 0; i < 80; i++) {
            const x = seededRandom(i * 4.4) * w;
            const y = seededRandom(i * 8.1) * h;

            ctx.fillStyle = `rgba(65,45,40,${
                0.08 + seededRandom(i) * 0.18
            })`;

            ctx.beginPath();
            ctx.arc(x, y, 2 + seededRandom(i * 3) * 12, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// ------------------------------------------------------------
// SOLE
// ------------------------------------------------------------

function createSunTexture() {
    return createCanvasTexture(2048, 1024, (ctx, w, h) => {
        const gradient = ctx.createRadialGradient(
            w * 0.5,
            h * 0.5,
            0,
            w * 0.5,
            h * 0.5,
            w * 0.7
        );

        gradient.addColorStop(0, "#fff9c4");
        gradient.addColorStop(0.3, "#ffd54a");
        gradient.addColorStop(0.7, "#ff9f1a");
        gradient.addColorStop(1, "#d94a00");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Granulazione solare
        for (let i = 0; i < 5000; i++) {
            const x = seededRandom(i * 1.7) * w;
            const y = seededRandom(i * 3.1) * h;
            const size = 1 + seededRandom(i * 5) * 5;

            ctx.fillStyle = `rgba(255,245,150,${
                0.04 + seededRandom(i * 8) * 0.16
            })`;

            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// ------------------------------------------------------------
// TEXTURE GENERICA
// ------------------------------------------------------------

function createGenericTexture(color) {
    return createCanvasTexture(512, 256, (ctx, w, h) => {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < 400; i++) {
            const x = seededRandom(i * 2.3) * w;
            const y = seededRandom(i * 5.1) * h;

            ctx.fillStyle = `rgba(255,255,255,${
                seededRandom(i * 8) * 0.08
            })`;

            ctx.fillRect(x, y, 1 + seededRandom(i) * 5, 1 + seededRandom(i * 2));
        }
    });
          }
// ============================================================
// CREAZIONE DEI CORPI CELESTI
// ============================================================

const BODY_DATA = {

    Sun: {
        radius: 5.5,
        texture: createSunTexture,
        emissive: 0xffaa22,
        emissiveIntensity: 1.8,
        roughness: 0.4,
        metalness: 0
    },

    Mercury: {
        radius: 0.45,
        texture: createMercuryTexture,
        roughness: 0.9,
        metalness: 0
    },

    Venus: {
        radius: 0.85,
        texture: createVenusTexture,
        roughness: 0.8,
        metalness: 0
    },

    Earth: {
        radius: 0.95,
        texture: createEarthTexture,
        roughness: 0.65,
        metalness: 0
    },

    Mars: {
        radius: 0.65,
        texture: createMarsTexture,
        roughness: 0.9,
        metalness: 0
    },

    Jupiter: {
        radius: 2.5,
        texture: createJupiterTexture,
        roughness: 0.8,
        metalness: 0
    },

    Saturn: {
        radius: 2.15,
        texture: createSaturnTexture,
        roughness: 0.75,
        metalness: 0
    },

    Uranus: {
        radius: 1.45,
        texture: createUranusTexture,
        roughness: 0.8,
        metalness: 0
    },

    Neptune: {
        radius: 1.4,
        texture: createNeptuneTexture,
        roughness: 0.8,
        metalness: 0
    },

    Moon: {
        radius: 0.28,
        texture: createMoonTexture,
        roughness: 1,
        metalness: 0
    },

    Pluto: {
        radius: 0.30,
        texture: createPlutoTexture,
        roughness: 0.95,
        metalness: 0
    }
};

// ------------------------------------------------------------
// CREA UN PIANETA
// ------------------------------------------------------------

export function createPlanet(name, options = {}) {

    const data = BODY_DATA[name] || {
        radius: 1,
        texture: () => createGenericTexture("#777777"),
        roughness: 0.8,
        metalness: 0
    };

    const radius = options.radius || data.radius;

    const geometry = new THREE.SphereGeometry(
        radius,
        options.segments || 96,
        options.segments || 64
    );

    const texture = data.texture();

    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: data.roughness,
        metalness: data.metalness,
        emissive: data.emissive || 0x000000,
        emissiveIntensity: data.emissiveIntensity || 0
    });

    const planet = new THREE.Mesh(geometry, material);

    planet.name = name;
    planet.userData.type = "planet";
    planet.userData.bodyName = name;

    return planet;
}

// ------------------------------------------------------------
// ATMOSFERA TERRESTRE
// ------------------------------------------------------------

export function addEarthAtmosphere(earth, radius) {

    const atmosphereGeometry = new THREE.SphereGeometry(
        radius * 1.045,
        64,
        48
    );

    const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x4da6ff,
        transparent: true,
        opacity: 0.13,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const atmosphere = new THREE.Mesh(
        atmosphereGeometry,
        atmosphereMaterial
    );

    atmosphere.name = "Earth Atmosphere";

    earth.add(atmosphere);

    return atmosphere;
}

// ------------------------------------------------------------
// NUVOLE DELLA TERRA
// ------------------------------------------------------------

export function addEarthClouds(earth, radius) {

    const geometry = new THREE.SphereGeometry(
        radius * 1.015,
        64,
        48
    );

    const material = new THREE.MeshStandardMaterial({
        map: createEarthCloudTexture(),
        transparent: true,
        opacity: 0.72,
        depthWrite: false
    });

    const clouds = new THREE.Mesh(
        geometry,
        material
    );

    clouds.name = "Earth Clouds";

    earth.add(clouds);

    return clouds;
}

// ------------------------------------------------------------
// ANELLI DI SATURNO
// ------------------------------------------------------------

export function addSaturnRings(saturn, radius) {

    const geometry = new THREE.RingGeometry(
        radius * 1.35,
        radius * 2.25,
        128
    );

    const material = new THREE.MeshStandardMaterial({
        color: 0xc9b18a,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.72,
        roughness: 0.9
    });

    const rings = new THREE.Mesh(
        geometry,
        material
    );

    rings.rotation.x = Math.PI / 2;

    rings.name = "Saturn Rings";

    saturn.add(rings);

    return rings;
}

// ============================================================
// LUNE
// ============================================================

const MOON_DATA = {

    Moon: {
        parent: "Earth",
        radius: 0.28,
        distance: 2.5,
        speed: 0.004,
        inclination: 0.09
    },

    Phobos: {
        parent: "Mars",
        radius: 0.09,
        distance: 1.15,
        speed: 0.012,
        inclination: 0.04
    },

    Deimos: {
        parent: "Mars",
        radius: 0.06,
        distance: 1.65,
        speed: 0.006,
        inclination: 0.08
    },

    Io: {
        parent: "Jupiter",
        radius: 0.16,
        distance: 3.0,
        speed: 0.009,
        inclination: 0.02
    },

    Europa: {
        parent: "Jupiter",
        radius: 0.14,
        distance: 3.55,
        speed: 0.006,
        inclination: 0.04
    },

    Ganymede: {
        parent: "Jupiter",
        radius: 0.22,
        distance: 4.2,
        speed: 0.004,
        inclination: 0.06
    },

    Callisto: {
        parent: "Jupiter",
        radius: 0.20,
        distance: 5.0,
        speed: 0.0025,
        inclination: 0.08
    },

    Titan: {
        parent: "Saturn",
        radius: 0.20,
        distance: 3.8,
        speed: 0.004,
        inclination: 0.05
    },

    Rhea: {
        parent: "Saturn",
        radius: 0.13,
        distance: 3.0,
        speed: 0.006,
        inclination: 0.08
    },

    Iapetus: {
        parent: "Saturn",
        radius: 0.10,
        distance: 5.0,
        speed: 0.002,
        inclination: 0.12
    },

    Enceladus: {
        parent: "Saturn",
        radius: 0.09,
        distance: 2.6,
        speed: 0.008,
        inclination: 0.04
    },

    Titania: {
        parent: "Uranus",
        radius: 0.12,
        distance: 2.3,
        speed: 0.004,
        inclination: 0.09
    },

    Oberon: {
        parent: "Uranus",
        radius: 0.11,
        distance: 2.8,
        speed: 0.003,
        inclination: 0.12
    },

    Ariel: {
        parent: "Uranus",
        radius: 0.09,
        distance: 1.9,
        speed: 0.006,
        inclination: 0.05
    },

    Umbriel: {
        parent: "Uranus",
        radius: 0.085,
        distance: 2.1,
        speed: 0.005,
        inclination: 0.07
    },

    Miranda: {
        parent: "Uranus",
        radius: 0.055,
        distance: 1.5,
        speed: 0.008,
        inclination: 0.10
    },

    Triton: {
        parent: "Neptune",
        radius: 0.16,
        distance: 2.5,
        speed: -0.004,
        inclination: 0.15
    }
};
// ============================================================
// CREAZIONE DELLE LUNE
// ============================================================

export function createMoon(name, options = {}) {

    const data = MOON_DATA[name] || {
        parent: null,
        radius: 0.08,
        distance: 2,
        speed: 0.005,
        inclination: 0
    };

    const radius = options.radius || data.radius;

    const geometry = new THREE.SphereGeometry(
        radius,
        48,
        32
    );

    let texture;

    // La Luna terrestre usa la texture lunare.
    // Per le altre lune utilizziamo una texture rocciosa.
    if (name === "Moon") {
        texture = createMoonTexture();
    } else {
        texture = createGenericTexture(
            name === "Io"
                ? "#c79d43"
                : name === "Europa"
                    ? "#d6c79e"
                    : name === "Ganymede"
                        ? "#77746c"
                        : name === "Callisto"
                            ? "#62594e"
                            : "#85817a"
        );
    }

    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.9,
        metalness: 0
    });

    const moon = new THREE.Mesh(
        geometry,
        material
    );

    moon.name = name;

    moon.userData.type = "moon";
    moon.userData.bodyName = name;
    moon.userData.parentName = data.parent;

    return moon;
}

// ============================================================
// ORBITE
// ============================================================

export function createOrbit({
    semiMajorAxis = 10,
    eccentricity = 0,
    inclination = 0,
    color = 0x3d79a8,
    opacity = 0.28,
    segments = 256
} = {}) {

    const points = [];

    const b = semiMajorAxis * Math.sqrt(
        1 - eccentricity * eccentricity
    );

    for (let i = 0; i <= segments; i++) {

        const angle = (i / segments) * Math.PI * 2;

        const x =
            semiMajorAxis *
            (Math.cos(angle) - eccentricity);

        const z =
            b *
            Math.sin(angle);

        points.push(
            new THREE.Vector3(
                x,
                0,
                z
            )
        );
    }

    const geometry = new THREE.BufferGeometry()
        .setFromPoints(points);

    const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
        depthWrite: false
    });

    const orbit = new THREE.LineLoop(
        geometry,
        material
    );

    orbit.rotation.x = inclination;

    orbit.userData.type = "orbit";

    return orbit;
}

// ============================================================
// ORBITE DI UN PIANETA ATTORNO AL SOLE
// ============================================================

export function createPlanetOrbit(name) {

    const orbitData = {

        Mercury: {
            distance: 10,
            eccentricity: 0.206,
            inclination: 0.122,
            color: 0x8b8b8b
        },

        Venus: {
            distance: 15,
            eccentricity: 0.007,
            inclination: 0.059,
            color: 0xd6b36a
        },

        Earth: {
            distance: 21,
            eccentricity: 0.017,
            inclination: 0.0,
            color: 0x4e9bd4
        },

        Mars: {
            distance: 28,
            eccentricity: 0.093,
            inclination: 0.032,
            color: 0xc45b42
        },

        Jupiter: {
            distance: 43,
            eccentricity: 0.049,
            inclination: 0.022,
            color: 0xb58b65
        },

        Saturn: {
            distance: 58,
            eccentricity: 0.057,
            inclination: 0.043,
            color: 0xd1bd94
        },

        Uranus: {
            distance: 75,
            eccentricity: 0.046,
            inclination: 0.013,
            color: 0x75cbd1
        },

        Neptune: {
            distance: 92,
            eccentricity: 0.011,
            inclination: 0.030,
            color: 0x4f73cf
        },

        Pluto: {
            distance: 115,
            eccentricity: 0.249,
            inclination: 0.299,
            color: 0xa88d78
        }
    };

    const data = orbitData[name];

    if (!data) {
        return null;
    }

    return createOrbit({
        semiMajorAxis: data.distance,
        eccentricity: data.eccentricity,
        inclination: data.inclination,
        color: data.color,
        opacity: 0.32
    });
}

// ============================================================
// ORBITE DELLE LUNE
// ============================================================

export function createMoonOrbit(name) {

    const data = MOON_DATA[name];

    if (!data) {
        return null;
    }

    return createOrbit({
        semiMajorAxis: data.distance,
        eccentricity: 0.01,
        inclination: data.inclination,
        color: 0x8fa8bd,
        opacity: 0.22,
        segments: 128
    });
}

// ============================================================
// DATI PUBBLICI
// ============================================================

export {
    BODY_DATA,
    MOON_DATA
};
