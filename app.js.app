import * as THREE from "three";

import { initializeWelcome } from "./welcome.js";

import {
    initializeExplorationControls,
    setExplorationMode
} from "./explorationControls.js";

import {
    initializeCamera,
    getCamera,
    getControls,
    updateCamera
} from "./camera.js";

import {
    initializeInformation,
    openInformation,
    closeInformation
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
    updateMode,
    updateRegion,
    updateSelectedStatus,
    hideLoadingScreen
} from "./interface.js";

import {
    celestialObjects,
    moonObjects,
    allCelestialObjects,
    getCelestialObject
} from "./celestialBodies.js";

import {
    deepSpaceObjects,
    galaxyObjects,
    nebulaObjects,
    cometObjects,
    asteroidBelt,
    kuiperBelt,
    oortCloud
} from "./universe.js";

let scene;
let renderer;

let camera;
let controls;

let universeGroup;
let solarSystemGroup;
let celestialGroup;
let deepSpaceGroup;
let effects;

let raycaster;
let mouse;

let selectedObject = null;
let selectedData = null;

let clock;

let initialized = false;

const objectMeshes = new Map();

const textureLoader =
    new THREE.TextureLoader();


// --------------------------------------------------
// INITIALIZATION
// --------------------------------------------------

function initializeApp() {
    if (initialized) return;

    initialized = true;

    clock = new THREE.Clock();

    createScene();
    createRenderer();

    const cameraSystem =
        initializeCamera(
            scene,
            renderer
        );

    camera =
        cameraSystem.camera;

    controls =
        cameraSystem.controls;

    effects =
        initializeEffects(
            scene
        );

    createUniverse();

    setupRaycasting();
    setupEvents();

    initializeInterface();
    initializeInformation();
    initializeGuide();
    initializeExplorationControls();
    initializeWelcome();

    setExplorationMode("FREE");

    updateMode("FREE");
    updateRegion("SOLAR SYSTEM");
    updateSelectedStatus();

    animate();

    setTimeout(() => {
        hideLoadingScreen();
    }, 1200);
}


// --------------------------------------------------
// SCENE
// --------------------------------------------------

function createScene() {
    scene =
        new THREE.Scene();

    scene.background =
        new THREE.Color(
            0x01030a
        );

    scene.fog =
        new THREE.FogExp2(
            0x01030a,
            0.00001
        );

    universeGroup =
        new THREE.Group();

    solarSystemGroup =
        new THREE.Group();

    celestialGroup =
        new THREE.Group();

    deepSpaceGroup =
        new THREE.Group();

    scene.add(
        universeGroup
    );

    universeGroup.add(
        solarSystemGroup
    );

    solarSystemGroup.add(
        celestialGroup
    );

    universeGroup.add(
        deepSpaceGroup
    );

    createLighting();
}


// --------------------------------------------------
// RENDERER
// --------------------------------------------------

