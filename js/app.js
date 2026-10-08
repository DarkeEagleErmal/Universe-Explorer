import * as THREE from "three";

import {
    initializeWelcome
} from "./welcome.js";

import {
    initializeCamera,
    getCamera,
    getControls,
    updateCamera
} from "./camera.js";

import {
    initializeExplorationControls
} from "./explorationControls.js";

import {
    initializeInterface,
    updatePosition,
    updateScale,
    updateSelectedStatus
} from "./interface.js";

import {
    initializeGuide
} from "./guide.js";

import {
    initializeInformation
} from "./information.js";

import {
    celestialObjects,
    moonObjects,
    allCelestialObjects
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


// ============================================================
// DOM
// ============================================================

const canvasContainer =
    document.getElementById("canvasContainer");

const infoPanel =
    document.getElementById("infoPanel");

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");

const searchResults =
    document.getElementById("searchResults");

const selectedStatus =
    document.getElementById("selectedStatus");

const loadingScreen =
    document.getElementById("loadingScreen");


// ============================================================
// THREE.JS
// ============================================================

let scene = null;
let renderer = null;
let camera = null;
let controls = null;


// ============================================================
// GROUPS
// ============================================================

const solarSystemGroup =
    new THREE.Group();

const deepSpaceGroup =
    new THREE.Group();

const galaxyGroup =
    new THREE.Group();

const nebulaGroup =
    new THREE.Group();

const blackHoleGroup =
    new THREE.Group();

const cometGroup =
    new THREE.Group();

const asteroidGroup =
    new THREE.Group();

const kuiperGroup =
    new THREE.Group();

const oortGroup =
    new THREE.Group();


// ============================================================
// OBJECT REGISTRY
// ============================================================

const objectMap =
    new Map();

const interactiveObjects =
    [];

const animatedObjects =
    [];

const orbitLines =
    [];


// ============================================================
// STATE
// ============================================================

let selectedObject = null;

let currentFilter = "all";

let orbitsVisible = true;

let timeMultiplier = 1;

let cameraAnimation = null;

let initialized = false;


// ============================================================
// TEXTURE
// ============================================================

function createSoftTexture() {

    const canvas =
        document.createElement("canvas");

    canvas.width = 128;
    canvas.height = 128;

    const context =
        canvas.getContext("2d");

    const gradient =
        context.createRadialGradient(
            64,
            64,
            0,
            64,
            64,
            64
        );

    gradient.addColorStop(
        0,
        "rgba(255,255,255,1)"
    );

    gradient.addColorStop(
        0.2,
        "rgba(255,255,255,.9)"
    );

    gradient.addColorStop(
        0.5,
        "rgba(255,255,255,.25)"
    );

    gradient.addColorStop(
        1,
        "rgba(255,255,255,0)"
    );

    context.fillStyle =
        gradient;

    context.fillRect(
        0,
        0,
        128,
        128
    );

    const texture =
        new THREE.CanvasTexture(
            canvas
        );

    texture.colorSpace =
        THREE.SRGBColorSpace;

    return texture;
}

const softTexture =
    createSoftTexture();


// ============================================================
// INITIALIZE SCENE
// ============================================================

function initializeScene() {

    scene =
        new THREE.Scene();

    scene.background =
        new THREE.Color(
            0x01030a
        );


    renderer =
        new THREE.WebGLRenderer({
            antialias: true,
            powerPreference:
                "high-performance"
        });

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            window.innerWidth < 700
                ? 1.5
                : 2
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
        1.12;


    if (canvasContainer) {

        canvasContainer.innerHTML =
            "";

        canvasContainer.appendChild(
            renderer.domElement
        );
    }


    scene.add(
        solarSystemGroup
    );

    scene.add(
        deepSpaceGroup
    );

    scene.add(
        galaxyGroup
    );

    scene.add(
        nebulaGroup
    );

    scene.add(
        blackHoleGroup
    );

    scene.add(
        cometGroup
    );

    scene.add(
        asteroidGroup
    );

    scene.add(
        kuiperGroup
    );

    scene.add(
        oortGroup
    );


    createLighting();

    createStarField();

    createAllObjects();

    initializeCamera(
        scene,
        renderer
    );

    camera =
        getCamera();

    controls =
        getControls();

    initializeRaycaster();

    initialized =
        true;
}


// ============================================================
// LIGHTING
// ============================================================

function createLighting() {

    const ambient =
        new THREE.AmbientLight(
            0x526b91,
            0.16
        );

    scene.add(
        ambient
    );


    const hemisphere =
        new THREE.HemisphereLight(
            0x668cff,
            0x02030a,
            0.12
        );

    scene.add(
        hemisphere
    );


    const sunLight =
        new THREE.PointLight(
            0xfff1d0,
            5.5,
            1800,
            1.8
        );

    sunLight.position.set(
        0,
        0,
        0
    );

    scene.add(
        sunLight
    );
}
// ============================================================
// STAR FIELD
// ============================================================

function createStarField() {

    const count =
        window.innerWidth < 700
            ? 9000
            : 18000;

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
            0.5 +
            Math.random() *
            0.5;


        const variation =
            Math.random();


        if (variation < 0.75) {

            colors[i * 3] =
                brightness;

            colors[i * 3 + 1] =
                brightness;

            colors[i * 3 + 2] =
                brightness;

        } else if (
            variation < 0.9
        ) {

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
            size: 1.8,
            map: softTexture,
            transparent: true,
            opacity: 0.9,
            vertexColors: true,
            depthWrite: false
        });


    const stars =
        new THREE.Points(
            geometry,
            material
        );

    scene.add(
        stars
    );
}


