// js/information.js

import * as THREE from "three";

import {
    getCelestialObject
} from "./celestialBodies.js";

import {
    getUniverseObject
} from "./universe.js";


/* =========================================================
   STATE
========================================================= */

let selectedObject = null;
let selectedData = null;

let currentPage = 1;
const totalPages = 4;

let infoPanel = null;

let previewScene = null;
let previewCamera = null;
let previewRenderer = null;
let previewRoot = null;

let previewAnimationId = null;


/* =========================================================
   DOM
========================================================= */

function getElements() {

    return {

        panel:
            document.getElementById("infoPanel"),

        close:
            document.getElementById("closeInfo"),

        type:
            document.getElementById("objectType"),

        name:
            document.getElementById("objectName"),

        pageNumber:
            document.getElementById("pageNumber"),

        infoType:
            document.getElementById("infoType"),

        infoName:
            document.getElementById("infoName"),

        infoSize:
            document.getElementById("infoSize"),

        infoMass:
            document.getElementById("infoMass"),

        infoTemperature:
            document.getElementById("infoTemperature"),

        infoGravity:
            document.getElementById("infoGravity"),

        infoComposition:
            document.getElementById("infoComposition"),

        infoAtmosphere:
            document.getElementById("infoAtmosphere"),

        infoRotation:
            document.getElementById("infoRotation"),

        infoOrbit:
            document.getElementById("infoOrbit"),

        infoFacts:
            document.getElementById("infoFacts"),

        previousPage:
            document.getElementById("previousPage"),

        nextPage:
            document.getElementById("nextPage"),

        /*
         * These old controls are deliberately kept hidden
         * so the existing HTML does not break.
         */
        focusObject:
            document.getElementById("focusObject"),

        favoriteObject:
            document.getElementById("favoriteObject"),

        atmosphereButton:
            document.getElementById("atmosphereButton"),

        preview:
            document.getElementById(
                "objectPreviewSphere"
            )
    };
}


/* =========================================================
   INITIALIZATION
========================================================= */

export function initializeInformation() {

    const elements = getElements();

    infoPanel = elements.panel;

    if (!infoPanel) {
        return;
    }


    /* Close */

    elements.close?.addEventListener(
        "click",
        closeInformation
    );


    /* Pages */

    elements.previousPage?.addEventListener(
        "click",
        previousPage
    );

    elements.nextPage?.addEventListener(
        "click",
        nextPage
    );


    /*
     * The old Focus / Favorite / Atmosphere
     * buttons are no longer part of the interface.
     */

    hideUnusedButtons();


    /* Object selection */

    window.addEventListener(
        "universe:objectSelected",
        event => {

            const {
                object,
                data,
                name
            } = event.detail || {};

            const resolvedData =
                data ||
                resolveObjectData(
                    name,
                    object
                );

            if (!resolvedData) {
                return;
            }

            openInformation(
                object,
                resolvedData
            );
        }
    );


    /* External close */

    window.addEventListener(
        "universe:closeInfo",
        closeInformation
    );
}


/* =========================================================
   HIDE OLD CONTROLS
========================================================= */

function hideUnusedButtons() {

    const ids = [
        "focusObject",
        "favoriteObject",
        "atmosphereButton"
    ];

    ids.forEach(id => {

        const element =
            document.getElementById(id);

        if (!element) {
            return;
        }

        element.style.display = "none";
        element.setAttribute(
            "aria-hidden",
            "true"
        );
    });
}


/* =========================================================
   RESOLVE OBJECT
========================================================= */

function resolveObjectData(
    name,
    object
) {

    const objectName =
        name ||
        object?.userData?.name;

    if (!objectName) {
        return null;
    }


    /* Solar System */

    const celestial =
        getCelestialObject(
            objectName
        );

    if (celestial) {
        return celestial;
    }


    /* Deep Universe */

    const universe =
        getUniverseObject(
            objectName
        );

    if (universe) {
        return universe;
    }


    return null;
}


/* =========================================================
   OPEN INFORMATION
========================================================= */

