import React, { ReactNode } from "react";
import { PropsWithChildren } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useStyles } from "react-native-unistyles";
import { controls, primitives } from "@/styles/styles";

export function KiteModal(props: PropsWithChildren<{
    title?: string;
    visible?: boolean;
    buttons?: ReactNode[];
    disableClickCancel?: boolean;
    onRequestClose?: () => void;
}>) {
    const controlStyles = useStyles(controls);
    const primitiveStyles = useStyles(primitives);

    return <Modal visible={props.visible} animationType="fade" onRequestClose={props.onRequestClose} transparent>
        <Pressable style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, backgroundColor: "black", opacity: 0.35 }} onPress={props.onRequestClose} />
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20
        }}>
            <View style={[{
                backgroundColor: controlStyles.theme.colors.backgroundPrimary,
                minWidth: 320,
                minHeight: 150,
                padding: 20,
                borderRadius: controlStyles.theme.corners,
                gap: 10
            }]}>
                {props.title && <Text style={primitiveStyles.styles.text}>{props.title}</Text>}
                <View style={{ flex: 1, justifyContent: "center" }}>
                    {props.children}
                </View>
                {props.buttons && <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 5 }}>
                    {props.buttons}
                </View>}
            </View>
        </View>
    </Modal>;
}