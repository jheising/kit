import { useActionSheet } from "@expo/react-native-action-sheet";
import { ActionSheetOptions } from "@expo/react-native-action-sheet/lib/typescript/types";
import { useStyles } from "react-native-unistyles";
import { controls, primitives } from "@/styles/styles";

export function useStyledActionSheet() {
    const { showActionSheetWithOptions } = useActionSheet();
    const controlStyles = useStyles(controls);
    const primitiveStyles = useStyles(primitives);

    return {
        showActionSheetWithOptions: (options: ActionSheetOptions, callback: (i?: number) => void | Promise<void>) => {
            showActionSheetWithOptions({
                ...options,
                textStyle: primitiveStyles.styles.text,
                titleTextStyle: primitiveStyles.styles.text,
                messageTextStyle: primitiveStyles.styles.secondaryText,
                destructiveColor: primitiveStyles.theme.colors.danger,
                tintColor: primitiveStyles.theme.colors.success,
                cancelButtonTintColor: primitiveStyles.theme.colors.typographySecondary,
                containerStyle: {
                    backgroundColor: primitiveStyles.theme.colors.backgroundSecondary
                }
            }, callback);
        }
    };
}