function createRenderer() {
    const container =
        document.getElementById(
            "canvasContainer"
        );

    if (!container) {
        console.error(
            "canvasContainer not found."
        );

        return;
    }

    renderer =
        new THREE.WebGLRenderer({
            antialias: true,
            alpha: false
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

    renderer.shadowMap.enabled =
        true;

    renderer.shadowMap.type =
        THREE.PCFSoftShadowMap;

    container.appendChild(
        renderer.domElement
    );
}


// --------------------------------------------------
// LIGHTING
// --------------------------------------------------

function createLighting() {
    const ambient =
        new THREE.AmbientLight(
            0x6688aa,
            0.18
        );

    scene.add(
        ambient
    );

    const sunlight =
        new THREE.PointLight(
            0xfff4dd,
            5,
            0,
            1.5
        );

    sunlight.position.set(
        0,
        0,
        0
    );

    sunlight.castShadow =
        true;

    sunlight.shadow.mapSize.width =
        2048;

    sunlight.shadow.mapSize.height =
        2048;

    scene.add(
        sunlight
    );
}


// --------------------------------------------------
// UNIVERSE
// --------------------------------------------------

function createUniverse() {
    createCelestialBodies();
    createDeepSpaceObjects();

    createAsteroidBelt();
    createKuiperBelt();
    createOortCloud();

    createComets();
}


// --------------------------------------------------
// CELESTIAL BODIES
// --------------------------------------------------

function createCelestialBodies() {
    allCelestialObjects.forEach(
        data => {
            createCelestialObject(
                data
            );
        }
    );
}

function createCelestialObject(
    data
) {
    const radius =
        getDisplayRadius(
            data
        );

    const geometry =
        new THREE.SphereGeometry(
            radius,
            64,
            64
        );

    const material =
        createBodyMaterial(
            data
        );

    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );

    mesh.position.set(
        data.position.x,
        data.position.y,
        data.position.z
    );

    mesh.userData = {
        type:
            data.type || "Unknown",

        name:
            data.name,

        data
    };

    mesh.castShadow =
        true;

    mesh.receiveShadow =
        true;

    celestialGroup.add(
        mesh
    );

    objectMeshes.set(
        data.name,
        mesh
    );

    createOrbit(
        data
    );

    if (
        data.name === "Earth"
    ) {
        createAtmosphere(
            mesh
        );
    }

    if (
        data.name === "Saturn"
    ) {
        createSaturnRings(
            mesh,
            radius
        );
    }
}


// --------------------------------------------------
// BODY MATERIALS
// --------------------------------------------------

function createBodyMaterial(
    data
) {
    const color =
        typeof data.color ===
        "number"
            ? data.color
            : 0x6c8cff;

    const material =
        new THREE.MeshStandardMaterial({
            color,
            roughness: 0.78,
            metalness: 0.02
        });

    if (
        data.name === "Sun" ||
        data.type === "Star"
    ) {
        material.emissive =
            new THREE.Color(
                color
            );

        material.emissiveIntensity =
            1.8;

        material.roughness =
            0.45;
    }

    return material;
}

function getDisplayRadius(
    data
) {
    const radius =
        Number(
            data.radius
        ) || 1;

    if (
        data.name === "Sun"
    ) {
        return 14;
    }

    if (
        data.type === "Planet"
    ) {
        return Math.max(
            1.8,
            Math.min(
                radius * 0.35,
                7
            )
        );
    }

    if (
        data.type === "Moon"
    ) {
        return Math.max(
            0.8,
            Math.min(
                radius * 0.5,
                2.5
            )
        );
    }

    return Math.max(
        1,
        Math.min(
            radius * 0.4,
            5
        )
    );
}


// --------------------------------------------------
// ATMOSPHERE
// --------------------------------------------------

function createAtmosphere(
    planet
) {
    const radius =
        planet.geometry.parameters.radius;

    const geometry =
        new THREE.SphereGeometry(
            radius * 1.08,
            64,
            64
        );

    const material =
        new THREE.MeshBasicMaterial({
            color: 0x4da6ff,
            transparent: true,
            opacity: 0.12,
            side: THREE.BackSide,
            blending:
                THREE.AdditiveBlending,
            depthWrite: false
        });

    const atmosphere =
        new THREE.Mesh(
            geometry,
            material
        );

    planet.add(
        atmosphere
    );
}


// --------------------------------------------------
// SATURN RINGS
// --------------------------------------------------

function createSaturnRings(
    planet,
    radius
) {
    const geometry =
        new THREE.RingGeometry(
            radius * 1.5,
            radius * 2.6,
            96
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0xc8b995,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.78,
            roughness: 0.9
        });

    const rings =
        new THREE.Mesh(
            geometry,
            material
        );

    rings.rotation.x =
        Math.PI / 2.4;

    planet.add(
        rings
    );
}


// --------------------------------------------------
// ORBITS
// --------------------------------------------------

