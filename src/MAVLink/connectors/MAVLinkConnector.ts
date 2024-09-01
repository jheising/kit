import { MAVLinkWebSocketConnector, MAVLinkWebSocketConnectorOptions } from "@/src/MAVLink/connectors/MAVLinkWebSocketConnector";

export interface MAVLinkWebSocketConnectorFactoryOptions {
    type: "websocket",
    options: MAVLinkWebSocketConnectorOptions
}

export type MAVLinkConnectorFactoryOptions = MAVLinkWebSocketConnectorFactoryOptions;

export class MAVLinkConnector {
    static create(options: MAVLinkConnectorFactoryOptions): MAVLinkWebSocketConnector {
        return new MAVLinkWebSocketConnector(options.options);
    }
}