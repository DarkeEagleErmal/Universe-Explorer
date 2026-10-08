// js/universe.js

/*
============================================================
UNIVERSE EXPLORER
DEEP UNIVERSE DATABASE
============================================================

Contains:
- Milky Way
- Galaxies
- Nebulae
- Black holes
- Comets
- Asteroids
- Asteroid Belt
- Kuiper Belt
- Oort Cloud
- Deep-space regions

This file contains universe data.
3D rendering, particles, materials and effects
are handled by app.js and effects.js.
============================================================
*/


/* =========================================================
   HELPER
========================================================= */

function createUniverseObject(data) {
    return {
        name: data.name,
        type: data.type,

        position: data.position || [0, 0, 0],

        radius: data.radius || 1,

        color:
            data.color !== undefined
                ? data.color
                : 0xffffff,

        secondaryColor:
            data.secondaryColor !== undefined
                ? data.secondaryColor
                : null,

        textureStyle:
            data.textureStyle || "default",

        description:
            data.description || "",

        size:
            data.size || "Unknown",

        distance:
            data.distance || "Unknown",

        mass:
            data.mass || "Unknown",

        temperature:
            data.temperature || "Unknown",

        composition:
            data.composition || "Unknown",

        rotation:
            data.rotation || "Unknown",

        facts:
            Array.isArray(data.facts)
                ? data.facts
                : [],

        visual:
            data.visual || {},

        interactive:
            data.interactive !== false
    };
}


/* =========================================================
   MILKY WAY
========================================================= */

export const MilkyWay = createUniverseObject({

    name: "Milky Way",
    type: "Galaxy",

    position: [0, 0, 0],

    radius: 520,

    color: 0x9ebeff,
    secondaryColor: 0x563b91,

    textureStyle: "milkyWay",

    description:
        "A vast barred spiral galaxy containing hundreds of billions of stars, including our Solar System.",

    size:
        "Approximately 100,000–120,000 light-years across",

    distance:
        "Our home galaxy",

    mass:
        "Approximately 1–1.5 trillion solar masses",

    temperature:
        "Varies across the galaxy",

    composition:
        "Stars, gas, dust, dark matter and planetary systems",

    rotation:
        "Differential rotation",

    visual: {
        spiralArms: 4,
        coreSize: 90,
        dustDensity: 0.85,
        starDensity: 1.0,
        thickness: 0.08
    },

    facts: [
        "The Milky Way is a barred spiral galaxy.",
        "Our Solar System is located in the Orion Arm.",
        "The galactic center contains a supermassive black hole.",
        "The Milky Way contains hundreds of billions of stars."
    ]
});


/* =========================================================
   ANDROMEDA GALAXY
========================================================= */

export const Andromeda = createUniverseObject({

    name: "Andromeda Galaxy",
    type: "Galaxy",

    position: [-400, 180, -300],

    radius: 30,

    color: 0xaec9ff,
    secondaryColor: 0x6e78b8,

    textureStyle: "spiralGalaxy",

    description:
        "A massive spiral galaxy and one of the nearest large galaxies to the Milky Way.",

    size:
        "Approximately 260,000 light-years across",

    distance:
        "Approximately 2.5 million light-years",

    mass:
        "Approximately one trillion solar masses",

    temperature:
        "Varies across the galaxy",

    composition:
        "Stars, gas, dust and dark matter",

    rotation:
        "Differential rotation",

    visual: {
        spiralArms: 2,
        coreSize: 0.18,
        dustDensity: 0.75,
        starDensity: 0.9,
        inclination: 0.25
    },

    facts: [
        "Andromeda is the nearest major galaxy to the Milky Way.",
        "It contains hundreds of billions of stars.",
        "Andromeda and the Milky Way are gravitationally interacting.",
        "The two galaxies are expected to merge in the distant future."
    ]
});


/* =========================================================
   TRIANGULUM GALAXY
========================================================= */