export function openInformation(
    object,
    data
) {

    if (!data && object?.userData?.name) {

        data =
            resolveObjectData(
                object.userData.name,
                object
            );
    }

    if (!data) {
        return;
    }


    selectedObject =
        object || null;

    selectedData =
        data;

    currentPage = 1;


    const elements =
        getElements();


    updateInformation();

    createPreview();


    elements.panel?.classList.remove(
        "hidden"
    );


    document.body.classList.add(
        "information-open"
    );


    window.dispatchEvent(
        new CustomEvent(
            "universe:informationOpened",
            {
                detail: {
                    object:
                        selectedObject,

                    data:
                        selectedData
                }
            }
        )
    );
}


/* =========================================================
   CLOSE
========================================================= */

export function closeInformation() {

    const elements =
        getElements();


    elements.panel?.classList.add(
        "hidden"
    );


    stopPreview();


    selectedObject = null;
    selectedData = null;


    document.body.classList.remove(
        "information-open"
    );


    window.dispatchEvent(
        new CustomEvent(
            "universe:informationClosed"
        )
    );
}


/* =========================================================
   UPDATE INFORMATION
========================================================= */

function updateInformation() {

    const elements =
        getElements();

    if (!selectedData) {
        return;
    }


    const data =
        selectedData;


    setText(
        elements.type,
        data.type ||
        "Unknown"
    );


    setText(
        elements.name,
        data.name ||
        "Unknown Object"
    );


    setText(
        elements.infoType,
        data.type ||
        "Unknown"
    );


    setText(
        elements.infoName,
        data.name ||
        "Unknown"
    );


    setText(
        elements.infoSize,
        data.size ||
        data.radius ||
        "Unknown"
    );


    setText(
        elements.infoMass,
        data.mass ||
        "Unknown"
    );


    setText(
        elements.infoTemperature,
        data.temperature ||
        "Unknown"
    );


    setText(
        elements.infoGravity,
        data.gravity ||
        "Unknown"
    );


    setText(
        elements.infoComposition,
        data.composition ||
        "Unknown"
    );


    setText(
        elements.infoAtmosphere,
        data.atmosphere ||
        "Unknown"
    );


    setText(
        elements.infoRotation,
        data.rotation ||
        "Unknown"
    );


    setText(
        elements.infoOrbit,
        data.orbit ||
        "Unknown"
    );


    setFacts(
        elements.infoFacts,
        data.facts
    );


    updatePageVisibility();
}


/* =========================================================
   TEXT
========================================================= */

function setText(
    element,
    value
) {

    if (!element) {
        return;
    }


    element.textContent =
        value !== undefined &&
        value !== null &&
        value !== ""
            ? String(value)
            : "Unknown";
}


/* =========================================================
   FACTS
========================================================= */

function setFacts(
    element,
    facts
) {

    if (!element) {
        return;
    }


    element.innerHTML = "";


    if (Array.isArray(facts)) {

        facts.forEach(
            fact => {

                const item =
                    document.createElement(
                        "li"
                    );

                item.textContent =
                    String(fact);

                element.appendChild(
                    item
                );
            }
        );

        return;
    }


    const item =
        document.createElement(
            "li"
        );

    item.textContent =
        facts
            ? String(facts)
            : "No facts available.";

    element.appendChild(
        item
    );
}


/* =========================================================
   PAGE SYSTEM
========================================================= */

function updatePageVisibility() {

    const pages =
        document.querySelectorAll(
            ".info-page"
        );


    pages.forEach(
        (page, index) => {

            const number =
                index + 1;

            page.classList.toggle(
                "active",
                number === currentPage
            );

            page.classList.toggle(
                "hidden",
                number !== currentPage
            );
        }
    );


    const elements =
        getElements();


    setText(
        elements.pageNumber,
        `${currentPage} / ${totalPages}`
    );


    if (elements.previousPage) {

        elements.previousPage.disabled =
            currentPage <= 1;
    }


    if (elements.nextPage) {

        elements.nextPage.disabled =
            currentPage >= totalPages;
    }
}


function nextPage() {

    if (
        currentPage >= totalPages
    ) {
        return;
    }

    currentPage++;

    updatePageVisibility();
}


