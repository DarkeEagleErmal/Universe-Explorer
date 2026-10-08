import * as THREE from "three";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

let scene = null;
let camera = null;
let renderer = null;
let composer = null;

let starField = null;
let dustField = null;
let meteorField = null;

let sunCorona = null;
let sunLight = null;
let bloomPass = null;

let starData = [];
let meteorData = [];

let effectsGroup = null;

const clock = new THREE.Clock();

const EFFECT_SETTINGS = {
    stars: 18000,
    dust: 2600,
    meteors: 3,

    starTwinkle: 0.035,
    dustMovement: 0.001,
    nebulaMovement: 0.00015,

    bloomStrength: 0.75,
    bloomRadius: 0.55,
    bloomThreshold: 0.72,

    sunLightIntensity: 4.0,

    adaptiveQuality: true
};


/* =========================================================
   TEXTURES
========================================================= */

function createSoftCircleTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;

    const ctx = canvas.getContext("2d");

    const gradient = ctx.createRadialGradient(
        64,
        64,
        0,
        64,
        64,
        64
    );

    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.12, "rgba(255,255,255,1)");
    gradient.addColorStop(0.35, "rgba(255,255,255,0.65)");
    gradient.addColorStop(0.7, "rgba(255,255,255,0.12)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    return new THREE.CanvasTexture(canvas);
}

function createGlowTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;

    const ctx = canvas.getContext("2d");

    const gradient = ctx.createRadialGradient(
        128,
        128,
        0,
        128,
        128,
        128
    );

    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.15, "rgba(255,240,180,0.9)");
    gradient.addColorStop(0.35, "rgba(255,190,80,0.45)");
    gradient.addColorStop(0.65, "rgba(255,120,30,0.12)");
    gradient.addColorStop(1, "rgba(255,80,0,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    return new THREE.CanvasTexture(canvas);
}


/* =========================================================
   STAR FIELD
========================================================= */

function createStarField() {
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(EFFECT_SETTINGS.stars * 3);
    const colors = new Float32Array(EFFECT_SETTINGS.stars * 3);
    const sizes = new Float32Array(EFFECT_SETTINGS.stars);

    const color = new THREE.Color();

    for (let i = 0; i < EFFECT_SETTINGS.stars; i++) {

        const radius =
            500 +
            Math.pow(Math.random(), 0.55) * 8000;

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(
            THREE.MathUtils.randFloatSpread(2)
        );

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        /*
         * Stellar colors based loosely on temperature.
         */

        const temperature = Math.random();

        if (temperature < 0.15) {
            // blue
            color.setRGB(
                0.55,
                0.72,
                1.0
            );
        } else if (temperature < 0.38) {
            // white-blue
            color.setRGB(
                0.78,
                0.88,
                1.0
            );
        } else if (temperature < 0.70) {
            // white
            color.setRGB(
                1.0,
                0.98,
                0.92
            );
        } else if (temperature < 0.90) {
            // yellow
            color.setRGB(
                1.0,
                0.86,
                0.55
            );
        } else {
            // orange/red
            color.setRGB(
                1.0,
                0.55,
                0.30
            );
        }

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        /*
         * Most stars are tiny.
         * A small percentage are larger.
         */

        const brightStar = Math.random() < 0.025;

        sizes[i] = brightStar
            ? THREE.MathUtils.randFloat(2.0, 4.5)
            : THREE.MathUtils.randFloat(0.35, 1.8);

        starData.push({
            phase: Math.random() * Math.PI * 2,
            speed: THREE.MathUtils.randFloat(
                0.15,
                0.8
            ),
            baseSize: sizes[i]
        });
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
        size: 1.5,
        map: createSoftCircleTexture(),
        transparent: true,
        opacity: 0.88,
        vertexColors: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    starField = new THREE.Points(
        geometry,
        material
    );

    starField.name = "RealisticStarField";

    effectsGroup.add(starField);
}


/* =========================================================
   SPACE DUST
========================================================= */

function createSpaceDust() {
    const geometry = new THREE.BufferGeometry();

    const count = EFFECT_SETTINGS.dust;

    const positions = new Float32Array(
        count * 3
    );

    const colors = new Float32Array(
        count * 3
    );

    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {

        const radius = THREE.MathUtils.randFloat(
            80,
            2500
        );

        const theta =
            Math.random() *
            Math.PI *
            2;

        const phi =
            Math.acos(
                THREE.MathUtils.randFloatSpread(2)
            );

        positions[i * 3] =
            radius *
            Math.sin(phi) *
            Math.cos(theta);

        positions[i * 3 + 1] =
            radius *
            Math.cos(phi);

        positions[i * 3 + 2] =
            radius *
            Math.sin(phi) *
            Math.sin(theta);

        const brightness =
            THREE.MathUtils.randFloat(
                0.08,
                0.30
            );

        color.setRGB(
            brightness,
            brightness * 0.9,
            brightness * 1.1
        );

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

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

    dustField = new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
            size: 0.7,
            map: createSoftCircleTexture(),
            transparent: true,
            opacity: 0.20,
            vertexColors: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        })
    );

    dustField.name = "InterstellarDust";

    effectsGroup.add(dustField);
}