// ============================================================
// DATA HELPERS
// ============================================================

function getColor(
    data,
    fallback = 0x778899
) {

    if (
        typeof data?.color ===
        "number"
    ) {
        return data.color;
    }

    if (
        typeof data?.color ===
        "string"
    ) {

        try {

            return new THREE.Color(
                data.color
            ).getHex();

        } catch {
            return fallback;
        }
    }

    return fallback;
}


function getPosition(
    data
) {

    if (
        Array.isArray(
            data?.position
        )
    ) {

        return new THREE.Vector3(
            Number(
                data.position[0]
            ) || 0,

            Number(
                data.position[1]
            ) || 0,

            Number(
                data.position[2]
            ) || 0
        );
    }

    return new THREE.Vector3();
}


function registerObject(
    name,
    object,
    data
) {

    if (
        !name ||
        !object
    ) {
        return;
    }


    const key =
        name.toLowerCase();


    object.userData.celestial =
        data;

    object.userData.objectName =
        name;


    objectMap.set(
        key,
        object
    );


    if (
        !interactiveObjects.includes(
            object
        )
    ) {

        interactiveObjects.push(
            object
        );
    }
}


// ============================================================
// PLANET MATERIAL
// ============================================================

function createPlanetTexture(
    color,
    name
) {

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.width = 512;
    canvas.height = 256;

    const context =
        canvas.getContext(
            "2d"
        );

    const base =
        new THREE.Color(
            color
        );


    context.fillStyle =
        "#" +
        base.getHexString();

    context.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    const objectName =
        String(
            name || ""
        ).toLowerCase();


    if (
        objectName ===
        "earth"
    ) {

        context.fillStyle =
            "rgba(30,120,70,.65)";

        for (
            let i = 0;
            i < 100;
            i++
        ) {

            context.beginPath();

            context.ellipse(
                Math.random() *
                    canvas.width,

                Math.random() *
                    canvas.height,

                8 +
                    Math.random() *
                    30,

                4 +
                    Math.random() *
                    14,

                Math.random() *
                    Math.PI,

                0,
                Math.PI * 2
            );

            context.fill();
        }


        context.fillStyle =
            "rgba(255,255,255,.12)";

        for (
            let i = 0;
            i < 50;
            i++
        ) {

            context.beginPath();

            context.ellipse(
                Math.random() *
                    canvas.width,

                Math.random() *
                    canvas.height,

                20 +
                    Math.random() *
                    50,

                2 +
                    Math.random() *
                    6,

                Math.random() *
                    Math.PI,

                0,
                Math.PI * 2
            );

            context.fill();
        }

    } else if (
        objectName ===
            "jupiter" ||
        objectName ===
            "saturn"
    ) {

        for (
            let i = 0;
            i < 25;
            i++
        ) {

            context.fillStyle =
                `rgba(255,255,255,${0.025 + Math.random() * 0.09})`;

            context.fillRect(
                0,
                i *
                    canvas.height /
                    25,
                canvas.width,
                5 +
                    Math.random() *
                    10
            );
        }

    } else {

        for (
            let i = 0;
            i < 350;
            i++
        ) {

            context.fillStyle =
                `rgba(255,255,255,${Math.random() * 0.12})`;

            context.beginPath();

            context.arc(
                Math.random() *
                    canvas.width,

                Math.random() *
                    canvas.height,

                1 +
                    Math.random() *
                    6,

                0,
                Math.PI * 2
            );

            context.fill();
        }
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
// CREATE CELESTIAL BODIES
// ============================================================

function createCelestialBodies() {

    const source =
        Array.isArray(
            allCelestialObjects
        )
            ? allCelestialObjects
            : [
                ...(celestialObjects || []),
                ...(moonObjects || [])
            ];


    const unique =
        new Map();


    source.forEach(
        data => {

            if (
                data?.name
            ) {

                unique.set(
                    data.name,
                    data
                );
            }
        }
    );


    unique.forEach(
        data => {

            createCelestialBody(
                data
            );
        }
    );
}


// ============================================================
// CREATE ONE BODY
// ============================================================

function createCelestialBody(
    data
) {

    const radius =
        Math.max(
            Number(
                data.radius
            ) || 0.3,
            0.12
        );


    const texture =
        createPlanetTexture(
            getColor(
                data
            ),
            data.name
        );


    const material =
        new THREE.MeshStandardMaterial({
            map: texture,
            roughness:
                data.type === "Star"
                    ? 0.25
                    : 0.8,
            metalness: 0.02
        });


    const geometry =
        new THREE.SphereGeometry(
            radius,
            48,
            48
        );


    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );


    mesh.position.copy(
        getPosition(
            data
        )
    );


    registerObject(
        data.name,
        mesh,
        data
    );


    solarSystemGroup.add(
        mesh
    );


    animatedObjects.push(
        mesh
    );


    if (
        data.name.toLowerCase() ===
        "sun"
    ) {

        material.emissive =
            new THREE.Color(
                0xff8a18
            );

        material.emissiveIntensity =
            1.8;


        const glow =
            createGlow(
                radius * 1.7,
                0xffb52e,
                0.28
            );


        mesh.add(
            glow
        );

        mesh.userData.glow =
            glow;
    }


    if (
        data.name.toLowerCase() ===
        "earth"
    ) {

        createEarthAtmosphere(
            mesh,
            radius
        );
    }


    if (
        data.name.toLowerCase() ===
        "saturn"
    ) {

        createSaturnRings(
            mesh,
            radius
        );
    }
}


function createGlow(
    radius,
    color,
    opacity
) {

    const glow =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                radius,
                32,
                32
            ),

            new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity,
                side:
                    THREE.BackSide,
                blending:
                    THREE.AdditiveBlending,
                depthWrite: false
            })
        );

    return glow;
}
// ============================================================
// EARTH ATMOSPHERE
// ============================================================

