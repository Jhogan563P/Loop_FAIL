import { useState } from "react";
import type { SoundState } from "../interfaces/control";
import { ControlContext } from "./context";
import type { ErrorLevel } from "@/interfaces/sound";

export default function ControlContextProvider({children} : {children: React.ReactNode}) {

    const [soundState, setSoundState] = useState<SoundState>('seccion1');
    const [errorState, setErrorState] = useState<ErrorLevel>(0);

    return (
        <ControlContext.Provider value={{ soundState, setSoundState, errorState, setErrorState }}>
            {children}
        </ControlContext.Provider>
    );
}
