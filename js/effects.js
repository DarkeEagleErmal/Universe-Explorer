import * as THREE from "three";
import { COLORS } from "./colors.js";

let starField = null;
let ambientParticles = null;
let glowGroup = null;

const animatedObjects = [];

// ============================================================
// CREATE STAR TEXTURE
// ============================================================

function createStarTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;

    const ctx = canvas.getContext("2d");

    const gradient = ctx.createRadialGradient(
        32, 32, 0,
        32, 32, 32
    );

    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.15, "rgba(255,255,255,1)");
    gradient.addColorStop(0.35, "rgba(180,220,255,0.9)");
    gradient.addColorStop(0.65, "rgba(120,180,255,0.35)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    return texture;
}

// ============================================================
// STAR FIELD
// ============================================================

function createStarField(scene) {
    const starCount = 12000;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;

        const radius = 250 + Math.random() * 4500;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(
            THREE.MathUtils.randFloatSpread(2)
        );

        positions[i3] =
            radius * Math.sin(phi) * Math.cos(theta);

        positions[i3 + 1] =
            radius * Math.cos(phi);

        positions[i3 + 2] =
            radius * Math.sin(phi) * Math.sin(theta);

        // Slight variation in star colors
        const type = Math.random();

        if (type < 0.72) {
            colors[i3] = 1;
            colors[i3 + 1] = 1;
            colors[i3 + 2] = 1;
        } else if (type < 0.88) {
            colors[i3] = 0.55;
            colors[i3 + 1] = 0.8;
            colors[i3 + 2] = 1;
        } else if (type < 0.96) {
            colors[i3] = 1;
            colors[i3 + 1] = 0.82;
            colors[i3 + 2] = 0.55;
        } else {
            colors[i3] = 1;
            colors[i3 + 1] = 0.55;
            colors[i3 + 2] = 0.4;
        }

        sizes[i] = 1.5 + Math.random() * 4;
    }

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3)
    );

    geometry.setAttribute(
        "size",
        new THREE.BufferAttribute(sizes, 1)
    );

    const material = new THREE.PointsMaterial({
        size: 3,
        map: createStarTexture(),
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    starField = new THREE.Points(
        geometry,
        material
    );

    starField.name = "RealisticStarField";

    scene.add(starField);
}

// ============================================================
// AMBIENT PARTICLES
// ============================================================

function createAmbientParticles(scene) {
    const count = 1800;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        positions[i3] =
            THREE.MathUtils.randFloatSpread(2500);

        positions[i3 + 1] =
            THREE.MathUtils.randFloatSpread(2500);

        positions[i3 + 2] =
            THREE.MathUtils.randFloatSpread(2500);
    }

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
        color: 0x8ac8ff,
        size: 1.2,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    ambientParticles = new THREE.Points(
        geometry,
        material
    );

    ambientParticles.name = "AmbientSpaceParticles";

    scene.add(ambientParticles);
}

// ============================================================
// GLOW GROUP
// ============================================================

function createGlowGroup(scene) {
    glowGroup = new THREE.Group();
    glowGroup.name = "SpaceGlowEffects";

    scene.add(glowGroup);
}

// ============================================================
// INITIALIZE
// ============================================================

export function initializeEffects(scene) {
    createStarField(scene);
    createAmbientParticles(scene);
    createGlowGroup(scene);
}

// ============================================================
// UPDATE
// ============================================================

export function updateEffects(time = 0) {
    if (starField) {
        starField.rotation.y += 0.00001;

        const material = starField.material;

        // Subtle global twinkle
        material.opacity =
            0.88 + Math.sin(time * 0.001) * 0.07;
    }

    if (ambientParticles) {
        ambientParticles.rotation.y += 0.000025;
        ambientParticles.rotation.x += 0.000008;
    }

    animatedObjects.forEach((item) => {
        if (item.update) {
            item.update(time);
        }
    });
}

// ============================================================
// CREATE GLOW
// ============================================================

export function createGlow(
    color = COLORS.effects.glow,
    size = 10,
    opacity = 0.35
) {
    const group = new THREE.Group();

    const texture = createStarTexture();

    const material = new THREE.SpriteMaterial({
        map: texture,
        color,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const sprite = new THREE.Sprite(material);

    sprite.scale.set(
        size,
        size,
        1
    );

    group.add(sprite);

    if (glowGroup) {
        glowGroup.add(group);
    }

    return group;
}

// ============================================================
// NEBULA GLOW
// ============================================================

export function createNebulaGlow(
    color,
    size = 100,
    opacity = 0.12
) {
    const geometry = new THREE.SphereGeometry(
        size,
        32,
        32
    );

    const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
    });

    const mesh = new THREE.Mesh(
        geometry,
        material
    );

    mesh.name = "NebulaGlow";

    if (glowGroup) {
        glowGroup.add(mesh);
    }

    return mesh;
}

// ============================================================
// ENERGY RING
// ============================================================

export function createEnergyRing(
    color = COLORS.effects.cyan,
    radius = 10
) {
    const geometry = new THREE.RingGeometry(
        radius * 0.92,
        radius,
        96
    );

    const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const ring = new THREE.Mesh(
        geometry,
        material
    );

    ring.name = "EnergyRing";

    if (glowGroup) {
        glowGroup.add(ring);
    }

    animatedObjects.push({
        object: ring,

        update(time) {
            ring.rotation.z =
                time * 0.00025;
        }
    });

    return ring;
}

// ============================================================
// VISIBILITY
// ============================================================

export function setEffectsVisible(visible) {
    if (starField) {
        starField.visible = visible;
    }

    if (ambientParticles) {
        ambientParticles.visible = visible;
    }

    if (glowGroup) {
        glowGroup.visible = visible;
    }
}

export function areEffectsVisible() {
    return (
        starField?.visible ??
        true
    );
}

// ============================================================
// CLEAR
// ============================================================

export function clearEffects() {
    if (starField) {
        starField.parent?.remove(starField);
        starField.geometry.dispose();
        starField.material.dispose();
        starField = null;
    }

    if (ambientParticles) {
        ambientParticles.parent?.remove(
            ambientParticles
        );

        ambientParticles.geometry.dispose();
        ambientParticles.material.dispose();

        ambientParticles = null;
    }

    if (glowGroup) {
        glowGroup.parent?.remove(glowGroup);
        glowGroup = null;
    }

    animatedObjects.length = 0;
}