function createEarthAtmosphere(
    earth,
    radius
) {

    const atmosphere =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                radius * 1.07,
                40,
                40
            ),

            new THREE.MeshBasicMaterial({
                color: 0x4aa8ff,
                transparent: true,
                opacity: 0.14,
                side:
                    THREE.BackSide,
                blending:
                    THREE.AdditiveBlending,
                depthWrite: false
            })
        );


    atmosphere.userData.isAtmosphere =
        true;


    earth.add(
        atmosphere
    );


    earth.userData.atmosphere =
        atmosphere;
}


// ============================================================
// SATURN RINGS
// ============================================================

function createSaturnRings(
    saturn,
    radius
) {

    const geometry =
        new THREE.RingGeometry(
            radius * 1.45,
            radius * 2.35,
            128
        );


    const material =
        new THREE.MeshStandardMaterial({
            color: 0xcbbd99,
            transparent: true,
            opacity: 0.7,
            side:
                THREE.DoubleSide,
            roughness: 0.9
        });


    const rings =
        new THREE.Mesh(
            geometry,
            material
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
            160
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
            color: 0x35506b,
            transparent: true,
            opacity: 0.35
        });


    const line =
        new THREE.LineLoop(
            geometry,
            material
        );


    solarSystemGroup.add(
        line
    );


    orbitLines.push(
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
// DEEP SPACE OBJECTS
// ============================================================

function createAllObjects() {

    createCelestialBodies();

    createDeepSpaceObjects();

    createNebulaObjects();

    createGalaxyObjects();

    createBlackHoleObjects();

    createCometObjects();

    createAsteroidRegion();

    createKuiperRegion();

    createOortRegion();
}


// ============================================================
// GENERIC DEEP OBJECT
// ============================================================

function createDeepObject(
    data
) {

    if (
        !data ||
        !data.name
    ) {
        return null;
    }


    const position =
        getPosition(
            data
        );


    const radius =
        Math.max(
            Number(
                data.radius
            ) || 5,
            2
        );


    const group =
        new THREE.Group();


    group.position.copy(
        position
    );


    const hit =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                radius * 1.5,
                20,
                20
            ),
            new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0
            })
        );


    group.add(
        hit
    );


    registerObject(
        data.name,
        group,
        data
    );


    deepSpaceGroup.add(
        group
    );


    return group;
}
// ============================================================
// GALAXY
// ============================================================

function createGalaxyVisual(
    data
) {

    const position =
        getPosition(
            data
        );


    const size =
        Math.max(
            Number(
                data.radius
            ) || 20,
            12
        );


    const count =
        window.innerWidth < 700
            ? 1200
            : 2400;


    const positions =
        new Float32Array(
            count * 3
        );


    const colors =
        new Float32Array(
            count * 3
        );


    const color =
        new THREE.Color(
            getColor(
                data,
                0xc9b8ff
            )
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const radius =
            Math.random() *
            size;


        const arm =
            i % 4;


        const angle =
            radius * 0.12 +
            arm *
                Math.PI /
                2 +
            (Math.random() -
                0.5) *
                0.8;


        positions[i * 3] =
            Math.cos(angle) *
            radius;

        positions[i * 3 + 1] =
            (Math.random() -
                0.5) *
            size *
            0.08;

        positions[i * 3 + 2] =
            Math.sin(angle) *
            radius;


        const brightness =
            0.45 +
            Math.random() *
            0.55;


        colors[i * 3] =
            color.r *
            brightness;

        colors[i * 3 + 1] =
            color.g *
            brightness;

        colors[i * 3 + 2] =
            color.b *
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
            size: 0.55,
            map: softTexture,
            vertexColors: true,
            transparent: true,
            opacity: 0.82,
            blending:
                THREE.AdditiveBlending,
            depthWrite: false
        });


    const galaxy =
        new THREE.Points(
            geometry,
            material
        );


    galaxy.position.copy(
        position
    );


    const core =
        createGlowSprite(
            0xffffff,
            size * 0.55,
            0.5
        );


    galaxy.add(
        core
    );


    const hit =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                size * 0.85,
                16,
                16
            ),
            new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0
            })
        );


    galaxy.add(
        hit
    );


    registerObject(
        data.name,
        galaxy,
        data
    );


    galaxyGroup.add(
        galaxy
    );


    animatedObjects.push(
        galaxy
    );
}


