import { createContext } from "react";import type { ControleContextType, PlayerState } from "../interfaces/context";

export const ControlContext = createContext<ControleContextType>({} as ControleContextType);


export const PlayerContext = createContext<PlayerState | null>(null);