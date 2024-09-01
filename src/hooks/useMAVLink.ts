import { MAVLinkConnectionState, MAVLinkConnectorBase } from "@/src/MAVLink/connectors/MAVLinkConnectorBase";
import { useEffect, useState } from "react";
import { MAVLinkConnector, MAVLinkConnectorFactoryOptions } from "@/src/MAVLink/connectors/MAVLinkConnector";
import stableStringify from "fast-json-stable-stringify";

export function useMAVLink(options: { connector: MAVLinkConnectorFactoryOptions }): {
    connection?: MAVLinkConnectorBase,
    state: MAVLinkConnectionState
} {
    const [connection, setConnection] = useState<MAVLinkConnectorBase>();
    const [connectionState, setConnectionState] = useState<MAVLinkConnectionState>(MAVLinkConnectionState.DISCONNECTED);

    useEffect(() => {

        function handleConnectionStateChange(newState: MAVLinkConnectionState) {
            setConnectionState(newState);
        }

        const newConnection = MAVLinkConnector.create(options.connector);
        if (newConnection) {
            setConnection(newConnection);
            newConnection.on("connection-state", handleConnectionStateChange);
            newConnection.connect();
        }

        return () => {
            if (newConnection) {
                newConnection.off("connection-state", handleConnectionStateChange);
                newConnection.disconnect();
                setConnection(undefined);
            }
        };
    }, [stableStringify(options.connector)]);

    return {
        connection: connection,
        state: connectionState
    };
}