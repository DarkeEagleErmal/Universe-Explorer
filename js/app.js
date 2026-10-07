import * as THREE from "three";

import { initializeWelcome } from "./welcome.js";

import {
    initializeExplorationControls,
    setExplorationMode
} from "./explorationControls.js";

import {
    initializeCamera,
    focusCameraOnObject,
    updateCamera
} from "./camera.js";

import {
    initializeInformation
} from "./information.js";

import {
    initializeGuide
} from "./guide.js";

import {
    initializeEffects,
    updateEffects
} from "./effects.js";

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
// GLOBAL VARIABLES
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


// ============================================================
// INITIALIZATION
// ============================================================

function initializeApp() {
initializeWelcome();
    createScene();
    createRenderer();

    const cameraData = initializeCamera(
        scene,
        renderer
    );

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
        0.00008
    );

    const ambientLight =
        new THREE.AmbientLight(
            COLORS.lighting.ambient,
            0.7
        );

    scene.add(ambientLight);

    const sunLight =
        new THREE.PointLight(
            COLORS.lighting.sunlight,
            6,
            1000000
        );

    sunLight.position.set(0, 0, 0);

    scene.add(sunLight);
}


// ============================================================
// RENDERER
// ============================================================

function createRenderer() {

    const container =
        document.getElementById(
            "canvasContainer"
        );

    renderer =
        new THREE.WebGLRenderer({
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

    renderer.outputColorSpace =
        THREE.SRGBColorSpace;

    renderer.shadowMap.enabled = true;

    if (container) {

        container.innerHTML = "";

        container.appendChild(
            renderer.domElement
        );
    }
}


// ============================================================
// UNIVERSE GROUPS
// ============================================================

function createUniverseGroups() {

    solarSystem =
        new THREE.Group();

    solarSystem.name =
        "Solar System";

    deepSpaceGroup =
        new THREE.Group();

    deepSpaceGroup.name =
        "Deep Space";

    galaxyGroup =
        new THREE.Group();

    galaxyGroup.name =
        "Galaxies";

    nebulaGroup =
        new THREE.Group();

    nebulaGroup.name =
        "Nebulae";

    blackHoleGroup =
        new THREE.Group();

    blackHoleGroup.name =
        "Black Holes";

    asteroidGroup =
        new THREE.Group();

    asteroidGroup.name =
        "Asteroids";

    cometGroup =
        new THREE.Group();

    cometGroup.name =
        "Comets";

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
            : Object.values(allCelestialObjects || {})),

        ...(Array.isArray(moonObjects)
            ? moonObjects
            : Object.values(moonObjects || {}))
    ];

    objects.forEach(data => {

        if (!data || !data.name) {
            return;
        }

        const radius =
            Math.max(
                Number(data.radius) || 1,
                0.5
            );

        const geometry =
            new THREE.SphereGeometry(
                radius,
                64,
                64
            );

        const material =
            new THREE.MeshStandardMaterial({
                color:
                    data.color || 0xffffff,

                roughness: 0.7,

                metalness: 0.02
            });

        const mesh =
            new THREE.Mesh(
                geometry,
                material
            );

        mesh.name =
            data.name;

        if (data.position) {

            mesh.position.set(
                Number(data.position.x) || 0,
                Number(data.position.y) || 0,
                Number(data.position.z) || 0
            );
        }

        mesh.userData = {
            type:
                data.type || "Planet",

            name:
                data.name,

            data
        };

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        solarSystem.add(mesh);

        objectMeshes.push(mesh);

        objectMap.set(
            data.name.toLowerCase(),
            mesh
        );

        if (data.name === "Earth") {

            createEarthAtmosphere(
                mesh,
                radius
            );
        }

        if (data.name === "Sun") {

            createSunGlow(
                mesh,
                radius
            );
        }

        if (data.name === "Saturn") {

            createSaturnRings(
                mesh,
                radius
            );
        }
    });
}


// ============================================================
// EARTH ATMOSPHERE
// ============================================================

function createEarthAtmosphere(
    parent,
    radius
) {

    const geometry =
        new THREE.SphereGeometry(
            radius * 1.08,
            64,
            64
        );

    const material =
        new THREE.MeshBasicMaterial({
            color:
                COLORS.planets.earth.atmosphere,

            transparent: true,

            opacity: 0.18,

            side: THREE.BackSide,

            depthWrite: false
        });

    const atmosphere =
        new THREE.Mesh(
            geometry,
            material
        );

    parent.add(atmosphere);
}


