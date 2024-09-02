import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Poppins_400Regular, useFonts } from "@expo-google-fonts/poppins";
import { RedHatMono_400Regular } from "@expo-google-fonts/red-hat-mono";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "../styles/unistyles";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

export default function RootLayout() {
    const [loaded, error] = useFonts({
        Poppins_400Regular,
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
