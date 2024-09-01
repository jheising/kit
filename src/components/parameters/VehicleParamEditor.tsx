import { MAVLinkConnectorBase, MAVLinkParameter } from "@/src/MAVLink/connectors/MAVLinkConnectorBase";
import { ParamEditorBox } from "@/src/components/parameters/ParamEditorBox";
import { Button, Pressable, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { useStyles } from "react-native-unistyles";
import { controls } from "@/styles/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export interface VehicleParamEditorProps {
    connection?: MAVLinkConnectorBase;
}

export function VehicleParamEditor(props: VehicleParamEditorProps) {

    const controlStyles = useStyles(controls);

    const [availableParameters, setAvailableParameters] = useState<MAVLinkParameter[]>([]);
    const [filteredParameters, setFilteredParameters] = useState<MAVLinkParameter[]>([]);
    const [filterText, setFilterText] = useState("");
    const [editingParameter, setEditingParameter] = useState<string>();

    useEffect(() => {

        setEditingParameter(undefined);

        if (!filterText) {
            setFilteredParameters(availableParameters);
            return;
        }

        const searchString = filterText.toLowerCase();
        setFilteredParameters(availableParameters.filter(parameter => parameter.name.toLowerCase().includes(searchString)));
    }, [availableParameters, filterText]);

    function handleClearSearch() {
        setFilterText("");
    }

    async function handleSaveValue(parameterID: string, newValue: string) {
        if (props.connection) {
            await props.connection.setParameter(parameterID, Number(newValue));
            setEditingParameter(undefined);
            setAvailableParameters(props.connection.getCachedParameters());
        }
    }

    return <View style={{ flex: 1, backgroundColor: controlStyles.theme.colors.backgroundSecondary }}>
        <Button title="Refresh Params" onPress={() => {
            if (props.connection) {
                setAvailableParameters(props.connection.getCachedParameters());
            }
        }} />
        <View>
            <TextInput style={[controlStyles.styles.input, { margin: 20 }]} value={filterText} onChangeText={setFilterText} placeholder={"Search..."} placeholderTextColor={controlStyles.theme.colors.typographySecondary} />
            <Pressable style={{ position: "absolute", right: 30, height: "100%", alignItems: "center", justifyContent: "center", opacity: 0.5 }} onPress={handleClearSearch}>
                <MaterialCommunityIcons name="close-circle" size={18}
                                        color={controlStyles.theme.colors.typographySecondary} />
            </Pressable>
        </View>
        {/*{availableParameters.map(parameter => <ParamEditorBox key={parameter.name} name={parameter.name} />)}*/}
        <FlashList style={{ width: "100%", height: "100%" }}
                   data={filteredParameters}
                   renderItem={({ item }) => <Pressable onPress={() => {
                       setEditingParameter(item.name);
                   }}>
                       <ParamEditorBox name={item.name}
                                       value={item.value.toString()}
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