function previousPage() {

    if (
        currentPage <= 1
    ) {
        return;
    }

    currentPage--;

    updatePageVisibility();
}


/* =========================================================
   PREVIEW CLEANUP
========================================================= */

function stopPreview() {

    if (previewAnimationId) {

        cancelAnimationFrame(
            previewAnimationId
        );

        previewAnimationId = null;
    }


    if (previewRenderer) {

        previewRenderer.dispose();

        previewRenderer.domElement
            ?.remove();
    }


    if (previewScene) {

        previewScene.traverse(
            object => {

                if (object.geometry) {
                    object.geometry.dispose();
                }

                if (object.material) {

                    if (
                        Array.isArray(
                            object.material
                        )
                    ) {

                        object.material
                            .forEach(
                                material => {

                                    material
                                        .dispose();
                                }
                            );

                    } else {

                        object.material
                            .dispose();
                    }
                }
            }
        );
    }


    previewScene = null;
    previewCamera = null;
    previewRenderer = null;
    previewRoot = null;
}


/* =========================================================
   CREATE PREVIEW
========================================================= */

function createPreview() {

    const container =
        document.getElementById(
            "objectPreviewSphere"
        );


    if (
        !container ||
        !selectedData
    ) {
        return;
    }


    stopPreview();

    container.innerHTML = "";


    /*
     * Scene
     */

    previewScene =
        new THREE.Scene();


    /*
     * Camera
     */

    previewCamera =
        new THREE.PerspectiveCamera(
            32,
            1,
            0.01,
            100
        );


    previewCamera.position.set(
        0,
        0,
        4
    );


    /*
     * Renderer
     */

    previewRenderer =
        new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });


    previewRenderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    const width =
        Math.max(
            container.clientWidth || 300,
            220
        );


    const height =
        Math.max(
            container.clientHeight || 300,
            220
        );


    previewRenderer.setSize(
        width,
        height,
        false
    );


    previewRenderer.outputColorSpace =
        THREE.SRGBColorSpace;


    previewRenderer.shadowMap.enabled =
        true;


    previewRenderer.shadowMap.type =
        THREE.PCFSoftShadowMap;


    container.appendChild(
        previewRenderer.domElement
    );


    /*
     * Lighting
     */

    const ambient =
        new THREE.AmbientLight(
            0x8aaaff,
            0.45
        );


    previewScene.add(
        ambient
    );


    const keyLight =
        new THREE.DirectionalLight(
            0xffffff,
            3.5
        );


    keyLight.position.set(
        4,
        2,
        5
    );


    keyLight.castShadow =
        true;


    previewScene.add(
        keyLight
    );


    const rimLight =
        new THREE.DirectionalLight(
            0x4b7dff,
            1.1
        );


    rimLight.position.set(
        -4,
        1,
        -3
    );


    previewScene.add(
        rimLight
    );


    /*
     * Create correct object
     */

    previewRoot =
        createPreviewObject(
            selectedData
        );


    if (previewRoot) {

        previewScene.add(
            previewRoot
        );
    }


    /*
     * Start animation
     */

    animatePreview();
}


/* =========================================================
   CREATE PREVIEW OBJECT
========================================================= */

function createPreviewObject(
    data
) {

    const type =
        String(
            data.type || ""
        ).toLowerCase();


    const name =
        String(
            data.name || ""
        ).toLowerCase();


    /*
     * Black hole
     */

    if (
        type.includes("black")
    ) {

        return createBlackHolePreview();
    }


    /*
     * Galaxy
     */

    if (
        type.includes("galaxy")
    ) {

        return createGalaxyPreview(
            data
        );
    }


    /*
     * Nebula
     */

    if (
        type.includes("nebula")
    ) {

        return createNebulaPreview(
            data
        );
    }


    /*
     * Comet
     */

    if (
        type.includes("comet")
    ) {

        return createCometPreview(
            data
        );
    }


    /*
     * Asteroid
     */

    if (
        type.includes("asteroid")
    ) {

        return createAsteroidPreview(
            data
        );
    }


    /*
     * Star / Sun
     */

    if (
        type.includes("star") ||
        name === "sun"
    ) {

        return createStarPreview(
            data
        );
    }


    /*
     * Normal planet / moon / dwarf planet
     */

    return createPlanetPreview(
        data
    );
}


