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

export const darkTheme = {
    colors: {
        typography: "#ffffff",
        typographySecondary: "#89898E",
        backgroundPrimary: "#19191D",
        backgroundSecondary: "#27272E",
        success: "#51C776",
        danger: "#c75151"
    },
    typography: {
        font: {
            regular: "Inter_400Regular",
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