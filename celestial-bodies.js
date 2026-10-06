// ============================================================
// CELESTIAL INTEGRATION
// Collega i nuovi corpi celesti a Universe Explorer
// ============================================================

import * as THREE from "three";

import {
    createPlanet,
    createMoon,
    createPlanetOrbit,
    createMoonOrbit,
    addEarthAtmosphere,
    addEarthClouds,
    addSaturnRings
} from "./celestial-bodies.js";


// ============================================================
// CONFIGURAZIONE
// ============================================================

const PLANETS = [
    "Mercury",
    "Venus",
    "Earth",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
    "Pluto"
];

const MOONS = [
    "Moon",

    "Phobos",
    "Deimos",

    "Io",
    "Europa",
    "Ganymede",
    "Callisto",

    "Titan",
    "Rhea",
    "Iapetus",
    "Enceladus",

    "Titania",
    "Oberon",
    "Ariel",
    "Umbriel",
    "Miranda",

    "Triton"
];


// ============================================================
// CREAZIONE DI TUTTI I PIANETI
// ============================================================

export function createRealisticSolarSystem(scene) {

    const solarSystem = new THREE.Group();

    solarSystem.name = "REALISTIC SOLAR SYSTEM";

    scene.add(solarSystem);


    // --------------------------------------------------------
    // SOLE
    // --------------------------------------------------------

    const sun = createPlanet("Sun", {
        radius: 5.5
    });

    sun.name = "Sun";

    solarSystem.add(sun);


    // Luce reale del Sole
    const sunLight = new THREE.PointLight(
        0xfff1c1,
        4.5,
        1000
    );

    sunLight.position.set(0, 0, 0);

    solarSystem.add(sunLight);


    // Glow del Sole
    addSunGlow(sun);


    // --------------------------------------------------------
    // PIANETI
    // --------------------------------------------------------

    const planetObjects = {};

    PLANETS.forEach((name) => {

        const planet = createPlanet(name);

        planetObjects[name] = planet;

        solarSystem.add(planet);


        // Orbita
        const orbit = createPlanetOrbit(name);

        if (orbit) {
            solarSystem.add(orbit);

            orbit.userData.bodyName = name;
        }


        // Posizione iniziale
        positionPlanet(name, planet);


        // Caratteristiche speciali
        if (name === "Earth") {

            addEarthAtmosphere(
                planet,
                planet.geometry.parameters.radius
            );

            addEarthClouds(
                planet,
                planet.geometry.parameters.radius
            );
        }


        if (name === "Saturn") {

            addSaturnRings(
                planet,
                planet.geometry.parameters.radius
            );
        }
    });


    // --------------------------------------------------------
    // LUNE
    // --------------------------------------------------------

    const moonObjects = {};

    MOONS.forEach((name) => {

        const moon = createMoon(name);

        moonObjects[name] = moon;

        const parentName =
            moon.userData.parentName;

        const parent =
            planetObjects[parentName];

        if (!parent) {
            return;
        }


        // Gruppo che permette alla luna
        // di orbitare attorno al pianeta
        const moonSystem =
            new THREE.Group();

        moonSystem.name =
            `${name} ORBIT`;

        parent.add(moonSystem);


        moonSystem.add(moon);


        const distance =
            getMoonDistance(name);

        moon.position.set(
            distance,
            0,
            0
        );


        // Orbita della luna
        const moonOrbit =
            createMoonOrbit(name);

        if (moonOrbit) {

            moonOrbit.position.set(
                0,
                0,
                0
            );

            parent.add(moonOrbit);

            moonOrbit.userData.bodyName =
                name;
        }


        moon.userData.orbitGroup =
            moonSystem;
    });


    return {
        solarSystem,
        sun,
        planets: planetObjects,
        moons: moonObjects
    };
}


// ============================================================
// POSIZIONE DEI PIANETI
// ============================================================

function positionPlanet(name, planet) {

    const positions = {

        Mercury: 10,
        Venus: 15,
        Earth: 21,
        Mars: 28,
        Jupiter: 43,
        Saturn: 58,
        Uranus: 75,
        Neptune: 92,
        Pluto: 115
    };


    if (positions[name] === undefined) {
        return;
    }


    planet.position.set(
        positions[name],
        0,
        0
    );
}


// ============================================================
// DISTANZA DELLE LUNE
// ============================================================

function getMoonDistance(name) {

    const distances = {

        Moon: 2.5,

        Phobos: 1.15,
        Deimos: 1.65,

        Io: 3.0,
        Europa: 3.55,
        Ganymede: 4.2,
        Callisto: 5.0,

        Titan: 3.8,
        Rhea: 3.0,
        Iapetus: 5.0,
        Enceladus: 2.6,

        Titania: 2.3,
        Oberon: 2.8,
        Ariel: 1.9,
        Umbriel: 2.1,
        Miranda: 1.5,

        Triton: 2.5
    };


    return distances[name] || 2;
}


