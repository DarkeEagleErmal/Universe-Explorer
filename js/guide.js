// ============================================================
// UNIVERSE EXPLORER — GUIDE & TOUR
// ============================================================

const tourObjects = [
    {
        name: "Sun",
        type: "Star",
        description:
            "The star at the center of our Solar System. Its gravity keeps the planets in orbit."
    },
    {
        name: "Mercury",
        type: "Planet",
        description:
            "The smallest planet and the closest planet to the Sun."
    },
    {
        name: "Venus",
        type: "Planet",
        description:
            "A rocky planet with a thick atmosphere and extremely high surface temperatures."
    },
    {
        name: "Earth",
        type: "Planet",
        description:
            "Our home planet and the only world currently known to support life."
    },
    {
        name: "Moon",
        type: "Moon",
        description:
            "Earth's natural satellite. It influences Earth's tides and completes an orbit around our planet."
    },
    {
        name: "Mars",
        type: "Planet",
        description:
            "The Red Planet, known for its iron-rich surface and ancient geological features."
    },
    {
        name: "Jupiter",
        type: "Planet",
        description:
            "The largest planet in the Solar System, famous for its enormous storms and many moons."
    },
    {
        name: "Saturn",
        type: "Planet",
        description:
            "A gas giant famous for its spectacular system of icy rings."
    },
    {
        name: "Uranus",
        type: "Planet",
        description:
            "An ice giant with a highly tilted rotation axis and a cold atmosphere."
    },
    {
        name: "Neptune",
        type: "Planet",
        description:
            "The most distant major planet in the Solar System, with powerful winds and a deep blue appearance."
    },
    {
        name: "Pluto",
        type: "Dwarf Planet",
        description:
            "A dwarf planet located in the distant Kuiper Belt beyond Neptune."
    },
    {
        name: "Sirius",
        type: "Star",
        description:
            "The brightest star in Earth's night sky when viewed from the Solar System."
    },
    {
        name: "Andromeda",
        type: "Galaxy",
        description:
            "A large spiral galaxy and one of the closest major galaxies to the Milky Way."
    },
    {
        name: "Triangulum",
        type: "Galaxy",
        description:
            "A spiral galaxy belonging to the Local Group of galaxies."
    },
    {
        name: "Black Hole",
        type: "Black Hole",
        description:
            "A region of spacetime where gravity is so strong that light cannot escape once it passes the event horizon."
    },
    {
        name: "Deep Space Black Hole",
        type: "Black Hole",
        description:
            "A distant black hole surrounded by an intense region of gravitational influence."
    },
    {
        name: "Purple Nebula",
        type: "Nebula",
        description:
            "A vast cloud of gas and dust represented here as a luminous deep-space nebula."
    },
    {
        name: "Blue Nebula",
        type: "Nebula",
        description:
            "A large cloud of interstellar material glowing with blue light."
    },
    {
        name: "Magenta Nebula",
        type: "Nebula",
        description:
            "A colorful interstellar cloud made of gas and cosmic dust."
    },
    {
        name: "Deep Blue Nebula",
        type: "Nebula",
        description:
            "A distant, dark-blue region of interstellar gas and dust."
    },
    {
        name: "Comet",
        type: "Comet",
        description:
            "An icy body that can develop a glowing coma and tail when approaching a star."
    },
    {
        name: "Asteroid Belt",
        type: "Asteroid",
        description:
            "A large population of rocky objects located mainly between the orbits of Mars and Jupiter."
    },
    {
        name: "Kuiper Belt",
        type: "Region",
        description:
            "A distant region beyond Neptune containing many icy bodies and dwarf planets."
    },
    {
        name: "Oort Cloud",
        type: "Region",
        description:
            "A theoretical distant reservoir of icy objects surrounding the Solar System."
    }
];

// ============================================================
// STATE
// ============================================================

let currentTourIndex = 0;
let tourActive = false;

// ============================================================
// HELPERS
// ============================================================

function getElement(id) {
    return document.getElementById(id);
}

function emit(name, detail = {}) {
    window.dispatchEvent(
        new CustomEvent(name, {
            detail
        })
    );
}

// ============================================================
// TOUR DISPLAY
// ============================================================

function updateTourDisplay() {
    const object =
        tourObjects[currentTourIndex];

    if (!object) return;

    const title =
        getElement("tourTitle");

    const description =
        getElement("tourDescription");

    const progressText =
        getElement("tourProgressText");

    const progressBar =
        getElement("tourProgressBar");

    const progress =
        currentTourIndex + 1;

    const total =
        tourObjects.length;

    if (title) {
        title.textContent =
            object.name;
    }

    if (description) {
        description.textContent =
            object.description;
    }

    if (progressText) {
        progressText.textContent =
            `${progress} / ${total}`;
    }

    if (progressBar) {
        progressBar.style.width =
            `${(progress / total) * 100}%`;
    }

    emit(
        "universe:tourObject",
        {
            name: object.name,
            type: object.type,
            index: currentTourIndex,
            total,
            description:
                object.description
        }
    );
}

// ============================================================
// START TOUR
// ============================================================