function createOrbit(
    data
) {
    if (
        !data.orbit ||
        data.name === "Sun"
    ) {
        return;
    }

    const orbitRadius =
        Math.sqrt(
            data.position.x *
                data.position.x +
            data.position.z *
                data.position.z
        );

    if (
        orbitRadius < 15
    ) {
        return;
    }

    const curve =
        new THREE.EllipseCurve(
            0,
            0,
            orbitRadius,
            orbitRadius,
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
            color: 0x385878,
            transparent: true,
            opacity: 0.28
        });

    const line =
        new THREE.LineLoop(
            geometry,
            material
        );

    line.userData.isOrbit =
        true;

    solarSystemGroup.add(
        line
    );
}


// --------------------------------------------------
// DEEP SPACE
// --------------------------------------------------

function createDeepSpaceObjects() {
    createGalaxies();
    createNebulae();
    createBlackHoles();
}


// --------------------------------------------------
// GALAXIES
// --------------------------------------------------

function createGalaxies() {
    galaxyObjects.forEach(
        galaxy => {
            const group =
                createGalaxy(
                    galaxy
                );

            deepSpaceGroup.add(
                group
            );

            objectMeshes.set(
                galaxy.name,
                group
            );
        }
    );
}

function createGalaxy(
    data
) {
    const group =
        new THREE.Group();

    const particleCount =
        1800;

    const positions =
        new Float32Array(
            particleCount * 3
        );

    const colors =
        new Float32Array(
            particleCount * 3
        );

    const baseColor =
        new THREE.Color(
            data.color ||
            0x8aaaff
        );

    for (
        let i = 0;
        i < particleCount;
        i++
    ) {
        const i3 =
            i * 3;

        const radius =
            Math.pow(
                Math.random(),
                0.65
            ) * 35;

        const angle =
            radius * 0.42 +
            Math.random() * 0.8;

        const arm =
            Math.random() >
            0.5
                ? 1
                : -1;

        positions[i3] =
            Math.cos(
                angle * arm
            ) * radius;

        positions[i3 + 1] =
            (Math.random() - 0.5) *
            Math.max(
                0.5,
                radius * 0.08
            );

        positions[i3 + 2] =
            Math.sin(
                angle * arm
            ) * radius;

        colors[i3] =
            baseColor.r;

        colors[i3 + 1] =
            baseColor.g;

        colors[i3 + 2] =
            baseColor.b;
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
            size: 0.45,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending:
                THREE.AdditiveBlending,
            depthWrite: false
        });

    const points =
        new THREE.Points(
            geometry,
            material
        );

    group.add(
        points
    );

    group.position.set(
        data.position.x,
        data.position.y,
        data.position.z
    );

    group.userData = {
        name: data.name,
        type:
            data.type ||
            "Galaxy",
        data
    };

    return group;
}


// --------------------------------------------------
// NEBULAE
// --------------------------------------------------

function createNebulae() {
    nebulaObjects.forEach(
        nebula => {
            const geometry =
                new THREE.SphereGeometry(
                    nebula.size || 100,
                    32,
                    32
                );

            const material =
                new THREE.MeshBasicMaterial({
                    color:
                        nebula.color ||
                        0x5636aa,
                    transparent: true,
                    opacity:
                        nebula.opacity ||
                        0.055,
                    side:
                        THREE.BackSide,
                    blending:
                        THREE.AdditiveBlending,
                    depthWrite: false
                });

            const mesh =
                new THREE.Mesh(
                    geometry,
                    material
                );

            mesh.position.set(
                nebula.position.x,
                nebula.position.y,
                nebula.position.z
            );

            mesh.userData = {
                name: nebula.name,
                type: "Nebula",
                data: nebula
            };

            deepSpaceGroup.add(
                mesh
            );

            objectMeshes.set(
                nebula.name,
                mesh
            );
        }
    );
}


// --------------------------------------------------
// BLACK HOLES
// --------------------------------------------------

function createBlackHoles() {
    deepSpaceObjects
        .filter(
            object =>
                object.type ===
                "Black Hole"
        )
        .forEach(
            data => {
                const group =
                    createBlackHole(
                        data
                    );

                deepSpaceGroup.add(
                    group
                );

                objectMeshes.set(
                    data.name,
                    group
                );
            }
        );
}

