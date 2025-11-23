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
            const errorLevel = getRandomErrorLevel(currentSection);

            console.log('🎵 Loading section audio:', currentSection, 'level:', errorLevel);

            // Small delay to ensure previous audio is stopped
            const timeoutId = setTimeout(() => {
                void player.goTo(soundState, errorLevel);
            }, 100);

            return () => clearTimeout(timeoutId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSection, currentPhase, completedChallenges]);

    const handleRestart = () => {
        console.log('🔄 Restarting game...');
        resetGame();
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
        </div>
    );
}