function createGlowSprite(
    size,
    color,
    opacity
) {

    const sprite =
        new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: softTexture,
                color,
                transparent: true,
                opacity,
                depthWrite: false,
                blending:
                    THREE.AdditiveBlending
            })
        );


    sprite.scale.set(
        size,
        size,
        1
    );


    return sprite;
}


function createGalaxyObjects() {

    if (
        !Array.isArray(
            galaxyObjects
        )
    ) {
        return;
    }


    galaxyObjects.forEach(
        data =>
            createGalaxyVisual(
                data
            )
    );
}


// ============================================================
// NEBULA
// ============================================================

function createNebulaVisual(
    data
) {

    const position =
        getPosition(
            data
        );


    const size =
        Math.max(
            Number(
                data.radius
            ) || 70,
            50
        );


    const group =
        new THREE.Group();


    group.position.copy(
        position
    );


    const color =
        getColor(
            data,
            0x735cff
        );


    const layers =
        window.innerWidth < 700
            ? 10
            : 18;


    for (
        let i = 0;
        i < layers;
        i++
    ) {

        const cloud =
            createGlowSprite(
                size *
                    (0.65 +
                        Math.random() *
                        0.8),

                color,

                0.025 +
                    Math.random() *
                    0.025
            );


        cloud.position.set(
            (Math.random() -
                0.5) *
                size,

            (Math.random() -
                0.5) *
                size *
                0.55,

            (Math.random() -
                0.5) *
                size *
                0.65
        );


        group.add(
            cloud
        );
    }


    const hit =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                size * 0.7,
                16,
                16
            ),
            new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0
            })
        );


    group.add(
        hit
    );


    registerObject(
        data.name,
        group,
        data
    );


    nebulaGroup.add(
        group
    );


    animatedObjects.push(
        group
    );
}


function createNebulaObjects() {

    if (
        !Array.isArray(
            nebulaObjects
        )
    ) {
        return;
    }


    nebulaObjects.forEach(
        data =>
            createNebulaVisual(
                data
            )
    );
}


// ============================================================
// BLACK HOLE
// ============================================================

function createBlackHoleVisual(
    data
) {

    const group =
        new THREE.Group();


    group.position.copy(
        getPosition(
            data
        )
    );


    const radius =
        Math.max(
            Number(
                data.radius
            ) || 5,
            3
        );


    const core =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                radius,
                40,
                40
            ),
            new THREE.MeshBasicMaterial({
                color: 0x000000
            })
        );


    group.add(
        core
    );


    const disk =
        new THREE.Mesh(
            new THREE.RingGeometry(
                radius * 1.4,
                radius * 3.6,
                128
            ),
            new THREE.MeshBasicMaterial({
                color: 0xff5a19,
                transparent: true,
                opacity: 0.72,
                side:
                    THREE.DoubleSide,
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


    const glow =
        new THREE.Mesh(
            new THREE.RingGeometry(
                radius * 3.5,
                radius * 5,
                128
            ),
            new THREE.MeshBasicMaterial({
                color: 0xff9d52,
                transparent: true,
                opacity: 0.12,
                side:
                    THREE.DoubleSide,
                blending:
                    THREE.AdditiveBlending,
                depthWrite: false
            })
        );


    glow.rotation.x =
        Math.PI / 2;


    group.add(
        glow
    );


    const hit =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                radius * 5,
                20,
                20
            ),
            new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0
            })
        );


    group.add(
        hit
    );


    registerObject(
        data.name,
        group,
        data
    );


    blackHoleGroup.add(
        group
    );


    animatedObjects.push(
        group
    );
}


function createBlackHoleObjects() {

    if (
        !Array.isArray(
            deepSpaceObjects
        )
    ) {
        return;
    }


    deepSpaceObjects.forEach(
        data => {

            const type =
                String(
                    data.type ||
                    ""
                ).toLowerCase();


            if (
                type.includes(
                    "black"
                )
            ) {

                createBlackHoleVisual(
                    data
                );
            }
        }
    );
}
// ============================================================
// COMETS
// ============================================================

