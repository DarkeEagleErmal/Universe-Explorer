import * as THREE from "three";
import {
    getCelestialObject
} from "./celestialBodies.js";

let selectedObject = null;
let selectedData = null;
let currentPage = 1;
const totalPages = 4;

let infoPanel = null;
let previewScene = null;
let previewCamera = null;
let previewRenderer = null;
let previewObject = null;

function getElements() {
    return {
        panel: document.getElementById("infoPanel"),
        close: document.getElementById("closeInfo"),
        type: document.getElementById("objectType"),
        name: document.getElementById("objectName"),
        pageNumber: document.getElementById("pageNumber"),

        infoType: document.getElementById("infoType"),
        infoName: document.getElementById("infoName"),
        infoSize: document.getElementById("infoSize"),
        infoMass: document.getElementById("infoMass"),
        infoTemperature: document.getElementById("infoTemperature"),
        infoGravity: document.getElementById("infoGravity"),
        infoComposition: document.getElementById("infoComposition"),
        infoAtmosphere: document.getElementById("infoAtmosphere"),
        infoRotation: document.getElementById("infoRotation"),
        infoOrbit: document.getElementById("infoOrbit"),
        infoFacts: document.getElementById("infoFacts"),

        previousPage: document.getElementById("previousPage"),
        nextPage: document.getElementById("nextPage"),
        focusObject: document.getElementById("focusObject"),
        favoriteObject: document.getElementById("favoriteObject"),
        atmosphereButton: document.getElementById("atmosphereButton"),

        preview: document.getElementById(
            "objectPreviewSphere"
        )
    };
}

export function initializeInformation() {
    const elements = getElements();

    infoPanel = elements.panel;

    if (!infoPanel) return;

    elements.close?.addEventListener(
        "click",
        closeInformation
    );

    elements.previousPage?.addEventListener(
        "click",
        previousPage
    );

    elements.nextPage?.addEventListener(
        "click",
        nextPage
    );

    elements.focusObject?.addEventListener(
        "click",
        () => {
            if (!selectedObject) return;

            window.dispatchEvent(
                new CustomEvent(
                    "universe:focusObject",
                    {
                        detail: {
                            object: selectedObject,
                            data: selectedData
                        }
                    }
                )
            );
        }
    );

    elements.favoriteObject?.addEventListener(
        "click",
        toggleFavorite
    );

    elements.atmosphereButton?.addEventListener(
        "click",
        () => {
            window.dispatchEvent(
                new CustomEvent(
                    "universe:toggleAtmosphere",
                    {
                        detail: {
                            object: selectedObject,
                            data: selectedData
                        }
                    }
                )
            );
        }
    );

    window.addEventListener(
        "universe:objectSelected",
        event => {
            const {
                object,
                data,
                name
            } = event.detail || {};

            openInformation(
                object,
                data || getCelestialObject(name)
            );
        }
    );

    window.addEventListener(
        "universe:closeInfo",
        closeInformation
    );
}

export function openInformation(object, data) {
    if (!data && object?.userData?.name) {
        data = getCelestialObject(
            object.userData.name
        );
    }

    if (!data) return;

    selectedObject = object || null;
    selectedData = data;
    currentPage = 1;

    const elements = getElements();

    updateInformation();
    createPreview();

    elements.panel?.classList.remove("hidden");

    document.body.classList.add(
        "information-open"
    );

    window.dispatchEvent(
        new CustomEvent(
            "universe:informationOpened",
            {
                detail: {
                    object,
                    data
                }
            }
        )
    );
}