// ============================================================
// SUN GLOW
// ============================================================

function createSunGlow(
    parent,
    radius
) {

    const geometry =
        new THREE.SphereGeometry(
            radius * 1.5,
            32,
            32
        );

    const material =
        new THREE.MeshBasicMaterial({
            color:
                COLORS.sun.glow,

            transparent: true,

            opacity: 0.16,

            side: THREE.BackSide,

            depthWrite: false
        });

    const glow =
        new THREE.Mesh(
            geometry,
            material
        );

    parent.add(glow);
}


// ============================================================
// SATURN RINGS
// ============================================================

function createSaturnRings(
    parent,
    radius
) {

    const geometry =
        new THREE.RingGeometry(
            radius * 1.45,
            radius * 2.4,
            128
        );

    const material =
        new THREE.MeshBasicMaterial({
            color:
                COLORS.planets.saturn.rings,

            transparent: true,

            opacity: 0.8,

            side: THREE.DoubleSide,

            depthWrite: false
        });

    const rings =
        new THREE.Mesh(
            geometry,
            material
        );

    rings.rotation.x =
        Math.PI / 2;

    parent.add(rings);
}


// ============================================================
// DEEP SPACE
// ============================================================

function createDeepSpace() {

    const objects =
        Array.isArray(deepSpaceObjects)
            ? deepSpaceObjects
            : Object.values(
                deepSpaceObjects || {}
            );

    objects.forEach(data => {

        if (!data || !data.name) {
            return;
        }

        const position =
            data.position || {};

        const radius =
            Number(data.radius) || 30;

        const geometry =
            new THREE.SphereGeometry(
                radius,
                32,
                32
            );

        const material =
            new THREE.MeshBasicMaterial({
                color:
                    data.color || 0xffffff,

                transparent: true,

                opacity: 0.75
            });

        const mesh =
            new THREE.Mesh(
                geometry,
                material
            );

        mesh.position.set(
            Number(position.x) || 0,
            Number(position.y) || 0,
            Number(position.z) || 0
        );

        mesh.name =
            data.name;

        mesh.userData = {
            type:
                data.type || "Deep Space Object",

            name:
                data.name,

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

    const objects =
        Array.isArray(nebulaObjects)
            ? nebulaObjects
            : Object.values(
                nebulaObjects || {}
            );

    objects.forEach(data => {

        if (!data) {
            return;
        }

        const position =
            data.position || {};

        const size =
            Number(data.size) || 300;

        const geometry =
            new THREE.SphereGeometry(
                size,
                32,
                32
            );

        const material =
            new THREE.MeshBasicMaterial({
                color:
                    data.color ||
                    COLORS.nebulae.purple,

                transparent: true,

                opacity: 0.12,

                depthWrite: false,

                side: THREE.DoubleSide
            });

        const mesh =
            new THREE.Mesh(
                geometry,
                material
            );

        mesh.position.set(
            Number(position.x) || 0,
            Number(position.y) || 0,
            Number(position.z) || 0
        );

        mesh.name =
            data.name || "Nebula";

        mesh.userData = {
            type: "Nebula",

            name: mesh.name,

            data
        };

        nebulaGroup.add(mesh);

        objectMeshes.push(mesh);

        objectMap.set(
            mesh.name.toLowerCase(),
            mesh
        );
    });
}


// ============================================================
// GALAXIES
// ============================================================

function createGalaxies() {

    const objects =
        Array.isArray(galaxyObjects)
            ? galaxyObjects
            : Object.values(
                galaxyObjects || {}
            );

    objects.forEach(data => {

        if (!data) {
            return;
        }

        const group =
            new THREE.Group();

        const position =
            data.position || {};

        group.position.set(
            Number(position.x) || 0,
            Number(position.y) || 0,
            Number(position.z) || 0
        );

        const particleCount =
            Number(data.count) || 2500;

        const size =
            Number(data.size) || 500;

        const positions =
            new Float32Array(
                particleCount * 3
            );

        const colors =
            new Float32Array(
                particleCount * 3
            );

        const color =
            new THREE.Color(
                data.color ||
                COLORS.galaxies.andromeda
            );

        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            const radius =
                Math.pow(
                    Math.random(),
                    0.65
                ) * size;

            const angle =
                Math.random() *
                Math.PI *
                2 +
                radius * 0.008;

            const x =
                Math.cos(angle) *
                radius;

            const z =
                Math.sin(angle) *
                radius;

            const y =
                (Math.random() - 0.5) *
                size *
                0.08;

            const index =
                i * 3;

            positions[index] =
                x;

            positions[index + 1] =
                y;

            positions[index + 2] =
                z;

            colors[index] =
                color.r;

            colors[index + 1] =
                color.g;

            colors[index + 2] =
                color.b;
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
                size:
                    Number(
                        data.particleSize
                    ) || 3,

                vertexColors: true,

                transparent: true,

                opacity: 0.8,

                depthWrite: false
            });

        const points =
            new THREE.Points(
                geometry,
                material
            );

        group.add(points);

        group.name =
            data.name || "Galaxy";

        group.userData = {
            type: "Galaxy",

            name: group.name,

            data
        };

        galaxyGroup.add(group);

        objectMeshes.push(group);

        objectMap.set(
            group.name.toLowerCase(),
            group
        );
    });
}


// ============================================================
// BLACK HOLES
// ============================================================

function createBlackHoles() {

    const objects =
        Array.isArray(deepSpaceObjects)
            ? deepSpaceObjects
            : Object.values(
                deepSpaceObjects || {}
            );

    objects
        .filter(data =>
            data &&
            (
                data.type === "Black Hole" ||
                data.type === "BlackHole"
            )
        )
        .forEach(data => {

            const group =
                new THREE.Group();

            const position =
                data.position || {};

            group.position.set(
                Number(position.x) || 0,
                Number(position.y) || 0,
                Number(position.z) || 0
            );

            const radius =
                Number(data.radius) || 20;

            const core =
                new THREE.Mesh(
                    new THREE.SphereGeometry(
                        radius,
                        64,
                        64
                    ),
                    new THREE.MeshBasicMaterial({
                        color: 0x000000
                    })
                );

            group.add(core);

            const ring =
                new THREE.Mesh(
                    new THREE.RingGeometry(
                        radius * 1.4,
                        radius * 3.5,
                        128
                    ),
                    new THREE.MeshBasicMaterial({
                        color:
                            COLORS.blackHoles.accretionDisk,

                        transparent: true,

                        opacity: 0.75,

                        side: THREE.DoubleSide,

                        depthWrite: false
                    })
                );

            ring.rotation.x =
                Math.PI / 2;

            group.add(ring);

            group.name =
                data.name || "Black Hole";

            group.userData = {
                type: "Black Hole",

                name: group.name,

                data
            };

            blackHoleGroup.add(group);

            objectMeshes.push(group);

            objectMap.set(
                group.name.toLowerCase(),
                group
            );
        });
        }
    // ============================================================
// ASTEROID BELT
// ============================================================

function createAsteroidBelt() {

    if (!asteroidBelt) return;

    const count =
        Number(asteroidBelt.count) || 1000;

    const minRadius =
        Number(asteroidBelt.minRadius) || 60;

    const maxRadius =
        Number(asteroidBelt.maxRadius) || 85;

    for (let i = 0; i < count; i++) {

        const radius =
            THREE.MathUtils.lerp(
                minRadius,
                maxRadius,
                Math.random()
            );

        const angle =
            Math.random() * Math.PI * 2;

        const size =
            Math.random() * 0.7 + 0.2;

        const asteroid =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    size,
                    8,
                    8
                ),
                new THREE.MeshStandardMaterial({
                    color:
                        COLORS.asteroids.main,

                    roughness: 1
                })
            );

        asteroid.position.set(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 4,
            Math.sin(angle) * radius
        );

        asteroid.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        asteroidGroup.add(asteroid);
    }
}