export const Triangulum = createUniverseObject({

    name: "Triangulum Galaxy",
    type: "Galaxy",

    position: [430, 100, -360],

    radius: 20,

    color: 0x9bbdff,
    secondaryColor: 0x536aa9,

    textureStyle: "spiralGalaxy",

    description:
        "A nearby spiral galaxy and one of the major members of the Local Group.",

    size:
        "Approximately 60,000 light-years across",

    distance:
        "Approximately 2.7 million light-years",

    mass:
        "Tens of billions of solar masses",

    temperature:
        "Varies across the galaxy",

    composition:
        "Stars, gas, dust and dark matter",

    rotation:
        "Differential rotation",

    visual: {
        spiralArms: 3,
        coreSize: 0.16,
        dustDensity: 0.65,
        starDensity: 0.75,
        inclination: 0.35
    },

    facts: [
        "The Triangulum Galaxy is part of the Local Group.",
        "It contains large regions of active star formation.",
        "It is smaller than both the Milky Way and Andromeda."
    ]
});


/* =========================================================
   WHIRLPOOL GALAXY
========================================================= */

export const WhirlpoolGalaxy = createUniverseObject({

    name: "Whirlpool Galaxy",
    type: "Galaxy",

    position: [560, -170, -500],

    radius: 18,

    color: 0xa9c9ff,
    secondaryColor: 0x704da6,

    textureStyle: "spiralGalaxy",

    description:
        "A striking grand-design spiral galaxy interacting with a smaller companion galaxy.",

    size:
        "Approximately 60,000 light-years across",

    distance:
        "Approximately 23 million light-years",

    mass:
        "Large spiral galaxy",

    temperature:
        "Varies",

    composition:
        "Stars, gas, dust and dark matter",

    rotation:
        "Differential rotation",

    visual: {
        spiralArms: 2,
        coreSize: 0.15,
        dustDensity: 0.9,
        starDensity: 0.8,
        inclination: 0.15
    },

    facts: [
        "The Whirlpool Galaxy has two prominent spiral arms.",
        "It is gravitationally interacting with a smaller companion.",
        "Its spiral structure contains many active star-forming regions."
    ]
});


/* =========================================================
   DISTANT GALAXY
========================================================= */

export const DistantGalaxy = createUniverseObject({

    name: "Distant Galaxy",
    type: "Galaxy",

    position: [-650, -260, -700],

    radius: 12,

    color: 0x897dff,
    secondaryColor: 0x423c86,

    textureStyle: "distantGalaxy",

    description:
        "A distant galaxy represented as a deep-space exploration target.",

    size:
        "Unknown",

    distance:
        "Millions of light-years",

    mass:
        "Unknown",

    temperature:
        "Unknown",

    composition:
        "Stars, gas, dust and dark matter",

    rotation:
        "Unknown",

    visual: {
        spiralArms: 3,
        coreSize: 0.2,
        dustDensity: 0.5,
        starDensity: 0.7
    },

    facts: [
        "Distant galaxies allow astronomers to study the evolution of the Universe.",
        "Their light can travel for millions or billions of years before reaching us."
    ]
});


/* =========================================================
   NEBULA — ORION
========================================================= */

export const OrionNebula = createUniverseObject({

    name: "Orion Nebula",
    type: "Nebula",

    position: [180, 120, -260],

    radius: 24,

    color: 0x775cff,
    secondaryColor: 0x35a9ff,

    textureStyle: "emissionNebula",

    description:
        "A huge stellar nursery where new stars are forming from clouds of gas and dust.",

    size:
        "Approximately 24 light-years across",

    distance:
        "Approximately 1,340 light-years",

    mass:
        "Thousands of solar masses of gas and dust",

    temperature:
        "Hundreds to thousands of kelvin in different regions",

    composition:
        "Hydrogen, helium, oxygen, dust and other elements",

    visual: {
        layers: 8,
        density: 0.82,
        turbulence: 0.8,
        particleDensity: 1.0,
        cloudScale: 1.2,
        glow: 1.0
    },

    facts: [
        "The Orion Nebula is one of the most studied star-forming regions.",
        "It contains young massive stars.",
        "The nebula is visible to the naked eye under dark skies."
    ]
});


/* =========================================================
   CARINA NEBULA
========================================================= */