/* =========================================================
   PLANET / MOON
========================================================= */

function createPlanetPreview(
    data
) {

    const group =
        new THREE.Group();


    const geometry =
        new THREE.SphereGeometry(
            1,
            96,
            96
        );


    const color =
        typeof data.color === "number"
            ? data.color
            : 0x6f9cff;


    const material =
        new THREE.MeshStandardMaterial({

            color,

            roughness:
                data.name === "Earth"
                    ? 0.55
                    : 0.78,

            metalness:
                0.02,

            emissive:
                new THREE.Color(
                    color
                ),

            emissiveIntensity:
                0.015
        });


    const sphere =
        new THREE.Mesh(
            geometry,
            material
        );


    sphere.castShadow = true;
    sphere.receiveShadow = true;


    group.add(
        sphere
    );


    /*
     * Add procedural surface detail
     */

    addSurfaceDetail(
        group,
        data
    );


    /*
     * Earth-like atmosphere
     */

    const atmosphere =
        String(
            data.name || ""
        ).toLowerCase();


    if (
        atmosphere === "earth" ||
        atmosphere === "venus" ||
        atmosphere === "uranus" ||
        atmosphere === "neptune"
    ) {

        addAtmosphere(
            group,
            atmosphere
        );
    }


    return group;
}


/* =========================================================
   SURFACE DETAIL
========================================================= */

function addSurfaceDetail(
    group,
    data
) {

    const name =
        String(
            data.name || ""
        ).toLowerCase();


    if (
        name !== "earth" &&
        name !== "jupiter" &&
        name !== "saturn" &&
        name !== "uranus" &&
        name !== "neptune" &&
        name !== "mars" &&
        name !== "venus"
    ) {
        return;
    }


    const texture =
        createPlanetTexture(
            name
        );


    const geometry =
        new THREE.SphereGeometry(
            1.006,
            96,
            96
        );


    const material =
        new THREE.MeshStandardMaterial({

            map: texture,

            roughness:
                0.72,

            metalness:
                0.0
        });


    const detail =
        new THREE.Mesh(
            geometry,
            material
        );


    detail.scale.setScalar(
        1.002
    );


    group.add(
        detail
    );
}


/* =========================================================
   PROCEDURAL PLANET TEXTURE
========================================================= */

function createPlanetTexture(
    name
) {

    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width = 512;
    canvas.height = 256;


    const ctx =
        canvas.getContext("2d");


    const image =
        ctx.createImageData(
            canvas.width,
            canvas.height
        );


    const data =
        image.data;


    for (
        let y = 0;
        y < canvas.height;
        y++
    ) {

        for (
            let x = 0;
            x < canvas.width;
            x++
        ) {

            const index =
                (
                    y *
                    canvas.width +
                    x
                ) * 4;


            const nx =
                x /
                canvas.width;


            const ny =
                y /
                canvas.height;


            const noise =
                Math.sin(
                    nx * 40 +
                    Math.sin(
                        ny * 20
                    )
                ) *
                Math.cos(
                    ny * 35
                );


            let r = 80;
            let g = 100;
            let b = 130;


            if (name === "earth") {

                r =
                    25 +
                    noise * 20;

                g =
                    75 +
                    noise * 35;

                b =
                    145 +
                    noise * 40;


                if (
                    noise > 0.35
                ) {

                    g += 45;
                    b += 20;
                }
            }


            else if (
                name === "mars"
            ) {

                r =
                    125 +
                    noise * 45;

                g =
                    45 +
                    noise * 20;

                b =
                    28 +
                    noise * 15;
            }


            else if (
                name === "jupiter" ||
                name === "saturn"
            ) {

                const bands =
                    Math.sin(
                        ny * 70
                    );


                r =
                    150 +
                    bands * 35;

                g =
                    120 +
                    bands * 28;

                b =
                    85 +
                    bands * 22;
            }


            else if (
                name === "venus"
            ) {

                r = 185 + noise * 25;
                g = 135 + noise * 20;
                b = 75 + noise * 12;
            }


            else if (
                name === "uranus"
            ) {

                r = 80 + noise * 15;
                g = 170 + noise * 25;
                b = 185 + noise * 25;
            }


            else if (
                name === "neptune"
            ) {

                r = 25 + noise * 15;
                g = 80 + noise * 20;
                b = 190 + noise * 35;
            }


            data[index] =
                Math.max(
                    0,
                    Math.min(
                        255,
                        r
                    )
                );

            data[index + 1] =
                Math.max(
                    0,
                    Math.min(
                        255,
                        g
                    )
                );

            data[index + 2] =
                Math.max(
                    0,
                    Math.min(
                        255,
                        b
                    )
                );

            data[index + 3] =
                255;
        }
    }


    ctx.putImageData(
        image,
        0,
        0
    );


    const texture =
        new THREE.CanvasTexture(
            canvas
        );


    texture.colorSpace =
        THREE.SRGBColorSpace;


    return texture;
}


