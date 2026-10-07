import * as THREE from "three";
import { COLORS } from "./colors.js";

let scene = null;

let starField = null;
let ambientParticles = null;

let effectGroups = {
    stars: null,
    particles: null,
    glow: null
};

export function initializeEffects(targetScene) {
    scene = targetScene;

    effectGroups.stars =
        new THREE.Group();

    effectGroups.particles =
        new THREE.Group();

    effectGroups.glow =
        new THREE.Group();

    scene.add(
        effectGroups.stars,
        effectGroups.particles,
        effectGroups.glow
    );

    createStarField();
    createAmbientParticles();

    return effectGroups;
}

function createStarField() {
    const count = 16000;

    const positions =
        new Float32Array(count * 3);

    const colors =
        new Float32Array(count * 3);

    const sizes =
        new Float32Array(count);

    const color =
        new THREE.Color(
            COLORS.space.star
        );

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        const radius =
            500 +
            Math.random() * 50000;

        const theta =
            Math.random() *
            Math.PI * 2;

        const phi =
            Math.acos(
                2 * Math.random() - 1
            );

        positions[i3] =
            radius *
            Math.sin(phi) *
            Math.cos(theta);

        positions[i3 + 1] =
            radius *
            Math.cos(phi);

        positions[i3 + 2] =
            radius *
            Math.sin(phi) *
            Math.sin(theta);

        const starColor =
            getStarColor();

        colors[i3] =
            starColor.r;

        colors[i3 + 1] =
            starColor.g;

        colors[i3 + 2] =
            starColor.b;

        sizes[i] =
            0.4 +
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
            color,
            size: 1.5,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.95,
            vertexColors: true,
            depthWrite: false
        });

    starField =
        new THREE.Points(
            geometry,
            material
        );

    effectGroups.stars.add(
        starField
    );
}

function getStarColor() {
    const random =
        Math.random();

    if (random < 0.08) {
        return new THREE.Color(
            COLORS.space.starBlue
        );
    }

    if (random < 0.14) {
        return new THREE.Color(
            COLORS.stars.yellow
        );
    }

    if (random < 0.18) {
        return new THREE.Color(
            COLORS.stars.red
        );
    }

    return new THREE.Color(
        COLORS.space.star
    );
}

function createAmbientParticles() {
    const count = 2500;

    const positions =
        new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        positions[i3] =
            (Math.random() - 0.5) *
            8000;

        positions[i3 + 1] =
            (Math.random() - 0.5) *
            8000;

        positions[i3 + 2] =
            (Math.random() - 0.5) *
            8000;
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
            color: COLORS.effects.cyan,
            size: 0.7,
            transparent: true,
            opacity: 0.22,
            depthWrite: false
        });

    ambientParticles =
        new THREE.Points(
            geometry,
            material
        );

    effectGroups.particles.add(
        ambientParticles
    );
}

export function createGlow(
    position,
    color = COLORS.effects.glow,
    size = 10,
    opacity = 0.35
) {
    if (!scene) return null;

    const group =
        new THREE.Group();

    const layers = [
        {
            scale: 1,
            opacity
        },
        {
            scale: 1.6,
            opacity: opacity * 0.45
        },
        {
            scale: 2.5,
            opacity: opacity * 0.18
        }
    ];

    layers.forEach(layer => {
        const geometry =
            new THREE.SphereGeometry(
                size * layer.scale,
                32,
                32
            );

        const material =
            new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity:
                    layer.opacity,
                blending:
                    THREE.AdditiveBlending,
                depthWrite: false
            });

        const mesh =
            new THREE.Mesh(
                geometry,
                material
            );

        group.add(mesh);
    });

    group.position.copy(
        position
    );

    effectGroups.glow.add(
        group
    );

    return group;
}

export function createNebulaGlow(
    position,
    color,
    size = 100
) {
    if (!scene) return null;

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
            opacity: 0.08,
            blending:
                THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });

    const nebula =
        new THREE.Mesh(
            geometry,
            material
        );

    nebula.position.copy(
        position
    );

    effectGroups.glow.add(
        nebula
    );

    return nebula;
}

export function createEnergyRing(
    position,
    color = COLORS.effects.cyan,
    radius = 10
) {
    if (!scene) return null;

    const geometry =
        new THREE.RingGeometry(
            radius * 0.8,
            radius,
            64
        );

    const material =
        new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.55,
            side: THREE.DoubleSide,
            blending:
                THREE.AdditiveBlending,
            depthWrite: false
        });

    const ring =
        new THREE.Mesh(
            geometry,
            material
        );

    ring.position.copy(
        position
    );

    ring.rotation.x =
        Math.PI / 2;

    effectGroups.glow.add(
        ring
    );

    return ring;
}

export function updateEffects(
    elapsedTime,
    deltaTime
) {
    if (starField) {
        starField.rotation.y +=
            deltaTime * 0.002;
    }

    if (ambientParticles) {
        ambientParticles.rotation.y +=
            deltaTime * 0.006;

        ambientParticles.rotation.x +=
            deltaTime * 0.001;
    }

    if (
        effectGroups.glow
    ) {
        effectGroups.glow.children.forEach(
            object => {
                object.rotation.y +=
                    deltaTime * 0.08;

                object.rotation.z +=
                    deltaTime * 0.03;
            }
        );
    }
}

export function setStarsVisible(
    visible
) {
    if (effectGroups.stars) {
        effectGroups.stars.visible =
            visible;
    }
}

export function setParticlesVisible(
    visible
) {
    if (effectGroups.particles) {
        effectGroups.particles.visible =
            visible;
    }
}

export function setGlowVisible(
    visible
) {
    if (effectGroups.glow) {
        effectGroups.glow.visible =
            visible;
    }
}

export function getEffects() {
    return effectGroups;
}

export function clearEffects() {
    Object.values(
        effectGroups
    ).forEach(group => {
        if (!group) return;

        while (
            group.children.length
        ) {
            const child =
                group.children.pop();

            child.traverse(
                object => {
                    if (object.geometry) {
                        object.geometry.dispose();
                    }

                    if (object.material) {
                        if (
                            Array.isArray(
                                object.material
                            )
                        ) {
                            object.material.forEach(
                                material =>
                                    material.dispose()
                            );
                        } else {
                            object.material.dispose();
                        }
                    }
                }
            );
        }
    });
}
