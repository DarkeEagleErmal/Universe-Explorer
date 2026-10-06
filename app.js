import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


// ============================================================
// UNIVERSE EXPLORER
// MAIN APPLICATION
// ============================================================


// ============================================================
// DOM
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

const solarSystemButton =
    document.getElementById("solarSystemButton");

const freeModeButton =
    document.getElementById("freeModeButton");

const guidedModeButton =
    document.getElementById("guidedModeButton");

const tourButton =
    document.getElementById("tourButton");

const orbitsButton =
    document.getElementById("orbitsButton");

const timeButton =
    document.getElementById("timeButton");

const zoomIn =
    document.getElementById("zoomIn");

const zoomOut =
    document.getElementById("zoomOut");

const resetCamera =
    document.getElementById("resetCamera");

const previousPage =
    document.getElementById("previousPage");

const nextPage =
    document.getElementById("nextPage");

const focusObjectButton =
    document.getElementById("focusObject");

const favoriteObjectButton =
    document.getElementById("favoriteObject");

const atmosphereButton =
    document.getElementById("atmosphereButton");

const guidedPanel =
    document.getElementById("guidedPanel");

const tourTitle =
    document.getElementById("tourTitle");

const tourDescription =
    document.getElementById("tourDescription");

const tourNext =
    document.getElementById("tourNext");

const tourProgress =
    document.getElementById("tourProgress");

const tourProgressBar =
    document.getElementById("tourProgressBar");

const tourProgressText =
    document.getElementById("tourProgressText");

const scaleText =
    document.getElementById("scaleText");

const regionText =
    document.getElementById("regionText");

const spaceObjectButtons =
    document.querySelectorAll(
        ".space-object-button"
    );


// ============================================================
// THREE.JS SCENE
// ============================================================

const scene =
    new THREE.Scene();

scene.background =
    new THREE.Color(
        0x01030a
    );


const camera =
    new THREE.PerspectiveCamera(
        55,
        window.innerWidth /
        window.innerHeight,
        0.01,
        1000000
    );

camera.position.set(
    0,
    25,
    55
);


const renderer =
    new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance"
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

canvasContainer.appendChild(
    renderer.domElement
);


// ============================================================
// CAMERA CONTROLS
// ============================================================

const controls =
    new OrbitControls(
        camera,
        renderer.domElement
    );

controls.enableDamping =
    true;

controls.dampingFactor =
    0.055;

controls.minDistance =
    0.5;

controls.maxDistance =
    100000;

controls.zoomSpeed =
    1.2;

controls.rotateSpeed =
    0.45;

controls.panSpeed =
    0.6;

controls.target.set(
    0,
    0,
    0
);


// ============================================================
// LIGHTING
// ============================================================

const ambientLight =
    new THREE.AmbientLight(
        0x6688aa,
        0.18
    );

scene.add(
    ambientLight
);


const sunLight =
    new THREE.PointLight(
        0xfff4dd,
        5,
        1200
    );

sunLight.position.set(
    0,
    0,
    0
);

scene.add(
    sunLight
);


// ============================================================
// MAIN GROUPS
// ============================================================

const solarSystem =
    new THREE.Group();

scene.add(
    solarSystem
);


const asteroidField =
    new THREE.Group();

scene.add(
    asteroidField
);


const kuiperBelt =
    new THREE.Group();

scene.add(
    kuiperBelt
);


const oortCloud =
    new THREE.Group();

scene.add(
    oortCloud
);


const cometGroup =
    new THREE.Group();

scene.add(
    cometGroup
);


const nebulaGroup =
    new THREE.Group();

scene.add(
    nebulaGroup
);


const galaxyGroup =
    new THREE.Group();

scene.add(
    galaxyGroup
);


const blackHoleGroup =
    new THREE.Group();

scene.add(
    blackHoleGroup
);


// ============================================================
// GLOBAL ARRAYS
// ============================================================

