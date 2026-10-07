// =========================================================
// UNIVERSE EXPLORER
// celestialBodies.js
// Solar System celestial bodies database
// =========================================================

import * as THREE from "three";
import { COLORS } from "./colors.js";


// =========================================================
// CELESTIAL OBJECT DATABASE
// =========================================================

export const celestialObjects = {

    Sun: {
        name: "Sun",
        type: "Star",

        position: new THREE.Vector3(0, 0, 0),

        radius: 3.5,

        color: COLORS.sun.base,

        size: "1,392,700 km",
        mass: "1.989 × 10³⁰ kg",
        temperature: "5,500 °C",
        gravity: "274 m/s²",

        composition: "Hydrogen and helium",

        atmosphere: "Hydrogen and helium plasma",

        rotation: "25–35 days",

        orbit: "Galactic orbit",

        facts:
            "The Sun is the star at the center of our Solar System. " +
            "Its energy powers almost every major process on Earth.",

        source: "NASA / ESA"
    },


    Mercury: {
        name: "Mercury",
        type: "Planet",

        position: new THREE.Vector3(7, 0, 0),

        radius: 0.45,

        color: COLORS.planets.mercury.base,

        size: "4,879 km",
        mass: "3.30 × 10²³ kg",
        temperature: "167 °C",
        gravity: "3.70 m/s²",

        composition: "Rock and iron",

        atmosphere: "Very thin exosphere",

        rotation: "58.6 days",

        orbit: "88 days",

        facts:
            "Mercury is the smallest planet in the Solar System " +
            "and the closest planet to the Sun.",

        source: "NASA / ESA"
    },


    Venus: {
        name: "Venus",
        type: "Planet",

        position: new THREE.Vector3(10, 0, 0),

        radius: 0.65,

        color: COLORS.planets.venus.base,

        size: "12,104 km",
        mass: "4.87 × 10²⁴ kg",
        temperature: "464 °C",
        gravity: "8.87 m/s²",

        composition: "Rock and metal",

        atmosphere: "Carbon dioxide dominant",

        rotation: "243 days",

        orbit: "224.7 days",

        facts:
            "Venus has a dense carbon-dioxide atmosphere and is " +
            "the hottest planet in the Solar System.",

        source: "NASA / ESA"
    },


    Earth: {
        name: "Earth",
        type: "Planet",

        position: new THREE.Vector3(14, 0, 0),

        radius: 0.72,

        color: COLORS.planets.earth.base,

        size: "12,742 km",
        mass: "5.97 × 10²⁴ kg",
        temperature: "15 °C",
        gravity: "9.81 m/s²",

        composition: "Rock, iron and silicates",

        atmosphere: "Nitrogen and oxygen",

        rotation: "23.9 hours",

        orbit: "365.25 days",

        facts:
            "Earth is the only known planet with stable surface " +
            "liquid water and life.",

        source: "NASA / ESA"
    },


    Mars: {
        name: "Mars",
        type: "Planet",

        position: new THREE.Vector3(18, 0, 0),

        radius: 0.58,

        color: COLORS.planets.mars.base,

        size: "6,779 km",
        mass: "6.39 × 10²³ kg",
        temperature: "−63 °C",
        gravity: "3.71 m/s²",

        composition: "Rock and iron",

        atmosphere: "CO₂ dominant",

        rotation: "24.6 hours",

        orbit: "687 days",

        facts:
            "Mars has been explored by numerous robotic missions " +
            "and remains one of the main targets for planetary science.",

        source: "NASA / ESA / Scientific Catalogues"
    },


    Jupiter: {
        name: "Jupiter",
        type: "Planet",

        position: new THREE.Vector3(25, 0, 0),

        radius: 2.1,

        color: COLORS.planets.jupiter.base,

        size: "139,820 km",
        mass: "1.90 × 10²⁷ kg",
        temperature: "−110 °C",
        gravity: "24.79 m/s²",

        composition: "Hydrogen and helium",

        atmosphere: "Hydrogen and helium",

        rotation: "9.9 hours",

        orbit: "11.86 years",

        facts:
            "Jupiter is the largest planet in the Solar System. " +
            "It is famous for its enormous storms, including the Great Red Spot.",

        source: "NASA / ESA"
    },


    Saturn: {
        name: "Saturn",
        type: "Planet",

        position: new THREE.Vector3(32, 0, 0),

        radius: 1.75,

        color: COLORS.planets.saturn.base,

        size: "116,460 km",
        mass: "5.68 × 10²⁶ kg",
        temperature: "−140 °C",
        gravity: "10.44 m/s²",

        composition: "Hydrogen and helium",

        atmosphere: "Hydrogen and helium",

        rotation: "10.7 hours",

        orbit: "29.45 years",

        facts:
            "Saturn is a gas giant surrounded by a spectacular system " +
            "of rings made mostly of ice and rocky material.",

        source: "NASA / ESA"
    },


    Uranus: {
        name: "Uranus",
        type: "Planet",

        position: new THREE.Vector3(39, 0, 0),

        radius: 1.15,

        color: COLORS.planets.uranus.base,

        size: "50,724 km",
        mass: "8.68 × 10²⁵ kg",
        temperature: "−195 °C",
        gravity: "8.69 m/s²",

        composition: "Water, methane and ammonia ices",

        atmosphere: "Hydrogen, helium and methane",

        rotation: "17.2 hours",

        orbit: "84 years",

        facts:
            "Uranus rotates on its side, giving the planet an unusual " +
            "seasonal cycle.",

        source: "NASA / ESA"
    },


    Neptune: {
        name: "Neptune",
        type: "Planet",

        position: new THREE.Vector3(46, 0, 0),

        radius: 1.1,

        color: COLORS.planets.neptune.base,

        size: "49,244 km",
        mass: "1.02 × 10²⁶ kg",
        temperature: "−200 °C",
        gravity: "11.15 m/s²",

        composition: "Water, ammonia and methane ices",

        atmosphere: "Hydrogen, helium and methane",

        rotation: "16.1 hours",

        orbit: "164.8 years",

        facts:
            "Neptune is the most distant major planet from the Sun " +
            "and has some of the fastest winds in the Solar System.",

        source: "NASA / ESA"
    },


    Pluto: {
        name: "Pluto",
        type: "Dwarf Planet",

        position: new THREE.Vector3(54, 0, 0),

        radius: 0.38,

        color: COLORS.planets.pluto.base,

        size: "2,377 km",
        mass: "1.30 × 10²² kg",
        temperature: "−229 °C",
        gravity: "0.62 m/s²",

        composition: "Rock and water ice",

        atmosphere: "Nitrogen, methane and carbon monoxide",

        rotation: "6.4 days",

        orbit: "248 years",

        facts:
            "Pluto is a dwarf planet located in the Kuiper Belt " +
            "beyond the orbit of Neptune.",

        source: "NASA / ESA"
    },


    Moon: {
        name: "Moon",
        type: "Moon",

        position: new THREE.Vector3(15.5, 0.3, 0),

        radius: 0.20,

        color: COLORS.moons.moon,

        size: "3,475 km",
        mass: "7.34 × 10²² kg",
        temperature: "−20 °C average",
        gravity: "1.62 m/s²",

        composition: "Rock and minerals",

        atmosphere: "Extremely thin exosphere",

        rotation: "27.3 days",

        orbit: "27.3 days",

        facts:
            "The Moon is Earth's natural satellite and is the fifth-largest " +
            "moon in the Solar System.",

        source: "NASA / ESA"
    },


    Sirius: {
        name: "Sirius",
        type: "Star",

        position: new THREE.Vector3(-70, 20, -40),

        radius: 1.8,

        color: COLORS.stars.sirius,

        size: "1.71 × Sun",
        mass: "2.02 × Sun",
        temperature: "9,940 °C",
        gravity: "High",

        composition: "Hydrogen and helium",

        atmosphere: "Stellar plasma",

        rotation: "Variable",

        orbit: "Binary system",

        facts:
            "Sirius is the brightest star visible in Earth's night sky. " +
            "It is part of a binary star system.",

        source: "NASA / ESA / Scientific Catalogues"
    }

};