function createBlackHole(
    data
) {
    const group =
        new THREE.Group();

    const coreGeometry =
        new THREE.SphereGeometry(
            data.radius || 8,
            64,
            64
        );

    const coreMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x000000
        });

    const core =
        new THREE.Mesh(
            coreGeometry,
            coreMaterial
        );

    group.add(
        core
    );

    const diskGeometry =
        new THREE.TorusGeometry(
            (data.radius || 8) * 1.7,
            (data.radius || 8) * 0.35,
            32,
            96
        );

    const diskMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xff5a18,
            transparent: true,
            opacity: 0.75,
            blending:
                THREE.AdditiveBlending
        });

    const disk =
        new THREE.Mesh(
            diskGeometry,
            diskMaterial
        );

    disk.rotation.x =
        Math.PI / 2;

    group.add(
        disk
    );

    group.position.set(
        data.position.x,
        data.position.y,
        data.position.z
    );

    group.userData = {
        name: data.name,
        type: "Black Hole",
        data
    };

    return group;
}


// --------------------------------------------------
// ASTEROID BELT
// --------------------------------------------------

function createAsteroidBelt() {
    if (!asteroidBelt) return;

    const group =
        new THREE.Group();

    const count =
        asteroidBelt.count ||
        1000;

    for (
        let i = 0;
        i < count;
        i++
    ) {
        const angle =
            Math.random() *
            Math.PI * 2;

        const radius =
            asteroidBelt.minRadius +
            Math.random() *
            (
                asteroidBelt.maxRadius -
                asteroidBelt.minRadius
            );

        const size =
            0.08 +
            Math.random() *
            0.35;

        const geometry =
            new THREE.IcosahedronGeometry(
                size,
                1
            );

        const material =
            new THREE.MeshStandardMaterial({
                color:
                    0x8e857b,
                roughness: 1
            });

        const asteroid =
            new THREE.Mesh(
                geometry,
                material
            );

        asteroid.position.set(
            Math.cos(angle) *
                radius,
            (Math.random() - 0.5) *
                4,
            Math.sin(angle) *
                radius
        );

        asteroid.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        group.add(
            asteroid
        );
    }

    group.userData.isAsteroidBelt =
        true;

    solarSystemGroup.add(
        group
    );
}


// --------------------------------------------------
// KUIPER BELT
// --------------------------------------------------

function createKuiperBelt() {
    if (!kuiperBelt) return;

    const group =
        new THREE.Group();

    const count =
        kuiperBelt.count ||
        700;

    for (
        let i = 0;
        i < count;
        i++
    ) {
        const angle =
            Math.random() *
            Math.PI * 2;

        const radius =
            kuiperBelt.minRadius +
            Math.random() *
            (
                kuiperBelt.maxRadius -
                kuiperBelt.minRadius
            );

        const geometry =
            new THREE.IcosahedronGeometry(
                0.1 +
                    Math.random() *
                    0.25,
                1
            );

        const material =
            new THREE.MeshStandardMaterial({
                color:
                    0x9ca5b5,
                roughness: 1
            });

        const object =
            new THREE.Mesh(
                geometry,
                material
            );

        object.position.set(
            Math.cos(angle) *
                radius,
            (Math.random() - 0.5) *
                7,
            Math.sin(angle) *
                radius
        );

        group.add(
            object
        );
    }

    solarSystemGroup.add(
        group
    );
}


// --------------------------------------------------
// OORT CLOUD
// --------------------------------------------------

function createOortCloud() {
    if (!oortCloud) return;

    const geometry =
        new THREE.SphereGeometry(
            oortCloud.radius ||
                7000,
            32,
            32
        );

    const material =
        new THREE.MeshBasicMaterial({
            color:
                0x768aa5,
            transparent: true,
            opacity: 0.025,
            wireframe: true
        });

    const cloud =
        new THREE.Mesh(
            geometry,
            material
        );

    solarSystemGroup.add(
        cloud
    );
}


// --------------------------------------------------
// COMETS
// --------------------------------------------------

