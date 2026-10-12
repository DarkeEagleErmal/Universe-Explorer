
/* ============================================================
   UNIVERSE EXPLORER — LIGHTING ENGINE
   File: js/lighting.js

   RESPONSABILITÀ:
   - Illuminazione spaziale
   - Luce proveniente dal Sole
   - Ombre dei corpi celesti
   - Luce ambientale molto tenue
   - Sincronizzazione con la posizione del Sole

   NON contiene pianeti, interfaccia o navigazione.
   ============================================================ */

import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const CONFIG = Object.freeze({
    ambientColor: 0x9aabff,
    ambientIntensity: 0.10,

    sunlightColor: 0xfff0d8,
    sunlightIntensity: 3.0,

    fillSkyColor: 0x344d87,
    fillGroundColor: 0x080b18,
    fillIntensity: 0.08,

    shadowMapSize: 2048,
    shadowCameraSize: 250,
    shadowNear: 0.5,
    shadowFar: 1200,
    shadowBias: -0.0001,
    shadowNormalBias: 0.015,
    shadowRadius: 2
});

const clamp = (value, min, max) =>
    Math.min(max, Math.max(min, value));

export function createSpaceLighting(scene, options = {}) {
    if (!scene?.isScene) {
        throw new Error(
            "createSpaceLighting() requires a valid THREE.Scene."
        );
    }

    const group = new THREE.Group();
    group.name = "UniverseExplorerLighting";

    const ambientLight = new THREE.AmbientLight(
        CONFIG.ambientColor,
        CONFIG.ambientIntensity
    );
    ambientLight.name = "DeepSpaceAmbientLight";

    const sunlight = new THREE.DirectionalLight(
        CONFIG.sunlightColor,
        CONFIG.sunlightIntensity
    );
    sunlight.name = "MainSunlight";

    sunlight.position.set(100, 50, 80);
    sunlight.target.position.set(0, 0, 0);

    sunlight.castShadow = options.shadows !== false;

    sunlight.shadow.mapSize.set(
        CONFIG.shadowMapSize,
        CONFIG.shadowMapSize
    );

    const shadowCamera = sunlight.shadow.camera;
    shadowCamera.left = -CONFIG.shadowCameraSize;
    shadowCamera.right = CONFIG.shadowCameraSize;
    shadowCamera.top = CONFIG.shadowCameraSize;
    shadowCamera.bottom = -CONFIG.shadowCameraSize;
    shadowCamera.near = CONFIG.shadowNear;
    shadowCamera.far = CONFIG.shadowFar;
    shadowCamera.updateProjectionMatrix();

    sunlight.shadow.bias = CONFIG.shadowBias;
    sunlight.shadow.normalBias = CONFIG.shadowNormalBias;
    sunlight.shadow.radius = CONFIG.shadowRadius;

    const fillLight = new THREE.HemisphereLight(
        CONFIG.fillSkyColor,
        CONFIG.fillGroundColor,
        CONFIG.fillIntensity
    );
    fillLight.name = "CosmicFillLight";

    group.add(ambientLight);
    group.add(sunlight);
    group.add(sunlight.target);
    group.add(fillLight);

    scene.add(group);

    let disposed = false;

    function ensureActive() {
        if (disposed) {
            throw new Error(
                "Universe Explorer lighting has already been disposed."
            );
        }
    }

    /**
     * Orienta la luce verso un punto della scena.
     * Per una luce diretta dal Sole, passa la posizione del Sole.
     */
    function setSunPosition(x, y, z) {
        ensureActive();

        const position = new THREE.Vector3(x, y, z);

        if (!Number.isFinite(x) ||
            !Number.isFinite(y) ||
            !Number.isFinite(z)) {
            throw new TypeError(
                "Sun position must contain finite coordinates."
            );
        }

        if (position.lengthSq() < 0.000001) {
            position.set(0, 1, 0);
        }

        sunlight.position.copy(position);
        sunlight.target.position.set(0, 0, 0);

        sunlight.target.updateMatrixWorld(true);
        sunlight.updateMatrixWorld(true);
    }

    /**
     * Imposta la posizione del Sole e il punto da illuminare.
     * Usa coordinate nello stesso sistema della scena.
     */
    function syncWithSun(sun, target = new THREE.Vector3()) {
        ensureActive();

        if (!sun?.isObject3D) {
            throw new TypeError(
                "syncWithSun() requires a valid Sun Object3D."
            );
        }

        const sunWorldPosition = new THREE.Vector3();
        sun.getWorldPosition(sunWorldPosition);

        const targetPosition = target.isVector3
            ? target.clone()
            : new THREE.Vector3();

        sunlight.position.copy(sunWorldPosition);
        sunlight.target.position.copy(targetPosition);

        sunlight.target.updateMatrixWorld(true);
        sunlight.updateMatrixWorld(true);
    }

    function setSunIntensity(intensity) {
        ensureActive();

        const value = Number(intensity);

        if (!Number.isFinite(value)) {
            throw new TypeError(
                "Sun intensity must be a finite number."
            );
        }

        sunlight.intensity = clamp(value, 0, 10);
    }

    function setAmbientIntensity(intensity) {
        ensureActive();

        const value = Number(intensity);

        if (!Number.isFinite(value)) {
            throw new TypeError(
                "Ambient intensity must be a finite number."
            );
        }

        ambientLight.intensity = clamp(value, 0, 1);
    }

    function setFillIntensity(intensity) {
        ensureActive();

        const value = Number(intensity);

        if (!Number.isFinite(value)) {
            throw new TypeError(
                "Fill intensity must be a finite number."
            );
        }

        fillLight.intensity = clamp(value, 0, 1);
    }

    function setShadowsEnabled(enabled) {
        ensureActive();
        sunlight.castShadow = Boolean(enabled);
    }

    function setShadowCameraSize(size) {
        ensureActive();

        const value = Number(size);

        if (!Number.isFinite(value) || value <= 0) {
            throw new TypeError(
                "Shadow camera size must be a positive number."
            );
        }

        const camera = sunlight.shadow.camera;
        const half = value / 2;

        camera.left = -half;
        camera.right = half;
        camera.top = half;
        camera.bottom = -half;
        camera.updateProjectionMatrix();
    }

    function dispose() {
        if (disposed) return;

        disposed = true;
        scene.remove(group);

        // Le luci non possiedono geometrie o texture da liberare.
        group.clear();
    }

    return {
        group,
        ambientLight,
        sunlight,
        fillLight,

        setSunPosition,
        syncWithSun,
        setSunIntensity,
        setAmbientIntensity,
        setFillIntensity,
        setShadowsEnabled,
        setShadowCameraSize,
        dispose
    };
}
