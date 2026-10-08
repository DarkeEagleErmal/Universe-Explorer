import * as THREE from "three";
import { COLORS } from "./colors.js";


// ============================================================
// GLOBAL EFFECTS
// ============================================================

let scene = null;

let starField = null;
let ambientParticles = null;

const glowObjects = [];


// ============================================================
// STAR FIELD
// ============================================================

function createStarField() {

    const starCount = 18000;

    const positions = new Float32Array(
        starCount * 3
    );

    const colors = new Float32Array(
        starCount * 3
    );

    const sizes = new Float32Array(
        starCount
    );

    for (let i = 0; i < starCount; i++) {

        // Large spherical distribution
        const radius =
            800 +
            Math.random() * 7000;

        const theta =
            Math.random() *
            Math.PI * 2;

        const phi =
            Math.acos(
                THREE.MathUtils.randFloatSpread(2)
            );

        const x =
            radius *
            Math.sin(phi) *
            Math.cos(theta);

        const y =
            radius *
            Math.cos(phi);

        const z =
            radius *
            Math.sin(phi) *
            Math.sin(theta);

        const index = i * 3;

        positions[index] = x;
        positions[index + 1] = y;
        positions[index + 2] = z;


        // Slightly varied star colours
        const brightness =
            0.65 +
            Math.random() * 0.35;

        const type =
            Math.random();

        let color;

        if (type < 0.70) {

            // White
            color = new THREE.Color(
                COLORS.space.star
            );

        } else if (type < 0.85) {

            // Blue-white
            color = new THREE.Color(
                COLORS.space.starBlue
            );

        } else if (type < 0.94) {

            // Slightly warm
            color = new THREE.Color(
                0xffe9c7
            );

        } else {

            // Soft reddish star
            color = new THREE.Color(
                0xffc0a0
            );
        }

        colors[index] =
            color.r * brightness;

        colors[index + 1] =
            color.g * brightness;

        colors[index + 2] =
            color.b * brightness;


        // Very small points
        sizes[i] =
            0.8 +
            Math.random() * 1.8;
    }


    const geometry =
        new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );

    geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(
            colors,
            3
        )
    );

    geometry.setAttribute(
        "size",
        new THREE.BufferAttribute(
            sizes,
            1
        )
    );


    const material =
        new THREE.PointsMaterial({

            size: 1.7,

            vertexColors: true,

            transparent: true,

            opacity: 0.9,

            depthWrite: false,

            blending:
                THREE.AdditiveBlending,

            sizeAttenuation: true
        });


    starField =
        new THREE.Points(
            geometry,
            material
        );

    starField.name =
        "Realistic Star Field";

    scene.add(
        starField
    );
}


// ============================================================
// AMBIENT SPACE PARTICLES
// ============================================================

function createAmbientParticles() {

    const count = 2500;

    const positions =
        new Float32Array(
            count * 3
        );

    for (let i = 0; i < count; i++) {

        const radius =
            250 +
            Math.random() * 2500;

        const theta =
            Math.random() *
            Math.PI * 2;

        const phi =
            Math.acos(
                THREE.MathUtils.randFloatSpread(2)
            );

        const index = i * 3;

        positions[index] =
            radius *
            Math.sin(phi) *
            Math.cos(theta);

        positions[index + 1] =
            radius *
            Math.cos(phi);

        positions[index + 2] =
            radius *
            Math.sin(phi) *
            Math.sin(theta);
    }


    const geometry =
        new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({

            color:
                COLORS.effects.cyan,

            size: 0.7,

            transparent: true,

            opacity: 0.22,

            depthWrite: false,

            blending:
                THREE.AdditiveBlending
        });


    ambientParticles =
        new THREE.Points(
            geometry,
            material
        );

    ambientParticles.name =
        "Ambient Space Dust";

    scene.add(
        ambientParticles
    );
}


// ============================================================
// INITIALIZE EFFECTS
// ============================================================

export function initializeEffects(
    targetScene
) {

    scene =
        targetScene;

    if (!scene) {
        return;
    }

    createStarField();

    createAmbientParticles();
}


