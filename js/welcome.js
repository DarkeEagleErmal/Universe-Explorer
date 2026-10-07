// =========================================================
// UNIVERSE EXPLORER
// welcome.js
// Home / Welcome screen
// =========================================================

const homeScreen = document.getElementById("homeScreen");
const explorerScreen = document.getElementById("explorerScreen");
const exploreButton = document.getElementById("exploreButton");
const homeButton = document.getElementById("homeButton");


// =========================================================
// SHOW EXPLORER
// =========================================================

export function showExplorer() {

    if (!homeScreen || !explorerScreen) return;

    homeScreen.classList.remove("active");
    homeScreen.classList.add("hidden");

    explorerScreen.classList.remove("hidden");
    explorerScreen.classList.add("active");
}


// =========================================================
// SHOW HOME
// =========================================================

export function showHome() {

    if (!homeScreen || !explorerScreen) return;

    explorerScreen.classList.remove("active");
    explorerScreen.classList.add("hidden");

    homeScreen.classList.remove("hidden");
    homeScreen.classList.add("active");
}


// =========================================================
// EXPLORE BUTTON
// =========================================================

if (exploreButton) {

    exploreButton.addEventListener("click", () => {

        showExplorer();

        window.dispatchEvent(
            new CustomEvent("universe:explore")
        );

    });

}


// =========================================================
// HOME BUTTON
// =========================================================

if (homeButton) {

    homeButton.addEventListener("click", () => {

        showHome();

        window.dispatchEvent(
            new CustomEvent("universe:home")
        );

    });

}


// =========================================================
// KEYBOARD
// =========================================================

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        if (
            explorerScreen &&
            !explorerScreen.classList.contains("hidden")
        ) {

            showHome();

            window.dispatchEvent(
                new CustomEvent("universe:home")
            );

        }

    }

});


// =========================================================
// INITIAL STATE
// =========================================================

export function initializeWelcome() {

    if (!homeScreen || !explorerScreen) return;

    homeScreen.classList.add("active");
    homeScreen.classList.remove("hidden");

    explorerScreen.classList.add("hidden");
    explorerScreen.classList.remove("active");
    }
