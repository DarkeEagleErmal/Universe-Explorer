/* =========================================
   UNIVERSE EXPLORER
   ADVANCED 3D ENGINE
========================================= */

const canvas = document.getElementById("universe");

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.outputEncoding = THREE.sRGBEncoding;


/* =========================================
   SCENA
========================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x000004);


/* =========================================
   CAMERA
========================================= */

const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    3000
);

camera.position.set(0, 8, 42);


/* =========================================
   LUCI
========================================= */

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    0.12
);

scene.add(ambientLight);

const sunLight = new THREE.PointLight(
    0xffffff,
    4,
    600
);

sunLight.position.set(0, 0, 0);

scene.add(sunLight);


/* =========================================
   STELLE
========================================= */

const starGeometry =
    new THREE.BufferGeometry();

const starCount = 16000;

const starPositions =
    new Float32Array(starCount * 3);

for (let i = 0; i < starCount * 3; i += 3) {

    const radius =
        250 + Math.random() * 1200;

    const theta =
        Math.random() * Math.PI * 2;

    const phi =
        Math.acos(
            2 * Math.random() - 1
        );

    starPositions[i] =
        radius *
        Math.sin(phi) *
        Math.cos(theta);

    starPositions[i + 1] =
        radius *
        Math.sin(phi) *
        Math.sin(theta);

    starPositions[i + 2] =
        radius *
        Math.cos(phi);
}

starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        starPositions,
        3
    )
);

const starMaterial =
    new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.65,
        transparent: true,
        opacity: 0.9
    });

const stars =
    new THREE.Points(
        starGeometry,
        starMaterial
    );

scene.add(stars);


/* =========================================
   SISTEMA SOLARE
========================================= */

const solarSystem =
    new THREE.Group();

scene.add(solarSystem);


/* =========================================
   SOLE
========================================= */

const sunGeometry =
    new THREE.SphereGeometry(
        4,
        64,
        64
    );

const sunMaterial =
    new THREE.MeshBasicMaterial({
        color: 0xffa928
    });

const sun =
    new THREE.Mesh(
        sunGeometry,
        sunMaterial
    );

solarSystem.add(sun);


/* Bagliore */

const glowGeometry =
    new THREE.SphereGeometry(
        4.8,
        64,
        64
    );

const glowMaterial =
    new THREE.MeshBasicMaterial({
        color: 0xff8c00,
        transparent: true,
        opacity: 0.14,
        side: THREE.BackSide
    });

const sunGlow =
    new THREE.Mesh(
        glowGeometry,
        glowMaterial
    );

sun.add(sunGlow);


/* =========================================
   CREAZIONE PIANETI
========================================= */

function createPlanet(
    name,
    radius,
    distance,
    color,
    speed
) {

    const orbit =
        new THREE.Group();

    solarSystem.add(orbit);

    const geometry =
        new THREE.SphereGeometry(
            radius,
            64,
            64
        );

    const material =
        new THREE.MeshStandardMaterial({
            color,
            roughness: 0.8,
            metalness: 0.05
        });

    const planet =
        new THREE.Mesh(
            geometry,
            material
        );

    planet.position.x =
        distance;

    planet.userData = {
        name,
        distance,
        speed
    };

    orbit.add(planet);

    return {
        planet,
        orbit
    };
}


/* =========================================
   PIANETI
========================================= */

const mercury = createPlanet(
    "Mercurio",
    0.45,
    7,
    0x9b8f82,
    0.035
);

const venus = createPlanet(
    "Venere",
    0.75,
    10,
    0xc98b4a,
    0.026
);

const earth = createPlanet(
    "Terra",
    0.85,
    14,
    0x3978c9,
    0.020
);

const mars = createPlanet(
    "Marte",
    0.62,
    18,
    0xb94b32,
    0.016
);

const jupiter = createPlanet(
    "Giove",
    1.9,
    25,
    0xc89462,
    0.009
);

const saturn = createPlanet(
    "Saturno",
    1.55,
    33,
    0xd4b47a,
    0.007
);

const uranus = createPlanet(
    "Urano",
    1.05,
    40,
    0x73c9d6,
    0.005
);

const neptune = createPlanet(
    "Nettuno",
    1.0,
    47,
    0x3159c8,
    0.004
);


/* =========================================
   ATMOSFERA TERRA
========================================= */

const atmosphere =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            0.94,
            48,
            48
        ),
        new THREE.MeshBasicMaterial({
            color: 0x4fa8ff,
            transparent: true,
            opacity: 0.14,
            side: THREE.BackSide
        })
    );

earth.planet.add(
    atmosphere
);


/* =========================================
   ANELLI DI SATURNO
========================================= */

const ring =
    new THREE.Mesh(
        new THREE.RingGeometry(
            2,
            3.3,
            128
        ),
        new THREE.MeshBasicMaterial({
            color: 0xc9b58b,
            transparent: true,
            opacity: 0.75,
            side: THREE.DoubleSide
        })
    );

ring.rotation.x =
    Math.PI / 2.4;

saturn.planet.add(ring);


/* =========================================
   ORBITE
========================================= */

function createOrbit(distance) {

    const curve =
        new THREE.EllipseCurve(
            0,
            0,
            distance,
            distance,
            0,
            Math.PI * 2,
            false,
            0
        );

    const points =
        curve.getPoints(180);

    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(points);

    const material =
        new THREE.LineBasicMaterial({
            color: 0x536b8f,
            transparent: true,
            opacity: 0.22
        });

    const orbit =
        new THREE.LineLoop(
            geometry,
            material
        );

    orbit.rotation.x =
        Math.PI / 2;

    solarSystem.add(orbit);
}

[
    7,
    10,
    14,
    18,
    25,
    33,
    40,
    47
].forEach(createOrbit);


/* =========================================
   DATI PIANETI
========================================= */

const planetData = {

    Sole: "La stella al centro del Sistema Solare.",

    Mercurio:
        "Il pianeta più vicino al Sole.",

    Venere:
        "Un pianeta roccioso con un'atmosfera molto densa.",

    Terra:
        "Il nostro pianeta, ricco di acqua e vita.",

    Marte:
        "Il pianeta rosso caratterizzato da vulcani e antichi letti fluviali.",

    Giove:
        "Il pianeta più grande del Sistema Solare.",

    Saturno:
        "Un gigante gassoso famoso per il suo spettacolare sistema di anelli.",

    Urano:
        "Un gigante ghiacciato con una rotazione molto inclinata.",

    Nettuno:
        "Il pianeta più lontano dal Sole."
};