export const CarinaNebula = createUniverseObject({

    name: "Carina Nebula",
    type: "Nebula",

    position: [-300, -120, -420],

    radius: 38,

    color: 0xff4f9b,
    secondaryColor: 0x4d8dff,

    textureStyle: "emissionNebula",

    description:
        "A huge region of gas and dust containing intense star formation.",

    size:
        "More than 300 light-years across",

    distance:
        "Approximately 7,500 light-years",

    mass:
        "Large cloud complex",

    temperature:
        "Varies strongly across the nebula",

    composition:
        "Hydrogen, helium, oxygen, dust and ionized gas",

    visual: {
        layers: 10,
        density: 0.88,
        turbulence: 0.9,
        particleDensity: 1.2,
        cloudScale: 1.5,
        glow: 1.1
    },

    facts: [
        "The Carina Nebula contains some extremely massive stars.",
        "It is one of the brightest large star-forming regions in the Milky Way.",
        "Its gas and dust form enormous sculpted structures."
    ]
});


/* =========================================================
   CRAB NEBULA
========================================================= */

export const CrabNebula = createUniverseObject({

    name: "Crab Nebula",
    type: "Nebula",

    position: [320, 210, -380],

    radius: 15,

    color: 0x55bfff,
    secondaryColor: 0xff5f8f,

    textureStyle: "supernovaRemnant",

    description:
        "The expanding remains of a stellar explosion observed from Earth in 1054.",

    size:
        "Approximately 11 light-years across",

    distance:
        "Approximately 6,500 light-years",

    mass:
        "Several solar masses of expanding material",

    temperature:
        "Extremely hot plasma in parts of the remnant",

    composition:
        "Ionized gas, dust and energetic particles",

    visual: {
        layers: 7,
        density: 0.7,
        turbulence: 1.0,
        particleDensity: 1.1,
        cloudScale: 0.9,
        glow: 1.2
    },

    facts: [
        "The Crab Nebula is a supernova remnant.",
        "A rapidly rotating neutron star lies at its center.",
        "The nebula continues to expand into space."
    ]
});


/* =========================================================
   PILLARS REGION
========================================================= */

export const PillarsOfCreation = createUniverseObject({

    name: "Pillars of Creation",
    type: "Nebula",

    position: [-200, 250, -500],

    radius: 18,

    color: 0x5c75ff,
    secondaryColor: 0xb454d9,

    textureStyle: "darkNebula",

    description:
        "Towering columns of gas and dust inside the Eagle Nebula.",

    size:
        "Several light-years",

    distance:
        "Approximately 6,500–7,000 light-years",

    mass:
        "Large quantities of gas and dust",

    temperature:
        "Varies throughout the cloud",

    composition:
        "Hydrogen, oxygen, dust and other material",

    visual: {
        layers: 9,
        density: 0.95,
        turbulence: 0.75,
        particleDensity: 1.0,
        cloudScale: 1.1,
        glow: 0.75
    },

    facts: [
        "The pillars are dense columns of interstellar gas and dust.",
        "New stars are forming inside and around the region.",
        "The structure is part of the Eagle Nebula."
    ]
});


/* =========================================================
   CUSTOM DEEP-SPACE NEBULAE
========================================================= */

export const PurpleNebula = createUniverseObject({

    name: "Purple Nebula",
    type: "Nebula",

    position: [-120, 160, -240],

    radius: 26,

    color: 0x8b4dff,
    secondaryColor: 0xd05cff,

    textureStyle: "purpleNebula",

    description:
        "A dense violet interstellar cloud used as an exploration region.",

    visual: {
        layers: 9,
        density: 0.85,
        turbulence: 0.85,
        particleDensity: 1.0,
        cloudScale: 1.3,
        glow: 1.0
    },

    facts: [
        "Nebulae are enormous clouds of gas and dust.",
        "Dense nebular regions can become stellar nurseries."
    ]
});


