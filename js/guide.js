import {
    getCelestialObject
} from "./celestialBodies.js";

let guidedMode = false;
let tourActive = false;
let currentTourIndex = 0;

const tourObjects = [
    "Sun",
    "Mercury",
    "Venus",
    "Earth",
    "Moon",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
    "Pluto",
    "Sirius",
    "Andromeda"
];

const tourDescriptions = {
    Sun:
        "The star at the center of our Solar System. Its immense gravity keeps the planets in orbit.",

    Mercury:
        "The smallest planet and the closest planet to the Sun.",

    Venus:
        "A rocky planet with an extremely hot surface and a dense atmosphere.",

    Earth:
        "Our home planet and the only world currently known to support life.",

    Moon:
        "Earth's natural satellite. Its gravity influences Earth's tides.",

    Mars:
        "The Red Planet, a cold rocky world with evidence of ancient water.",

    Jupiter:
        "The largest planet in the Solar System, famous for its enormous storms.",

    Saturn:
        "A gas giant surrounded by a spectacular system of icy rings.",

    Uranus:
        "An ice giant that rotates almost sideways compared with the other planets.",

    Neptune:
        "The most distant major planet in the Solar System, with extremely powerful winds.",

    Pluto:
        "A dwarf planet located in the distant Kuiper Belt.",

    Sirius:
        "The brightest star in Earth's night sky and one of our closest stellar neighbors.",

    Andromeda:
        "A massive spiral galaxy located approximately 2.5 million light-years from the Milky Way."
};

function emit(name, detail = {}) {
    window.dispatchEvent(
        new CustomEvent(name, {
            detail
        })
    );
}

export function initializeGuide() {
    const guidedButton =
        document.getElementById(
            "guidedModeButton"
        );

    const tourButton =
        document.getElementById(
            "tourButton"
        );

    const nextButton =
        document.getElementById(
            "tourNext"
        );

    guidedButton?.addEventListener(
        "click",
        () => {
            startGuidedMode();
        }
    );

    tourButton?.addEventListener(
        "click",
        () => {
            startTour();
        }
    );

    nextButton?.addEventListener(
        "click",
        () => {
            nextTourObject();
        }
    );

    window.addEventListener(
        "universe:guidedMode",
        startGuidedMode
    );

    window.addEventListener(
        "universe:startTour",
        startTour
    );

    window.addEventListener(
        "universe:freeMode",
        stopGuide
    );

    updateGuidedPanel();
    updateTourProgress();
}

export function startGuidedMode() {
    guidedMode = true;
    tourActive = false;

    currentTourIndex = 0;

    emit(
        "universe:guideStarted"
    );

    updateGuidedPanel();
    updateTourProgress();
}

export function stopGuide() {
    guidedMode = false;
    tourActive = false;

    hideGuidedPanel();
    hideTourProgress();

    emit(
        "universe:guideStopped"
    );
}

export function startTour() {
    guidedMode = true;
    tourActive = true;
    currentTourIndex = 0;

    updateGuidedPanel();
    updateTourProgress();

    focusCurrentTourObject();
}

export function nextTourObject() {
    if (!tourActive) return;

    if (
        currentTourIndex >=
        tourObjects.length - 1
    ) {
        finishTour();
        return;
    }

    currentTourIndex++;

    updateGuidedPanel();
    updateTourProgress();

    focusCurrentTourObject();
}

export function previousTourObject() {
    if (!tourActive) return;

    if (currentTourIndex <= 0) return;

    currentTourIndex--;

    updateGuidedPanel();
    updateTourProgress();

    focusCurrentTourObject();
}

function focusCurrentTourObject() {
    const name =
        tourObjects[currentTourIndex];

    const data =
        getCelestialObject(name);

    if (!data) return;

    emit(
        "universe:tourObject",
        {
            name,
            data,
            index: currentTourIndex
        }
    );

    emit(
        "universe:searchObject",
        {
            name
        }
    );

    emit(
        "universe:focusObjectByName",
        {
            name
        }
    );
}

function updateGuidedPanel() {
    const panel =
        document.getElementById(
            "guidedPanel"
        );

    const title =
        document.getElementById(
            "tourTitle"
        );

    const description =
        document.getElementById(
            "tourDescription"
        );

    const nextButton =
        document.getElementById(
            "tourNext"
        );

    if (!panel) return;

    if (!guidedMode) {
        hideGuidedPanel();
        return;
    }

    panel.classList.remove(
        "hidden"
    );

    if (!tourActive) {
        if (title) {
            title.textContent =
                "GUIDED MODE";
        }

        if (description) {
            description.textContent =
                "Explore the Universe freely. Select any celestial object to discover more information.";
        }

        if (nextButton) {
            nextButton.textContent =
                "START TOUR";
        }

        return;
    }

    const name =
        tourObjects[currentTourIndex];

    if (title) {
        title.textContent =
            name.toUpperCase();
    }

    if (description) {
        description.textContent =
            tourDescriptions[name] ||
            "Explore this celestial object and discover its properties.";
    }

    if (nextButton) {
        nextButton.textContent =
            currentTourIndex >=
            tourObjects.length - 1
                ? "FINISH TOUR"
                : "NEXT OBJECT";
    }
}

function updateTourProgress() {
    const progress =
        document.getElementById(
            "tourProgress"
        );

    const progressBar =
        document.getElementById(
            "tourProgressBar"
        );

    const progressText =
        document.getElementById(
            "tourProgressText"
        );

    if (!tourActive) {
        hideTourProgress();
        return;
    }

    if (progress) {
        progress.classList.remove(
            "hidden"
        );
    }

    const current =
        currentTourIndex + 1;

    const total =
        tourObjects.length;

    const percentage =
        (current / total) * 100;

    if (progressBar) {
        progressBar.style.width =
            `${percentage}%`;
    }

    if (progressText) {
        progressText.textContent =
            `${current} / ${total}`;
    }
}

function hideGuidedPanel() {
    const panel =
        document.getElementById(
            "guidedPanel"
        );

    panel?.classList.add(
        "hidden"
    );
}

function hideTourProgress() {
    const progress =
        document.getElementById(
            "tourProgress"
        );

    progress?.classList.add(
        "hidden"
    );
}

function finishTour() {
    tourActive = false;

    updateGuidedPanel();
    hideTourProgress();

    emit(
        "universe:tourFinished"
    );
}

export function isGuidedMode() {
    return guidedMode;
}

export function isTourActive() {
    return tourActive;
}

export function getCurrentTourIndex() {
    return currentTourIndex;
}

export function getCurrentTourObject() {
    return tourObjects[
        currentTourIndex
    ];
}

export function resetGuide() {
    guidedMode = false;
    tourActive = false;
    currentTourIndex = 0;

    hideGuidedPanel();
    hideTourProgress();
}

window.addEventListener(
    "keydown",
    event => {
        if (!tourActive) return;

        if (event.key === "ArrowRight") {
            nextTourObject();
        }

        if (event.key === "ArrowLeft") {
            previousTourObject();
        }

        if (event.key === "Escape") {
            stopGuide();
        }
    }
);
