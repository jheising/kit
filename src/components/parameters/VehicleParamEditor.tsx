import { MAVLinkConnectorBase, MAVLinkParameter } from "@/src/MAVLink/connectors/MAVLinkConnectorBase";
import { ParamEditorBox } from "@/src/components/parameters/ParamEditorBox";
import { Button, Pressable, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { useStyles } from "react-native-unistyles";
import { controls } from "@/styles/styles";
import { KiteInput } from "@/src/components/primitives/KiteInput";
import { KiteButton } from "@/src/components/primitives/KiteButton";
import { KiteText } from "@/src/components/primitives/KiteText";

export interface VehicleParamEditorProps {
    connection?: MAVLinkConnectorBase;
}

export function VehicleParamEditor(props: VehicleParamEditorProps) {

    const controlStyles = useStyles(controls);

    const [availableParameters, setAvailableParameters] = useState<MAVLinkParameter[]>([]);
    const [totalParameters, setTotalParameters] = useState(0);
    const [filteredParameters, setFilteredParameters] = useState<MAVLinkParameter[]>([]);
    const [filterText, setFilterText] = useState("");
    const [editingParameter, setEditingParameter] = useState<string>();

    useEffect(() => {

        if (!props.connection) {
            return;
        }

        function handleParameterCacheUpdated() {
            setAvailableParameters(props.connection!.getCachedParameters());
            setTotalParameters(props.connection!.availableParamCount);
        }

        setAvailableParameters(props.connection.getCachedParameters());
        setTotalParameters(props.connection.availableParamCount);
        props.connection.on("parameter-cache-updated", handleParameterCacheUpdated);

        return () => {
            if (props.connection) {
                props.connection.off("parameter-cache-updated", handleParameterCacheUpdated);
            }
        };
    }, [props.connection]);

    useEffect(() => {
        if (!filterText) {
            setFilteredParameters(availableParameters);
            return;
        }

        const searchString = filterText.toLowerCase();
        setFilteredParameters(availableParameters.filter(parameter => parameter.name.toLowerCase().includes(searchString)));
    }, [availableParameters, filterText]);

    function handleDownloadParams() {
        setEditingParameter(undefined);

        if (!props.connection) {
            return;
        }

        props.connection.downloadAllParameters(true);
    }

    async function handleSaveValue(parameterID: string, newValue: string) {
        if (props.connection) {
            await props.connection.setParameter(parameterID, Number(newValue));
            setEditingParameter(undefined);
            setAvailableParameters(props.connection.getCachedParameters());
        }
    }

    return <View style={{ flex: 1, backgroundColor: controlStyles.theme.colors.backgroundSecondary }}>
        <View style={{ padding: 10, gap: 5 }}>
            <KiteInput value={filterText} onChangeText={setFilterText} placeholder={"Search..."} placeholderTextColor={controlStyles.theme.colors.typographySecondary} showClearButton />
            <View style={{ gap: 5, flexDirection: "row", alignItems: "center" }}>
                <View style={{paddingLeft:10}}><KiteText>Loaded {availableParameters.length} of {totalParameters}</KiteText></View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}>
                    <KiteButton title="Download Params" color="success" onPress={handleDownloadParams} />
                </View>
            </View>
        </View>
        {/*{availableParameters.map(parameter => <ParamEditorBox key={parameter.name} name={parameter.name} />)}*/}
        <FlashList style={{ width: "100%", height: "100%" }}
                   data={filteredParameters}
                   renderItem={({ item }) => <Pressable onPress={() => {
                       setEditingParameter(item.name);
                   }}>
                       <ParamEditorBox name={item.name}
                                       initialValue={item.value.toString()}
                                       editing={item.name === editingParameter}
                                       onCancel={() => setEditingParameter(undefined)}
                                       onSaveValue={(newValue) => handleSaveValue(item.name, newValue)} />
                   </Pressable>}
                   extraData={editingParameter}
                   keyExtractor={item => item.name}
                   estimatedItemSize={50}
        />
    </View>;
}