function createComets() {
    if (!cometObjects) return;

    cometObjects.forEach(
        comet => {
            const group =
                new THREE.Group();

            const nucleus =
                new THREE.Mesh(
                    new THREE.SphereGeometry(
                        comet.radius ||
                            0.8,
                        24,
                        24
                    ),
                    new THREE.MeshStandardMaterial({
                        color:
                            0xcfd8df,
                        roughness: 1
                    })
                );

            group.add(
                nucleus
            );

            const tail =
                new THREE.Mesh(
                    new THREE.ConeGeometry(
                        comet.tailLength ||
                            12,
                        comet.tailLength ||
                            12,
                        16,
                        1,
                        true
                    ),
                    new THREE.MeshBasicMaterial({
                        color:
                            0x8ddcff,
                        transparent: true,
                        opacity: 0.22,
                        blending:
                            THREE.AdditiveBlending,
                        side:
                            THREE.DoubleSide
                    })
                );

            tail.rotation.z =
                Math.PI / 2;

            tail.position.x =
                -(comet.tailLength ||
                    12) /
                2;

            group.add(
                tail
            );

            group.position.set(
                comet.position.x,
                comet.position.y,
                comet.position.z
            );

            group.userData = {
                name: comet.name,
                type: "Comet",
                data: comet
            };

            deepSpaceGroup.add(
                group
            );

            objectMeshes.set(
                comet.name,
                group
            );
        }
    );
}


// --------------------------------------------------
// RAYCASTING
// --------------------------------------------------

function setupRaycasting() {
    raycaster =
        new THREE.Raycaster();

    mouse =
        new THREE.Vector2();

    renderer.domElement.addEventListener(
        "pointerdown",
        handlePointerDown
    );
}

function handlePointerDown(
    event
) {
    const rect =
        renderer.domElement.getBoundingClientRect();

    mouse.x =
        (
            (event.clientX -
                rect.left) /
                rect.width
        ) *
            2 -
        1;

    mouse.y =
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
        mouse,
        camera
    );

    const objects = [
        ...celestialGroup.children,
        ...deepSpaceGroup.children
    ];

    const intersections =
        raycaster.intersectObjects(
            objects,
            true
        );

    if (!intersections.length) {
        return;
    }

    let object =
        intersections[0].object;

    while (
        object.parent &&
        !object.userData?.data
    ) {
        object =
            object.parent;
    }

    if (
        !object.userData?.data
    ) {
        return;
    }

    selectObject(
        object,
        object.userData.data
    );
}


// --------------------------------------------------
// SELECTION
// --------------------------------------------------

function selectObject(
    object,
    data
) {
    selectedObject =
        object;

    selectedData =
        data;

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

    openInformation(
        object,
        data
    );

    updateSelectedStatus();
}


// --------------------------------------------------
// EVENTS
// --------------------------------------------------

function setupEvents() {
    window.addEventListener(
        "universe:focusObject",
        event => {
            const object =
                event.detail?.object;

            if (!object) return;

            focusObject(
                object
            );
        }
    );

    window.addEventListener(
        "universe:focusObjectByName",
        event => {
            const name =
                event.detail?.name;

            if (!name) return;

            focusObjectByName(
                name
            );
        }
    );

    window.addEventListener(
        "universe:search",
        event => {
            const query =
                event.detail?.query;

            handleSearch(
                query
            );
        }
    );

    window.addEventListener(
        "universe:home",
        () => {
            closeInformation();
        }
    );

    window.addEventListener(
        "universe:freeMode",
        () => {
            updateMode(
                "FREE"
            );
        }
    );

    window.addEventListener(
        "universe:guidedMode",
        () => {
            updateMode(
                "GUIDED"
            );
        }
    );

    window.addEventListener(
        "universe:solarSystem",
        () => {
            updateRegion(
                "SOLAR SYSTEM"
            );
        }
    );

    window.addEventListener(
        "universe:regionChanged",
        event => {
            updateRegion(
                event.detail?.region
            );
        }
    );
}