// =========================================================
// ADDITIONAL MOONS
// =========================================================

export const moonObjects = {

    Titan: {
        name: "Titan",
        type: "Moon",

        position: new THREE.Vector3(35, 1.5, 0),

        radius: 0.42,

        color: COLORS.moons.titan,

        size: "5,150 km",
        mass: "1.35 × 10²³ kg",
        temperature: "−179 °C",
        gravity: "1.35 m/s²",

        composition: "Rock and water ice",

        atmosphere: "Nitrogen and methane",

        rotation: "15.9 days",

        orbit: "15.9 days",

        facts:
            "Titan is Saturn's largest moon and has a thick atmosphere " +
            "and liquid hydrocarbon lakes on its surface.",

        source: "NASA / ESA"
    },


    Rhea: {
        name: "Rhea",
        type: "Moon",

        position: new THREE.Vector3(29, -1.3, 0),

        radius: 0.28,

        color: COLORS.moons.rhea,

        size: "1,528 km",
        mass: "2.31 × 10²¹ kg",
        temperature: "−174 °C",
        gravity: "0.26 m/s²",

        composition: "Water ice and rock",

        atmosphere: "Very thin exosphere",

        rotation: "4.5 days",

        orbit: "4.5 days",

        facts:
            "Rhea is Saturn's second-largest moon and is composed largely " +
            "of water ice mixed with rocky material.",

        source: "NASA / ESA"
    },


    Enceladus: {
        name: "Enceladus",
        type: "Moon",

        position: new THREE.Vector3(30, 1.2, 0),

        radius: 0.18,

        color: COLORS.moons.enceladus,

        size: "504 km",
        mass: "1.08 × 10²⁰ kg",
        temperature: "−201 °C",
        gravity: "0.11 m/s²",

        composition: "Water ice and rock",

        atmosphere: "Water vapor and other gases",

        rotation: "1.37 days",

        orbit: "1.37 days",

        facts:
            "Enceladus has an icy surface and powerful water-rich plumes " +
            "that emerge from its south polar region.",

        source: "NASA / ESA"
    }

};


// =========================================================
// COMBINED DATABASE
// =========================================================

export const allCelestialObjects = {
    ...celestialObjects,
    ...moonObjects
};


// =========================================================
// OBJECT LOOKUP
// =========================================================

export function getCelestialObject(name) {

    return allCelestialObjects[name] || null;
}


// =========================================================
// OBJECT LIST
// =========================================================

export function getCelestialObjectList() {

    return Object.values(allCelestialObjects);
}


// =========================================================
// OBJECT TYPE FILTER
// =========================================================

export function getObjectsByType(type) {

    return getCelestialObjectList().filter(
        object =>
            object.type.toLowerCase() === type.toLowerCase()
    );
}
