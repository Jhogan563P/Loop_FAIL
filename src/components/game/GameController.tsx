import { useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import type { GameSection } from '@/hooks/useGameState';
import { usePlayer } from '@/hooks/usePlayer';
import RobotDisplay from './RobotDisplay';
import KeyboardChallenge from './KeyboardChallenge';
import FinalCollapse from './FinalCollapse';
import type { ErrorLevel } from '@/interfaces/sound';

type SoundState = "seccion1" | "seccion2" | "seccion3" | "seccion4";

const getSoundState = (section: GameSection): SoundState => {
    if (section === 'final') return 'seccion4';
    return `seccion${section}` as SoundState;
};

const getRandomErrorLevel = (section: GameSection): ErrorLevel => {
    if (section === 'final') return 4;
    if (section === 1 || section === 2) {
        return Math.floor(Math.random() * 3) as ErrorLevel;
    }
    return Math.floor(Math.random() * 5) as ErrorLevel;
};

export default function GameController() {
    const {
        currentSection,
        currentPhase,
        totalChallenges,
        completedChallenges,
        correctHits,
        incorrectHits,
        currentKeys,
        pressedKeys,
        challengeTimeLimit,
        timeRemaining,
        resetGame,
        startSectionChallenges,
        sectionOnePassedHalf,
        markSectionOneHalfPassed,
    } = useGameState();

    const player = usePlayer();

    // Handle section changes - play music continuously
    useEffect(() => {
        if (currentSection === 'final') {
            void player.pause();
            return;
        }

        // Only load new audio when section changes and we are at the start
        if (currentPhase === 'playing' && completedChallenges === 0) {
            const soundState = getSoundState(currentSection);

            // Section 1 special: start with no-error variant for the first playback.
            const isSectionOne = currentSection === 1;
            const initialError = isSectionOne ? 0 : getRandomErrorLevel(currentSection);

            console.log('🎵 Loading section audio:', currentSection, 'initial level:', initialError);

            // Small delay to ensure previous audio is stopped
            const timeoutId = setTimeout(() => {
                void player.goTo(soundState, initialError);
            }, 100);

            return () => clearTimeout(timeoutId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSection, currentPhase, completedChallenges]);

    // Watch for section 1 midpoint to trigger second pass: enable challenges and switch variant
    useEffect(() => {
        if (currentSection !== 1) return;
        if (sectionOnePassedHalf) return;

        // player's positionMs updated from PlayerContext; poll via interval if not provided
        const checkInterval = setInterval(() => {
            try {
                const pos = (player.positionMs ?? player.getPositionMs?.() ?? 0) as number;
                // when we reach half of section 1 (50s total -> 25s = 25000ms)
                if (pos >= 25000) {
                    console.log('Section 1 half reached, switching to error variant and starting challenges');
                    // switch to error-heavy variant (error level 2) and start challenges
                    if (typeof player.setErrorLevel === 'function') player.setErrorLevel(2);
                    // reload fragment and keep playing from same position is handled in the player provider
                    if (typeof player.play === 'function') void player.play();
                    // start the 2 challenges for section 1
                    startSectionChallenges(1);
                    markSectionOneHalfPassed();
                }
            } catch (e) {
                // ignore
            }
        }, 250);

        return () => clearInterval(checkInterval);
    }, [currentSection, sectionOnePassedHalf, player, startSectionChallenges, markSectionOneHalfPassed]);

    const handleRestart = () => {
        console.log('🔄 Restarting game...');
        resetGame();
        // Reset audio/error state in player so playback restarts cleanly
        try {
            if (typeof player.setErrorLevel === 'function') player.setErrorLevel(0);
            // Ensure player navigates to section 1 with no errors
            void player.goTo('seccion1', 0);
        } catch (e) {
            console.warn('Player restart helpers not available', e);
        }
    };

    if (currentSection === 'final') {
        return <FinalCollapse onRestart={handleRestart} />;
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 relative overflow-hidden">
            {/* Scanlines */}
            <div
                className="absolute inset-0 opacity-5 pointer-events-none z-10"
                style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
                }}
            />

            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-50 pointer-events-none z-10" />

            {/* Content */}
            <div className="relative z-20 min-h-screen flex flex-col items-center justify-between p-8">
                {/* Header */}
                <div className="w-full max-w-4xl flex justify-between items-center">
                    <div className="font-arcade text-blue-400 text-xs">
                        SECCION {currentSection}/4
                    </div>
                    <div className="font-arcade text-gray-500 text-xs">
                        {currentPhase === 'exploding' ? 'EXPLOSION' : `ERROR NIVEL ${player.currentErrorLevel}`}
                    </div>
                </div>

                {/* Robot Display */}
                <div className="flex-1 flex items-center justify-center w-full max-w-2xl">
                    <RobotDisplay section={currentSection} phase={currentPhase} />
                </div>

                {/* Keyboard Challenge or Explosion Message */}
                <div className="w-full max-w-4xl flex flex-col items-center gap-4 pb-8">
                    {currentPhase === 'playing' && (
                        <KeyboardChallenge
                            targetKeys={currentKeys}
                            pressedKeys={pressedKeys}
                            timeRemaining={timeRemaining}
                            totalTime={challengeTimeLimit}
                            completedChallenges={completedChallenges}
                            totalChallenges={totalChallenges}
                            correctHits={correctHits}
                            incorrectHits={incorrectHits}
                        />
                    )}
                    {currentPhase === 'exploding' && (
                        <div className="h-32 flex flex-col items-center justify-center gap-2">
                            <p className="font-arcade text-red-500 text-sm animate-pulse">
                                SISTEMA FALLANDO...
                            </p>
                            <p className="font-arcade text-gray-400 text-xs">
                                ACIERTOS: {correctHits}/{totalChallenges}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pixel grid */}
            <div
                className="absolute inset-0 opacity-5 pointer-events-none z-5"
                style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(59, 130, 246, 0.1) 4px, rgba(59, 130, 246, 0.1) 8px)',
                }}
            />

            {/* Red flash during explosion */}
            {currentPhase === 'exploding' && (
                <div className="absolute inset-0 bg-red-900 opacity-20 animate-pulse pointer-events-none z-30" />
            )}

            {/* Pending play overlay: appears when autoplay was blocked */}
            {player.pendingPlay && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50">
                    <div className="bg-slate-900/90 p-6 rounded-md border-2 border-blue-600 text-center">
                        <p className="font-arcade text-white mb-4">Haz click para activar el audio</p>
                        <button
                            onClick={() => {
                                console.log('User clicked to allow audio');
                                if (typeof player.requestUserPlay === 'function') player.requestUserPlay();
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-arcade rounded"
                        >
                            Activar audio
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