// ============================================================
// UPDATE EFFECTS
// ============================================================

export function updateEffects() {

    if (!scene) {
        return;
    }

    const time =
        performance.now() *
        0.001;


    // Very slow star-field movement
    if (starField) {

        starField.rotation.y =
            time * 0.001;

        starField.rotation.x =
            Math.sin(time * 0.03) *
            0.002;
    }


    // Very subtle space dust movement
    if (ambientParticles) {

        ambientParticles.rotation.y =
            -time * 0.002;

        ambientParticles.rotation.x =
            Math.sin(time * 0.02) *
            0.003;
    }


    // Animate registered glow effects
    glowObjects.forEach(
        effect => {

            if (!effect.object) {
                return;
            }

            const pulse =
                1 +
                Math.sin(
                    time *
                    effect.speed
                ) *
                effect.amount;

            effect.object.scale.set(
                pulse,
                pulse,
                pulse
            );
        }
    );
}


// ============================================================
// GLOW
// ============================================================

export function createGlow(
    parent,
    color = COLORS.effects.glow,
    radius = 10,
    opacity = 0.18
) {

    const geometry =
        new THREE.SphereGeometry(
            radius,
            32,
            32
        );

    const material =
        new THREE.MeshBasicMaterial({

            color,

            transparent: true,

            opacity,

            depthWrite: false,

            side:
                THREE.BackSide,

            blending:
                THREE.AdditiveBlending
        });


    const glow =
        new THREE.Mesh(
            geometry,
            material
        );

    parent.add(
        glow
    );


    glowObjects.push({
        object: glow,
        speed: 1.2,
        amount: 0.035
    });


    return glow;
}


// ============================================================
// NEBULA GLOW
// ============================================================

export function createNebulaGlow(
    parent,
    color,
    size = 100
) {

    const geometry =
        new THREE.SphereGeometry(
            size,
            32,
            32
        );

    const material =
        new THREE.MeshBasicMaterial({

            color,

            transparent: true,

            opacity: 0.06,

            depthWrite: false,

            side:
                THREE.BackSide,

            blending:
                THREE.AdditiveBlending
        });


    const glow =
        new THREE.Mesh(
            geometry,
            material
        );

    parent.add(
        glow
    );


    glowObjects.push({
        object: glow,
        speed: 0.35,
        amount: 0.025
    });


    return glow;
}


// ============================================================
// ENERGY RING
// ============================================================

export function createEnergyRing(
    parent,
    color = COLORS.effects.cyan,
    radius = 10
) {

    const geometry =
        new THREE.RingGeometry(
            radius * 1.15,
            radius * 1.25,
            96
        );

    const material =
        new THREE.MeshBasicMaterial({

            color,

            transparent: true,

            opacity: 0.35,

            side:
                THREE.DoubleSide,

            depthWrite: false,

            blending:
                THREE.AdditiveBlending
        });


    const ring =
        new THREE.Mesh(
            geometry,
            material
        );

    ring.rotation.x =
        Math.PI / 2;

    parent.add(
        ring
    );


    glowObjects.push({
        object: ring,
        speed: 1.8,
        amount: 0.04
    });


    return ring;
}


// ============================================================
// VISIBILITY
// ============================================================

export function setEffectsVisible(
    visible
) {

    if (starField) {
        starField.visible =
            visible;
    }

    if (ambientParticles) {
        ambientParticles.visible =
            visible;
    }
}


export function areEffectsVisible() {

    return (
        starField?.visible !== false
    );
}


// ============================================================
// CLEAR
// ============================================================

export function clearEffects() {

    if (!scene) {
        return;
    }

    if (starField) {

        scene.remove(
            starField
        );

        starField.geometry.dispose();
        starField.material.dispose();

        starField = null;
    }


    if (ambientParticles) {

        scene.remove(
            ambientParticles
        );

        ambientParticles.geometry.dispose();
        ambientParticles.material.dispose();

        ambientParticles = null;
    }


    glowObjects.length = 0;
}
