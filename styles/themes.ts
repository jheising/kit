// export const lightTheme = {
//     colors: {
//         typography: "#000000",
//         background: "#ffffff"
//     },
//     margins: {
//         sm: 2,
//         md: 4,
//         lg: 8,
//         xl: 12
//     }
// } as const;

const GREEN = "#51C776";
const RED = "#c75151";
const BLUE = "#5184c7";
const PURPLE = "#8e51c7";
const ORANGE = "#c77e51";

export const darkTheme = {
    colors: {
        typography: "#ffffff",
        typographySecondary: "#89898E",
        backgroundPrimary: "#19191D",
        backgroundSecondary: "#27272E",
        green: GREEN,
        red: RED,
        blue: BLUE,
        purple: PURPLE,
        orange: ORANGE,
        success: GREEN,
        danger: RED
    },
    typography: {
        font: {
            regular: "Poppins_400Regular",
            mono: "RedHatMono_400Regular"
        }
    },
    corners: 8,
    controlHeight: 40,
    margins: {
        sm: 2,
        md: 4,
        lg: 8,
        xl: 12
    }
} as const;

// define other themes