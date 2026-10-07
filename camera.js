import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let camera = null;
let controls = null;

export function initializeCamera(scene, renderer) {
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000000
    );

    camera.position.set(0, 80, 180);

    controls = new OrbitControls(
        camera,
        renderer.domElement
    );

    controls.enableDamping = true;
    controls.dampingFactor = 0.06;

    controls.enablePan = true;
    controls.enableZoom = true;
    controls.enableRotate = true;

    controls.minDistance = 2;
    controls.maxDistance = 500000;

    controls.target.set(0, 0, 0);

    return {
        camera,
        controls
    };
}

export function getCamera() {
    return camera;
}

export function getControls() {
    return controls;
}

export function updateCamera() {
    if (controls) {
        controls.update();
    }
}

export function resetCamera() {
    if (!camera || !controls) return;

    camera.position.set(0, 80, 180);
    controls.target.set(0, 0, 0);

    controls.update();

    window.dispatchEvent(
        new CustomEvent("universe:cameraReset")
    );
}

export function zoomIn(amount = 20) {
    if (!camera) return;

    const direction = new THREE.Vector3();

    camera.getWorldDirection(direction);

    camera.position.addScaledVector(
        direction,
        amount
    );

    if (controls) {
        controls.update();
    }
}

export function zoomOut(amount = 20) {
    if (!camera) return;

    const direction = new THREE.Vector3();

    camera.getWorldDirection(direction);

    camera.position.addScaledVector(
        direction,
        -amount
    );

    if (controls) {
        controls.update();
    }
}

export function focusCameraOnObject(
    object,
    distance = 12,
    duration = 1000
) {
    if (!camera || !controls || !object) return;

    const targetPosition = new THREE.Vector3();

    object.getWorldPosition(targetPosition);

    const direction = new THREE.Vector3()
        .subVectors(
            camera.position,
            targetPosition
        )
        .normalize();

    if (direction.length() === 0) {
        direction.set(0, 0, 1);
    }

    const finalPosition = targetPosition
        .clone()
        .add(
            direction.multiplyScalar(distance)
        );

    const startPosition =
        camera.position.clone();

    const startTarget =
        controls.target.clone();

    const startTime = performance.now();

    function animateCamera(currentTime) {
        const elapsed =
            currentTime - startTime;

        const progress =
            Math.min(
                elapsed / duration,
                1
            );

        const smoothProgress =
            progress < 0.5
                ? 2 * progress * progress
                : 1 -
                  Math.pow(
                      -2 * progress + 2,
                      2
                  ) / 2;

        camera.position.lerpVectors(
            startPosition,
            finalPosition,
            smoothProgress
        );

        controls.target.lerpVectors(
            startTarget,
            targetPosition,
            smoothProgress
        );

        controls.update();

        if (progress < 1) {
            requestAnimationFrame(
                animateCamera
            );
        }
    }

    requestAnimationFrame(
        animateCamera
    );
}

export function lookAt(position) {
    if (!controls) return;

    const target =
        position instanceof THREE.Vector3
            ? position
            : new THREE.Vector3(
                  position.x,
                  position.y,
                  position.z
              );

    controls.target.copy(target);

    controls.update();
}

export function setCameraPosition(position) {
    if (!camera) return;

    camera.position.set(
        position.x,
        position.y,
        position.z
    );

    if (controls) {
        controls.update();
    }
}

export function updateCameraAspect() {
    if (!camera) return;

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();
}

window.addEventListener(
    "universe:zoomIn",
    () => {
        zoomIn();
    }
);

window.addEventListener(
    "universe:zoomOut",
    () => {
        zoomOut();
    }
);

window.addEventListener(
    "universe:resetCamera",
    () => {
        resetCamera();
    }
);

window.addEventListener(
    "resize",
    () => {
        updateCameraAspect();
    }
);