// ============================================================
// KUIPER BELT
// ============================================================

function createKuiperBelt() {

    if (!kuiperBelt) return;

    const count =
        Number(kuiperBelt.count) || 700;

    const minRadius =
        Number(kuiperBelt.minRadius) || 180;

    const maxRadius =
        Number(kuiperBelt.maxRadius) || 230;

    for (let i = 0; i < count; i++) {

        const radius =
            THREE.MathUtils.lerp(
                minRadius,
                maxRadius,
                Math.random()
            );

        const angle =
            Math.random() * Math.PI * 2;

        const size =
            Math.random() * 0.5 + 0.15;

        const object =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    size,
                    8,
                    8
                ),
                new THREE.MeshBasicMaterial({
                    color:
                        COLORS.kuiperBelt.main
                })
            );

        object.position.set(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 8,
            Math.sin(angle) * radius
        );

        deepSpaceGroup.add(object);
    }
}


// ============================================================
// OORT CLOUD
// ============================================================

function createOortCloud() {

    if (!oortCloud) return;

    const count =
        Number(oortCloud.count) || 500;

    const minRadius =
        Number(oortCloud.minRadius) || 350;

    const maxRadius =
        Number(oortCloud.maxRadius) || 500;

    for (let i = 0; i < count; i++) {

        const radius =
            THREE.MathUtils.lerp(
                minRadius,
                maxRadius,
                Math.random()
            );

        const theta =
            Math.random() * Math.PI * 2;

        const phi =
            Math.acos(
                THREE.MathUtils.randFloatSpread(2)
            );

        const object =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.2,
                    6,
                    6
                ),
                new THREE.MeshBasicMaterial({
                    color:
                        COLORS.oortCloud.main
                })
            );

        object.position.set(
            radius *
            Math.sin(phi) *
            Math.cos(theta),

            radius *
            Math.cos(phi),

            radius *
            Math.sin(phi) *
            Math.sin(theta)
        );

        deepSpaceGroup.add(object);
    }
}