const objectMeshes = [];

const objectMap =
    new Map();

const moonObjects = [];

const comets = [];

const orbitObjects = [];

const deepObjects = [];


// ============================================================
// STATE
// ============================================================

let selectedObject = null;

let currentPage = 1;

let currentMode =
    "SOLAR SYSTEM";

let timeMultiplier = 1;

let orbitsVisible = true;

let atmosphereEnabled = true;

let favoriteObjects =
    new Set();

let guidedIndex = 0;

let guidedActive = false;

let tourActive = false;


// ============================================================
// STAR FIELD
// ============================================================

function createStars(
    count = 18000
) {

    const geometry =
        new THREE.BufferGeometry();

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
            0.45 +
            Math.random() *
            0.55;

        const type =
            Math.random();

        if (type < 0.72) {

            colors[i * 3] =
                brightness;

            colors[i * 3 + 1] =
                brightness;

            colors[i * 3 + 2] =
                brightness;

        } else if (type < 0.88) {

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
            size: 1.7,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: true
        });

    return new THREE.Points(
        geometry,
        material
    );
}

scene.add(
    createStars()
);
// ============================================================
// DEEP SPACE INFORMATION
// ============================================================

const deepSpaceInfo = {

    "andromeda galaxy": {
        type: "Galaxy",
        size: "≈ 260,000 light-years",
        mass: "≈ 1 trillion solar masses",
        temperature: "Varies",
        gravity: "Galactic",
        composition: "Stars, gas and dust",
        atmosphere: "Not applicable",
        rotation: "Hundreds of millions of years",
        orbit: "Local Group",
        facts:
            "The Andromeda Galaxy is the nearest large galaxy to the Milky Way."
    },

    "triangulum galaxy": {
        type: "Galaxy",
        size: "≈ 60,000 light-years",
        mass: "≈ 50 billion solar masses",
        temperature: "Varies",
        gravity: "Galactic",
        composition: "Stars, gas and dust",
        atmosphere: "Not applicable",
        rotation: "Hundreds of millions of years",
        orbit: "Local Group",
        facts:
            "The Triangulum Galaxy is one of the major galaxies of the Local Group."
    },

    "distant galaxy": {
        type: "Galaxy",
        size: "Unknown",
        mass: "Unknown",
        temperature: "Varies",
        gravity: "Galactic",
        composition: "Stars, gas and dust",
        atmosphere: "Not applicable",
        rotation: "Unknown",
        orbit: "Unknown",
        facts:
            "A distant galaxy represented for deep-space exploration."
    },

    "black hole": {
        type: "Black Hole",
        size: "Variable",
        mass: "Variable",
        temperature: "Extreme near accretion disk",
        gravity: "Extreme",
        composition: "Collapsed matter",
        atmosphere: "Not applicable",
        rotation: "Variable",
        orbit: "Variable",
        facts:
            "A black hole is an object whose gravity is strong enough that light cannot escape from inside its event horizon."
    },

    "deep space black hole": {
        type: "Black Hole",
        size: "Variable",
        mass: "Variable",
        temperature: "Extreme near accretion disk",
        gravity: "Extreme",
        composition: "Collapsed matter",
        atmosphere: "Not applicable",
        rotation: "Variable",
        orbit: "Variable",
        facts:
            "A black hole represented in a distant region of the Universe."
    }

};


// ============================================================
// ORBIT / MOON HELPERS
// ============================================================

function createMoonOrbit(
    parent,
    distance
) {

    const points = [];

    const segments = 96;

    for (
        let i = 0;
        i <= segments;
        i++
    ) {

        const angle =
            (i / segments) *
            Math.PI * 2;

        points.push(
            new THREE.Vector3(
                Math.cos(angle) * distance,
                0,
                Math.sin(angle) * distance
            )
        );
    }


    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(
                points
            );


    const material =
        new THREE.LineBasicMaterial({
            color: 0x5c7896,
            transparent: true,
            opacity: 0.28
        });


    const orbit =
        new THREE.LineLoop(
            geometry,
            material
        );


    parent.add(
        orbit
    );

    orbitObjects.push(
        orbit
    );

    return orbit;
}