/* =========================================================
   ATMOSPHERE
========================================================= */

function addAtmosphere(
    group,
    name
) {

    let color =
        0x55aaff;


    if (name === "earth") {
        color = 0x329cff;
    }

    if (name === "venus") {
        color = 0xffc86b;
    }

    if (
        name === "uranus" ||
        name === "neptune"
    ) {
        color = 0x59d7ff;
    }


    const geometry =
        new THREE.SphereGeometry(
            1.035,
            64,
            64
        );


    const material =
        new THREE.MeshBasicMaterial({

            color,

            transparent:
                true,

            opacity:
                0.13,

            side:
                THREE.BackSide,

            blending:
                THREE.AdditiveBlending
        });


    const atmosphere =
        new THREE.Mesh(
            geometry,
            material
        );


    group.add(
        atmosphere
    );
}


/* =========================================================
   STAR
========================================================= */

function createStarPreview(
    data
) {

    const group =
        new THREE.Group();


    const color =
        typeof data.color === "number"
            ? data.color
            : 0xffe9b0;


    const geometry =
        new THREE.SphereGeometry(
            1,
            64,
            64
        );


    const material =
        new THREE.MeshBasicMaterial({

            color,

            transparent:
                true
        });


    const star =
        new THREE.Mesh(
            geometry,
            material
        );


    group.add(
        star
    );


    /*
     * Glow layers
     */

    for (
        let i = 0;
        i < 3;
        i++
    ) {

        const glowGeometry =
            new THREE.SphereGeometry(
                1.15 +
                i * 0.18,
                32,
                32
            );


        const glowMaterial =
            new THREE.MeshBasicMaterial({

                color,

                transparent:
                    true,

                opacity:
                    0.08 /
                    (i + 1),

                blending:
                    THREE.AdditiveBlending,

                depthWrite:
                    false
            });


        const glow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            );


        group.add(
            glow
        );
    }


    return group;
}


/* =========================================================
   ASTEROID
========================================================= */

function createAsteroidPreview(
    data
) {

    const geometry =
        new THREE.IcosahedronGeometry(
            1,
            4
        );


    const position =
        geometry.attributes.position;


    for (
        let i = 0;
        i < position.count;
        i++
    ) {

        const x =
            position.getX(i);

        const y =
            position.getY(i);

        const z =
            position.getZ(i);


        const variation =
            0.82 +
            Math.random() * 0.28;


        position.setXYZ(
            i,
            x * variation,
            y * variation,
            z * variation
        );
    }


    geometry.computeVertexNormals();


    const color =
        typeof data.color === "number"
            ? data.color
            : 0x77716b;


    const material =
        new THREE.MeshStandardMaterial({

            color,

            roughness:
                0.95,

            metalness:
                0.05
        });


    const asteroid =
        new THREE.Mesh(
            geometry,
            material
        );


    return asteroid;
}


/* =========================================================
   COMET
========================================================= */