function startTour() {
    currentTourIndex = 0;
    tourActive = true;

    const panel =
        getElement("guidedPanel");

    if (panel) {
        panel.classList.add("active");
        panel.style.display = "block";
    }

    updateTourDisplay();

    emit(
        "universe:tourStarted",
        {
            total:
                tourObjects.length
        }
    );
}

// ============================================================
// NEXT
// ============================================================

function nextTourObject() {
    if (!tourActive) {
        startTour();
        return;
    }

    if (
        currentTourIndex <
        tourObjects.length - 1
    ) {
        currentTourIndex++;

        updateTourDisplay();
        return;
    }

    finishTour();
}

// ============================================================
// PREVIOUS
// ============================================================

function previousTourObject() {
    if (!tourActive) {
        startTour();
        return;
    }

    if (currentTourIndex > 0) {
        currentTourIndex--;

        updateTourDisplay();
    }
}

// ============================================================
// FINISH
// ============================================================

function finishTour() {
    tourActive = false;

    const title =
        getElement("tourTitle");

    const description =
        getElement("tourDescription");

    const progressText =
        getElement("tourProgressText");

    const progressBar =
        getElement("tourProgressBar");

    if (title) {
        title.textContent =
            "Tour Complete";
    }

    if (description) {
        description.textContent =
            "You have explored the main objects of Universe Explorer.";
    }

    if (progressText) {
        progressText.textContent =
            `${tourObjects.length} / ${tourObjects.length}`;
    }

    if (progressBar) {
        progressBar.style.width =
            "100%";
    }

    emit(
        "universe:tourCompleted"
    );
}

// ============================================================
// RESET
// ============================================================

function resetTour() {
    currentTourIndex = 0;
    tourActive = false;
}

// ============================================================
// GUIDED MODE
// ============================================================

function openGuidedMode() {
    const panel =
        getElement("guidedPanel");

    if (panel) {
        panel.classList.add("active");
        panel.style.display = "block";
    }

    emit(
        "universe:guidedOpened"
    );
}

// ============================================================
// CLOSE GUIDED MODE
// ============================================================

function closeGuidedMode() {
    const panel =
        getElement("guidedPanel");

    if (panel) {
        panel.classList.remove("active");
        panel.style.display = "none";
    }

    tourActive = false;

    emit(
        "universe:guidedClosed"
    );
}

// ============================================================
// INITIALIZE
// ============================================================

export function initializeGuide() {
    const guidedPanel =
        getElement("guidedPanel");

    const guidedModeButton =
        getElement("guidedModeButton");

    const tourButton =
        getElement("tourButton");

    const tourNext =
        getElement("tourNext");

    const previousPage =
        getElement("previousPage");

    // --------------------------------------------------------
    // GUIDED MODE
    // --------------------------------------------------------

    if (guidedModeButton) {
        guidedModeButton.addEventListener(
            "click",
            () => {
                openGuidedMode();
            }
        );
    }

    // --------------------------------------------------------
    // TOUR BUTTON
    // --------------------------------------------------------

    if (tourButton) {
        tourButton.addEventListener(
            "click",
            () => {
                startTour();
            }
        );
    }

    // --------------------------------------------------------
    // NEXT TOUR OBJECT
    // --------------------------------------------------------

    if (tourNext) {
        tourNext.addEventListener(
            "click",
            () => {
                nextTourObject();
            }
        );
    }

    // --------------------------------------------------------
    // PREVIOUS
    // --------------------------------------------------------

    if (previousPage) {
        previousPage.addEventListener(
            "click",
            () => {
                if (tourActive) {
                    previousTourObject();
                }
            }
        );
    }

    // --------------------------------------------------------
    // EXTERNAL TOUR EVENT
    // --------------------------------------------------------

    window.addEventListener(
        "universe:startTour",
        () => {
            startTour();
        }
    );

    // --------------------------------------------------------
    // CLOSE INFO / ESCAPE
    // --------------------------------------------------------

    window.addEventListener(
        "universe:guidedClosed",
        () => {
            if (guidedPanel) {
                guidedPanel.classList.remove(
                    "active"
                );
            }
        }
    );

    document.addEventListener(
        "keydown",
        event => {
            if (
                event.target instanceof
                    HTMLInputElement ||
                event.target instanceof
                    HTMLTextAreaElement
            ) {
                return;
            }

            if (!tourActive) return;

            if (
                event.key === "ArrowRight" ||
                event.key === "Enter"
            ) {
                nextTourObject();
            }

            if (
                event.key === "ArrowLeft"
            ) {
                previousTourObject();
            }

            if (
                event.key === "Escape"
            ) {
                closeGuidedMode();
            }
        }
    );

    resetTour();
}

// ============================================================
// PUBLIC FUNCTIONS
// ============================================================

export function getTourObjects() {
    return [...tourObjects];
}

export function getCurrentTourObject() {
    return tourObjects[
        currentTourIndex
    ];
}

export function getCurrentTourIndex() {
    return currentTourIndex;
}

export function isTourActive() {
    return tourActive;
}

export function startGuideTour() {
    startTour();
}

export function nextGuideObject() {
    nextTourObject();
}

export function previousGuideObject() {
    previousTourObject();
}