export const BlueNebula = createUniverseObject({

    name: "Blue Nebula",
    type: "Nebula",

    position: [260, -80, -300],

    radius: 22,

    color: 0x268cff,
    secondaryColor: 0x66d8ff,

    textureStyle: "blueNebula",

    description:
        "A luminous blue interstellar cloud filled with diffuse gas and dust.",

    visual: {
        layers: 8,
        density: 0.75,
        turbulence: 0.8,
        particleDensity: 0.9,
        cloudScale: 1.2,
        glow: 1.0
    },

    facts: [
        "Different gases emit different colors of light.",
        "Nebulae can be illuminated by nearby stars."
    ]
});


export const MagentaNebula = createUniverseObject({

    name: "Magenta Nebula",
    type: "Nebula",

    position: [500, 120, -620],

    radius: 28,

    color: 0xff4ca8,
    secondaryColor: 0x7b4cff,

    textureStyle: "magentaNebula",

    description:
        "A large colorful interstellar cloud.",

    visual: {
        layers: 9,
        density: 0.8,
        turbulence: 0.9,
        particleDensity: 1.0,
        cloudScale: 1.4,
        glow: 1.0
    },

    facts: [
        "Nebulae contain material recycled from previous generations of stars."
    ]
});


export const DeepBlueNebula = createUniverseObject({

    name: "Deep Blue Nebula",
    type: "Nebula",

    position: [-500, -150, -550],

    radius: 32,

    color: 0x274dff,
    secondaryColor: 0x18217a,

    textureStyle: "deepBlueNebula",

    description:
        "A large dark-blue deep-space cloud region.",

    visual: {
        layers: 10,
        density: 0.9,
        turbulence: 0.95,
        particleDensity: 1.2,
        cloudScale: 1.5,
        glow: 0.8
    },

    facts: [
        "Dense clouds of dust can block visible light.",
        "Infrared observations can reveal objects hidden inside them."
    ]
});


/* =========================================================
   BLACK HOLES
========================================================= */

export const SagittariusA = createUniverseObject({

    name: "Sagittarius A*",
    type: "Black Hole",

    position: [0, 0, 0],

    radius: 5,

    color: 0x05050a,
    secondaryColor: 0xff9d3d,

    textureStyle: "blackHole",

    description:
        "The supermassive black hole at the center of the Milky Way.",

    size:
        "Event-horizon diameter of roughly 24 million km",

    distance:
        "Approximately 26,000 light-years",

    mass:
        "Approximately 4.3 million solar masses",

    temperature:
        "Accretion environment can reach extreme temperatures",

    composition:
        "Black hole surrounded by hot plasma and orbiting material",

    rotation:
        "Unknown / rapidly rotating possible",

    visual: {
        diskRadius: 2.2,
        diskThickness: 0.25,
        particleDensity: 1.2,
        rotationSpeed: 1.5,
        lensingStrength: 1.0,
        glow: 1.2
    },

    facts: [
        "Sagittarius A* is the supermassive black hole at the center of the Milky Way.",
        "It has a mass millions of times greater than the Sun.",
        "Stars orbit around it at extremely high speeds.",
        "It is surrounded by a region of hot gas and dust."
    ]
});


export const DeepSpaceBlackHole = createUniverseObject({

    name: "Deep Space Black Hole",
    type: "Black Hole",

    position: [-520, 220, -650],

    radius: 6,

    color: 0x020207,
    secondaryColor: 0xff5b24,

    textureStyle: "blackHole",

    description:
        "A deep-space black hole exploration target surrounded by a luminous accretion disk.",

    size:
        "Unknown",

    distance:
        "Deep space",

    mass:
        "Unknown",

    temperature:
        "Extremely hot accretion material",

    composition:
        "Black hole and orbiting plasma",

    rotation:
        "Unknown",

    visual: {
        diskRadius: 2.8,
        diskThickness: 0.3,
        particleDensity: 1.5,
        rotationSpeed: 2.0,
        lensingStrength: 1.25,
        glow: 1.4
    },

    facts: [
        "A black hole is an object whose gravity is strong enough to trap light.",
        "Material falling toward a black hole can form an extremely hot accretion disk.",
        "The region around a black hole can strongly distort light."
    ]
});


/* =========================================================
   COMETS
========================================================= */

