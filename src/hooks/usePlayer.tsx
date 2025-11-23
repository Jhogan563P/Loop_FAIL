import { PlayerContext } from "@/context/context";
import { useContext } from "react";

export const usePlayer = () => {
	const ctx = useContext(PlayerContext);
	if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");

	return ctx;
};