// ============================================================
// SEARCH DATA
// ============================================================

function getAllSearchObjects() {

    const celestial =
        celestialObjects.map(
            data => ({
                name: data.name,
                type: data.type,
                object: objectMap.get(
                    data.name.toLowerCase()
                ),
                data
            })
        );


    const deep =
        Object.entries(
            deepSpaceInfo
        ).map(
            ([name, data]) => ({
                name,
                type: data.type,
                object:
                    deepObjects.find(
                        object =>
                            object.userData.name
                                ?.toLowerCase() ===
                            name
                    ),
                data
            })
        );


    return [
        ...celestial,
        ...deep
    ];
}


// ============================================================
// OBJECT FOCUS
// ============================================================

function focusObject(
    object
) {

    if (!object) {
        return;
    }


    const worldPosition =
        new THREE.Vector3();

    object.getWorldPosition(
        worldPosition
    );


    const distance =
        Math.max(
            object.userData.celestial?.radius || 2,
            2
        ) * 5;


    const direction =
        new THREE.Vector3(
            1,
            0.45,
            1
        ).normalize();


    const targetPosition =
        worldPosition.clone()
            .add(
                direction.multiplyScalar(
                    distance
                )
            );


    camera.position.copy(
        targetPosition
    );

    controls.target.copy(
        worldPosition
    );

    controls.update();
}


// ============================================================
// UPDATE ATMOSPHERE
// ============================================================

function updateAtmosphere() {

    if (!earth?.userData.atmosphere) {
        return;
    }

    earth.userData.atmosphere.visible =
        atmosphereEnabled;
}


// ============================================================
// REGION HUD
// ============================================================

function updateRegionHUD() {

    if (!regionText) {
        return;
    }


    const distance =
        camera.position.length();


    if (distance < 100) {

        regionText.textContent =
            "SOLAR SYSTEM";

    } else if (distance < 350) {

        regionText.textContent =
            "OUTER SOLAR SYSTEM";

    } else if (distance < 1200) {

        regionText.textContent =
            "DEEP SPACE";

    } else {

        regionText.textContent =
            "INTERSTELLAR SPACE";
    }
}
// ============================================================
// UI — HOME / EXPLORER
// ============================================================

function openExplorer() {

    homeScreen.classList.add("hidden");
    explorerScreen.classList.remove("hidden");

    setTimeout(() => {

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

    }, 50);
}


function openHome() {

    explorerScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");

    infoPanel.classList.remove(
        "visible"
    );
}


// ============================================================
// INFO PANEL
// ============================================================

function showInfo(data) {

    if (!data) {
        return;
    }

    selectedObject =
        data.object || null;


    if (selectedStatus) {

        selectedStatus.textContent =
            data.name;
    }


    const info =
        data.data || data;


    const title =
        document.getElementById(
            "infoTitle"
        );

    const type =
        document.getElementById(
            "infoType"
        );

    const description =
        document.getElementById(
            "infoDescription"
        );


    if (title) {
        title.textContent =
            data.name;
    }

    if (type) {
        type.textContent =
            info.type || "";
    }

    if (description) {

        description.textContent =
            info.facts || "";
    }


    const fields = {

        infoSize: info.size,
        infoMass: info.mass,
        infoTemperature:
            info.temperature,
        infoGravity: info.gravity,
        infoComposition:
            info.composition,
        infoAtmosphere:
            info.atmosphere,
        infoRotation:
            info.rotation,
        infoOrbit: info.orbit,
        infoSource: info.source

    };


    Object.entries(fields)
        .forEach(
            ([id, value]) => {

                const element =
                    document.getElementById(
                        id
                    );

                if (element) {

                    element.textContent =
                        value || "—";
                }
            }
        );


    infoPanel.classList.add(
        "visible"
    );
}


