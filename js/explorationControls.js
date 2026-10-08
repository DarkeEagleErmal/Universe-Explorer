// ============================================================
// UNIVERSE EXPLORER — EXPLORATION CONTROLS
// ============================================================

let explorationMode = "FREE";
let orbitsVisible = true;
let timeMultiplier = 1;
let objectFilter = "all";
let currentRegion = "Solar System";

// ============================================================
// EVENTS
// ============================================================

function emit(name, detail = {}) {
    window.dispatchEvent(
        new CustomEvent(name, {
            detail
        })
    );
}

// ============================================================
// EXPLORATION MODE
// ============================================================

export function setExplorationMode(mode) {
    explorationMode = String(mode || "FREE").toUpperCase();

    emit("universe:modeChanged", {
        mode: explorationMode
    });

    if (explorationMode === "SOLAR_SYSTEM") {
        emit("universe:solarSystem", {
            mode: explorationMode
        });
    }

    if (explorationMode === "FREE") {
        emit("universe:freeMode", {
            mode: explorationMode
        });
    }

    if (explorationMode === "GUIDED") {
        emit("universe:guidedMode", {
            mode: explorationMode
        });
    }
}

export function getExplorationMode() {
    return explorationMode;
}

// ============================================================
// ORBITS
// ============================================================

export function setOrbitsVisible(visible) {
    orbitsVisible = Boolean(visible);

    emit("universe:orbitsChanged", {
        visible: orbitsVisible
    });
}

export function areOrbitsVisible() {
    return orbitsVisible;
}

export function toggleOrbits() {
    setOrbitsVisible(!orbitsVisible);
}

// ============================================================
// TIME
// ============================================================

export function setTimeMultiplier(multiplier) {
    const value = Number(multiplier);

    if (!Number.isFinite(value)) {
        return;
    }

    timeMultiplier = Math.max(
        0,
        Math.min(value, 1000)
    );

    emit("universe:timeChanged", {
        multiplier: timeMultiplier
    });

    emit("universe:timeMultiplierChanged", {
        multiplier: timeMultiplier
    });
}

export function getTimeMultiplier() {
    return timeMultiplier;
}

export function increaseTime() {
    if (timeMultiplier < 1) {
        setTimeMultiplier(1);
    } else if (timeMultiplier < 10) {
        setTimeMultiplier(timeMultiplier + 1);
    } else if (timeMultiplier < 100) {
        setTimeMultiplier(timeMultiplier + 10);
    } else {
        setTimeMultiplier(
            Math.min(timeMultiplier * 2, 1000)
        );
    }
}

export function decreaseTime() {
    if (timeMultiplier <= 1) {
        setTimeMultiplier(0);
    } else if (timeMultiplier <= 10) {
        setTimeMultiplier(timeMultiplier - 1);
    } else {
        setTimeMultiplier(
            Math.max(
                1,
                Math.floor(timeMultiplier / 2)
            )
        );
    }
}

// ============================================================
// OBJECT FILTER
// ============================================================

export function setObjectFilter(filter) {
    objectFilter =
        String(filter || "all")
            .toLowerCase();

    emit(
        "universe:objectFilterChanged",
        {
            filter: objectFilter
        }
    );
}

export function getObjectFilter() {
    return objectFilter;
}

// ============================================================
// REGION
// ============================================================

export function setCurrentRegion(region) {
    currentRegion =
        String(
            region || "Solar System"
        );

    emit(
        "universe:regionChanged",
        {
            region: currentRegion
        }
    );
}

export function getCurrentRegion() {
    return currentRegion;
}

// ============================================================
// INITIALIZE BUTTONS
// ============================================================

