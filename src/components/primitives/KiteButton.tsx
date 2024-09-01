import { ActivityIndicator, Pressable, Text, View, ViewStyle } from "react-native";
import { useStyles } from "react-native-unistyles";
import { controls, primitives } from "@/styles/styles";
import { PropsWithChildren, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

export function KiteButton(props: PropsWithChildren<{
    title?: string;
    color?: "success" | "danger";
    iconName?: string;
    rounded?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    hasActivity?: boolean;
    onPress?: () => void;
}>) {
    const controlStyles = useStyles(controls);
    const primitiveStyles = useStyles(primitives);
    const isSquare = !!props.iconName && !props.title;
    const [pressed, setPressed] = useState(false);

    function renderContent() {

        if (props.hasActivity) {
            return <ActivityIndicator animating color={primitiveStyles.theme.colors.typography} />;
        }

        const fontColor = props.disabled ? primitiveStyles.theme.colors.typographySecondary : primitiveStyles.theme.colors.typography;

        return <React.Fragment>
            {props.iconName && <MaterialCommunityIcons name={props.iconName as any} size={24} color={fontColor} />}
            {props.title && <Text style={[primitiveStyles.styles.text, { color: fontColor, flex: 1, textAlign: "center" }]}>{props.title}</Text>}
        </React.Fragment>;
    }

    return <Pressable style={[controlStyles.styles.button, {
        backgroundColor: props.color ? primitiveStyles.theme.colors[props.color] : primitiveStyles.theme.colors.backgroundSecondary
    }, {
        width: isSquare ? controlStyles.theme.controlHeight : "auto",
        minWidth: !isSquare ? controlStyles.theme.controlHeight * 1.5 : undefined,
        opacity: pressed ? 0.6 : 1,
        borderRadius: props.rounded ? 1000 : undefined
    }, props.style]} onPress={props.onPress} onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)} disabled={props.disabled || props.hasActivity}>
        {renderContent()}
    </Pressable>;
}