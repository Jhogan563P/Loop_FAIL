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

    if (phase === 'exploding' || phase === 'challenge-failed') {
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

// Get robot states for all 3 robots based on current section
const getRobotsState = (section: GameSection, phase: GamePhase) => {
    if (section === 'final') {
        return [r3_sentado, r3_sentado, r3_sentado];
    }

    const isExploding = phase === 'exploding' || phase === 'challenge-failed';

    // Robot 1 (left)
    let robot1 = r1_sentado;
    if (section === 1 && isExploding) robot1 = r1_explosion;
    else if (section >= 2) robot1 = r1_explosion; // Already exploded in previous sections

    // Robot 2 (center)
    let robot2 = r1_sentado; // Not active yet
    if (section >= 2) robot2 = r2_cantando;
    if (section === 2 && isExploding) robot2 = r2_explosion;
    else if (section >= 3) robot2 = r2_explosion; // Already exploded

    // Robot 3 (right)
    let robot3 = r1_sentado; // Not active yet
    if (section >= 3) robot3 = r3_cantando;
    if ((section === 3 || section === 4) && isExploding) robot3 = r3_sentado;

    return [robot1, robot2, robot3];
};

export default function RobotDisplay({ section, phase }: RobotDisplayProps) {
    const [robots, setRobots] = useState(getRobotsState(section, phase));
    const [key, setKey] = useState(0);

    useEffect(() => {
        const newRobots = getRobotsState(section, phase);
        console.log('RobotDisplay: changing robots ->', { section, phase, newRobots });
        setRobots(newRobots);
        setKey(prev => prev + 1); // Force re-render of GIFs
    }, [section, phase]);

    return (
        <div className="relative w-full h-full flex items-center justify-center gap-8">
            <AnimatePresence mode="wait">
                {robots.map((robotGif, index) => (
                    <motion.div
                        key={`${key}-${index}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                            opacity: 1,
                            scale: (phase === 'exploding' || phase === 'challenge-failed') ? [1, 1.1, 1] : 1
                        }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                            duration: (phase === 'exploding' || phase === 'challenge-failed') ? 0.5 : 0.3,
                            scale: { duration: 0.5, times: [0, 0.5, 1] },
                            delay: index * 0.1 // Stagger animation
                        }}
                        className="relative"
                    >
                        <img
                            src={robotGif}
                            alt={`Robot ${index + 1}`}
                            className="max-w-full max-h-[300px] object-contain pixelated"
                        />

                        {/* Explosion flash effect */}
                        {(phase === 'exploding' || phase === 'challenge-failed') && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.6, 0] }}
                                transition={{ duration: 0.5, times: [0, 0.3, 1], delay: index * 0.1 }}
                                className="absolute inset-0 bg-red-500 mix-blend-screen"
                            />
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
