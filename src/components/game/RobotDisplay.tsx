import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { GameSection } from '@/hooks/useGameState';
import type { GamePhase } from '@/hooks/useGameState';

// Import robot GIFs
import r1_sentado from '@/assets/robots/r1_sentado.gif';
import r1_explosion from '@/assets/robots/r1_explosion.gif';
import r2_cantando from '@/assets/robots/r2_cantando.gif';
import r2_explosion from '@/assets/robots/r2_explosion.gif';
import r3_cantando from '@/assets/robots/r3_cantando.gif';
import r3_sentado from '@/assets/robots/r3_sentado.gif';

interface RobotDisplayProps {
    section: GameSection;
    phase: GamePhase;
}

// Correct sequence: r1_sentado -> r1_explosion -> r2_cantando -> r2_explosion -> r3_cantando -> r3_sentado (final)
const getRobotGif = (section: GameSection, phase: GamePhase): string => {
    if (section === 'final') return r3_sentado;

    if (phase === 'exploding') {
        // Show explosion for current section
        if (section === 1) return r1_explosion;
        if (section === 2) return r2_explosion;
        if (section === 3 || section === 4) return r3_sentado; // Final explosion shows r3_sentado
    }

    // Playing phase - show correct robot
    if (section === 1) return r1_sentado;
    if (section === 2) return r2_cantando;
    if (section === 3 || section === 4) return r3_cantando;

    return r1_sentado;
};

export default function RobotDisplay({ section, phase }: RobotDisplayProps) {
    const [currentRobot, setCurrentRobot] = useState(getRobotGif(section, phase));
    const [key, setKey] = useState(0);

    useEffect(() => {
        const newRobot = getRobotGif(section, phase);
        console.log('RobotDisplay: changing robot gif ->', { section, phase, newRobot });
        setCurrentRobot(newRobot);
        setKey(prev => prev + 1); // Force re-render of GIF
    }, [section, phase]);

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                        opacity: 1,
                        scale: phase === 'exploding' ? [1, 1.1, 1] : 1
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                        duration: phase === 'exploding' ? 0.5 : 0.3,
                        scale: { duration: 0.5, times: [0, 0.5, 1] }
                    }}
                    className="relative"
                >
                    <img
                        src={currentRobot}
                        alt={`Robot ${phase === 'exploding' ? 'explosion' : 'estado'} ${section}`}
                        className="max-w-full max-h-[400px] object-contain pixelated"
                    />

                    {/* Explosion flash effect */}
                    {phase === 'exploding' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.6, 0] }}
                            transition={{ duration: 0.5, times: [0, 0.3, 1] }}
                            className="absolute inset-0 bg-red-500 mix-blend-screen"
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
