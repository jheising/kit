import { View, ViewStyle } from "react-native";
import { useStyles } from "react-native-unistyles";
import { primitives } from "@/styles/styles";
import { PropsWithChildren } from "react";

export function ListBox(props: PropsWithChildren<{
    style?: ViewStyle
}>) {
    const { theme, styles } = useStyles(primitives);

    return <View style={[styles.control, {
        minHeight: 60,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderTopColor: theme.colors.backgroundPrimary,
        borderTopWidth: 1
    }, props.style]}>
        {props.children}
    </View>;
}