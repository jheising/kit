import { useMAVLink } from "@/src/hooks/useMAVLink";
import { MapView } from "@/src/components/mapping/MapView.web";
import { View } from "react-native";
import { useStyles } from "react-native-unistyles";
import { primitives } from "@/styles/styles";
import { ActionList } from "@/src/components/actions/ActionList";
import { MAVLinkUtils } from "@/src/MAVLink/utils/MAVLinkUtils";
import { KiteButton } from "@/src/components/primitives/KiteButton";
import { useState } from "react";
import { VehicleParamEditor } from "@/src/components/parameters/VehicleParamEditor";

export default function Index() {

    const [showParamEditor, setShowParamEditor] = useState(false);

    const mavLink = useMAVLink({
        connector: {
            type: "websocket", options: {
                websocketURL: "ws://lawnny.local:3000/json"
            }
        }
    });

    function renderParamEditor() {
        if (!showParamEditor) {
            return;
        }

        return <View style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "50%"
        }}>
            <VehicleParamEditor connection={mavLink.connection} />
        </View>;
    }

    function handleToggleParamEditor() {
        setShowParamEditor(!showParamEditor);
    }

    const primitiveStyles = useStyles(primitives);
    return <View style={{ width: "100%", height: "100%", flexDirection: "row", backgroundColor: primitiveStyles.theme.colors.backgroundPrimary }}>
        <View style={{ width: 250 }}>
            <ActionList connection={mavLink.connection}
                        actions={[
                            {
                                title: "Start Mission",
                                icon: "map-marker-path",
                                confirmAction: true,
                                message: MAVLinkUtils.createSimpleCOMMAND_LONG(
                                    176, // MAV_CMD_DO_SET_MODE,
                                    1,
                                    10
                                )
                            },
                            {
                                title: "Reset Mission",
                                icon: "map-marker-left",
                                confirmAction: true,
                                message: MAVLinkUtils.createSimpleCOMMAND_LONG(
                                    224, // MAV_CMD_DO_SET_MISSION_CURRENT
                                    -1,
                                    1
                                )
                            },
                            {
                                title: "Clear Mission",
                                icon: "map-marker-remove",
                                confirmAction: true,
                                message: {
                                    mavpackettype: "MISSION_CLEAR_ALL",
                                    target_system: 1,
                                    target_component: 1,
                                    mission_type: 0
                                },
                                awaitMessage: {
                                    mavpackettype: "MISSION_ACK",
                                    type: 0
                                }
                            },
                            {
                                title: "Calibrate Compass",
                                icon: "sun-compass",
                                message: MAVLinkUtils.createSimpleCOMMAND_LONG(
                                    42006 // MAV_CMD_FIXED_MAG_CAL_YAW
                                ),
                                awaitMessage: {
                                    mavpackettype: "COMMAND_ACK",
                                    command: 42006, // MAV_CMD_FIXED_MAG_CAL_YAW
                                    result: 0 // MAV_RESULT_ACCEPTED
                                },
                                inputs: [
                                    {
                                        title: "Compass direction in degrees",
                                        parameterName: "param1",
                                        helpText: "Must be true north reference"
                                    }
                                ]
                            }
                        ]} />
                <View style={{ padding: 10 }}><KiteButton title={`${showParamEditor ? "Hide" : "Edit"} Params`} onPress={handleToggleParamEditor} /></View>
        </View>
        <View style={{ flex: 1 }}>
            <MapView connection={mavLink.connection} isGroundVehicle />
        </View>
        {renderParamEditor()}
    </View>;
}