export const HalleyComet = createUniverseObject({

    name: "Halley's Comet",
    type: "Comet",

    position: [95, 35, -40],

    radius: 0.35,

    color: 0xb8d8e8,
    secondaryColor: 0x6bc8ff,

    textureStyle: "comet",

    description:
        "A famous periodic comet that returns to the inner Solar System approximately every 76 years.",

    size:
        "Nucleus approximately 15 × 8 km",

    distance:
        "Solar System",

    mass:
        "Approximately 2.2 × 10¹⁴ kg",

    temperature:
        "Extremely cold nucleus",

    composition:
        "Water ice, dust and frozen gases",

    visual: {
        nucleusSize: 0.35,
        comaSize: 1.2,
        tailLength: 12,
        tailParticles: 900,
        dustParticles: 500,
        tailDirection: "awayFromSun"
    },

    facts: [
        "Halley's Comet is a short-period comet.",
        "It returns to the inner Solar System roughly every 76 years.",
        "Its tail is produced when sunlight heats material from the nucleus."
    ]
});


export const CometEncke = createUniverseObject({

    name: "Comet Encke",
    type: "Comet",

    position: [70, -30, 55],

    radius: 0.25,

    color: 0xaacbd8,
    secondaryColor: 0x65caff,

    textureStyle: "comet",

    description:
        "A short-period comet with one of the shortest orbital periods known.",

    size:
        "Nucleus a few kilometers across",

    distance:
        "Solar System",

    mass:
        "Unknown",

    temperature:
        "Extremely cold nucleus",

    composition:
        "Ice, dust and volatile compounds",

    visual: {
        nucleusSize: 0.25,
        comaSize: 0.9,
        tailLength: 8,
        tailParticles: 650,
        dustParticles: 350,
        tailDirection: "awayFromSun"
    },

    facts: [
        "Comet Encke has a short orbital period.",
        "Its activity increases when it approaches the Sun."
    ]
});


export const DeepSpaceComet = createUniverseObject({

    name: "Deep Space Comet",
    type: "Comet",

    position: [-180, -60, -240],

    radius: 0.3,

    color: 0xa8d8ff,
    secondaryColor: 0x6f9cff,

    textureStyle: "comet",

    description:
        "A distant icy comet used as a deep-space exploration target.",

    visual: {
        nucleusSize: 0.3,
        comaSize: 1.1,
        tailLength: 14,
        tailParticles: 800,
        dustParticles: 450,
        tailDirection: "awayFromSun"
    },

    facts: [
        "Comets are remnants from the formation of planetary systems.",
        "Their tails can stretch millions of kilometers when active."
    ]
});


/* =========================================================
   ASTEROIDS
========================================================= */

export const AsteroidVesta = createUniverseObject({

    name: "Vesta",
    type: "Asteroid",

    position: [25, 0, 0],

    radius: 0.18,

    color: 0x8c8279,

    textureStyle: "asteroid",

    size:
        "Approximately 525 km",

    distance:
        "Asteroid Belt",

    mass:
        "Approximately 2.59 × 10²⁰ kg",

    composition:
        "Rock and metal",

    visual: {
        irregularity: 0.65,
        craterDensity: 0.7,
        rotationSpeed: 0.3
    },

    facts: [
        "Vesta is one of the largest objects in the asteroid belt.",
        "It has a differentiated internal structure.",
        "Its surface contains enormous impact features."
    ]
});


export const AsteroidPallas = createUniverseObject({

    name: "Pallas",
    type: "Asteroid",

    position: [26, 5, -2],

    radius: 0.17,

    color: 0x807b75,

    textureStyle: "asteroid",

    size:
        "Approximately 512 km",

    distance:
        "Asteroid Belt",

    mass:
        "Approximately 2.04 × 10²⁰ kg",

    composition:
        "Rock and metal",

    visual: {
        irregularity: 0.7,
        craterDensity: 0.65,
        rotationSpeed: 0.25
    },

    facts: [
        "Pallas is one of the largest asteroids.",
        "Its orbit is significantly inclined compared with many other major asteroids."
    ]
});


