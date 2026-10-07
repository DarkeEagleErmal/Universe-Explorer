export function showExplorer() {
    const homeScreen = document.getElementById("homeScreen");
    const explorerScreen = document.getElementById("explorerScreen");

    if (!homeScreen || !explorerScreen) return;

    homeScreen.classList.add("hidden");
    explorerScreen.classList.remove("hidden");

    window.dispatchEvent(new CustomEvent("universe:explore"));
}

export function showHome() {
    const homeScreen = document.getElementById("homeScreen");
    const explorerScreen = document.getElementById("explorerScreen");

    if (!homeScreen || !explorerScreen) return;

    explorerScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");

    window.dispatchEvent(new CustomEvent("universe:home"));
}

export function initializeWelcome() {
    const exploreButton = document.getElementById("exploreButton");
    const homeButton = document.getElementById("homeButton");

    if (exploreButton) {
        exploreButton.onclick = function (event) {
            event.preventDefault();
            event.stopPropagation();
            showExplorer();
        };
    }

    if (homeButton) {
        homeButton.onclick = function (event) {
            event.preventDefault();
            event.stopPropagation();
            showHome();
        };
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            const explorerScreen = document.getElementById("explorerScreen");

            if (
                explorerScreen &&
                !explorerScreen.classList.contains("hidden")
            ) {
                showHome();
            }
        }
    });

    const homeScreen = document.getElementById("homeScreen");
    const explorerScreen = document.getElementById("explorerScreen");

    if (homeScreen) homeScreen.classList.remove("hidden");
    if (explorerScreen) explorerScreen.classList.add("hidden");
}
