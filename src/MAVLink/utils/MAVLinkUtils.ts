import { MAVLinkMessage } from "@/src/MAVLink/connectors/MAVLinkConnectorBase";

export class MAVLinkUtils {
    static isMAVLinkPartialMatch(message: MAVLinkMessage, partialMessage: MAVLinkMessage): boolean {
        for (const [key, value] of Object.entries(partialMessage)) {
            let messageValue = message[key];

            if (messageValue !== value) {
                return false;
            }
        }

        return true;
    }

    static createSimpleCOMMAND_LONG(command: number,
                                    param1: number = 0,
                                    param2: number = 0,
                                    param3: number = 0,
                                    param4: number = 0,
                                    param5: number = 0,
                                    param6: number = 0,
                                    param7: number = 0): MAVLinkMessage {
        return {
            mavpackettype: "COMMAND_LONG",
            target_system: 1,
            target_component: 1,
            command,
            confirmation: 0,
            param1,
            param2,
            param3,
            param4,
            param5,
            param6,
            param7
        };
    }
}