// ============================================================
// GLOW DEL SOLE
// ============================================================

function addSunGlow(sun) {

    const glowLayers = [
        {
            scale: 1.12,
            opacity: 0.28,
            color: 0xffd45c
        },
        {
            scale: 1.30,
            opacity: 0.14,
            color: 0xff9d21
        },
        {
            scale: 1.55,
            opacity: 0.07,
            color: 0xff6a00
        }
    ];


    glowLayers.forEach((layer, index) => {

        const geometry =
            new THREE.SphereGeometry(
                5.5 * layer.scale,
                64,
                48
            );


        const material =
            new THREE.MeshBasicMaterial({

                color: layer.color,

                transparent: true,

                opacity: layer.opacity,

                side: THREE.BackSide,

                blending:
                    THREE.AdditiveBlending,

                depthWrite: false
            });


        const glow =
            new THREE.Mesh(
                geometry,
                material
            );


        glow.name =
            `Sun Glow ${index + 1}`;


        sun.add(glow);
    });
}


// ============================================================
// ANIMAZIONE
// ============================================================

export function updateCelestialBodies(
    solarSystem,
    delta
) {

    if (!solarSystem) {
        return;
    }


    // --------------------------------------------------------
    // ROTAZIONE DEI PIANETI
    // --------------------------------------------------------

    const planetSpeeds = {

        Mercury: 0.0010,
        Venus: 0.0007,
        Earth: 0.0025,
        Mars: 0.0022,
        Jupiter: 0.0045,
        Saturn: 0.0040,
        Uranus: 0.0030,
        Neptune: 0.0028,
        Pluto: 0.0012
    };


    PLANETS.forEach((name) => {

        const planet =
            solarSystem.getObjectByName(name);

        if (!planet) {
            return;
        }


        const speed =
            planetSpeeds[name] || 0.001;


        planet.rotation.y +=
            speed * delta;
    });


    // --------------------------------------------------------
    // ROTAZIONE DELLE LUNE
    // --------------------------------------------------------

    MOONS.forEach((name) => {

        const moon =
            solarSystem.getObjectByName(name);

        if (!moon) {
            return;
        }


        moon.rotation.y +=
            0.002 * delta;


        const orbitGroup =
            moon.userData.orbitGroup;


        if (orbitGroup) {

            const speed =
                getMoonSpeed(name);


            orbitGroup.rotation.y +=
                speed * delta;


            orbitGroup.rotation.x +=
                0.0001 * delta;
        }
    });


    // --------------------------------------------------------
    // SOLE
    // --------------------------------------------------------

    const sun =
        solarSystem.getObjectByName("Sun");


    if (sun) {

        sun.rotation.y +=
            0.0008 * delta;
    }
}


// ============================================================
// VELOCITÀ DELLE LUNE
// ============================================================

function getMoonSpeed(name) {

    const speeds = {

        Moon: 0.004,

        Phobos: 0.012,
        Deimos: 0.006,

        Io: 0.009,
        Europa: 0.006,
        Ganymede: 0.004,
        Callisto: 0.0025,

        Titan: 0.004,
        Rhea: 0.006,
        Iapetus: 0.002,
        Enceladus: 0.008,

        Titania: 0.004,
        Oberon: 0.003,
        Ariel: 0.006,
        Umbriel: 0.005,
        Miranda: 0.008,

        Triton: -0.004
    };


    return speeds[name] || 0.004;
}


// ============================================================
// SIRIUS
// ============================================================

export function createSirius() {

    const group =
        new THREE.Group();

    group.name = "Sirius";


    // Stella principale
    const starGeometry =
        new THREE.SphereGeometry(
            3,
            64,
            64
        );


    const starMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xddeeff
        });


    const star =
        new THREE.Mesh(
            starGeometry,
            starMaterial
        );


    group.add(star);


    // Luce della stella
    const light =
        new THREE.PointLight(
            0xddeeff,
            12,
            500
        );


    group.add(light);


    // Glow
    const glowGeometry =
        new THREE.SphereGeometry(
            5,
            48,
            48
        );


    const glowMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x9fcaff,

            transparent: true,

            opacity: 0.20,

            side: THREE.BackSide,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false
        });


    const glow =
        new THREE.Mesh(
            glowGeometry,
            glowMaterial
        );


    group.add(glow);


    return group;
}


// ============================================================
// ESPORTAZIONE
// ============================================================

export default {
    createRealisticSolarSystem,
    updateCelestialBodies,
    createSirius
};