// --------------------------------------------------
// SEARCH
// --------------------------------------------------

function handleSearch(
    query
) {
    if (!query) return;

    const lower =
        query.toLowerCase();

    const results =
        allCelestialObjects
            .filter(
                object =>
                    object.name
                        .toLowerCase()
                        .includes(
                            lower
                        )
            )
            .map(
                object => ({
                    name:
                        object.name,
                    type:
                        object.type
                })
            );

    window.dispatchEvent(
        new CustomEvent(
            "universe:searchResults",
            {
                detail: {
                    results
                }
            }
        )
    );
}


// --------------------------------------------------
// FOCUS
// --------------------------------------------------

function focusObject(
    object
) {
    if (!object) return;

    const position =
        new THREE.Vector3();

    object.getWorldPosition(
        position
    );

    const direction =
        new THREE.Vector3(
            1,
            0.5,
            1
        ).normalize();

    const distance =
        object.geometry?.parameters
            ?.radius
            ? object.geometry.parameters.radius *
              5
            : 15;

    const target =
        position.clone();

    const finalPosition =
        position
            .clone()
            .add(
                direction.multiplyScalar(
                    Math.max(
                        distance,
                        10
                    )
                )
            );

    const start =
        camera.position.clone();

    const startTarget =
        controls.target.clone();

    const startTime =
        performance.now();

    const duration =
        1000;

    function animateFocus(
        time
    ) {
        const progress =
            Math.min(
                (
                    time -
                    startTime
                ) /
                    duration,
                1
            );

        const smooth =
            progress < 0.5
                ? 2 *
                  progress *
                  progress
                : 1 -
                  Math.pow(
                      -2 *
                          progress +
                          2,
                      2
                  ) /
                      2;

        camera.position.lerpVectors(
            start,
            finalPosition,
            smooth
        );

        controls.target.lerpVectors(
            startTarget,
            target,
            smooth
        );

        controls.update();

        if (
            progress < 1
        ) {
            requestAnimationFrame(
                animateFocus
            );
        }
    }

    requestAnimationFrame(
        animateFocus
    );
}

function focusObjectByName(
    name
) {
    const object =
        objectMeshes.get(
            name
        );

    if (!object) {
        return;
    }

    const data =
        object.userData?.data ||
        getCelestialObject(
            name
        );

    if (data) {
        selectObject(
            object,
            data
        );
    }

    focusObject(
        object
    );
}


// --------------------------------------------------
// ANIMATION
// --------------------------------------------------

function animate() {
    requestAnimationFrame(
        animate
    );

    const delta =
        clock.getDelta();

    const elapsed =
        clock.getElapsedTime();

    updateUniverse(
        delta
    );

    updateEffects(
        elapsed,
        delta
    );

    updateCamera();

    updateHUD();

    renderer.render(
        scene,
        camera
    );
}

function updateUniverse(
    delta
) {
    celestialGroup.children.forEach(
        object => {
            if (
                object.userData?.data
            ) {
                object.rotation.y +=
                    delta * 0.08;
            }
        }
    );

    deepSpaceGroup.children.forEach(
        object => {
            if (
                object.userData?.type ===
                "Galaxy"
            ) {
                object.rotation.y +=
                    delta * 0.01;
            }

            if (
                object.userData?.type ===
                "Black Hole"
            ) {
                object.rotation.y +=
                    delta * 0.15;
            }
        }
    );
}


// --------------------------------------------------
// HUD
// --------------------------------------------------

function updateHUD() {
    if (!camera) return;

    const position =
        camera.position;

    updatePosition(
        position.x,
        position.y,
        position.z
    );
}


// --------------------------------------------------
// RESIZE
// --------------------------------------------------

window.addEventListener(
    "resize",
    () => {
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

        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );
    }
);


// --------------------------------------------------
// START
// --------------------------------------------------

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


// --------------------------------------------------
// GLOBAL ACCESS
// --------------------------------------------------

export {
    scene,
    renderer,
    camera,
    controls,
    selectedObject,
    selectedData
};
