import { ControlContext } from "@/context/context";
import { useContext } from "react";

export default function useControlGame() {
    const controlContextData = useContext(ControlContext);

    if (!controlContextData) {
        throw new Error("useControlGame must be used within ControlContextProvider");
    }


    return controlContextData;
}