function createCometVisual(
    data
) {

    const group =
        new THREE.Group();


    group.position.copy(
        getPosition(
            data
        )
    );


    const nucleus =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                Math.max(
                    Number(
                        data.radius
                    ) || 0.2,
                    0.15
                ),
                24,
                24
            ),

            new THREE.MeshStandardMaterial({
                color: 0xd8e0e8,
                roughness: 0.85
            })
        );


    group.add(
        nucleus
    );


    const tail =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                0.35,
                6,
                18,
                1,
                true
            ),

            new THREE.MeshBasicMaterial({
                color: 0x91ddff,
                transparent: true,
                opacity: 0.38,
                blending:
                    THREE.AdditiveBlending,
                depthWrite: false
            })
        );


    tail.rotation.z =
        Math.PI / 2;

    tail.position.x =
        3;


    group.add(
        tail
    );


    const hit =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                2.5,
                16,
                16
            ),

            new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0
            })
        );


    group.add(
        hit
    );


    registerObject(
        data.name,
        group,
        data
    );


    cometGroup.add(
        group
    );


    animatedObjects.push(
        group
    );
}


function createCometObjects() {

    if (
        !Array.isArray(
            cometObjects
        )
    ) {
        return;
    }


    cometObjects.forEach(
        data =>
            createCometVisual(
                data
            )
    );
}


// ============================================================
// ASTEROID REGION
// ============================================================

function createAsteroidRegion() {

    const count =
        window.innerWidth < 700
            ? 650
            : 1500;


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
            Math.random() *
            5;


        const angle =
            Math.random() *
            Math.PI *
            2;


        positions[i * 3] =
            Math.cos(angle) *
            radius;


        positions[i * 3 + 1] =
            (Math.random() -
                0.5) *
            1.5;


        positions[i * 3 + 2] =
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
            color: 0x938a80,
            size: 0.13,
            map: softTexture,
            transparent: true,
            opacity: 0.72
        });


    const points =
        new THREE.Points(
            geometry,
            material
        );


    asteroidGroup.add(
        points
    );


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
        facts:
            "A broad region containing many rocky bodies orbiting the Sun.",
        source: "NASA"
    };


    const hit =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                27,
                16,
                16
            ),
            new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0
            })
        );


    asteroidGroup.add(
        hit
    );


    registerObject(
        data.name,
        asteroidGroup,
        data
    );
}


// ============================================================
// KUIPER BELT
// ============================================================

function createKuiperRegion() {

    const count =
        window.innerWidth < 700
            ? 500
            : 1200;


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
            Math.PI *
            2;


        positions[i * 3] =
            Math.cos(angle) *
            radius;


        positions[i * 3 + 1] =
            (Math.random() -
                0.5) *
            7;


        positions[i * 3 + 2] =
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


    const points =
        new THREE.Points(
            geometry,

            new THREE.PointsMaterial({
                color: 0x9da8b9,
                size: 0.15,
                map: softTexture,
                transparent: true,
                opacity: 0.55
            })
        );


    kuiperGroup.add(
        points
    );


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
        facts:
            "A distant region of icy bodies beyond Neptune.",
        source: "NASA"
    };


    registerObject(
        data.name,
        kuiperGroup,
        data
    );
}


// ============================================================
// OORT CLOUD
// ============================================================

function createOortRegion() {

    const count =
        window.innerWidth < 700
            ? 700
            : 1800;


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
            Math.PI *
            2;


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


    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const points =
        new THREE.Points(
            geometry,

            new THREE.PointsMaterial({
                color: 0x71849c,
                size: 0.11,
                map: softTexture,
                transparent: true,
                opacity: 0.35
            })
        );


    oortGroup.add(
        points
    );


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
        source: "NASA"
    };


    registerObject(
        data.name,
        oortGroup,
        data
    );
}
// ============================================================
// RAYCASTING
// ============================================================

const raycaster =
    new THREE.Raycaster();

const pointer =
    new THREE.Vector2();


function initializeRaycaster() {

    raycaster.params.Points.threshold =
        5;


    renderer.domElement.addEventListener(
        "pointerdown",
        event => {

            if (
                event.button !==
                undefined &&
                event.button !== 0
            ) {
                return;
            }


            const rect =
                renderer.domElement
                    .getBoundingClientRect();


            pointer.x =
                (
                    (event.clientX -
                        rect.left) /
                    rect.width
                ) *
                2 -
                1;


            pointer.y =
                -(
                    (
                        event.clientY -
                        rect.top
                    ) /
                    rect.height
                ) *
                2 +
                1;


            raycaster.setFromCamera(
                pointer,
                camera
            );


            const hits =
                raycaster.intersectObjects(
                    interactiveObjects,
                    true
                );


            if (
                !hits.length
            ) {
                return;
            }


            let object =
                hits[0].object;


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
            }
        }
    );
}


// ============================================================
// SELECT OBJECT
// ============================================================

