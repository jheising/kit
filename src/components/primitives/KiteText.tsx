import { Text, TextProps } from "react-native";
import { useStyles } from "react-native-unistyles";
import { primitives } from "@/styles/styles";

export function KiteText(props: TextProps) {
    const primitiveStyles = useStyles(primitives);
    return <Text {...props} style={[primitiveStyles.styles.text, props.style]} />;
}