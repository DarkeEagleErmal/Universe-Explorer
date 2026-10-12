
/* ============================================================
   UNIVERSE EXPLORER — LIGHTING ENGINE
   File: js/lighting.js

   Responsabilità:
   - Illuminazione ambientale dello spazio
   - Luce direzionale del Sole
   - Luce di supporto per gli oggetti celesti
   - Gestione separata delle luci

   NON contiene pianeti, interfaccia o navigazione.
   ============================================================ */

import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const LIGHTING_CONFIG = {
    ambientColor: 0x9aabff,
    ambientIntensity: 0.12,

    sunlightColor: 0xfff0d2,
    sunlightIntensity: 4.0,

    fillColor: 0x263d85,
    fillIntensity: 0.16,

    shadowMapSize: 2048,
    shadowCameraSize: 100
};

/**
 * Crea il sistema di illuminazione della scena.
 *
 * @param {THREE.Scene} scene
 * @returns {Object} Controlli e riferimenti alle luci.
 */
export function createSpaceLighting(scene) {
    if (!scene || !scene.isScene) {
        throw new Error(
            "createSpaceLighting() requires a valid THREE.Scene."
        );
    }

    const group = new THREE.Group();
    group.name = "UniverseExplorerLighting";

    // Luce ambientale molto tenue: evita il nero assoluto
    // senza eliminare il contrasto tra luce e ombra.
    const ambientLight = new THREE.AmbientLight(
        LIGHTING_CONFIG.ambientColor,
        LIGHTING_CONFIG.ambientIntensity
    );

    ambientLight.name = "DeepSpaceAmbientLight";
    group.add(ambientLight);

    // Luce direzionale principale.
    // La sua posizione rappresenta la direzione della luce
    // proveniente dalla futura posizione del Sole.
    const sunlight = new THREE.DirectionalLight(
        LIGHTING_CONFIG.sunlightColor,
        LIGHTING_CONFIG.sunlightIntensity
    );

    sunlight.name = "MainSunlight";
    sunlight.position.set(100, 50, 80);
    sunlight.target.position.set(0, 0, 0);

    sunlight.castShadow = true;

    sunlight.shadow.mapSize.set(
        LIGHTING_CONFIG.shadowMapSize,
        LIGHTING_CONFIG.shadowMapSize
    );

    sunlight.shadow.camera.left =
        -LIGHTING_CONFIG.shadowCameraSize;

    sunlight.shadow.camera.right =
        LIGHTING_CONFIG.shadowCameraSize;

    sunlight.shadow.camera.top =
        LIGHTING_CONFIG.shadowCameraSize;

    sunlight.shadow.camera.bottom =
        -LIGHTING_CONFIG.shadowCameraSize;

    sunlight.shadow.camera.near = 0.5;
    sunlight.shadow.camera.far = 500;

    sunlight.shadow.bias = -0.0001;
    sunlight.shadow.normalBias = 0.02;
    sunlight.shadow.radius = 3;

    group.add(sunlight);
    group.add(sunlight.target);

    // Debole luce fredda di riempimento, per un aspetto
    // cinematografico senza cancellare le ombre principali.
    const fillLight = new THREE.HemisphereLight(
        0x5275bd,
        0x080b18,
        LIGHTING_CONFIG.fillIntensity
    );

    fillLight.name = "CosmicFillLight";
    group.add(fillLight);

    scene.add(group);

    let disposed = false;

    return {
        group,
        ambientLight,
        sunlight,
        fillLight,

        /**
         * Cambia la direzione della luce principale.
         */
        setSunDirection(x, y, z) {
            if (disposed) return;

            sunlight.position.set(x, y, z);
            sunlight.target.position.set(0, 0, 0);
            sunlight.target.updateMatrixWorld();
        },

        /**
         * Modifica l'intensità della luce principale.
         */
        setSunIntensity(intensity) {
            if (disposed) return;

            sunlight.intensity = Math.max(
                0,
                Math.min(Number(intensity) || 0, 10)
            );
        },

        /**
         * Attiva o disattiva le ombre.
         * Il renderer deve avere shadowMap.enabled = true.
         */
        setShadowsEnabled(enabled) {
            if (disposed) return;

            sunlight.castShadow = Boolean(enabled);
        },

        /**
         * Rimuove le luci dalla scena.
         */
        dispose() {
            if (disposed) return;

            disposed = true;
            scene.remove(group);
        }
    };
}