function createCometPreview(
    data
) {

    const group =
        new THREE.Group();


    /*
     * Irregular icy nucleus
     */

    const geometry =
        new THREE.IcosahedronGeometry(
            0.65,
            4
        );


    const position =
        geometry.attributes.position;


    for (
        let i = 0;
        i < position.count;
        i++
    ) {

        const variation =
            0.82 +
            Math.random() * 0.3;


        position.setXYZ(
            i,

            position.getX(i) *
                variation,

            position.getY(i) *
                variation,

            position.getZ(i) *
                variation
        );
    }


    geometry.computeVertexNormals();


    const material =
        new THREE.MeshStandardMaterial({

            color:
                0x777b82,

            roughness:
                1.0,

            metalness:
                0
        });


    const nucleus =
        new THREE.Mesh(
            geometry,
            material
        );


    group.add(
        nucleus
    );


    /*
     * Coma
     */

    const comaGeometry =
        new THREE.SphereGeometry(
            0.95,
            32,
            32
        );


    const comaMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0x9edcff,

            transparent:
                true,

            opacity:
                0.16,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false
        });


    const coma =
        new THREE.Mesh(
            comaGeometry,
            comaMaterial
        );


    group.add(
        coma
    );


    /*
     * Tail
     */

    const tailPoints = [];


    for (
        let i = 0;
        i < 180;
        i++
    ) {

        const t =
            i / 179;

        const spread =
            0.06 +
            t * 0.45;


        tailPoints.push(
            new THREE.Vector3(

                -t * 5,

                (
                    Math.random() -
                    0.5
                ) * spread,

                (
                    Math.random() -
                    0.5
                ) * spread
            )
        );
    }


    const tailGeometry =
        new THREE.BufferGeometry()
            .setFromPoints(
                tailPoints
            );


    const tailMaterial =
        new THREE.PointsMaterial({

            color:
                0x8edcff,

            size:
                0.035,

            transparent:
                true,

            opacity:
                0.65,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false
        });


    const tail =
        new THREE.Points(
            tailGeometry,
            tailMaterial
        );


    group.add(
        tail
    );


    return group;
}


/* =========================================================
   BLACK HOLE
========================================================= */

function createBlackHolePreview() {

    const group =
        new THREE.Group();


    /*
     * Event horizon
     */

    const holeGeometry =
        new THREE.SphereGeometry(
            0.72,
            64,
            64
        );


    const holeMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0x000000
        });


    const hole =
        new THREE.Mesh(
            holeGeometry,
            holeMaterial
        );


    group.add(
        hole
    );


    /*
     * Accretion disk
     */

    const diskGeometry =
        new THREE.RingGeometry(
            0.85,
            1.75,
            128
        );


    const diskMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0xff7a25,

            transparent:
                true,

            opacity:
                0.85,

            side:
                THREE.DoubleSide,

            blending:
                THREE.AdditiveBlending
        });


    const disk =
        new THREE.Mesh(
            diskGeometry,
            diskMaterial
        );


    disk.rotation.x =
        Math.PI / 2.8;


    group.add(
        disk
    );


    /*
     * Outer glow
     */

    const glowGeometry =
        new THREE.RingGeometry(
            1.65,
            2.0,
            128
        );


    const glowMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0xffa04a,

            transparent:
                true,

            opacity:
                0.18,

            side:
                THREE.DoubleSide,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false
        });


    const glow =
        new THREE.Mesh(
            glowGeometry,
            glowMaterial
        );


    glow.rotation.x =
        Math.PI / 2.8;


    group.add(
        glow
    );


    return group;
}


/* =========================================================
   GALAXY
========================================================= */