// ============================================================
// CLOSE INFO
// ============================================================

if (closeInfo) {

    closeInfo.addEventListener(
        "click",
        () => {

            infoPanel.classList.remove(
                "visible"
            );

            selectedObject =
                null;


            if (selectedStatus) {

                selectedStatus.textContent =
                    "NONE";
            }
        }
    );
}


// ============================================================
// OBJECT SELECTION
// ============================================================

function selectObject(object) {

    if (!object) {
        return;
    }


    let data =
        object.userData.celestial;


    if (!data) {

        const name =
            object.userData.name
                ?.toLowerCase();

        data =
            deepSpaceInfo[name];
    }


    if (!data) {
        return;
    }


    showInfo({

        name:
            object.userData.celestial?.name ||
            object.userData.name,

        type:
            data.type,

        object,

        data
    });
}


// ============================================================
// RAYCASTING
// ============================================================

const raycaster =
    new THREE.Raycaster();

const mouse =
    new THREE.Vector2();


renderer.domElement.addEventListener(
    "pointerdown",
    event => {

        mouse.x =
            (event.clientX /
                window.innerWidth) *
                2 -
            1;

        mouse.y =
            -(event.clientY /
                window.innerHeight) *
                2 +
            1;


        raycaster.setFromCamera(
            mouse,
            camera
        );


        const intersections =
            raycaster.intersectObjects(
                objectMeshes,
                true
            );


        if (
            intersections.length > 0
        ) {

            let object =
                intersections[0].object;


            while (
                object &&
                !object.userData.celestial &&
                !object.userData.name
            ) {

                object =
                    object.parent;
            }


            if (object) {

                selectObject(
                    object
                );
            }
        }
    }
);
// ============================================================
// RICERCA
// ============================================================

function searchObject(query) {

    const term =
        query.trim().toLowerCase();

    if (!term) {
        return;
    }

    const object =
        objectMap.get(term);

    if (object) {

        focusObject(
            object
        );

        selectObject(
            object
        );

        return;
    }


    const deepObject =
        deepObjects.find(
            item =>
                item.name
                    .toLowerCase()
                    .includes(term)
        );


    if (deepObject) {

        focusObject(
            deepObject.object
        );

        selectObject(
            deepObject.object
        );

        return;
    }


    const celestial =
        objectMeshes.find(
            mesh =>
                mesh.userData
                    .celestial
                    ?.name
                    ?.toLowerCase()
                    .includes(term)
        );


    if (celestial) {

        focusObject(
            celestial
        );

        selectObject(
            celestial
        );
    }
}


if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                searchObject(
                    searchInput.value
                );
            }
        }
    );
}


// ============================================================
// FOCUS OBJECT
// ============================================================

function focusObject(
    object
) {

    if (!object) {
        return;
    }


    const worldPosition =
        new THREE.Vector3();


    object.getWorldPosition(
        worldPosition
    );


    const radius =
        object.geometry
            ?.boundingSphere
            ?.radius ||
        object.scale.x ||
        1;


    const direction =
        new THREE.Vector3(
            1,
            0.5,
            1
        )
        .normalize();


    const distance =
        Math.max(
            radius * 5,
            5
        );


    camera.position.copy(
        worldPosition
            .clone()
            .add(
                direction.multiplyScalar(
                    distance
                )
            )
    );


    controls.target.copy(
        worldPosition
    );


    controls.update();
}


// ============================================================
// GUIDED MODE
// ============================================================

const guidedObjects = [
    "Sun",
    "Earth",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
    "Pluto"
];


