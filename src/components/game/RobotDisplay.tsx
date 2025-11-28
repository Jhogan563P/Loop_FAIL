import { motion } from 'framer-motion';
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
    incorrectHits?: number; // To track which robot should explode
}

// Get robot states for all 3 robots based on current section and error count
const getRobotsState = (section: GameSection, phase: GamePhase, incorrectHits: number = 0) => {
    if (section === 'final') {
        return [r3_sentado, r3_sentado, r3_sentado];
    }

    // Section 5: All 3 robots singing (victory)
    if (section === 5) {
        return [r3_cantando, r3_cantando, r3_cantando];
    }

    const isChallengeFailed = phase === 'challenge-failed';
    
    // Sections 1 & 2: Use r1_explosion for explosions, r2_cantando after
    if (section === 1 || section === 2) {
        let robot1 = r1_sentado;
        let robot2 = r1_sentado;
        let robot3 = r1_sentado;

        if (incorrectHits > 0) {
            // Determine which robot is currently exploding (left to right: 1st error=left, 2nd=center, 3rd=right)
            const currentExplodingIndex = ((incorrectHits - 1) % 3); // 0=left, 1=center, 2=right
            
            if (isChallengeFailed) {
                // During explosion phase: show explosion on current robot, r2_cantando on previous ones
                if (currentExplodingIndex === 0) {
                    robot1 = r1_explosion;
                } else if (currentExplodingIndex === 1) {
                    robot1 = r2_cantando;
                    robot2 = r1_explosion;
                } else if (currentExplodingIndex === 2) {
                    robot1 = r2_cantando;
                    robot2 = r2_cantando;
                    robot3 = r1_explosion;
                }
            } else {
                // Playing phase: show r2_cantando for all robots that have already exploded
                if (incorrectHits >= 1) robot1 = r2_cantando;
                if (incorrectHits >= 2) robot2 = r2_cantando;
                if (incorrectHits >= 3) robot3 = r2_cantando;
            }
        }

        return [robot1, robot2, robot3];
    }

    // Section 3: Start with r2_cantando, explosion r2_explosion, stay r2_cantando
    if (section === 3) {
        let robot1 = r2_cantando;
        let robot2 = r2_cantando;
        let robot3 = r2_cantando;

        if (incorrectHits > 0 && isChallengeFailed) {
            // During explosion phase: show r2_explosion on current robot
            const currentExplodingIndex = ((incorrectHits - 1) % 3);
            
            if (currentExplodingIndex === 0) {
                robot1 = r2_explosion;
            } else if (currentExplodingIndex === 1) {
                robot2 = r2_explosion;
            } else if (currentExplodingIndex === 2) {
                robot3 = r2_explosion;
            }
        }
        // All robots stay r2_cantando during playing phase

        return [robot1, robot2, robot3];
    }

    // Section 4: Start with r2_cantando, explosion r2_explosion, change to r3_cantando
    if (section === 4) {
        let robot1 = r2_cantando;
        let robot2 = r2_cantando;
        let robot3 = r2_cantando;

        if (incorrectHits > 0) {
            // Determine which robot is currently exploding (left to right)
            const currentExplodingIndex = ((incorrectHits - 1) % 3);
            
            if (isChallengeFailed) {
                // During explosion phase: show r2_explosion on current robot, r3_cantando on previous ones
                if (currentExplodingIndex === 0) {
                    robot1 = r2_explosion;
                } else if (currentExplodingIndex === 1) {
                    robot1 = r3_cantando;
                    robot2 = r2_explosion;
                } else if (currentExplodingIndex === 2) {
                    robot1 = r3_cantando;
                    robot2 = r3_cantando;
                    robot3 = r2_explosion;
                }
            } else {
                // Playing phase: show r3_cantando for all robots that have already exploded
                if (incorrectHits >= 1) robot1 = r3_cantando;
                if (incorrectHits >= 2) robot2 = r3_cantando;
                if (incorrectHits >= 3) robot3 = r3_cantando;
            }
        }

        return [robot1, robot2, robot3];
    }

    return [r1_sentado, r1_sentado, r1_sentado];
};

export default function RobotDisplay({ section, phase, incorrectHits = 0 }: RobotDisplayProps) {
    const [robots, setRobots] = useState(getRobotsState(section, phase, incorrectHits));
    const [key, setKey] = useState(0);

    useEffect(() => {
        const newRobots = getRobotsState(section, phase, incorrectHits);
        console.log('RobotDisplay: changing robots ->', { section, phase, incorrectHits, newRobots });
        setRobots(newRobots);
        setKey(prev => prev + 1); // Force re-render of GIFs
    }, [section, phase, incorrectHits]);

    return (
        <div className="relative w-full h-full flex items-center justify-center gap-8">
            {/* Robots */}
            {robots.map((robotGif, index) => {
                const explodingRobotIndex = (incorrectHits - 1) % 3;
                const isThisRobotExploding = phase === 'challenge-failed' && explodingRobotIndex === index;
                
                return (
                    <motion.div
                        key={`${key}-${index}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                            opacity: 1,
                            scale: isThisRobotExploding ? [1, 1.1, 1] : 1
                        }}
                        transition={{
                            duration: isThisRobotExploding ? 0.5 : 0.3,
                            scale: { duration: 0.5, times: [0, 0.5, 1] },
                            delay: section === 5 ? index * 0.3 + 1.5 : index * 0.1
                        }}
                        className="relative z-0"
                    >
                        <img
                            src={robotGif}
                            alt={`Robot ${index + 1}`}
                            className="max-w-full max-h-[300px] object-contain pixelated"
                        />

                        {/* Explosion flash effect - only on the exploding robot */}
                        {isThisRobotExploding && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.6, 0] }}
                                transition={{ duration: 0.5, times: [0, 0.3, 1] }}
                                className="absolute inset-0 bg-red-500 mix-blend-screen"
                            />
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}