/* =========================================================
   SUN LIGHT
========================================================= */

function createSunLighting() {

    sunLight = new THREE.PointLight(
        0xffd27a,
        EFFECT_SETTINGS.sunLightIntensity,
        0,
        1.8
    );

    sunLight.position.set(
        0,
        0,
        0
    );

    sunLight.castShadow = true;

    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;

    sunLight.shadow.camera.near = 0.1;
    sunLight.shadow.camera.far = 10000;

    scene.add(sunLight);

    const ambient = new THREE.AmbientLight(
        0x536b91,
        0.055
    );

    scene.add(ambient);
}


/* =========================================================
   SOLAR CORONA
========================================================= */

function createSolarCorona() {

    const texture = createGlowTexture();

    const material = new THREE.SpriteMaterial({
        map: texture,
        color: 0xffb347,
        transparent: true,
        opacity: 0.30,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    sunCorona = new THREE.Sprite(material);

    sunCorona.name = "SolarCorona";

    sunCorona.position.set(
        0,
        0,
        0
    );

    sunCorona.scale.set(
        16,
        16,
        1
    );

    effectsGroup.add(sunCorona);
}


/* =========================================================
   SMALL SOLAR PLASMA
========================================================= */

function createSolarPlasma() {

    const count = 700;

    const geometry =
        new THREE.BufferGeometry();

    const positions =
        new Float32Array(count * 3);

    const colors =
        new Float32Array(count * 3);

    const color =
        new THREE.Color(
            0xffc45c
        );

    for (let i = 0; i < count; i++) {

        const radius =
            THREE.MathUtils.randFloat(
                3.8,
                7.5
            );

        const theta =
            Math.random() *
            Math.PI *
            2;

        const phi =
            Math.acos(
                THREE.MathUtils.randFloatSpread(2)
            );

        positions[i * 3] =
            radius *
            Math.sin(phi) *
            Math.cos(theta);

        positions[i * 3 + 1] =
            radius *
            Math.cos(phi);

        positions[i * 3 + 2] =
            radius *
            Math.sin(phi) *
            Math.sin(theta);

        colors[i * 3] =
            color.r;

        colors[i * 3 + 1] =
            color.g;

        colors[i * 3 + 2] =
            color.b;
    }

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

    const plasma =
        new THREE.Points(
            geometry,
            new THREE.PointsMaterial({
                size: 0.7,
                map: createSoftCircleTexture(),
                transparent: true,
                opacity: 0.22,
                vertexColors: true,
                depthWrite: false,
                blending:
                    THREE.AdditiveBlending
            })
        );

    plasma.name =
        "SolarPlasma";

    effectsGroup.add(plasma);
}


/* =========================================================
   METEORS
========================================================= */

function createMeteorField() {

    const group =
        new THREE.Group();

    group.name =
        "OccasionalMeteors";

    for (
        let i = 0;
        i < EFFECT_SETTINGS.meteors;
        i++
    ) {

        const geometry =
            new THREE.BufferGeometry();

        const points =
            new Float32Array([
                0, 0, 0,
                -4, 0, 0
            ]);

        geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(
                points,
                3
            )
        );

        const meteor =
            new THREE.Line(
                geometry,
                new THREE.LineBasicMaterial({
                    color: 0xdff6ff,
                    transparent: true,
                    opacity: 0
                })
            );

        meteor.position.set(
            THREE.MathUtils.randFloatSpread(
                1500
            ),
            THREE.MathUtils.randFloatSpread(
                900
            ),
            THREE.MathUtils.randFloatSpread(
                1500
            )
        );

        meteorData.push({
            object: meteor,
            velocity:
                new THREE.Vector3(
                    THREE.MathUtils.randFloat(
                        -3,
                        3
                    ),
                    THREE.MathUtils.randFloat(
                        -2,
                        2
                    ),
                    THREE.MathUtils.randFloat(
                        -3,
                        3
                    )
                ),
            timer:
                Math.random() * 20,
            duration:
                THREE.MathUtils.randFloat(
                    0.15,
                    0.45
                ),
            cooldown:
                THREE.MathUtils.randFloat(
                    7,
                    20
                )
        });

        group.add(meteor);
    }

    meteorField = group;

    effectsGroup.add(
        meteorField
    );
}


/* =========================================================
   BLOOM
========================================================= */

function createBloom() {

    const renderPass =
        new RenderPass(
            scene,
            camera
        );

    bloomPass =
        new UnrealBloomPass(
            new THREE.Vector2(
                window.innerWidth,
                window.innerHeight
            ),
            EFFECT_SETTINGS.bloomStrength,
            EFFECT_SETTINGS.bloomRadius,
            EFFECT_SETTINGS.bloomThreshold
        );

    composer =
        new EffectComposer(
            renderer
        );

    composer.addPass(
        renderPass
    );

    composer.addPass(
        bloomPass
    );

    composer.addPass(
        new OutputPass()
    );
}


/* =========================================================
   STAR TWINKLE
========================================================= */

function updateStars(time) {

    if (!starField) return;

    const sizes =
        starField.geometry
            .attributes
            .size
            .array;

    for (
        let i = 0;
        i < starData.length;
        i++
    ) {

        const star =
            starData[i];

        const variation =
            Math.sin(
                time *
                star.speed +
                star.phase
            ) *
            EFFECT_SETTINGS.starTwinkle;

        sizes[i] =
            Math.max(
                0.2,
                star.baseSize *
                (1 + variation)
            );
    }

    starField.geometry
        .attributes
        .size
        .needsUpdate = true;
}


/* =========================================================
   SOLAR EFFECT UPDATE
========================================================= */

function updateSolarEffects(time) {

    if (sunCorona) {

        const pulse =
            1 +
            Math.sin(
                time * 0.35
            ) *
            0.025;

        sunCorona.scale.set(
            16 * pulse,
            16 * pulse,
            1
        );

        sunCorona.material.opacity =
            0.27 +
            Math.sin(
                time * 0.45
            ) *
            0.025;
    }
}


/* =========================================================
   METEOR UPDATE
========================================================= */

function updateMeteors(delta) {

    if (!meteorField) return;

    for (
        const meteorDataItem
        of meteorData
    ) {

        meteorDataItem.timer +=
            delta;

        const meteor =
            meteorDataItem.object;

        if (
            meteorDataItem.timer >
            meteorDataItem.cooldown
        ) {

            meteorDataItem.timer = 0;

            meteorDataItem.cooldown =
                THREE.MathUtils.randFloat(
                    7,
                    20
                );

            meteor.position.set(
                THREE.MathUtils.randFloatSpread(
                    1500
                ),
                THREE.MathUtils.randFloatSpread(
                    900
                ),
                THREE.MathUtils.randFloatSpread(
                    1500
                )
            );

            meteor.material.opacity =
                0.9;
        }

        if (
            meteor.material.opacity >
            0
        ) {

            meteor.position.addScaledVector(
                meteorDataItem.velocity,
                delta * 80
            );

            meteor.material.opacity -=
                delta * 2.5;
        }
    }
}


/* =========================================================
   INITIALIZATION
========================================================= */

export function initializeEffects(
    targetScene,
    targetCamera,
    targetRenderer
) {

    scene =
        targetScene;

    camera =
        targetCamera;

    renderer =
        targetRenderer;

    effectsGroup =
        new THREE.Group();

    effectsGroup.name =
        "UniverseEffects";

    scene.add(
        effectsGroup
    );

    createStarField();
    createSpaceDust();
    createSunLighting();
    createSolarCorona();
    createSolarPlasma();
    createMeteorField();
    createBloom();

    return {
        composer,
        effectsGroup
    };
}


/* =========================================================
   ANIMATION
========================================================= */

export function updateEffects() {

    if (!scene) return;

    const delta =
        Math.min(
            clock.getDelta(),
            0.05
        );

    const elapsed =
        clock.elapsedTime;

    updateStars(
        elapsed
    );

    updateSolarEffects(
        elapsed
    );

    updateMeteors(
        delta
    );

    if (dustField) {

        dustField.rotation.y +=
            delta *
            EFFECT_SETTINGS.dustMovement;
    }

    if (starField) {

        starField.rotation.y +=
            delta *
            0.000015;
    }
}


/* =========================================================
   RENDER
========================================================= */

export function renderEffects() {

    if (composer) {
        composer.render();
    } else if (
        renderer &&
        scene &&
        camera
    ) {
        renderer.render(
            scene,
            camera
        );
    }
}


/* =========================================================
   RESIZE
========================================================= */

export function resizeEffects(
    width,
    height
) {

    if (!camera) return;

    if (composer) {
        composer.setSize(
            width,
            height
        );
    }

    if (bloomPass) {
        bloomPass.resolution.set(
            width,
            height
        );
    }
}


/* =========================================================
   QUALITY
========================================================= */

export function setEffectsQuality(
    quality = "high"
) {

    if (!starField || !dustField) {
        return;
    }

    if (quality === "low") {

        starField.material.size =
            1.2;

        starField.material.opacity =
            0.75;

        dustField.material.opacity =
            0.10;

        if (bloomPass) {
            bloomPass.strength =
                0.45;
        }

    } else if (
        quality === "medium"
    ) {

        starField.material.size =
            1.4;

        starField.material.opacity =
            0.82;

        dustField.material.opacity =
            0.15;

        if (bloomPass) {
            bloomPass.strength =
                0.60;
        }

    } else {

        starField.material.size =
            1.5;

        starField.material.opacity =
            0.88;

        dustField.material.opacity =
            0.20;

        if (bloomPass) {
            bloomPass.strength =
                EFFECT_SETTINGS.bloomStrength;
        }
    }
}


/* =========================================================
   CLEANUP
========================================================= */

export function disposeEffects() {

    if (!effectsGroup) return;

    effectsGroup.traverse(
        object => {

            if (object.geometry) {
                object.geometry.dispose();
            }

            if (object.material) {

                if (
                    object.material.map
                ) {
                    object.material.map.dispose();
                }

                object.material.dispose();
            }
        }
    );

    scene.remove(
        effectsGroup
    );

    effectsGroup = null;
    starField = null;
    dustField = null;
    meteorField = null;
    sunCorona = null;
    sunLight = null;
    composer = null;
}
