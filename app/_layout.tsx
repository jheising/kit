import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Inter_400Regular, useFonts } from "@expo-google-fonts/inter";
import { RedHatMono_400Regular } from "@expo-google-fonts/red-hat-mono";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "../styles/unistyles";
import { useStyles } from "react-native-unistyles";
import { primitives } from "@/styles/styles";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

export default function RootLayout() {
    const { styles } = useStyles(primitives);

    const [loaded, error] = useFonts({
        Inter_400Regular,
        RedHatMono_400Regular
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return <ActionSheetProvider>
        <GestureHandlerRootView style={[{ flex: 1 }]}>
            <Drawer>
                <Drawer.Screen
                    name="index" // This is the name of the page and must match the url from root
                    options={{
                        drawerLabel: "Home",
                        title: "overview"
                    }}
                />
                <Drawer.Screen
                    name="vehicle/[id]" // This is the name of the page and must match the url from root
                    options={{
                        drawerLabel: "Vehicle",
                        title: "Vehicle"
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    </ActionSheetProvider>;
}