// ============================================================
// COMETS
// ============================================================

function createComets() {

    if (!cometObjects) return;

    const objects =
        Array.isArray(cometObjects)
            ? cometObjects
            : Object.values(
                cometObjects || {}
            );

    objects.forEach(data => {

        if (!data) return;

        const group =
            new THREE.Group();

        const radius =
            Number(data.radius) || 1;

        const position =
            data.position || {};

        group.position.set(
            Number(position.x) || 0,
            Number(position.y) || 0,
            Number(position.z) || 0
        );

        const nucleus =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    radius,
                    24,
                    24
                ),
                new THREE.MeshStandardMaterial({
                    color:
                        COLORS.comets.nucleus,

                    roughness: 0.9
                })
            );

        group.add(nucleus);

        const tailLength =
            Number(data.tailLength) || 25;

        const tail =
            new THREE.Mesh(
                new THREE.ConeGeometry(
                    radius * 2,
                    tailLength,
                    16,
                    1,
                    true
                ),
                new THREE.MeshBasicMaterial({
                    color:
                        COLORS.comets.tail,

                    transparent: true,

                    opacity: 0.25,

                    side: THREE.DoubleSide,

                    depthWrite: false
                })
            );

        tail.rotation.z =
            Math.PI / 2;

        tail.position.x =
            -tailLength / 2;

        group.add(tail);

        group.name =
            data.name || "Comet";

        group.userData = {
            type: "Comet",

            name: group.name,

            data
        };

        cometGroup.add(group);

        objectMeshes.push(group);

        objectMap.set(
            group.name.toLowerCase(),
            group
        );
    });
}


// ============================================================
// ORBITS
// ============================================================

function createOrbits() {

    const objects =
        Array.isArray(allCelestialObjects)
            ? allCelestialObjects
            : Object.values(
                allCelestialObjects || {}
            );

    objects.forEach(data => {

        if (!data || !data.orbit) {
            return;
        }

        const position =
            data.position || {};

        const radius =
            Number(data.orbit.radius) ||
            Math.sqrt(
                Math.pow(
                    Number(position.x) || 0,
                    2
                ) +
                Math.pow(
                    Number(position.z) || 0,
                    2
                )
            );

        if (radius <= 1) {
            return;
        }

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
                    COLORS.orbits.default,

                transparent: true,

                opacity: 0.25
            });

        const line =
            new THREE.LineLoop(
                geometry,
                material
            );

        solarSystem.add(line);
    });
}


// ============================================================
// RAYCASTER
// ============================================================

function initializeRaycaster() {

    raycaster =
        new THREE.Raycaster();

    mouse =
        new THREE.Vector2();
}


// ============================================================
// EVENTS
// ============================================================

function initializeEvents() {

    renderer.domElement.addEventListener(
        "click",
        handleCanvasClick
    );

    window.addEventListener(
        "resize",
        handleResize
    );

    window.addEventListener(
        "universe:objectSelected",
        event => {

            const name =
                event.detail?.name;

            if (name) {
                focusObjectByName(name);
            }
        }
    );

    window.addEventListener(
        "universe:search",
        event => {

            const query =
                event.detail?.query;

            if (query) {
                searchObject(query);
            }
        }
    );

    window.addEventListener(
        "universe:focusObjectByName",
        event => {

            const name =
                event.detail?.name;

            if (name) {
                focusObjectByName(name);
            }
        }
    );

    window.addEventListener(
        "universe:tourObject",
        event => {

            const name =
                event.detail?.name;

            if (name) {
                focusObjectByName(name);
            }
        }
    );

    window.addEventListener(
        "universe:explore",
        resetExplorer
    );

    window.addEventListener(
        "universe:resetCamera",
        () => {

            selectedObject = null;
            selectedData = null;
        }
    );
}