function selectObject(
    object
) {

    if (
        !object?.userData?.celestial
    ) {
        return;
    }


    selectedObject =
        object;


    const data =
        object.userData.celestial;


    if (selectedStatus) {

        selectedStatus.textContent =
            `SELECTED: ${data.name.toUpperCase()}`;
    }


    infoPanel?.classList.remove(
        "hidden"
    );


    window.dispatchEvent(
        new CustomEvent(
            "universe:objectSelected",
            {
                detail: {
                    object,
                    data
                }
            }
        )
    );


    focusObject(
        object
    );
}


// ============================================================
// SEARCH
// ============================================================

function performSearch() {

    const query =
        searchInput?.value
            .trim()
            .toLowerCase();


    if (
        !searchResults
    ) {
        return;
    }


    searchResults.innerHTML =
        "";


    if (!query) {
        return;
    }


    const results = [];


    objectMap.forEach(
        (object, key) => {

            const data =
                object.userData
                    .celestial;


            if (
                key.includes(
                    query
                )
            ) {

                results.push(
                    {
                        object,
                        data
                    }
                );
            }
        }
    );


    if (
        results.length ===
        0
    ) {

        searchResults.innerHTML =
            `<div class="search-result">
                NO OBJECT FOUND
            </div>`;

        return;
    }


    results
        .slice(
            0,
            12
        )
        .forEach(
            result => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "search-result";


                item.innerHTML =
                    `<strong>
                        ${result.data.name}
                    </strong>
                    <small style="
                        display:block;
                        margin-top:3px;
                        opacity:.65;
                    ">
                        ${result.data.type || "OBJECT"}
                    </small>`;


                item.addEventListener(
                    "click",
                    () => {

                        selectObject(
                            result.object
                        );

                        searchResults.innerHTML =
                            "";

                        searchInput.value =
                            result.data.name;
                    }
                );


                searchResults.appendChild(
                    item
                );
            }
        );
}


searchButton?.addEventListener(
    "click",
    performSearch
);


searchInput?.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter"
        ) {

            performSearch();
        }
    }
);
// ============================================================
// CAMERA FOCUS
// ============================================================

function easeInOutCubic(
    value
) {

    return value < 0.5
        ? 4 *
            value *
            value *
            value

        : 1 -
            Math.pow(
                -2 *
                    value +
                    2,
                3
            ) /
                2;
}


function focusObject(
    object,
    duration = 900
) {

    if (
        !object ||
        !camera ||
        !controls
    ) {
        return;
    }


    const target =
        new THREE.Vector3();


    object.getWorldPosition(
        target
    );


    const data =
        object.userData
            ?.celestial;


    const radius =
        Math.max(
            Number(
                data?.radius
            ) || 1,
            1
        );


    let distance =
        radius * 7;


    if (
        data?.type ===
        "Galaxy"
    ) {

        distance =
            Math.max(
                radius * 2.5,
                35
            );
    }


    if (
        data?.type ===
        "Nebula"
    ) {

        distance =
            Math.max(
                radius * 2,
                45
            );
    }


    if (
        data?.type ===
        "Black Hole"
    ) {

        distance =
            Math.max(
                radius * 6,
                35
            );
    }


    distance =
        Math.max(
            distance,
            5
        );


    const direction =
        new THREE.Vector3(
            1,
            0.45,
            1
        ).normalize();


    const destination =
        target
            .clone()
            .add(
                direction.multiplyScalar(
                    distance
                )
            );


    cameraAnimation = {

        startPosition:
            camera.position.clone(),

        startTarget:
            controls.target.clone(),

        endPosition:
            destination,

        endTarget:
            target,

        startTime:
            performance.now(),

        duration
    };
}


function updateCameraAnimation(
    now
) {

    if (
        !cameraAnimation
    ) {
        return;
    }


    const progress =
        Math.min(
            (
                now -
                cameraAnimation.startTime
            ) /
            cameraAnimation.duration,
            1
        );


    const eased =
        easeInOutCubic(
            progress
        );


    camera.position.lerpVectors(
        cameraAnimation.startPosition,
        cameraAnimation.endPosition,
        eased
    );


    controls.target.lerpVectors(
        cameraAnimation.startTarget,
        cameraAnimation.endTarget,
        eased
    );


    if (
        progress >=
        1
    ) {

        cameraAnimation =
            null;
    }
}


// ============================================================
// EVENT-BASED FOCUS
// ============================================================

window.addEventListener(
    "universe:focusObject",
    event => {

        const object =
            event.detail?.object;

        if (
            object
        ) {

            focusObject(
                object
            );
        }
    }
);


window.addEventListener(
    "universe:focusObjectByName",
    event => {

        const name =
            event.detail?.name
                ?.toLowerCase();


        if (!name) {
            return;
        }


        const object =
            objectMap.get(
                name
            );


        if (
            object
        ) {

            selectObject(
                object
            );
        }
    }
);


// ============================================================
// ORBIT VISIBILITY
// ============================================================

function setOrbitVisibility(
    visible
) {

    orbitsVisible =
        visible;


    orbitLines.forEach(
        line => {

            line.visible =
                visible;
        }
    );
}