export function initializeExplorationControls() {
    const solarSystemButton =
        document.getElementById(
            "solarSystemButton"
        );

    const freeModeButton =
        document.getElementById(
            "freeModeButton"
        );

    const guidedModeButton =
        document.getElementById(
            "guidedModeButton"
        );

    const tourButton =
        document.getElementById(
            "tourButton"
        );

    const orbitsButton =
        document.getElementById(
            "orbitsButton"
        );

    const timeButton =
        document.getElementById(
            "timeButton"
        );

    const zoomInButton =
        document.getElementById(
            "zoomIn"
        );

    const zoomOutButton =
        document.getElementById(
            "zoomOut"
        );

    const resetButton =
        document.getElementById(
            "resetCamera"
        );

    // --------------------------------------------------------
    // SOLAR SYSTEM
    // --------------------------------------------------------

    if (solarSystemButton) {
        solarSystemButton.addEventListener(
            "click",
            () => {
                setExplorationMode(
                    "SOLAR_SYSTEM"
                );
            }
        );
    }

    // --------------------------------------------------------
    // FREE MODE
    // --------------------------------------------------------

    if (freeModeButton) {
        freeModeButton.addEventListener(
            "click",
            () => {
                setExplorationMode(
                    "FREE"
                );
            }
        );
    }

    // --------------------------------------------------------
    // GUIDED MODE
    // --------------------------------------------------------

    if (guidedModeButton) {
        guidedModeButton.addEventListener(
            "click",
            () => {
                setExplorationMode(
                    "GUIDED"
                );
            }
        );
    }

    // --------------------------------------------------------
    // TOUR
    // --------------------------------------------------------

    if (tourButton) {
        tourButton.addEventListener(
            "click",
            () => {
                setExplorationMode(
                    "GUIDED"
                );

                emit(
                    "universe:startTour"
                );
            }
        );
    }

    // --------------------------------------------------------
    // ORBITS
    // --------------------------------------------------------

    if (orbitsButton) {
        orbitsButton.addEventListener(
            "click",
            () => {
                toggleOrbits();

                orbitsButton.classList.toggle(
                    "active",
                    orbitsVisible
                );
            }
        );
    }

    // --------------------------------------------------------
    // TIME
    // --------------------------------------------------------

    if (timeButton) {
        timeButton.addEventListener(
            "click",
            () => {
                increaseTime();

                timeButton.classList.add(
                    "active"
                );

                setTimeout(() => {
                    timeButton.classList.remove(
                        "active"
                    );
                }, 250);
            }
        );
    }

    // --------------------------------------------------------
    // ZOOM
    // --------------------------------------------------------

    if (zoomInButton) {
        zoomInButton.addEventListener(
            "click",
            () => {
                emit(
                    "universe:zoomIn"
                );
            }
        );
    }

    if (zoomOutButton) {
        zoomOutButton.addEventListener(
            "click",
            () => {
                emit(
                    "universe:zoomOut"
                );
            }
        );
    }

    // --------------------------------------------------------
    // RESET CAMERA
    // --------------------------------------------------------

    if (resetButton) {
        resetButton.addEventListener(
            "click",
            () => {
                emit(
                    "universe:resetCamera"
                );
            }
        );
    }

    // --------------------------------------------------------
    // OBJECT FILTERS
    // --------------------------------------------------------

    const filterButtons =
        document.querySelectorAll(
            "[data-object-type]"
        );

    filterButtons.forEach(
        button => {
            button.addEventListener(
                "click",
                () => {
                    const filter =
                        button.dataset.objectType ||
                        "all";

                    setObjectFilter(
                        filter
                    );

                    filterButtons.forEach(
                        item => {
                            item.classList.toggle(
                                "active",
                                item === button
                            );
                        }
                    );
                }
            );
        }
    );

    // --------------------------------------------------------
    // KEYBOARD
    // --------------------------------------------------------

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

            switch (
                event.key.toLowerCase()
            ) {
                case "g":
                    setExplorationMode(
                        "GUIDED"
                    );
                    break;

                case "f":
                    setExplorationMode(
                        "FREE"
                    );
                    break;

                case "s":
                    setExplorationMode(
                        "SOLAR_SYSTEM"
                    );
                    break;

                case "o":
                    toggleOrbits();
                    break;

                case "+":
                case "=":
                    emit(
                        "universe:zoomIn"
                    );
                    break;

                case "-":
                case "_":
                    emit(
                        "universe:zoomOut"
                    );
                    break;

                case "r":
                    emit(
                        "universe:resetCamera"
                    );
                    break;

                case "t":
                    setExplorationMode(
                        "GUIDED"
                    );

                    emit(
                        "universe:startTour"
                    );
                    break;
            }
        }
    );

    // --------------------------------------------------------
    // INITIAL STATE
    // --------------------------------------------------------

    setExplorationMode(
        explorationMode
    );

    setObjectFilter(
        objectFilter
    );

    setOrbitsVisible(
        orbitsVisible
    );
}
