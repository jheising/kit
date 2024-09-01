import { MAVLinkMessage } from "@/src/MAVLink/connectors/MAVLinkConnectorBase";

export interface MAVLinkActionInput {
    title?: string;
    parameterName: string;
    helpText?: string;
    type?: "number" | "string";
}

export interface MAVLinkAction {
    title: string;
    icon?: string;
    group?: string;
    description?: boolean;
    confirmAction?: boolean;
    confirmationMessage?: string;

    message: MAVLinkMessage;
    awaitMessage?: MAVLinkMessage;

    inputs?: MAVLinkActionInput[];
}