window.addEventListener(
    "universe:orbitsChanged",
    event => {

        setOrbitVisibility(
            event.detail?.visible ??
            true
        );
    }
);


// ============================================================
// MODE
// ============================================================

window.addEventListener(
    "universe:modeChanged",
    event => {

        const mode =
            event.detail?.mode;


        if (
            mode
        ) {

            const normalized =
                String(
                    mode
                ).toUpperCase();


            if (
                normalized ===
                "SOLAR_SYSTEM"
            ) {

                showSolarSystem();
            }


            if (
                normalized ===
                "FREE"
            ) {

                showUniverse();
            }


            if (
                normalized ===
                "GUIDED"
            ) {

                showUniverse();
            }
        }
    }
);


// ============================================================
// TIME
// ============================================================

window.addEventListener(
    "universe:timeMultiplierChanged",
    event => {

        const value =
            Number(
                event.detail?.multiplier
            );


        if (
            Number.isFinite(
                value
            )
        ) {

            timeMultiplier =
                value;
        }
    }
);
// ============================================================
// SOLAR SYSTEM VIEW
// ============================================================

function showSolarSystem() {

    solarSystemGroup.visible =
        true;

    asteroidGroup.visible =
        true;

    cometGroup.visible =
        true;

    kuiperGroup.visible =
        false;

    oortGroup.visible =
        false;

    galaxyGroup.visible =
        false;

    nebulaGroup.visible =
        false;

    blackHoleGroup.visible =
        false;

    deepSpaceGroup.visible =
        false;
}


// ============================================================
// FULL UNIVERSE VIEW
// ============================================================

function showUniverse() {

    solarSystemGroup.visible =
        true;

    asteroidGroup.visible =
        true;

    cometGroup.visible =
        true;

    kuiperGroup.visible =
        true;

    oortGroup.visible =
        true;

    galaxyGroup.visible =
        true;

    nebulaGroup.visible =
        true;

    blackHoleGroup.visible =
        true;

    deepSpaceGroup.visible =
        true;
}


// ============================================================
// FILTER
// ============================================================

function applyFilter(
    filter
) {

    currentFilter =
        filter;


    showUniverse();


    if (
        filter ===
        "all"
    ) {
        return;
    }


    solarSystemGroup.visible =
        [
            "planet",
            "moon",
            "star"
        ].includes(
            filter
        );


    galaxyGroup.visible =
        filter ===
        "galaxy";


    nebulaGroup.visible =
        filter ===
        "galaxy";


    blackHoleGroup.visible =
        filter ===
        "blackhole";


    cometGroup.visible =
        filter ===
        "comet";


    asteroidGroup.visible =
        filter ===
        "asteroid";


    kuiperGroup.visible =
        filter ===
        "asteroid";


    oortGroup.visible =
        filter ===
        "asteroid";


    if (
        filter ===
        "planet"
    ) {

        filterSolarObjects(
            data =>
                data.type ===
                "Planet"
        );
    }


    if (
        filter ===
        "moon"
    ) {

        filterSolarObjects(
            data =>
                data.type ===
                "Natural Satellite"
        );
    }


    if (
        filter ===
        "star"
    ) {

        filterSolarObjects(
            data =>
                data.type ===
                    "Star" ||
                data.type ===
                    "Star System"
        );
    }
}


function filterSolarObjects(
    predicate
) {

    objectMap.forEach(
        object => {

            const data =
                object.userData
                    ?.celestial;


            if (
                !data
            ) {
                return;
            }


            object.visible =
                predicate(
                    data
                );
        }
    );
}


window.addEventListener(
    "universe:objectFilterChanged",
    event => {

        applyFilter(
            event.detail?.filter ||
            "all"
        );
    }
);


// ============================================================
// SEARCH RESULTS EVENT
// ============================================================

window.addEventListener(
    "universe:search",
    event => {

        if (
            searchInput
        ) {

            searchInput.value =
                event.detail?.query ||
                "";
        }

        performSearch();
    }
);


// ============================================================
// TOUR OBJECT
// ============================================================

window.addEventListener(
    "universe:tourObject",
    event => {

        const name =
            event.detail?.name
                ?.toLowerCase();


        if (!name) {
            return;
        }


        const object =
            objectMap.get(
                name
            );


        if (
            object
        ) {

            selectObject(
                object
            );
        }
    }
);


// ============================================================
// START TOUR
// ============================================================

window.addEventListener(
    "universe:startTour",
    () => {

        showUniverse();
    }
);


// ============================================================
// POSITION HUD
// ============================================================

function updateHUD() {

    if (
        !camera
    ) {
        return;
    }


    if (
        positionTextExists()
    ) {

        updatePosition(
            camera.position
        );
    }


    const distance =
        camera.position.length();


    let scale =
        "PLANETARY SCALE";


    if (
        distance >
        120
    ) {

        scale =
            "OUTER SOLAR SYSTEM";
    }


    if (
        distance >
        500
    ) {

        scale =
            "DEEP SPACE";
    }


    if (
        distance >
        1200
    ) {

        scale =
            "INTERSTELLAR SPACE";
    }


    updateScale(
        scale
    );
}