function updateGuidedMode() {

    if (!guidedActive) {
        return;
    }


    if (
        guidedIndex >=
        guidedObjects.length
    ) {

        guidedIndex = 0;
    }


    const name =
        guidedObjects[
            guidedIndex
        ];


    const object =
        objectMap.get(
            name.toLowerCase()
        );


    if (object) {

        focusObject(
            object
        );

        selectObject(
            object
        );
    }


    if (guidedTitle) {

        guidedTitle.textContent =
            name;
    }


    if (guidedProgress) {

        guidedProgress.textContent =
            `${guidedIndex + 1} / ${guidedObjects.length}`;
    }
}


if (guidedNext) {

    guidedNext.addEventListener(
        "click",
        () => {

            guidedIndex++;

            updateGuidedMode();
        }
    );
}


if (guidedPrevious) {

    guidedPrevious.addEventListener(
        "click",
        () => {

            guidedIndex--;

            if (
                guidedIndex < 0
            ) {

                guidedIndex =
                    guidedObjects.length -
                    1;
            }

            updateGuidedMode();
        }
    );
}


// ============================================================
// ATMOSPHERE UPDATE
// ============================================================

function updateAtmosphere() {

    if (!earthAtmosphere) {
        return;
    }


    earthAtmosphere.visible =
        atmosphereEnabled;
}


// ============================================================
// RESIZE
// ============================================================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);
// ============================================================
// ANIMAZIONE
// ============================================================

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );


    const delta =
        clock.getDelta();


    const elapsed =
        clock.elapsedTime;


    // --------------------------------------------------------
    // ROTAZIONE PIANETI
    // --------------------------------------------------------

    objectMeshes.forEach(
        object => {

            const data =
                object.userData
                    .celestial;

            if (!data) {
                return;
            }


            if (
                data.type ===
                "Planet"
            ) {

                object.rotation.y +=
                    delta *
                    0.08 *
                    timeMultiplier;
            }


            if (
                data.type ===
                "Star"
            ) {

                object.rotation.y +=
                    delta *
                    0.02;
            }
        }
    );


    // --------------------------------------------------------
    // LUNE
    // --------------------------------------------------------

    moonObjects.forEach(
        moon => {

            moon.userData.angle +=
                delta *
                moon.userData.speed *
                timeMultiplier;


            moon.position.x =
                Math.cos(
                    moon.userData.angle
                ) *
                moon.userData.distance;


            moon.position.z =
                Math.sin(
                    moon.userData.angle
                ) *
                moon.userData.distance;


            moon.rotation.y +=
                delta *
                0.15;
        }
    );


    // --------------------------------------------------------
    // COMETE
    // --------------------------------------------------------

    comets.forEach(
        comet => {

            comet.userData.angle +=
                delta *
                comet.userData.speed *
                timeMultiplier;


            const angle =
                comet.userData.angle;


            comet.position.x =
                comet.userData.radius *
                Math.cos(angle);


            comet.position.z =
                comet.userData.radius *
                Math.sin(angle) *
                0.55;


            comet.rotation.y +=
                delta *
                0.5;
        }
    );


    // --------------------------------------------------------
    // NEBULOSE
    // --------------------------------------------------------

    nebulaGroup.children.forEach(
        nebula => {

            nebula.rotation.y +=
                delta *
                0.002;

            nebula.rotation.x +=
                delta *
                0.001;
        }
    );


    // --------------------------------------------------------
    // GALASSIE
    // --------------------------------------------------------

    galaxyGroup.children.forEach(
        galaxy => {

            galaxy.rotation.y +=
                delta *
                0.004;
        }
    );


    // --------------------------------------------------------
    // BUCHI NERI
    // --------------------------------------------------------

    blackHoleGroup.children.forEach(
        blackHole => {

            blackHole.rotation.y +=
                delta *
                0.08;

            blackHole.rotation.z +=
                delta *
                0.03;
        }
    );


    // --------------------------------------------------------
    // CONTROLLI
    // --------------------------------------------------------

    controls.update();


    // --------------------------------------------------------
    // RENDER
    // --------------------------------------------------------

    renderer.render(
        scene,
        camera
    );
}


animate();
