
/* =========================================================
   UNIVERSE EXPLORER — APP CONTROLLER
   Responsabilità:
   - Avvio dell'applicazione
   - Gestione delle schermate
   - Caricamento e gestione degli errori
   - Avvio e riavvio dell'esplorazione 3D

   I pianeti, gli effetti e la navigazione NON vanno qui.
   ========================================================= */

const App = (() => {
    "use strict";

    const state = {
        initialized: false,
        startingUniverse: false,
        universeModule: null,
        attempt: 0
    };

    const elements = {};

    const REQUIRED_ELEMENTS = [
        "loading-screen",
        "loading-progress-bar",
        "loading-percentage",
        "loading-status",
        "welcome-screen",
        "explore-button",
        "universe-screen",
        "universe-container",
        "home-button",
        "error-screen",
        "error-title",
        "error-message",
        "retry-button",
        "return-home-error-button"
    ];

    function getElement(id) {
        return document.getElementById(id);
    }

    function collectElements() {
        const missing = [];

        for (const id of REQUIRED_ELEMENTS) {
            const element = getElement(id);

            if (!element) {
                missing.push(`#${id}`);
            } else {
                elements[id] = element;
            }
        }

        if (missing.length > 0) {
            throw new Error(
                "Elementi HTML mancanti: " + missing.join(", ")
            );
        }
    }

    function setLoading(progress, message) {
        const percentage = Math.max(0, Math.min(100, progress));

       elements["loading-progress-bar"].style.width = `${percentage}%`;
        elements["loading-percentage"].textContent =
            `${Math.round(percentage)}%`;

        elements["loading-status"].textContent = message;
    }

    function showScreen(screenName) {
        const screens = [
            "loading-screen",
            "welcome-screen",
            "universe-screen",
            "error-screen"
        ];

        for (const id of screens) {
            const screen = elements[id];

            if (screen) {
                screen.hidden = id !== screenName;
            }
        }
    }

    function showError(title, message) {
        console.error(`[Universe Explorer] ${title}:`, message);

        state.startingUniverse = false;

        elements["error-title"].textContent = title;
        elements["error-message"].textContent = message;

        showScreen("error-screen");
    }

    function returnHome() {
        if (state.startingUniverse) {
            return;
        }

        showScreen("welcome-screen");
    }

    async function startUniverse() {
        if (state.startingUniverse) {
            return;
        }

        state.startingUniverse = true;
        state.attempt += 1;

        showScreen("loading-screen");
        setLoading(5, "Preparing the universe...");

        try {
            const container = elements["universe-container"];

            if (!container) {
                throw new Error(
                    "The 3D universe container was not found."
                );
            }

            setLoading(20, "Loading the exploration engine...");

            // Carica il motore 3D soltanto quando serve.
            // Il file universe.js verrà creato separatamente.
            if (!state.universeModule) {
                state.universeModule = await import("./universe.js");
            }

            setLoading(60, "Building the cosmic environment...");

            if (
                typeof state.universeModule.initializeUniverse !==
                "function"
            ) {
                throw new Error(
                    'universe.js must export initializeUniverse().'
                );
            }

            await state.universeModule.initializeUniverse({
                container,

                onProgress(progress, message) {
                    const value = Math.max(
                        60,
                        Math.min(99, Number(progress) || 60)
                    );

                    setLoading(
                        value,
                        message || "Preparing the universe..."
                    );
                }
            });

            setLoading(100, "Universe ready.");

            showScreen("universe-screen");
            state.startingUniverse = false;

        } catch (error) {
            state.startingUniverse = false;

            console.error(
                "[Universe Explorer] Exploration startup failed:",
                error
            );

            showError(
                "Unable to start the universe",
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred."
            );
        }
    }

    function connectEvents() {
        elements["explore-button"].addEventListener(
            "click",
            startUniverse
        );

        elements["home-button"].addEventListener(
            "click",
            returnHome
        );

        elements["return-home-error-button"].addEventListener(
            "click",
            returnHome
        );

        elements["retry-button"].addEventListener(
            "click",
            () => {
                // Un nuovo tentativo non registra nuovi eventi.
                state.universeModule = null;
                startUniverse();
            }
        );
    }

    function initialize() {
        if (state.initialized) {
            return;
        }

        try {
            collectElements();

            setLoading(100, "Application ready.");
            showScreen("welcome-screen");

            connectEvents();

            state.initialized = true;

            console.info(
                "[Universe Explorer] Application initialized."
            );

        } catch (error) {
            console.error(
                "[Universe Explorer] Initialization failed:",
                error
            );

            // Se l'HTML è incompleto, segnala il problema
            // senza lasciare il sito bloccato su un caricamento.
            document.body.textContent =
                "Universe Explorer could not start. " +
                (error instanceof Error
                    ? error.message
                    : "Please check the HTML structure.");
        }
    }

    return { initialize };
})();

// Avvia l'applicazione una sola volta.
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", App.initialize, {
        once: true
    });
} else {
    App.initialize();
}