// ============================================================
// CANVAS CLICK
// ============================================================

function handleCanvasClick(event) {

    const rect =
        renderer.domElement.getBoundingClientRect();

    mouse.x =
        ((event.clientX - rect.left) /
            rect.width) * 2 - 1;

    mouse.y =
        -((event.clientY - rect.top) /
            rect.height) * 2 + 1;

    raycaster.setFromCamera(
        mouse,
        camera
    );

    const intersects =
        raycaster.intersectObjects(
            objectMeshes,
            true
        );

    if (!intersects.length) {
        return;
    }

    let object =
        intersects[0].object;

    while (
        object.parent &&
        !object.userData?.data
    ) {
        object =
            object.parent;
    }

    if (!object.userData?.data) {
        return;
    }

    selectObject(object);
}


// ============================================================
// SELECT OBJECT
// ============================================================

function selectObject(object) {

    selectedObject =
        object;

    selectedData =
        object.userData.data;

    updateSelectedStatus(
        selectedData.name
    );

    window.dispatchEvent(
        new CustomEvent(
            "universe:objectSelected",
            {
                detail: {
                    object,
                    data: selectedData,
                    name: selectedData.name
                }
            }
        )
    );
}


// ============================================================
// SEARCH
// ============================================================

function searchObject(query) {

    const search =
        query
            .toLowerCase()
            .trim();

    if (!search) return;

    const match =
        [...objectMap.entries()]
            .find(
                ([name]) =>
                    name.includes(search)
            );

    if (!match) {

        window.dispatchEvent(
            new CustomEvent(
                "universe:searchResults",
                {
                    detail: {
                        results: []
                    }
                }
            )
        );

        return;
    }

    const object =
        match[1];

    selectObject(object);

    focusObjectByName(
        object.userData?.data?.name ||
        object.name
    );
}


// ============================================================
// FOCUS OBJECT
// ============================================================

function focusObjectByName(name) {

    if (!name) return;

    const object =
        objectMap.get(
            name.toLowerCase()
        );

    if (!object) return;

    selectedObject =
        object;

    selectedData =
        object.userData?.data || null;

    const radius =
        object.geometry?.parameters?.radius ||
        selectedData?.radius ||
        10;

    const distance =
        Math.max(
            radius * 5,
            15
        );

    focusCameraOnObject(
        object,
        distance,
        1200
    );

    if (selectedData) {

        updateSelectedStatus(
            selectedData.name
        );

        window.dispatchEvent(
            new CustomEvent(
                "universe:objectSelected",
                {
                    detail: {
                        object,
                        data: selectedData,
                        name: selectedData.name
                    }
                }
            )
        );
    }
}


// ============================================================
// RESET EXPLORER
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

    updatePosition(
        camera.position
    );

    updateScale(
        camera.position.length()
    );
}


// ============================================================
// ANIMATION
// ============================================================

function animate() {

    requestAnimationFrame(
        animate
    );

    const time =
        performance.now() * 0.0001;

    objectMeshes.forEach(
        object => {

            const data =
                object.userData?.data;

            if (!data) return;

            if (
                data.type === "Planet" ||
                data.type === "Moon" ||
                data.type === "Star"
            ) {
                object.rotation.y +=
                    0.0015;
            }
        }
    );

    if (galaxyGroup) {

        galaxyGroup.rotation.y =
            time * 0.08;
    }

    if (nebulaGroup) {

        nebulaGroup.rotation.y =
            time * 0.02;
    }

    if (blackHoleGroup) {

        blackHoleGroup.rotation.y =
            time * 0.4;
    }

    updateEffects();

    updateCamera();

    if (camera) {

        updatePosition(
            camera.position
        );

        updateScale(
            camera.position.length()
        );
    }

    renderer.render(
        scene,
        camera
    );
}


// ============================================================
// RESIZE
// ============================================================

function handleResize() {

    if (!camera || !renderer) {
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
}


// ============================================================
// LOADING SCREEN
// ============================================================

function hideLoadingScreen() {

    const loading =
        document.getElementById(
            "loadingScreen"
        );

    if (!loading) return;

    setTimeout(() => {

        loading.classList.add(
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
    