function positionTextExists() {

    return Boolean(
        document.getElementById(
            "positionText"
        )
    );
}


// ============================================================
// WINDOW EVENTS
// ============================================================

window.addEventListener(
    "resize",
    () => {

        if (
            !camera ||
            !renderer
        ) {
            return;
        }


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
                window.innerWidth < 700
                    ? 1.5
                    : 2
            )
        );
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


    if (
        !initialized
    ) {
        return;
    }


    const delta =
        clock.getDelta();


    const elapsed =
        clock.elapsedTime;


    updateCameraAnimation(
        performance.now()
    );


    updateCamera();


    // ========================================================
    // PLANETS
    // ========================================================

    animatedObjects.forEach(
        object => {

            const data =
                object.userData
                    ?.celestial;


            if (
                !data
            ) {
                return;
            }


            const type =
                String(
                    data.type ||
                    ""
                ).toLowerCase();


            if (
                type ===
                    "galaxy" ||
                type ===
                    "nebula" ||
                type.includes(
                    "black"
                )
            ) {

                return;
            }


            object.rotation.y +=
                0.0018 *
                timeMultiplier;


            if (
                object.userData
                    ?.glow
            ) {

                const pulse =
                    1 +
                    Math.sin(
                        elapsed *
                        1.5
                    ) *
                    0.035;


                object.userData
                    .glow
                    .scale.set(
                        pulse,
                        pulse,
                        pulse
                    );
            }
        }
    );


    // ========================================================
    // GALAXIES
    // ========================================================

    galaxyGroup.children.forEach(
        galaxy => {

            galaxy.rotation.y +=
                0.00008 *
                timeMultiplier;
        }
    );


    // ========================================================
    // NEBULAE
    // ========================================================

    nebulaGroup.rotation.y +=
        0.00001 *
        timeMultiplier;


    // ========================================================
    // BLACK HOLES
    // ========================================================

    blackHoleGroup.children.forEach(
        blackHole => {

            blackHole.rotation.y +=
                0.0015 *
                timeMultiplier;


            blackHole.children.forEach(
                child => {

                    if (
                        child.geometry
                            ?.type ===
                        "RingGeometry"
                    ) {

                        child.rotation.z +=
                            0.003 *
                            timeMultiplier;
                    }
                }
            );
        }
    );


    // ========================================================
    // ASTEROIDS
    // ========================================================

    asteroidGroup.rotation.y +=
        0.00012 *
        timeMultiplier;


    // ========================================================
    // KUIPER
    // ========================================================

    kuiperGroup.rotation.y +=
        0.00004 *
        timeMultiplier;


    // ========================================================
    // OORT
    // ========================================================

    oortGroup.rotation.y +=
        0.000008 *
        timeMultiplier;


    // ========================================================
    // COMETS
    // ========================================================

    cometGroup.children.forEach(
        comet => {

            comet.rotation.y +=
                0.002 *
                timeMultiplier;
        }
    );


    // ========================================================
    // HUD
    // ========================================================

    updateHUD();


    // ========================================================
    // RENDER
    // ========================================================

    renderer.render(
        scene,
        camera
    );
}
// ============================================================
// MODULE INITIALIZATION
// ============================================================

function initializeModules() {

    try {

        initializeWelcome();

    } catch (error) {

        console.warn(
            "Welcome initialization:",
            error
        );
    }


    try {

        initializeInterface();

    } catch (error) {

        console.warn(
            "Interface initialization:",
            error
        );
    }


    try {

        initializeExplorationControls();

    } catch (error) {

        console.warn(
            "Exploration controls initialization:",
            error
        );
    }


    try {

        initializeGuide();

    } catch (error) {

        console.warn(
            "Guide initialization:",
            error
        );
    }


    try {

        initializeInformation();

    } catch (error) {

        console.warn(
            "Information initialization:",
            error
        );
    }
}


// ============================================================
// LOADING
// ============================================================

function finishLoading() {

    if (
        !loadingScreen
    ) {
        return;
    }


    const progress =
        document.getElementById(
            "loadingProgress"
        );

    const percentage =
        document.getElementById(
            "loadingPercentage"
        );


    if (
        progress
    ) {

        progress.style.width =
            "100%";
    }


    if (
        percentage
    ) {

        percentage.textContent =
            "100%";
    }


    setTimeout(
        () => {

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
                500
            );

        },
        450
    );
}


// ============================================================
// START APPLICATION
// ============================================================

function startApplication() {

    try {

        initializeScene();

        initializeModules();

        showSolarSystem();

        finishLoading();

        animate();

    } catch (error) {

        console.error(
            "Universe Explorer initialization error:",
            error
        );

        if (
            loadingScreen
        ) {

            loadingScreen.style.opacity =
                "1";
        }
    }
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
        startApplication,
        {
            once: true
        }
    );

} else {

    startApplication();
}
