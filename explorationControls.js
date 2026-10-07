// =========================================================
// UNIVERSE EXPLORER
// explorationControls.js
// All exploration controls
// =========================================================

const solarSystemButton = document.getElementById("solarSystemButton");
const freeModeButton = document.getElementById("freeModeButton");
const guidedModeButton = document.getElementById("guidedModeButton");
const tourButton = document.getElementById("tourButton");
const orbitsButton = document.getElementById("orbitsButton");
const timeButton = document.getElementById("timeButton");

const zoomInButton = document.getElementById("zoomIn");
const zoomOutButton = document.getElementById("zoomOut");
const resetCameraButton = document.getElementById("resetCamera");

const spaceObjectButtons = document.querySelectorAll(
    ".space-object-button"
);


// =========================================================
// STATE
// =========================================================

let explorationMode = "FREE";
let showOrbits = true;
let timeMultiplier = 1;
let currentRegion = "SOLAR SYSTEM";
let objectFilter = "all";


// =========================================================
// EVENTS
// =========================================================

function emit(name, detail = {}) {

    window.dispatchEvent(
        new CustomEvent(name, {
            detail
        })
    );

}


// =========================================================
// EXPLORATION MODE
// =========================================================

export function setExplorationMode(mode) {

    explorationMode = mode.toUpperCase();

    updateModeButtons();

    emit("universe:modeChanged", {
        mode: explorationMode
    });

}


export function getExplorationMode() {

    return explorationMode;

}


// =========================================================
// MODE BUTTONS
// =========================================================

function updateModeButtons() {

    solarSystemButton?.classList.toggle(
        "active",
        currentRegion === "SOLAR SYSTEM"
    );

    freeModeButton?.classList.toggle(
        "active",
        explorationMode === "FREE"
    );

    guidedModeButton?.classList.toggle(
        "active",
        explorationMode === "GUIDED"
    );

}


// =========================================================
// SOLAR SYSTEM
// =========================================================

solarSystemButton?.addEventListener("click", () => {

    currentRegion = "SOLAR SYSTEM";

    setExplorationMode("FREE");

    emit("universe:solarSystem");

});


// =========================================================
// FREE MODE
// =========================================================

freeModeButton?.addEventListener("click", () => {

    setExplorationMode("FREE");

    emit("universe:freeMode");

});


// =========================================================
// GUIDED MODE
// =========================================================

guidedModeButton?.addEventListener("click", () => {

    setExplorationMode("GUIDED");

    emit("universe:guidedMode");

});


// =========================================================
// SPACE TOUR
// =========================================================

tourButton?.addEventListener("click", () => {

    setExplorationMode("GUIDED");

    emit("universe:startTour");

});


// =========================================================
// ORBITS
// =========================================================

export function setOrbitsVisible(visible) {

    showOrbits = Boolean(visible);

    orbitsButton?.classList.toggle(
        "active",
        showOrbits
    );

    emit("universe:orbitsChanged", {
        visible: showOrbits
    });

}


export function areOrbitsVisible() {

    return showOrbits;

}


orbitsButton?.addEventListener("click", () => {

    setOrbitsVisible(!showOrbits);

});


// =========================================================
// TIME SPEED
// =========================================================

const timeValues = [1, 5, 20];


export function setTimeMultiplier(value) {

    timeMultiplier = value;

    if (timeButton) {

        timeButton.innerHTML =
            `<span>◷</span> TIME ×${timeMultiplier}`;

    }

    emit("universe:timeChanged", {
        multiplier: timeMultiplier
    });

}


export function getTimeMultiplier() {

    return timeMultiplier;

}


timeButton?.addEventListener("click", () => {

    const currentIndex =
        timeValues.indexOf(timeMultiplier);

    const nextIndex =
        (currentIndex + 1) % timeValues.length;

    setTimeMultiplier(
        timeValues[nextIndex]
    );

});


// =========================================================
// ZOOM
// =========================================================

zoomInButton?.addEventListener("click", () => {

    emit("universe:zoomIn");

});


zoomOutButton?.addEventListener("click", () => {

    emit("universe:zoomOut");

});


// =========================================================
// RESET CAMERA
// =========================================================

resetCameraButton?.addEventListener("click", () => {

    emit("universe:resetCamera");

});


// =========================================================
// SPACE OBJECT FILTER
// =========================================================

export function setObjectFilter(type) {

    objectFilter = type.toLowerCase();

    spaceObjectButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.objectType === objectFilter
        );

    });

    emit("universe:objectFilterChanged", {
        type: objectFilter
    });

}


export function getObjectFilter() {

    return objectFilter;

}


spaceObjectButtons.forEach(button => {

    button.addEventListener("click", () => {

        const type =
            button.dataset.objectType || "all";

        setObjectFilter(type);

    });

});


// =========================================================
// REGION
// =========================================================

export function setCurrentRegion(region) {

    currentRegion = region;

    updateModeButtons();

    emit("universe:regionChanged", {
        region: currentRegion
    });

}


export function getCurrentRegion() {

    return currentRegion;

}


// =========================================================
// KEYBOARD CONTROLS
// =========================================================

document.addEventListener("keydown", event => {

    if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
    ) {
        return;
    }


    switch (event.key.toLowerCase()) {

        case "g":

            setExplorationMode("GUIDED");

            emit("universe:guidedMode");

            break;


        case "f":

            setExplorationMode("FREE");

            emit("universe:freeMode");

            break;


        case "r":

            emit("universe:resetCamera");

            break;


        case "o":

            setOrbitsVisible(!showOrbits);

            break;


        case "+":

        case "=":

            emit("universe:zoomIn");

            break;


        case "-":

        case "_":

            emit("universe:zoomOut");

            break;

    }

});


// =========================================================
// INITIALIZE
// =========================================================

export function initializeExplorationControls() {

    explorationMode = "FREE";
    showOrbits = true;
    timeMultiplier = 1;
    currentRegion = "SOLAR SYSTEM";
    objectFilter = "all";

    updateModeButtons();

    setOrbitsVisible(true);
    setTimeMultiplier(1);
    setObjectFilter("all");

}
