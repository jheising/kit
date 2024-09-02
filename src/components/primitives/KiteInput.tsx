import { Pressable, TextInput, TextInputProps, View, ViewStyle } from "react-native";
import { useStyles } from "react-native-unistyles";
import { controls, primitives } from "@/styles/styles";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export type KiteInputProps = TextInputProps & {
    showClearButton?: boolean
};

export function KiteInput(props: KiteInputProps) {
    const controlStyles = useStyles(controls);

    function handleClear() {
        if (props.onChangeText) {
            props.onChangeText("");
        }
    }

    return <View>
        <TextInput style={[controlStyles.styles.input, props.style]} {...props} />
        {props.showClearButton && <Pressable style={{ position: "absolute", right: 10, height: "100%", alignItems: "center", justifyContent: "center", opacity: 0.5 }} onPress={handleClear}>
            <MaterialCommunityIcons name="close-circle" size={18}
                                    color={controlStyles.theme.colors.typographySecondary} />
        </Pressable>}
    </View>;
}