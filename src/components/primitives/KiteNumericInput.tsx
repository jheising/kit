import { KiteInput } from "@/src/components/primitives/KiteInput";
import { useState } from "react";

export function KiteNumericInput(props: {
    autoFocus?:boolean;
    initialValue?: number | string;
    onChangeNumber?: (value:number) => void;
}) {
    const [value, setValue] = useState(props.initialValue?.toString() ?? "");

    function handleChangeText(text: string) {
        text = (text ?? "0").replace(/[^\d-.]/g, "");
        setValue(text);

        const numberValue = Number(text);

        if (!isNaN(numberValue)) {
            props.onChangeNumber?.(numberValue);
        }
    }

    return <KiteInput value={value} onChangeText={handleChangeText} inputMode={"decimal"} autoFocus={props.autoFocus} />
}