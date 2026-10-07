let selectedObject = null;
let selectedData = null;

let currentRegion = "SOLAR SYSTEM";

export function initializeInterface() {
    setupSearch();
    setupHomeButton();
    setupInfoClose();
    setupRegionEvents();
    setupSelectionEvents();

    updateRegion("SOLAR SYSTEM");
    updateMode("FREE");
    updatePosition(0, 0, 0);
}

function setupSearch() {
    const input =
        document.getElementById(
            "searchInput"
        );

    const button =
        document.getElementById(
            "searchButton"
        );

    if (!input) return;

    input.addEventListener(
        "keydown",
        event => {
            if (event.key === "Enter") {
                performSearch(
                    input.value
                );
            }
        }
    );

    button?.addEventListener(
        "click",
        () => {
            performSearch(
                input.value
            );
        }
    );
}

function performSearch(value) {
    const query =
        String(value || "")
            .trim();

    if (!query) return;

    window.dispatchEvent(
        new CustomEvent(
            "universe:search",
            {
                detail: {
                    query
                }
            }
        )
    );
}

export function showSearchResults(
    results = []
) {
    const container =
        document.getElementById(
            "searchResults"
        );

    if (!container) return;

    container.innerHTML = "";

    if (!results.length) {
        container.classList.add(
            "hidden"
        );

        return;
    }

    results.forEach(result => {
        const button =
            document.createElement(
                "button"
            );

        button.className =
            "search-result";

        button.textContent =
            result.name;

        button.addEventListener(
            "click",
            () => {
                window.dispatchEvent(
                    new CustomEvent(
                        "universe:searchResultSelected",
                        {
                            detail: result
                        }
                    )
                );

                container.classList.add(
                    "hidden"
                );
            }
        );

        container.appendChild(
            button
        );
    });

    container.classList.remove(
        "hidden"
    );
}

function setupHomeButton() {
    const button =
        document.getElementById(
            "homeButton"
        );

    button?.addEventListener(
        "click",
        () => {
            window.dispatchEvent(
                new CustomEvent(
                    "universe:home"
                )
            );
        }
    );
}

function setupInfoClose() {
    const button =
        document.getElementById(
            "closeInfo"
        );

    button?.addEventListener(
        "click",
        () => {
            window.dispatchEvent(
                new CustomEvent(
                    "universe:closeInfo"
                )
            );
        }
    );
}

function setupRegionEvents() {
    window.addEventListener(
        "universe:regionChanged",
        event => {
            const region =
                event.detail?.region ||
                "SOLAR SYSTEM";

            updateRegion(region);
        }
    );
}

function setupSelectionEvents() {
    window.addEventListener(
        "universe:objectSelected",
        event => {
            selectedObject =
                event.detail?.object ||
                null;

            selectedData =
                event.detail?.data ||
                null;

            updateSelectedStatus();
        }
    );

    window.addEventListener(
        "universe:informationClosed",
        () => {
            selectedObject = null;
            selectedData = null;

            updateSelectedStatus();
        }
    );
}

export function updateMode(
    mode
) {
    const modeText =
        document.getElementById(
            "modeText"
        );

    if (!modeText) return;

    modeText.textContent =
        String(mode || "FREE")
            .toUpperCase();
}

export function updateRegion(
    region
) {
    currentRegion =
        String(
            region ||
            "SOLAR SYSTEM"
        ).toUpperCase();

    const regionText =
        document.getElementById(
            "regionText"
        );

    if (regionText) {
        regionText.textContent =
            currentRegion;
    }

    const indicator =
        document.getElementById(
            "regionIndicator"
        );

    if (indicator) {
        indicator.classList.remove(
            "hidden"
        );
    }
}

export function updatePosition(
    x,
    y,
    z
) {
    const positionText =
        document.getElementById(
            "positionText"
        );

    if (!positionText) return;

    const format =
        value =>
            Number(value || 0)
                .toFixed(2);

    positionText.textContent =
        `X ${format(x)}  Y ${format(y)}  Z ${format(z)}`;
}

export function updateScale(
    value,
    unit = "AU"
) {
    const scaleText =
        document.getElementById(
            "scaleText"
        );

    if (!scaleText) return;

    scaleText.textContent =
        `${formatScale(value)} ${unit}`;
}

function formatScale(value) {
    const number =
        Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    if (Math.abs(number) >= 1000000) {
        return (
            number / 1000000
        ).toFixed(2) + "M";
    }

    if (Math.abs(number) >= 1000) {
        return (
            number / 1000
        ).toFixed(2) + "K";
    }

    return number.toFixed(2);
}

export function updateSelectedStatus() {
    const status =
        document.getElementById(
            "selectedStatus"
        );

    if (!status) return;

    if (!selectedData) {
        status.textContent =
            "NO OBJECT SELECTED";

        status.classList.remove(
            "active"
        );

        return;
    }

    status.textContent =
        `SELECTED: ${selectedData.name}`;

    status.classList.add(
        "active"
    );
}

export function updateLoadingProgress(
    percent
) {
    const loadingScreen =
        document.getElementById(
            "loadingScreen"
        );

    if (!loadingScreen) return;

    const value =
        Math.max(
            0,
            Math.min(
                100,
                Number(percent) || 0
            )
        );

    const progress =
        loadingScreen.querySelector(
            ".loading-progress"
        );

    if (progress) {
        progress.style.width =
            `${value}%`;
    }

    const text =
        loadingScreen.querySelector(
            ".loading-percent"
        );

    if (text) {
        text.textContent =
            `${Math.round(value)}%`;
    }
}

export function hideLoadingScreen() {
    const loadingScreen =
        document.getElementById(
            "loadingScreen"
        );

    if (!loadingScreen) return;

    loadingScreen.classList.add(
        "hidden"
    );
}

export function showLoadingScreen() {
    const loadingScreen =
        document.getElementById(
            "loadingScreen"
        );

    if (!loadingScreen) return;

    loadingScreen.classList.remove(
        "hidden"
    );
}

export function setExplorerVisible(
    visible
) {
    const explorer =
        document.getElementById(
            "explorerScreen"
        );

    if (!explorer) return;

    explorer.classList.toggle(
        "hidden",
        !visible
    );
}

export function setHomeVisible(
    visible
) {
    const home =
        document.getElementById(
            "homeScreen"
        );

    if (!home) return;

    home.classList.toggle(
        "hidden",
        !visible
    );
}

export function getCurrentRegion() {
    return currentRegion;
}

export function getSelectedObject() {
    return selectedObject;
}

export function getSelectedData() {
    return selectedData;
}

window.addEventListener(
    "universe:modeChanged",
    event => {
        updateMode(
            event.detail?.mode
        );
    }
);

window.addEventListener(
    "universe:positionChanged",
    event => {
        const position =
            event.detail?.position;

        if (!position) return;

        updatePosition(
            position.x,
            position.y,
            position.z
        );
    }
);

window.addEventListener(
    "universe:scaleChanged",
    event => {
        updateScale(
            event.detail?.value,
            event.detail?.unit
        );
    }
);

window.addEventListener(
    "universe:searchResults",
    event => {
        showSearchResults(
            event.detail?.results || []
        );
    }
);

window.addEventListener(
    "universe:loadingProgress",
    event => {
        updateLoadingProgress(
            event.detail?.percent
        );
    }
);