export const AsteroidHygiea = createUniverseObject({

    name: "Hygiea",
    type: "Asteroid",

    position: [27, -4, 3],

    radius: 0.14,

    color: 0x77746f,

    textureStyle: "asteroid",

    size:
        "Approximately 430 km",

    distance:
        "Asteroid Belt",

    mass:
        "Approximately 8.6 × 10¹⁹ kg",

    composition:
        "Carbon-rich material",

    visual: {
        irregularity: 0.6,
        craterDensity: 0.5,
        rotationSpeed: 0.2
    },

    facts: [
        "Hygiea is one of the largest objects in the asteroid belt.",
        "It is dark and carbon-rich."
    ]
});


/* =========================================================
   ASTEROID BELT
========================================================= */

export const asteroidBelt = {

    name: "Asteroid Belt",

    type: "Asteroid Belt",

    description:
        "A vast region of rocky bodies located mainly between Mars and Jupiter.",

    position: [25, 0, 0],

    minRadius: 23,

    maxRadius: 27,

    innerRadius: 23,

    outerRadius: 27,

    count: 1800,

    visual: {

        particleCount: 1800,

        sizeMin: 0.015,

        sizeMax: 0.08,

        irregularity: 0.85,

        craterDensity: 0.5,

        rotationSpeed: 0.35,

        inclination: 0.12,

        thickness: 1.5,

        randomDistribution: true
    },

    facts: [
        "The asteroid belt lies between Mars and Jupiter.",
        "It contains millions of rocky and metallic bodies.",
        "The total mass of the belt is much smaller than Earth's Moon.",
        "The objects are separated by enormous distances."
    ]
};


/* =========================================================
   KUIPER BELT
========================================================= */

export const kuiperBelt = {

    name: "Kuiper Belt",

    type: "Kuiper Belt",

    description:
        "A broad region of icy objects beyond the orbit of Neptune.",

    position: [0, 0, 0],

    minRadius: 75,

    maxRadius: 105,

    innerRadius: 75,

    outerRadius: 105,

    count: 2200,

    visual: {

        particleCount: 2200,

        sizeMin: 0.012,

        sizeMax: 0.07,

        color: 0x8cb8ff,

        secondaryColor: 0x6570c8,

        thickness: 8,

        inclination: 0.18,

        randomDistribution: true,

        orbitalSpread: 0.9
    },

    facts: [
        "The Kuiper Belt begins beyond Neptune's orbit.",
        "It contains many icy bodies and dwarf planets.",
        "Pluto is one of the best-known Kuiper Belt objects.",
        "The region preserves material from the early Solar System."
    ]
};


/* =========================================================
   OORT CLOUD
========================================================= */

export const oortCloud = {

    name: "Oort Cloud",

    type: "Oort Cloud",

    description:
        "A hypothetical distant spherical reservoir of icy objects surrounding the Solar System.",

    position: [0, 0, 0],

    minRadius: 180,

    maxRadius: 520,

    innerRadius: 180,

    outerRadius: 520,

    count: 2600,

    visual: {

        particleCount: 2600,

        sizeMin: 0.008,

        sizeMax: 0.045,

        color: 0x8aaeff,

        secondaryColor: 0x6a72c8,

        spherical: true,

        thickness: 1.0,

        randomDistribution: true,

        transparency: 0.5
    },

    facts: [
        "The Oort Cloud is a theoretical distant reservoir of icy bodies.",
        "It may be the source of many long-period comets.",
        "It is thought to surround the Solar System in a roughly spherical distribution."
    ]
};


/* =========================================================
   UNIVERSE REGIONS
========================================================= */

export const universeRegions = [

    {
        name: "Solar System",
        type: "Region",

        center: [0, 0, 0],

        radius: 120,

        description:
            "The planetary system surrounding the Sun."
    },

    {
        name: "Inner Solar System",
        type: "Region",

        center: [12, 0, 0],

        radius: 25,

        description:
            "The region containing the terrestrial planets."
    },

    {
        name: "Outer Solar System",
        type: "Region",

        center: [48, 0, 0],

        radius: 40,

        description:
            "The region dominated by the giant planets."
    },

    {
        name: "Kuiper Belt Region",
        type: "Region",

        center: [90, 0, 0],

        radius: 35,

        description:
            "The icy outer region beyond Neptune."
    },

    {
        name: "Deep Space",
        type: "Region",

        center: [0, 0, -350],

        radius: 600,

        description:
            "A large exploration region containing distant galaxies, nebulae and black holes."
    },

    {
        name: "Milky Way",
        type: "Region",

        center: [0, 0, 0],

        radius: 520,

        description:
            "Our home galaxy."
    }
];


