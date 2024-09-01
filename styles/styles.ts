import { createStyleSheet } from "react-native-unistyles";

export const primitives = createStyleSheet(theme => ({
    background: {
        backgroundColor: theme.colors.backgroundPrimary
    },
    control: {
        backgroundColor: theme.colors.backgroundSecondary
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.backgroundPrimary
    },
    text: {
        color: theme.colors.typography,
        fontFamily: theme.typography.font.regular
    },
    helpText: {
        color: theme.colors.typographySecondary,
        fontFamily: theme.typography.font.regular,
        fontSize: 10,
        paddingTop: 3
    },
    secondaryText: {
        color: theme.colors.typographySecondary,
        fontFamily: theme.typography.font.regular
    },
    fontMono: {
        fontFamily: theme.typography.font.mono
    }
}));

export const controls = createStyleSheet(theme => ({
    input: {
        color: theme.colors.typography,
        padding: 10,
        fontFamily: theme.typography.font.regular,
        backgroundColor: theme.colors.backgroundPrimary,
        borderRadius: theme.corners,
        borderWidth: 2,
        borderColor: theme.colors.backgroundSecondary,
        height: theme.controlHeight
    },
    button: {
        borderRadius: theme.corners,
        backgroundColor: theme.colors.backgroundSecondary,
        padding: 10,
        flexDirection: "row",
        height: theme.controlHeight,
        justifyContent: "center",
        alignItems: "center",
        gap: 5
    }
}));