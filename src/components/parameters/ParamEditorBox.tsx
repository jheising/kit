import { Button, Pressable, Text, TextInput, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { controls, primitives } from "@/styles/styles";
import { ListBox } from "@/src/components/primitives/ListBox";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";


export interface ParamEditorBoxProps {
    name: string;
    value: string;
    editing?: boolean;
    onSaveValue?: (value: string) => void;
    onCancel?: () => void;
}

export function ParamEditorBox(props: ParamEditorBoxProps) {
    const primitive = useStyles(primitives);
    const component = useStyles(stylesheet);
    const controlStyles = useStyles(controls);
    const [editingValue, setEditingValue] = useState<string>("");

    useEffect(() => {
        if (props.editing) {
            setEditingValue(props.value ?? "");
        }
    }, [props.editing]);

    function handleSaveValue() {
        if (props.onSaveValue) {
            props.onSaveValue(editingValue);
        }
    }

    function renderContent() {
        if (props.editing) {
            return <View style={{ flexDirection: "row", gap: 5 }}>
                <TextInput style={[controlStyles.styles.input, primitive.styles.fontMono, {flex:1}]} value={editingValue} onChangeText={setEditingValue} inputMode="numeric" onSubmitEditing={handleSaveValue} autoFocus />
                <Pressable style={{ width: 40, alignItems: "center", justifyContent: "center", backgroundColor: component.theme.colors.success, borderRadius: 5 }} onPress={handleSaveValue}>
                    <MaterialCommunityIcons name="check" size={24} color={component.theme.colors.backgroundSecondary} />
                </Pressable>
                <Pressable style={{ width: 40, alignItems: "center", justifyContent: "center", backgroundColor: component.theme.colors.danger, borderRadius: 5 }} onPress={props.onCancel}>
                    <MaterialCommunityIcons name="close" size={24} color={component.theme.colors.backgroundSecondary} />
                </Pressable>
            </View>;
        }

        return <Text style={[primitive.styles.text, primitive.styles.fontMono, { fontSize: 20 }]}>{props.value}</Text>;
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