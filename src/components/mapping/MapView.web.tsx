import { useStyles } from "react-native-unistyles";
import { useEffect, useRef } from "react";
import React from "react";
import { primitives } from "@/styles/styles";
import { MAVLinkConnectorBase, MAVLinkMessage } from "@/src/MAVLink/connectors/MAVLinkConnectorBase";

declare var Cesium: any;

interface CesiumState {
    hasFlownToVehicle: boolean;
    terrainProvider?: any;
    viewer?: any;
    lastVFR_HUD?: MAVLinkMessage;
    lastGLOBAL_POSITION_INT?: MAVLinkMessage;
    currentVehiclePosition?: any;
    vehiclePositionTrack?: any[];
}

const DEFAULT_CESIUM_VALUES: CesiumState = {
    hasFlownToVehicle: false
};

const MAX_TRACK_LENGTH = 256;

function getHeadingRayPositions(originPosition: any, heading: number, rayLength: number = 10) {
    heading = Cesium.Math.toRadians(heading);
    const hpr = new Cesium.HeadingPitchRoll(heading, 0, 0);
    hpr.heading -= Cesium.Math.PI_OVER_TWO;
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(originPosition, hpr);
    const matrix3 = Cesium.Matrix3.fromQuaternion(orientation);
    const direction = Cesium.Matrix3.multiplyByVector(matrix3, Cesium.Cartesian3.UNIT_X, new Cesium.Cartesian3());

    const headingRay = new Cesium.Ray(originPosition, direction);
    const headingRayTermination = Cesium.Ray.getPoint(headingRay, rayLength);
    return [originPosition, headingRayTermination];
}

async function getTerrainCorrectedPosition(terrainProvider: any, lat: number, lon: number) {
    const terrainPosition = (await Cesium.sampleTerrainMostDetailed(terrainProvider, [Cesium.Cartographic.fromDegrees(lon, lat)]))[0];
    return Cesium.Cartesian3.fromDegrees(lon, lat, terrainPosition.height);
}

async function initializeCesium(cesium: CesiumState, colors:any) {
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMzI5ZGRlNS02OWYwLTRlYTgtYmUwMS0xYjlmZDhjOTJiY2UiLCJpZCI6MzI1NCwiaWF0IjoxNTM2NjM3NjM5fQ.ly0KTLuzK1EjV8F0lkLpW0O7CI125NT9f8NdLTO4NCo";

    cesium.terrainProvider = await Cesium.createWorldTerrainAsync();
    cesium.viewer = new Cesium.Viewer("cesiumContainer", {
        timeline: false,
        animation: false,
        fullscreenButton: false,
        homeButton: false,
        infoBox: false,
        terrain: Cesium.Terrain.fromWorldTerrain()
    });

    cesium.viewer.scene.globe.depthTestAgainstTerrain = false;

    // Add our vehicle position
    cesium.viewer.entities.add({
        id: "vehicle",
        position: new Cesium.CallbackProperty(() => cesium.currentVehiclePosition, false),
        point: { pixelSize: 20, color: Cesium.Color.BLUE },
        // ellipsoid: {
        //     radii: new Cesium.Cartesian3(0.5, 0.5, 0.5),
        //     material: Cesium.Color.BLUE,
        // }
    });

    // Add our heading ray
    cesium.viewer.entities.add({
        id: "vehicle-heading",
        polyline: {
            positions: new Cesium.CallbackProperty(() => {
                if (!cesium.currentVehiclePosition || !cesium.lastVFR_HUD?.heading) {
                    return [];
                }
                return getHeadingRayPositions(cesium.currentVehiclePosition, cesium.lastVFR_HUD.heading as number);
            }, false),
            width: 4,
            arcType: Cesium.ArcType.NONE,
            material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.ORANGE)
        }
    });

    // cesium.viewer.entities.add({
    //     id: "vehicle-cog",
    //     polyline: {
    //         positions: new Cesium.CallbackProperty(() => {
    //             if (!cesium.currentVehiclePosition || !cesium.lastGLOBAL_POSITION_INT?.hdg) {
    //                 return [];
    //             }
    //             return getHeadingRayPositions(cesium.currentVehiclePosition, cesium.lastGLOBAL_POSITION_INT.hdg as number);
    //         }, false),
    //         width: 4,
    //         arcType: Cesium.ArcType.NONE,
    //         material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.BLACK)
    //     }
    // });

    cesium.viewer.entities.add({
        id: "vehicle-track",
        polyline: {
            positions: new Cesium.CallbackProperty(() => {
                if (!cesium.vehiclePositionTrack) {
                    return [];
                }
                return cesium.vehiclePositionTrack;
            }, false),
            width: 4,
            arcType: Cesium.ArcType.NONE,
            material: Cesium.Color.PURPLE
        }
    });
}

export function MapView(props: {
    connection?: MAVLinkConnectorBase,
    followVehicle?: boolean,
    isGroundVehicle?: boolean
}) {
    const cesiumRef = useRef<CesiumState>({ ...DEFAULT_CESIUM_VALUES });
    let cesium = cesiumRef.current;
    const primitive = useStyles(primitives);

    useEffect(() => {
        cesiumRef.current = { ...DEFAULT_CESIUM_VALUES };
        cesium = cesiumRef.current;

        const script = document.createElement("script");
        script.src = "https://cesium.com/downloads/cesiumjs/releases/1.120/Build/Cesium/Cesium.js";
        script.async = true;

        script.onload = async () => {
            await initializeCesium(cesium, primitive.theme.colors);
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
            if (message.mavpackettype === "VFR_HUD") {
                cesium.lastVFR_HUD = message;
            } else if (message.mavpackettype === "GLOBAL_POSITION_INT") {
                cesium.lastGLOBAL_POSITION_INT = message;

                const lat = message.lat as number / 10000000;
                const lon = message.lon as number / 10000000;
                const alt = message.alt as number / 1000;

                cesium.currentVehiclePosition = props.isGroundVehicle ? await getTerrainCorrectedPosition(cesium.terrainProvider, lat, lon) : Cesium.Cartesian3.fromDegrees(lon, lat, alt);

                if (!cesium.vehiclePositionTrack) {
                    cesium.vehiclePositionTrack = [];
                }

                cesium.vehiclePositionTrack.push(cesium.currentVehiclePosition);

                if (cesium.vehiclePositionTrack.length > MAX_TRACK_LENGTH) {
                    cesium.vehiclePositionTrack = cesium.vehiclePositionTrack.slice(cesium.vehiclePositionTrack.length - MAX_TRACK_LENGTH);
                }

                if (cesium.currentVehiclePosition && !cesium.hasFlownToVehicle) {
                    cesium.hasFlownToVehicle = true;
                    cesium.viewer.flyTo(cesium.viewer.entities.getById("vehicle"));
                }
            }
        }

        if (props.connection) {
            props.connection.on("message-received", handleMAVLinkMessage);
        }

        return () => {
            props.connection?.off("message-received", handleMAVLinkMessage);
        };
    }, [props.connection]);

    return <React.Fragment>
        <link href="https://cesium.com/downloads/cesiumjs/releases/1.120/Build/Cesium/Widgets/widgets.css" rel="stylesheet" />
        <div id="cesiumContainer" style={{ width: "100%", height: "100%" }} />
    </React.Fragment>;
}