function createGalaxyPreview(
    data
) {

    const group =
        new THREE.Group();


    const particles = [];


    const count = 1500;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const radius =
            Math.pow(
                Math.random(),
                0.55
            ) * 2.4;


        const angle =
            radius * 3.2 +
            Math.random() * 0.7;


        const armOffset =
            (
                i % 2 === 0
                    ? 0
                    : Math.PI
            );


        const x =
            Math.cos(
                angle +
                armOffset
            ) *
            radius;


        const z =
            Math.sin(
                angle +
                armOffset
            ) *
            radius;


        const y =
            (
                Math.random() -
                0.5
            ) *
            (
                0.25 +
                radius * 0.08
            );


        particles.push(
            new THREE.Vector3(
                x,
                y,
                z
            )
        );
    }


    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(
                particles
            );


    const material =
        new THREE.PointsMaterial({

            color:
                0xaac8ff,

            size:
                0.025,

            transparent:
                true,

            opacity:
                0.8,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false
        });


    const stars =
        new THREE.Points(
            geometry,
            material
        );


    group.add(
        stars
    );


    /*
     * Galactic core
     */

    const coreGeometry =
        new THREE.SphereGeometry(
            0.5,
            32,
            32
        );


    const coreMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0xffd9a0
        });


    const core =
        new THREE.Mesh(
            coreGeometry,
            coreMaterial
        );


    group.add(
        core
    );


    return group;
}


/* =========================================================
   NEBULA
========================================================= */

function createNebulaPreview(
    data
) {

    const group =
        new THREE.Group();


    const color =
        typeof data.color === "number"
            ? data.color
            : 0x795cff;


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const geometry =
            new THREE.SphereGeometry(
                0.7 +
                Math.random() * 0.8,
                32,
                32
            );


        const material =
            new THREE.MeshBasicMaterial({

                color,

                transparent:
                    true,

                opacity:
                    0.035 +
                    Math.random() * 0.045,

                blending:
                    THREE.AdditiveBlending,

                depthWrite:
                    false
            });


        const cloud =
            new THREE.Mesh(
                geometry,
                material
            );


        cloud.position.set(
            (
                Math.random() -
                0.5
            ) * 1.5,

            (
                Math.random() -
                0.5
            ) * 1.0,

            (
                Math.random() -
                0.5
            ) * 1.0
        );


        cloud.scale.set(
            1.4,
            0.7,
            0.8
        );


        group.add(
            cloud
        );
    }


    return group;
}


/* =========================================================
   PREVIEW ANIMATION
========================================================= */

function animatePreview() {

    if (
        !previewRenderer ||
        !previewScene ||
        !previewCamera ||
        !previewRoot
    ) {
        return;
    }


    previewAnimationId =
        requestAnimationFrame(
            animatePreview
        );


    /*
     * Natural rotation
     */

    previewRoot.rotation.y +=
        0.004;


    /*
     * Special rotation for black holes
     */

    if (
        String(
            selectedData?.type || ""
        ).toLowerCase()
            .includes("black")
    ) {

        previewRoot.rotation.z +=
            0.002;
    }


    previewRenderer.render(
        previewScene,
        previewCamera
    );
}


/* =========================================================
   GETTERS
========================================================= */

export function getSelectedObject() {

    return selectedObject;
}


export function getSelectedData() {

    return selectedData;
}


export function getCurrentPage() {

    return currentPage;
}


/* =========================================================
   SHOW BY NAME
========================================================= */

export function showInformationForName(
    name,
    object = null
) {

    if (!name) {
        return;
    }


    let data =
        getCelestialObject(
            name
        );


    if (!data) {

        data =
            getUniverseObject(
                name
            );
    }


    if (!data) {
        return;
    }


    openInformation(
        object,
        data
    );
}


/* =========================================================
   RESIZE PREVIEW
========================================================= */

export function resizeInformationPreview() {

    if (
        !previewRenderer ||
        !previewCamera
    ) {
        return;
    }


    const container =
        document.getElementById(
            "objectPreviewSphere"
        );


    if (!container) {
        return;
    }


    const width =
        Math.max(
            container.clientWidth || 300,
            220
        );


    const height =
        Math.max(
            container.clientHeight || 300,
            220
        );


    previewCamera.aspect =
        width / height;


    previewCamera.updateProjectionMatrix();


    previewRenderer.setSize(
        width,
        height,
        false
    );
}


/* =========================================================
   WINDOW RESIZE
========================================================= */

window.addEventListener(
    "resize",
    resizeInformationPreview
);
