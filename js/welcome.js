export function showExplorer() {
    const homeScreen = document.getElementById("homeScreen");
    const explorerScreen = document.getElementById("explorerScreen");

    if (homeScreen) {
        homeScreen.classList.remove("active");
        homeScreen.style.display = "none";
    }

    if (explorerScreen) {
        explorerScreen.classList.add("active");
        explorerScreen.style.display = "block";
    }

    window.dispatchEvent(new CustomEvent("universe:explore"));
}

export function showHome() {
    const homeScreen = document.getElementById("homeScreen");
    const explorerScreen = document.getElementById("explorerScreen");

    if (explorerScreen) {
        explorerScreen.classList.remove("active");
        explorerScreen.style.display = "none";
    }

    if (homeScreen) {
        homeScreen.classList.add("active");
        homeScreen.style.display = "flex";
    }

    window.dispatchEvent(new CustomEvent("universe:home"));
}

export function initializeWelcome() {
    const exploreButton = document.getElementById("exploreButton");
    const homeButton = document.getElementById("homeButton");

    if (exploreButton) {
        exploreButton.addEventListener("click", () => {
            showExplorer();
        });
    }

    if (homeButton) {
        homeButton.addEventListener("click", () => {
            showHome();
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            showHome();
        }
    });

    showHome();
}
