// =========================================================
// UNIVERSE EXPLORER
// colors.js
// Centralized colors for 3D celestial objects and effects
// =========================================================

export const COLORS = {

    // -----------------------------------------------------
    // MAIN SPACE
    // -----------------------------------------------------

    space: {
        background: 0x01030a,
        deepSpace: 0x000000,
        star: 0xffffff,
        starBlue: 0x82d2ff
    },


    // -----------------------------------------------------
    // SUN
    // -----------------------------------------------------

    sun: {
        base: 0xffc857,
        surface: 0xffd27a,
        glow: 0xffa726,
        light: 0xfff4dd
    },


    // -----------------------------------------------------
    // PLANETS
    // -----------------------------------------------------

    planets: {

        mercury: {
            base: 0x8c8178,
            surface: 0xa69b91
        },

        venus: {
            base: 0xd8a85b,
            surface: 0xe6b86e
        },

        earth: {
            base: 0x3d8cff,
            surface: 0x4b9cff,
            atmosphere: 0x4ba3ff
        },

        mars: {
            base: 0xb84a3a,
            surface: 0xc65a45
        },

        jupiter: {
            base: 0xc49a72,
            surface: 0xd2aa82
        },

        saturn: {
            base: 0xd5bd91,
            surface: 0xe0cba5,
            rings: 0xc5b68e
        },

        uranus: {
            base: 0x78cbd5,
            surface: 0x8bd9e0
        },

        neptune: {
            base: 0x4169c1,
            surface: 0x4d79d8
        },

        pluto: {
            base: 0x9c8578,
            surface: 0xb09b8c
        }
    },


    // -----------------------------------------------------
    // MOONS
    // -----------------------------------------------------

    moons: {

        moon: 0xaaaaaa,

        titan: 0xc49d68,

        rhea: 0xb5b0a5,

        enceladus: 0xdde5e8
    },


    // -----------------------------------------------------
    // STARS
    // -----------------------------------------------------

    stars: {

        default: 0xffffff,

        sirius: 0xdceeff,

        blue: 0x9fc8ff,

        yellow: 0xffe6a3,

        red: 0xff8c69
    },


    // -----------------------------------------------------
    // ASTEROIDS
    // -----------------------------------------------------

    asteroids: {

        main: 0x8e857b,

        dark: 0x625d58,

        light: 0xb0a79d
    },


    // -----------------------------------------------------
    // KUIPER BELT
    // -----------------------------------------------------

    kuiperBelt: {
        main: 0x9ca5b5,
        glow: 0x71849d
    },


    // -----------------------------------------------------
    // OORT CLOUD
    // -----------------------------------------------------

    oortCloud: {
        main: 0x768aa5,
        glow: 0x52647d
    },


    // -----------------------------------------------------
    // COMETS
    // -----------------------------------------------------

    comets: {

        nucleus: 0xcfd8df,

        tail: 0x8ddcff,

        glow: 0x65eaff
    },


    // -----------------------------------------------------
    // GALAXIES
    // -----------------------------------------------------

    galaxies: {

        andromeda: 0xc9b8ff,

        triangulum: 0x78b8ff,

        distant: 0xff9fcf,

        spiral: 0xa8c7ff
    },


    // -----------------------------------------------------
    // NEBULAE
    // -----------------------------------------------------

    nebulae: {

        purple: 0x4b1d8a,

        blue: 0x123f8c,

        magenta: 0x6b1d45,

        darkBlue: 0x183f70
    },


    // -----------------------------------------------------
    // BLACK HOLES
    // -----------------------------------------------------

    blackHoles: {

        core: 0x000000,

        accretionDisk: 0xff5a18,

        glow: 0xff9b4d,

        secondaryGlow: 0xffc078
    },


    // -----------------------------------------------------
    // ORBITS
    // -----------------------------------------------------

    orbits: {
        default: 0x385878,
        bright: 0x4d7395
    },


    // -----------------------------------------------------
    // LIGHTING
    // -----------------------------------------------------

    lighting: {

        ambient: 0x6688aa,

        sunlight: 0xfff4dd,

        cool: 0x6fa8ff
    },


    // -----------------------------------------------------
    // EFFECTS
    // -----------------------------------------------------

    effects: {

        cyan: 0x65eaff,

        blue: 0x438cff,

        white: 0xffffff,

        glow: 0x78dfff
    }
};


// =========================================================
// HELPER FUNCTIONS
// =========================================================

export function colorToHex(color) {

    return "#" + color.toString(16).padStart(6, "0");
}


export function lightenColor(color, amount = 0.2) {

    const r = (color >> 16) & 255;
    const g = (color >> 8) & 255;
    const b = color & 255;

    const newR = Math.min(255, Math.round(r + (255 - r) * amount));
    const newG = Math.min(255, Math.round(g + (255 - g) * amount));
    const newB = Math.min(255, Math.round(b + (255 - b) * amount));

    return (
        (newR << 16) |
        (newG << 8) |
        newB
    );
}


export function darkenColor(color, amount = 0.2) {

    const r = (color >> 16) & 255;
    const g = (color >> 8) & 255;
    const b = color & 255;

    const newR = Math.max(0, Math.round(r * (1 - amount)));
    const newG = Math.max(0, Math.round(g * (1 - amount)));
    const newB = Math.max(0, Math.round(b * (1 - amount)));

    return (
        (newR << 16) |
        (newG << 8) |
        newB
    );
}
