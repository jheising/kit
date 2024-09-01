import { View, ViewStyle } from "react-native";
import { useStyles } from "react-native-unistyles";
import { useEffect, useRef } from "react";
import React from "react";
import { primitives } from "@/styles/styles";
import { MAVLinkConnectorBase, MAVLinkMessage } from "@/src/MAVLink/connectors/MAVLinkConnectorBase";

declare var Cesium: any;

const DEFAULT_CESIUM_VALUES = {
    hasFlownToVehicle: false,
    terrainProvider: undefined as any,
    viewer: undefined as any,
    vehicleEntity: undefined as any,
    positionTrack: undefined as any,
    positionTrackEntity: undefined as any
};

const MAX_TRACK_LENGTH = 150;

export function MapView(props: {
    connection?: MAVLinkConnectorBase,
    followVehicle?: boolean,
    isGroundVehicle?: boolean
}) {
    const cesiumRef = useRef({ ...DEFAULT_CESIUM_VALUES });
    let cesium = cesiumRef.current;
    const primitive = useStyles(primitives);

    useEffect(() => {
        cesiumRef.current = { ...DEFAULT_CESIUM_VALUES };
        cesium = cesiumRef.current;

        const script = document.createElement("script");
        script.src = "https://cesium.com/downloads/cesiumjs/releases/1.120/Build/Cesium/Cesium.js";
        script.async = true;

        script.onload = async () => {

            Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMzI5ZGRlNS02OWYwLTRlYTgtYmUwMS0xYjlmZDhjOTJiY2UiLCJpZCI6MzI1NCwiaWF0IjoxNTM2NjM3NjM5fQ.ly0KTLuzK1EjV8F0lkLpW0O7CI125NT9f8NdLTO4NCo";

            cesium.terrainProvider = await Cesium.createWorldTerrainAsync();
            cesium.viewer = new Cesium.Viewer("cesiumContainer", {
                timeline: false,
                animation: false,
                fullscreenButton: false,
                //baseLayerPicker: false,
                //geocoder: false,
                homeButton: false,
                infoBox: false,
                //sceneModePicker: false,
                // selectionIndicator: false,
                //navigationHelpButton: false,
                // navigationInstructionsInitiallyVisible: false,
                terrain: Cesium.Terrain.fromWorldTerrain()
                // globe: false
            });


            // For Cesium
            // const buildingTileset = await Cesium.createOsmBuildingsAsync();
            // cesium.viewer.scene.primitives.add(buildingTileset);

            // For Google
            // try {
            //     cesium.viewer!.scene.primitives.add(await Cesium.createGooglePhotorealistic3DTileset());
            // } catch (error) {
            //     console.log(`Failed to load tileset: ${error}`);
            // }

            cesium.viewer.scene.globe.depthTestAgainstTerrain = false;
        };
        document.head.appendChild(script);

        return () => {
            if (cesium.viewer) {
                cesium.viewer.entities.removeAll();
                cesium.viewer.destroy();
            }
            document.head.removeChild(script);
        };
    }, []);

    useEffect(() => {

        async function handleMAVLinkMessage(message: MAVLinkMessage) {
            await updateVehiclePositionFromMAVLink(message);
        }

        if (props.connection) {
            props.connection.on("message-received", handleMAVLinkMessage);
        }

        return () => {
            props.connection?.off("message-received", handleMAVLinkMessage);
        };
    }, [props.connection]);

    async function getTerrainCorrectedPosition(lat: number, lon: number) {
        const terrainPosition = (await Cesium.sampleTerrainMostDetailed(cesium.terrainProvider, [Cesium.Cartographic.fromDegrees(lon, lat)]))[0];
        return Cesium.Cartesian3.fromDegrees(lon, lat, terrainPosition.height);
    }

    async function updateVehiclePositionFromMAVLink(message: MAVLinkMessage) {
        if (!cesium.viewer || message.mavpackettype !== "GLOBAL_POSITION_INT") {
            return;
        }

        const lat = message.lat as number / 10000000;
        const lon = message.lon as number / 10000000;
        const alt = message.alt as number / 1000;

        if (!cesium.positionTrack) {
            cesium.positionTrack = [];
        }

        // cesium.positionTrack.push([lon, lat]);
        //
        // if (cesium.positionTrack.length > MAX_TRACK_LENGTH) {
        //     cesium.positionTrack = cesium.positionTrack.slice(cesium.positionTrack.length - MAX_TRACK_LENGTH);
        // }
        //
        // if(cesium.positionTrack.length === 10) {
        //
        //     console.log(cesium.positionTrack);
        //     const trackPoints = Cesium.Cartesian3.fromDegreesArray(cesium.positionTrack.flat());
        //
        //     // if (cesium.positionTrack.length === 50) {
        //         console.log("Done!");
        //         cesium.viewer.entities.add({
        //             polyline : {
        //                 positions : trackPoints,
        //                 width : 4.0,
        //                 material : Cesium.Color.ORANGE,
        //                 clampToGround : true
        //             }
        //         });
        //
        //         cesium.viewer.flyTo(cesium.viewer);
        //     // }
        // }

        const vehiclePosition = props.isGroundVehicle ? await getTerrainCorrectedPosition(lat, lon) : Cesium.Cartesian3.fromDegrees(lon, lat, alt);

        if (!cesium.vehicleEntity) {
            cesium.vehicleEntity = cesium.viewer.entities.add({
                id: "vehicle",
                position: vehiclePosition,
                point: { pixelSize: 20, color: Cesium.Color.RED }
            });
        } else {
            cesium.vehicleEntity.position = vehiclePosition;
        }

        if (!cesium.hasFlownToVehicle && cesium.vehicleEntity) {
            cesium.hasFlownToVehicle = true;
            cesium.viewer.flyTo(cesium.vehicleEntity);
            // cesium.viewer.trackedEntity = cesium.vehicleEntity;
        }
    }

    return <React.Fragment>
        <link href="https://cesium.com/downloads/cesiumjs/releases/1.120/Build/Cesium/Widgets/widgets.css" rel="stylesheet" />
        <div id="cesiumContainer" style={{ width: "100%", height: "100%" }} />
    </React.Fragment>;
}