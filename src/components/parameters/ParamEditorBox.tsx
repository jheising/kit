import { Button, Pressable, Text, TextInput, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { controls, primitives } from "@/styles/styles";
import { ListBox } from "@/src/components/primitives/ListBox";
import React, { useEffect, useRef, useState } from "react";
import { KiteButton } from "@/src/components/primitives/KiteButton";
import { KiteNumericInput } from "@/src/components/primitives/KiteNumericInput";


export interface ParamEditorBoxProps {
    name: string;
    initialValue: number;
    editing?: boolean;
    onSaveValue?: (value: number) => void;
    onCancel?: () => void;
}

export function ParamEditorBox(props: ParamEditorBoxProps) {
    const primitive = useStyles(primitives);
    const component = useStyles(stylesheet);
    const currentValue = useRef(props.initialValue);

    function handleValueUpdated(value: number) {
        currentValue.current = value;
    }

    function handleSaveValue() {
        if (props.onSaveValue) {
            props.onSaveValue(currentValue.current);
        }
    }

    function renderContent() {
        if (props.editing) {
            return <View style={{ flexDirection: "row", gap: 5 }}>
                <KiteNumericInput initialValue={props.initialValue} onChangeNumber={handleValueUpdated} autoFocus/>
                <KiteButton iconName="check" color="success" onPress={handleSaveValue} />
                <KiteButton iconName="close" color="danger" onPress={props.onCancel} />
            </View>;
        }

        return <Text style={[primitive.styles.text, primitive.styles.fontMono, { fontSize: 20 }]}>{props.initialValue}</Text>;
    }

    return <ListBox style={component.styles.container}>
        <View style={[{ flex: 1 }]}>
            <Text style={[primitive.styles.secondaryText, primitive.styles.fontMono]}>{props.name}</Text>
        </View>
        {renderContent()}
    </ListBox>;
}

const stylesheet = createStyleSheet(theme => ({
    container: {
        flexDirection: {
            sm: "row"
        },
        alignItems: {
            md: "center"
        },
        flexWrap: "wrap",
        gap: 5
    }
}));