/* =========================================================
   COLLECTIONS
========================================================= */

export const galaxyObjects = [

    MilkyWay,
    Andromeda,
    Triangulum,
    WhirlpoolGalaxy,
    DistantGalaxy
];


export const nebulaObjects = [

    OrionNebula,
    CarinaNebula,
    CrabNebula,
    PillarsOfCreation,

    PurpleNebula,
    BlueNebula,
    MagentaNebula,
    DeepBlueNebula
];


export const blackHoleObjects = [

    SagittariusA,
    DeepSpaceBlackHole
];


export const cometObjects = [

    HalleyComet,
    CometEncke,
    DeepSpaceComet
];


export const asteroidObjects = [

    AsteroidVesta,
    AsteroidPallas,
    AsteroidHygiea
];


/* =========================================================
   DEEP SPACE OBJECTS
========================================================= */

export const deepSpaceObjects = [

    ...galaxyObjects,

    ...nebulaObjects,

    ...blackHoleObjects,

    ...cometObjects,

    ...asteroidObjects
];


/* =========================================================
   ALL UNIVERSE OBJECTS
========================================================= */

export const allDeepSpaceObjects = [

    ...deepSpaceObjects,

    asteroidBelt,

    kuiperBelt,

    oortCloud
];


/* =========================================================
   GET BY NAME
========================================================= */

export function getUniverseObject(name) {

    if (!name) {
        return null;
    }

    const normalized =
        String(name)
            .trim()
            .toLowerCase();

    return allDeepSpaceObjects.find(
        object =>
            object.name
                .toLowerCase() === normalized
    ) || null;
}


/* =========================================================
   GET GALAXIES
========================================================= */

export function getGalaxies() {

    return [
        ...galaxyObjects
    ];
}


/* =========================================================
   GET NEBULAE
========================================================= */

export function getNebulae() {

    return [
        ...nebulaObjects
    ];
}


/* =========================================================
   GET BLACK HOLES
========================================================= */

export function getBlackHoles() {

    return [
        ...blackHoleObjects
    ];
}


/* =========================================================
   GET COMETS
========================================================= */

export function getComets() {

    return [
        ...cometObjects
    ];
}


/* =========================================================
   GET ASTEROIDS
========================================================= */

export function getAsteroids() {

    return [
        ...asteroidObjects
    ];
}


/* =========================================================
   SEARCH
========================================================= */

export function searchUniverseObjects(query) {

    if (!query) {
        return [];
    }

    const normalized =
        String(query)
            .trim()
            .toLowerCase();

    return allDeepSpaceObjects.filter(
        object =>
            object.name
                .toLowerCase()
                .includes(normalized)
    );
}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {

    MilkyWay,

    Andromeda,

    Triangulum,

    WhirlpoolGalaxy,

    DistantGalaxy,

    OrionNebula,

    CarinaNebula,

    CrabNebula,

    PillarsOfCreation,

    PurpleNebula,

    BlueNebula,

    MagentaNebula,

    DeepBlueNebula,

    SagittariusA,

    DeepSpaceBlackHole,

    HalleyComet,

    CometEncke,

    DeepSpaceComet,

    AsteroidVesta,

    AsteroidPallas,

    AsteroidHygiea,

    asteroidBelt,

    kuiperBelt,

    oortCloud,

    galaxyObjects,

    nebulaObjects,

    blackHoleObjects,

    cometObjects,

    asteroidObjects,

    deepSpaceObjects,

    allDeepSpaceObjects,

    universeRegions,

    getUniverseObject,

    getGalaxies,

    getNebulae,

    getBlackHoles,

    getComets,

    getAsteroids,

    searchUniverseObjects
};
