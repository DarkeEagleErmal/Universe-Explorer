
/* ============================================================
   UNIVERSE EXPLORER — 3D NAVIGATION
   File: js/navigation.js

   Responsabilità:
   - Rotazione della telecamera
   - Zoom
   - Movimento libero con tastiera
   - Controlli del mouse
   - Limiti di navigazione

   Non crea pianeti e non gestisce l'interfaccia.
   ============================================================ */

import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

import { OrbitControls } from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js";

const CONFIG = {
    minDistance: 2,
    maxDistance: 6000,
    zoomSpeed: 0.8,
    rotateSpeed: 0.45,
    moveSpeed: 80,
    fastMoveMultiplier: 3,
    dampingFactor: 0.07
};

export function createNavigation(camera, renderer, scene) {
    if (!camera?.isPerspectiveCamera) {
        throw new Error(
            "Navigation requires a THREE.PerspectiveCamera."
        );
    }

    if (!renderer?.domElement) {
        throw new Error(
            "Navigation requires a valid WebGL renderer."
        );
    }

    if (!scene?.isScene) {
        throw new Error(
            "Navigation requires a valid THREE.Scene."
        );
    }

    const controls = new OrbitControls(
        camera,
        renderer.domElement
    );

    controls.enableDamping = true;
    controls.dampingFactor = CONFIG.dampingFactor;

    controls.enableZoom = true;
    controls.zoomSpeed = CONFIG.zoomSpeed;

    controls.enableRotate = true;
    controls.rotateSpeed = CONFIG.rotateSpeed;

    controls.enablePan = true;
    controls.screenSpacePanning = true;

    controls.minDistance = CONFIG.minDistance;
    controls.maxDistance = CONFIG.maxDistance;

    controls.target.set(0, 0, -100);
    controls.update();

    // Movimento libero tramite tastiera.
    const pressedKeys = new Set();
    const direction = new THREE.Vector3();
    const right = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);

    let enabled = true;
    let disposed = false;
    let currentSpeed = CONFIG.moveSpeed;

    const handledKeys = new Set([
        "KeyW", "KeyA", "KeyS", "KeyD",
        "KeyQ", "KeyE", "ShiftLeft", "ShiftRight"
    ]);

    function isTypingTarget(target) {
        return target instanceof HTMLElement &&
            (
                target.isContentEditable ||
                ["INPUT", "TEXTAREA", "SELECT", "BUTTON"]
                    .includes(target.tagName)
            );
    }

    function onKeyDown(event) {
        if (!enabled || isTypingTarget(event.target)) return;

        if (handledKeys.has(event.code)) {
            pressedKeys.add(event.code);
        }
    }

    function onKeyUp(event) {
        pressedKeys.delete(event.code);
    }

    function clearKeys() {
        pressedKeys.clear();
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearKeys);

    function update(deltaSeconds) {
        if (disposed || !enabled) return;

        controls.update();

        const delta = Math.min(
            Math.max(deltaSeconds || 0, 0),
            0.05
        );

        const speed = currentSpeed *
            (pressedKeys.has("ShiftLeft") ||
             pressedKeys.has("ShiftRight")
                ? CONFIG.fastMoveMultiplier
                : 1) *
            delta;

        direction.set(0, 0, 0);

        camera.getWorldDirection(right);
        right.cross(up).normalize();

        if (pressedKeys.has("KeyW")) {
            direction.add(
                camera.getWorldDirection(new THREE.Vector3())
            );
        }

        if (pressedKeys.has("KeyS")) {
            direction.sub(
                camera.getWorldDirection(new THREE.Vector3())
            );
        }

        if (pressedKeys.has("KeyD")) {
            direction.add(right);
        }

        if (pressedKeys.has("KeyA")) {
            direction.sub(right);
        }

        if (pressedKeys.has("KeyE")) {
            direction.y += 1;
        }

        if (pressedKeys.has("KeyQ")) {
            direction.y -= 1;
        }

        if (direction.lengthSq() > 0) {
            direction.normalize().multiplyScalar(speed);

            camera.position.add(direction);
            controls.target.add(direction);
        }
    }

    function setEnabled(value) {
        enabled = Boolean(value);
        controls.enabled = enabled;

        if (!enabled) {
            clearKeys();
        }
    }

    function setSpeed(value) {
        const speed = Number(value);

        if (Number.isFinite(speed) && speed > 0) {
            currentSpeed = Math.min(speed, 2000);
        }
    }

    function focusOn(position, distance = 15) {
        if (!position?.isVector3 || disposed) return;

        const offset = new THREE.Vector3()
            .subVectors(camera.position, controls.target);

        if (offset.lengthSq() === 0) {
            offset.set(0, 0, 1);
        }

        offset.setLength(
            THREE.MathUtils.clamp(
                distance,
                CONFIG.minDistance,
                CONFIG.maxDistance
            )
        );

        controls.target.copy(position);
        camera.position.copy(position).add(offset);
        controls.update();
    }

    function reset() {
        camera.position.set(0, 0, 45);
        controls.target.set(0, 0, -100);
        controls.update();
        clearKeys();
    }

    function dispose() {
        if (disposed) return;

        disposed = true;
        clearKeys();

        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        window.removeEventListener("blur", clearKeys);

        controls.dispose();
    }

    return {
        controls,
        update,
        setEnabled,
        setSpeed,
        focusOn,
        reset,
        dispose
    };
}
