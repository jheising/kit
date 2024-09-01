import { MAVLinkAction, MAVLinkActionInput } from "@/src/MAVLink/actions/MAVLinkAction";
import { KiteButton } from "@/src/components/primitives/KiteButton";
import { MAVLinkConnectionState, MAVLinkConnectorBase, MAVLinkMessage } from "@/src/MAVLink/connectors/MAVLinkConnectorBase";
import { useState } from "react";
import { MAVLinkUtils } from "@/src/MAVLink/utils/MAVLinkUtils";
import { useStyledActionSheet } from "@/src/hooks/useStyledActionSheet";
import { Modal } from "react-native";
import React from "react";
import { KiteModal } from "@/src/components/primitives/KiteModal";
import { ActionValueInput } from "@/src/components/actions/ActionValueInput";
import { KiteText } from "@/src/components/primitives/KiteText";

export function ActionButton(props: {
    action: MAVLinkAction;
    connection?: MAVLinkConnectorBase;
}) {

    const { showActionSheetWithOptions } = useStyledActionSheet();
    const [isLoading, setIsLoading] = useState(false);
    const [displayModal, setDisplayModal] = useState(false);
    const [currentMessage, setCurrentMessage] = useState<MAVLinkMessage>();

    async function processAction() {
        if (!props.connection) {
            return;
        }

        const messageToSend = currentMessage ?? props.action.message;

        if (props.action.awaitMessage) {
            setIsLoading(true);
            try {
                await props.connection.sendAndAwaitFilter(messageToSend, msg => MAVLinkUtils.isMAVLinkPartialMatch(msg, props.action.awaitMessage!));
            } catch (e) {

                showActionSheetWithOptions({
                    title: "Unable to complete action",
                    options: ["OK"]
                }, () => {
                });

                console.error("Unable to complete action", props.action, e);
            }
        } else {
            props.connection.sendMAVLinkMessage(messageToSend);
        }

        setIsLoading(false);
        setCurrentMessage(undefined);
    }

    function handleActionInputChange(actionInput: MAVLinkActionInput, value: number | string) {
        setCurrentMessage({
            ...currentMessage!,
            [actionInput.parameterName]: value
        });
    }

    function handleOK() {
        setDisplayModal(false);
        processAction();
    }

    function handleCancel() {
        setDisplayModal(false);
        setCurrentMessage(undefined);
    }

    function handlePress() {
        if (props.action.confirmAction || props.action.inputs) {
            setCurrentMessage({ ...props.action.message });
            setDisplayModal(true);
        } else {
            processAction();
        }

        // if (!props.connection) {
        //     return;
        // }
        //
        // if (props.action.confirmAction) {
        //     const options = ["Confirm", "Cancel"];
        //
        //     showActionSheetWithOptions({
        //         title: props.action.confirmationMessage ?? "Are you sure?",
        //         options,
        //         cancelButtonIndex: 1
        //     }, (selectedIndex) => {
        //         switch (selectedIndex) {
        //             case 0:
        //                 processAction();
        //                 break;
        //         }
        //     });
        // } else {
        //     processAction();
        // }
    }

    function renderModal() {
        if (!displayModal) {
            return;
        }

        if (props.action.inputs) {
            return <KiteModal visible={displayModal} buttons={[
                <KiteButton key="OK" title="OK" color="success" onPress={handleOK} />,
                <KiteButton key="Cancel" title="Cancel" onPress={handleCancel} />
            ]}>
                {props.action.inputs && props.action.inputs.map(input => <ActionValueInput key={input.parameterName} input={input} initialValue={currentMessage?.[input.parameterName]} onValueChange={handleActionInputChange} />)}
            </KiteModal>;
        }

        if (props.action.confirmAction) {
            return <KiteModal visible={displayModal} buttons={[
                <KiteButton key="OK" title="OK" color="success" onPress={handleOK} />,
                <KiteButton key="Cancel" title="Cancel" onPress={handleCancel} />
            ]}>
                <KiteText>{props.action.confirmationMessage ?? "Are you sure?"}</KiteText>
            </KiteModal>;
        }
    }

    return <React.Fragment>
        {renderModal()}
        <KiteButton title={props.action.title} iconName={props.action.icon} onPress={handlePress} hasActivity={isLoading} disabled={!props.connection || props.connection.connectionState !== MAVLinkConnectionState.CONNECTED} />
    </React.Fragment>;
}