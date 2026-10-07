// =========================================================
// UNIVERSE EXPLORER
// universe.js
// Deep Space objects and regions
// =========================================================

import * as THREE from "three";
import { COLORS } from "./colors.js";


// =========================================================
// DEEP SPACE OBJECT DATABASE
// =========================================================

export const deepSpaceObjects = {

    Andromeda: {
        name: "Andromeda Galaxy",
        type: "Galaxy",

        position: new THREE.Vector3(120, 35, -80),

        radius: 18,

        color: COLORS.galaxies.andromeda,

        distance: "2.54 million light-years",

        size: "≈220,000 light-years",

        facts:
            "The Andromeda Galaxy is the nearest major galaxy to the Milky Way " +
            "and contains hundreds of billions of stars.",

        source: "NASA / ESA"
    },


    Triangulum: {
        name: "Triangulum Galaxy",
        type: "Galaxy",

        position: new THREE.Vector3(-110, 25, -100),

        radius: 12,

        color: COLORS.galaxies.triangulum,

        distance: "2.73 million light-years",

        size: "≈60,000 light-years",

        facts:
            "The Triangulum Galaxy is a spiral galaxy and one of the major " +
            "members of the Local Group.",

        source: "NASA / ESA"
    },


    BlackHole: {
        name: "Black Hole",
        type: "Black Hole",

        position: new THREE.Vector3(90, -20, -70),

        radius: 5,

        color: COLORS.blackHoles.core,

        distance: "Deep Space",

        size: "Variable",

        facts:
            "A black hole is a region of spacetime where gravity is so strong " +
            "that nothing, including light, can escape once it crosses the event horizon.",

        source: "NASA / ESA"
    },


    DeepSpaceBlackHole: {
        name: "Deep Space Black Hole",
        type: "Black Hole",

        position: new THREE.Vector3(-150, -40, -120),

        radius: 7,

        color: COLORS.blackHoles.core,

        distance: "Deep Space",

        size: "Variable",

        facts:
            "Supermassive black holes can exist at the centers of galaxies " +
            "and can contain millions or billions of times the mass of the Sun.",

        source: "NASA / ESA"
    }

};


// =========================================================
// NEBULA DATABASE
// =========================================================

export const nebulaObjects = {

    PurpleNebula: {
        name: "Purple Nebula",
        type: "Nebula",

        position: new THREE.Vector3(-65, 35, -40),

        radius: 25,

        color: COLORS.nebulae.purple
    },


    BlueNebula: {
        name: "Blue Nebula",
        type: "Nebula",

        position: new THREE.Vector3(75, 45, -30),

        radius: 22,

        color: COLORS.nebulae.blue
    },


    MagentaNebula: {
        name: "Magenta Nebula",
        type: "Nebula",

        position: new THREE.Vector3(-95, -15, -60),

        radius: 20,

        color: COLORS.nebulae.magenta
    },


    DeepBlueNebula: {
        name: "Deep Blue Nebula",
        type: "Nebula",

        position: new THREE.Vector3(35, -50, -90),

        radius: 28,

        color: COLORS.nebulae.darkBlue
    }

};


// =========================================================
// GALAXY DATABASE
// =========================================================

export const galaxyObjects = {

    Andromeda: deepSpaceObjects.Andromeda,

    Triangulum: deepSpaceObjects.Triangulum,

    DistantGalaxy: {
        name: "Distant Galaxy",
        type: "Galaxy",

        position: new THREE.Vector3(-180, 70, -180),

        radius: 10,

        color: COLORS.galaxies.distant,

        distance: "Billions of light-years",

        size: "Variable",

        facts:
            "Distant galaxies allow astronomers to observe the Universe " +
            "as it appeared billions of years ago.",

        source: "NASA / ESA"
    }

};


// =========================================================
// ASTEROID BELT
// =========================================================

export const asteroidBelt = {

    name: "Asteroid Belt",

    type: "Asteroid Belt",

    innerRadius: 20,

    outerRadius: 23,

    color: COLORS.asteroids.main,

    count: 900
};


// =========================================================
// KUIPER BELT
// =========================================================

export const kuiperBelt = {

    name: "Kuiper Belt",

    type: "Kuiper Belt",

    innerRadius: 52,

    outerRadius: 62,

    color: COLORS.kuiperBelt.main,

    count: 700
};


// =========================================================
// OORT CLOUD
// =========================================================

export const oortCloud = {

    name: "Oort Cloud",

    type: "Oort Cloud",

    radius: 100,

    color: COLORS.oortCloud.main,

    count: 1200
};


// =========================================================
// COMETS
// =========================================================

export const cometObjects = [

    {
        name: "Comet Explorer-1",
        type: "Comet",

        position: new THREE.Vector3(42, 12, -20),

        radius: 0.18,

        color: COLORS.comets.nucleus
    },

    {
        name: "Comet Explorer-2",
        type: "Comet",

        position: new THREE.Vector3(-35, -8, -30),

        radius: 0.22,

        color: COLORS.comets.nucleus
    },

    {
        name: "Comet Explorer-3",
        type: "Comet",

        position: new THREE.Vector3(65, -15, -45),

        radius: 0.15,

        color: COLORS.comets.nucleus
    }
];


// =========================================================
// UNIVERSE REGIONS
// =========================================================

export const universeRegions = {

    solarSystem: {
        name: "SOLAR SYSTEM",

        position: new THREE.Vector3(0, 0, 0),

        scale: "Planetary"
    },

    kuiperBelt: {
        name: "KUIPER BELT",

        position: new THREE.Vector3(57, 0, 0),

        scale: "Outer Solar System"
    },

    oortCloud: {
        name: "OORT CLOUD",

        position: new THREE.Vector3(100, 0, 0),

        scale: "Solar System Boundary"
    },

    milkyWay: {
        name: "MILKY WAY",

        position: new THREE.Vector3(0, 0, 0),

        scale: "Galactic"
    },

    deepSpace: {
        name: "DEEP SPACE",

        position: new THREE.Vector3(100, 40, -100),

        scale: "Intergalactic"
    }
};


// =========================================================
// COMBINED DEEP SPACE DATABASE
// =========================================================

export const allDeepSpaceObjects = {

    ...deepSpaceObjects,

    ...nebulaObjects,

    ...galaxyObjects

};


// =========================================================
// FIND OBJECT
// =========================================================

export function getDeepSpaceObject(name) {

    return allDeepSpaceObjects[name] || null;
}


// =========================================================
// GET ALL DEEP SPACE OBJECTS
// =========================================================

export function getDeepSpaceObjectList() {

    return Object.values(allDeepSpaceObjects);
}


// =========================================================
// GET GALAXIES
// =========================================================

export function getGalaxies() {

    return Object.values(galaxyObjects);
}


// =========================================================
// GET NEBULAE
// =========================================================

export function getNebulae() {

    return Object.values(nebulaObjects);
}


// =========================================================
// GET COMETS
// =========================================================

export function getComets() {

    return cometObjects;
}
