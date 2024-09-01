import { TextInput, TextInputProps, View, ViewStyle } from "react-native";
import { useStyles } from "react-native-unistyles";
import { controls, primitives } from "@/styles/styles";
import React from "react";

export function KiteInput(props: TextInputProps) {
    const controlStyles = useStyles(controls);
    const primitiveStyles = useStyles(primitives);
    return <TextInput style={[controlStyles.styles.input, primitiveStyles.styles.fontMono, props.style]} {...props} />;
}