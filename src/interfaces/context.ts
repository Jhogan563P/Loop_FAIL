import type {  SoundState } from "./control";
import type { ErrorLevel, Song } from "./sound";

export interface ControleContextType {
    soundState: SoundState;
    setSoundState: (state: SoundState) => void;
    errorState: ErrorLevel;
    setErrorState: (state: ErrorLevel) => void;

    //if we have to implement more, just edit this interface
}


export interface SlideRef { songIndex: number; sectionIndex: number };

export interface PlayerState {
    currentSong: Song;
    currentSoundState: SoundState;
    currentErrorLevel: ErrorLevel;
    isPlaying: boolean;
    durationMs: number;
    positionMs: number;
    volume: number;
    isMuted: boolean;
    totalSongs: number;

    setErrorLevel: (level: ErrorLevel) => void;
    getPositionMs: () => number;
    play: () => Promise<void>;
    pause: () => Promise<void>;
    togglePlay: () => Promise<void>;
    goTo: (section: SoundState, errorLevel: ErrorLevel) => Promise<void>;
    setVolume: (v: number) => void;
    mute: () => void;
    unmute: () => void;
    setPositionMs: (ms: number) => void;
};