import { useStyles } from "react-native-unistyles";
import { primitives } from "@/styles/styles";
import { MAVLinkActionInput } from "@/src/MAVLink/actions/MAVLinkAction";
import { Text, View } from "react-native";
import { KiteInput } from "@/src/components/primitives/KiteInput";
import { useState } from "react";

export function ActionValueInput(props: {
    input: MAVLinkActionInput;
    initialValue?: number | string;
    onValueChange?: (input: MAVLinkActionInput, newValue: number | string) => void;
}) {
    const primitiveStyles = useStyles(primitives);
    const [value, setValue] = useState(props.initialValue?.toString() ?? "");

    function handleChangeText(text: string) {

        if (props.input.type === "string") {
            setValue(text);
            props.onValueChange?.(props.input, text);
        } else {
            text = (text ?? "0").replace(/[^\d-.]/g, "");
            setValue(text);

            const numberValue = Number(text);

            if (!isNaN(numberValue)) {
                props.onValueChange?.(props.input, numberValue);
            }
        }
    }

    return <View style={{ gap: 10 }}>
        <Text style={primitiveStyles.styles.text}>{props.input.title ?? props.input.parameterName}</Text>
        <View>
            <KiteInput value={value} onChangeText={handleChangeText} inputMode={props.input.type === "string" ? "text" : "decimal"} />
            {props.input.helpText && <Text style={[primitiveStyles.styles.helpText]}>{props.input.helpText}</Text>}
        </View>
    </View>;
}