import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '@/hooks/useGameState';
import type { GameSection } from '@/hooks/useGameState';
import { usePlayer } from '@/hooks/usePlayer';
import RobotDisplay from './RobotDisplay';
import KeyboardChallenge from './KeyboardChallenge';
import FinalCollapse from './FinalCollapse';
import type { ErrorLevel } from '@/interfaces/sound';
import type { SoundState } from '@/interfaces/control';

const getSoundState = (section: GameSection): SoundState => {
    if (section === 'final') return 'seccion4';
    if (section === 5) return 'seccion5';
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
        currentErrorLevel,
        totalChallenges,
        completedChallenges,
        correctHits,
        incorrectHits,
        currentKeys,
        pressedKeys,
        challengeTimeLimit,
        timeRemaining,
        sectionTimeRemaining,
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
        const shouldLoadAudio = currentPhase === 'playing' && completedChallenges === 0;
        
        if (shouldLoadAudio) {
            const soundState = getSoundState(currentSection);

            // Section 1 and 5 special: start with no-error variant
            const isSectionOne = currentSection === 1;
            const isSectionFive = currentSection === 5;
            const initialError = (isSectionOne || isSectionFive) ? 0 : getRandomErrorLevel(currentSection);

            console.log('🎵 Loading section audio:', currentSection, 'initial level:', initialError);
            void player.goTo(soundState, initialError);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSection, currentPhase, completedChallenges]);

    // Update player error level when game state error level changes
    useEffect(() => {
        if (currentSection === 'final') return;
        if (currentPhase === 'exploding') return; // Don't update during section transition
        if (completedChallenges === 0) return; // Don't update at the start of a section
        
        console.log('🎚️ Updating player error level to:', currentErrorLevel, 'Section:', currentSection);
        if (typeof player.setErrorLevel === 'function') {
            player.setErrorLevel(currentErrorLevel);
            // Play after changing error level to ensure audio continues
            if (typeof player.play === 'function') {
                void player.play();
            }
        }
    }, [currentErrorLevel, currentSection, currentPhase, player, completedChallenges]);

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
                    console.log('Section 1 half reached, starting challenges');
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
                {/* Header - Hide in section 5 */}
                {currentSection !== 5 && (
                    <div className="w-full max-w-4xl flex justify-between items-center">
                        <div className="font-arcade text-blue-400 text-xs">
                            SECCION {currentSection}/4
                        </div>
                        <div className="font-arcade text-gray-500 text-xs">
                            {(currentPhase === 'exploding' || currentPhase === 'challenge-failed') ? 'EXPLOSION' : `ERROR NIVEL ${currentErrorLevel}`}
                        </div>
                    </div>
                )}

                {/* Section Progress Bar - Hide in section 5 */}
                {typeof currentSection === 'number' && currentSection !== 5 && (
                    <div className="w-full max-w-4xl mb-8 px-4">
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 shadow-lg">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-arcade text-blue-400 text-xs tracking-wider">
                                    TIEMPO DE SECCIÓN
                                </span>
                                <span className="font-arcade text-blue-300 text-xl tabular-nums">
                                    {Math.ceil(sectionTimeRemaining)}s
                                </span>
                            </div>
                            <div className="w-full h-3 bg-gray-800/80 rounded-full overflow-hidden border border-blue-500/50 shadow-inner">
                                <div 
                                    className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 transition-all duration-100 relative"
                                    style={{ 
                                        width: `${(sectionTimeRemaining / ([21, 24, 33, 24][currentSection - 1] || 21)) * 100}%` 
                                    }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Robot Display */}
                <div className="flex-1 flex items-center justify-center w-full max-w-2xl">
                    <RobotDisplay section={currentSection} phase={currentPhase} incorrectHits={incorrectHits} />
                </div>

                {/* Keyboard Challenge or Explosion Message - Hide in section 5 */}
                {currentSection !== 5 && totalChallenges > 0 && (
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
                        {currentPhase === 'challenge-failed' && (
                            <div className="h-32 flex flex-col items-center justify-center gap-2">
                                <p className="font-arcade text-red-500 text-xl animate-pulse">
                                    ¡ERROR!
                                </p>
                                <p className="font-arcade text-orange-400 text-xs">
                                    NIVEL DE ERROR AUMENTADO
                                </p>
                            </div>
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
                )}
            </div>

            {/* Section 5: Full-screen black overlay that fades out */}
            {currentSection === 5 && (
                <div className="absolute inset-0 z-[100] pointer-events-none">
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute inset-0 bg-black"
                    />
                </div>
            )}

            {/* Pixel grid */}
            <div
                className="absolute inset-0 opacity-5 pointer-events-none z-5"
                style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(59, 130, 246, 0.1) 4px, rgba(59, 130, 246, 0.1) 8px)',
                }}
            />

            {/* Red flash during explosion or challenge failure */}
            {(currentPhase === 'exploding' || currentPhase === 'challenge-failed') && (
                <div className="absolute inset-0 bg-red-900 opacity-20 animate-pulse pointer-events-none z-30" />
            )}

            {/* Pending play overlay: appears when autoplay was blocked */}
            {player.pendingPlay && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
                    <div className="bg-gray-900/95 p-8 rounded-lg border-4 border-blue-500 text-center shadow-[0_0_40px_rgba(59,130,246,0.6)] max-w-md">
                        <div className="mb-6">
                            <div className="text-6xl mb-4 animate-pulse">🔊</div>
                            <p className="font-arcade text-blue-400 text-xl mb-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">
                                AUDIO REQUERIDO
                            </p>
                            <p className="font-arcade text-gray-300 text-sm mb-4">
                                El juego está pausado
                            </p>
                            <p className="font-arcade text-gray-400 text-xs">
                                Haz clic para activar el audio y continuar
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                console.log('User clicked to allow audio');
                                if (typeof player.requestUserPlay === 'function') player.requestUserPlay();
                            }}
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-arcade text-lg rounded border-2 border-blue-400 transition-all shadow-lg shadow-blue-500/50 animate-pulse"
                        >
                            ACTIVAR AUDIO
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
