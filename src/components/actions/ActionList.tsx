import { useStyles } from "react-native-unistyles";
import { primitives } from "@/styles/styles";
import { MAVLinkAction } from "@/src/MAVLink/actions/MAVLinkAction";
import { FlashList } from "@shopify/flash-list";
import { ActionButton } from "@/src/components/actions/ActionButton";
import { View } from "react-native";
import { MAVLinkConnectorBase } from "@/src/MAVLink/connectors/MAVLinkConnectorBase";

export function ActionList(props: {
    actions: MAVLinkAction[];
    connection?: MAVLinkConnectorBase
}) {
    const { theme, styles } = useStyles(primitives);
    return <FlashList data={props.actions}
                      estimatedItemSize={50}
                      renderItem={({ item }) => <View style={{paddingHorizontal: 10, paddingTop: 10}}>
                          <ActionButton action={item} connection={props.connection} />
                      </View>} />;
}