export function closeInformation() {
    const elements = getElements();

    elements.panel?.classList.add("hidden");

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

function updateInformation() {
    const elements = getElements();

    if (!selectedData) return;

    const data = selectedData;

    setText(
        elements.type,
        data.type || "Unknown"
    );

    setText(
        elements.name,
        data.name || "Unknown Object"
    );

    setText(
        elements.infoType,
        data.type || "Unknown"
    );

    setText(
        elements.infoName,
        data.name || "Unknown"
    );

    setText(
        elements.infoSize,
        data.size || data.radius || "Unknown"
    );

    setText(
        elements.infoMass,
        data.mass || "Unknown"
    );

    setText(
        elements.infoTemperature,
        data.temperature || "Unknown"
    );

    setText(
        elements.infoGravity,
        data.gravity || "Unknown"
    );

    setText(
        elements.infoComposition,
        data.composition || "Unknown"
    );

    setText(
        elements.infoAtmosphere,
        data.atmosphere || "Unknown"
    );

    setText(
        elements.infoRotation,
        data.rotation || "Unknown"
    );

    setText(
        elements.infoOrbit,
        data.orbit || "Unknown"
    );

    setFacts(
        elements.infoFacts,
        data.facts
    );

    updatePageVisibility();
    updateFavoriteButton();
}

function setText(element, value) {
    if (!element) return;

    element.textContent =
        value !== undefined &&
        value !== null &&
        value !== ""
            ? String(value)
            : "Unknown";
}

function setFacts(element, facts) {
    if (!element) return;

    if (Array.isArray(facts)) {
        element.innerHTML = "";

        facts.forEach(fact => {
            const item =
                document.createElement("li");

            item.textContent = fact;

            element.appendChild(item);
        });

        return;
    }

    if (facts) {
        element.textContent = String(facts);
    } else {
        element.textContent =
            "No facts available.";
    }
}

function updatePageVisibility() {
    const pages =
        document.querySelectorAll(
            ".info-page"
        );

    pages.forEach((page, index) => {
        const pageNumber = index + 1;

        page.classList.toggle(
            "active",
            pageNumber === currentPage
        );

        page.classList.toggle(
            "hidden",
            pageNumber !== currentPage
        );
    });

    const elements = getElements();

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
    if (currentPage >= totalPages) return;

    currentPage++;

    updatePageVisibility();
}

function previousPage() {
    if (currentPage <= 1) return;

    currentPage--;

    updatePageVisibility();
}

function toggleFavorite() {
    if (!selectedData?.name) return;

    const key =
        `universe-favorite-${selectedData.name}`;

    const isFavorite =
        localStorage.getItem(key) === "true";

    localStorage.setItem(
        key,
        String(!isFavorite)
    );

    updateFavoriteButton();

    window.dispatchEvent(
        new CustomEvent(
            "universe:favoriteChanged",
            {
                detail: {
                    name: selectedData.name,
                    favorite: !isFavorite
                }
            }
        )
    );
}

function updateFavoriteButton() {
    const button =
        document.getElementById(
            "favoriteObject"
        );

    if (!button || !selectedData?.name) return;

    const key =
        `universe-favorite-${selectedData.name}`;

    const isFavorite =
        localStorage.getItem(key) === "true";

    button.classList.toggle(
        "active",
        isFavorite
    );

    button.setAttribute(
        "aria-pressed",
        String(isFavorite)
    );

    button.textContent =
        isFavorite
            ? "★ FAVORITED"
            : "☆ FAVORITE";
}

function createPreview() {
    const container =
        document.getElementById(
            "objectPreviewSphere"
        );

    if (!container || !selectedData) return;

    container.innerHTML = "";

    previewScene = new THREE.Scene();

    previewCamera =
        new THREE.PerspectiveCamera(
            35,
            1,
            0.1,
            100
        );

    previewCamera.position.set(
        0,
        0,
        4
    );

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

    previewRenderer.setSize(
        180,
        180
    );

    previewRenderer.outputColorSpace =
        THREE.SRGBColorSpace;

    container.appendChild(
        previewRenderer.domElement
    );

    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            1.4
        );

    previewScene.add(
        ambientLight
    );

    const light =
        new THREE.DirectionalLight(
            0xffffff,
            3
        );

    light.position.set(
        3,
        2,
        4
    );

    previewScene.add(light);

    const color =
        typeof selectedData.color ===
        "number"
            ? selectedData.color
            : 0x6fa8ff;

    const geometry =
        new THREE.SphereGeometry(
            1,
            48,
            48
        );

    const material =
        new THREE.MeshStandardMaterial({
            color,
            roughness: 0.7,
            metalness: 0.05
        });

    previewObject =
        new THREE.Mesh(
            geometry,
            material
        );

    previewScene.add(
        previewObject
    );

    if (
        selectedData.type === "Star" ||
        selectedData.name === "Sun"
    ) {
        material.emissive =
            new THREE.Color(color);

        material.emissiveIntensity = 1.2;
    }

    animatePreview();
}

function animatePreview() {
    if (
        !previewRenderer ||
        !previewScene ||
        !previewCamera ||
        !previewObject
    ) {
        return;
    }

    previewObject.rotation.y += 0.008;

    previewRenderer.render(
        previewScene,
        previewCamera
    );

    requestAnimationFrame(
        animatePreview
    );
}

export function getSelectedObject() {
    return selectedObject;
}

export function getSelectedData() {
    return selectedData;
}

export function getCurrentPage() {
    return currentPage;
}

export function showInformationForName(
    name,
    object = null
) {
    const data =
        getCelestialObject(name);

    if (!data) return;

    openInformation(
        object,
        data
    );
}
