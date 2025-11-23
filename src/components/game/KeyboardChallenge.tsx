import { motion } from 'framer-motion';

interface KeyboardChallengeProps {
    targetKeys: string[];
    pressedKeys: string[];
    timeRemaining: number;
    totalTime: number;
    completedChallenges: number;
    totalChallenges: number;
    correctHits: number;
    incorrectHits: number;
}

export default function KeyboardChallenge({
    targetKeys,
    pressedKeys,
    timeRemaining,
    totalTime,
    completedChallenges,
    totalChallenges,
    correctHits,
    incorrectHits,
}: KeyboardChallengeProps) {
    const progress = (timeRemaining / totalTime) * 100;
    const challengeProgress = (completedChallenges / totalChallenges) * 100;

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
            {/* Stats */}
            <div className="w-full flex justify-between items-center font-arcade text-xs md:text-sm px-4">
                <div className="text-green-400">
                    ACIERTOS: {correctHits}
                </div>
                <div className="text-gray-400">
                    PROGRESO: {completedChallenges}/{totalChallenges}
                </div>
                <div className="text-red-400">
                    FALLOS: {incorrectHits}
                </div>
            </div>

            {/* Progress Bars */}
            <div className="w-full space-y-2 px-4">
                {/* Challenge progress */}
                <div className="w-full h-2 bg-gray-700 border border-blue-900 relative overflow-hidden rounded-full">
                    <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: '0%' }}
                        animate={{ width: `${challengeProgress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {/* Timer bar */}
                <div className="w-full h-4 bg-gray-800 border-2 border-blue-500 relative overflow-hidden rounded-sm shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1, ease: 'linear' }}
                    />
                </div>
            </div>

            {/* Keys Display */}
            <div className="flex flex-wrap justify-center gap-4 min-h-[120px] items-center">
                {targetKeys.map((key, index) => {
                    const isPressed = pressedKeys.includes(key);

                    return (
                        <motion.div
                            key={`${key}-${index}`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: isPressed ? 1.1 : 1,
                                opacity: 1,
                                y: isPressed ? 5 : 0
                            }}
                            className="relative"
                        >
                            <div className={`
                w-20 h-20 md:w-24 md:h-24 
                flex items-center justify-center 
                border-4 
                transition-colors duration-100
                ${isPressed
                                    ? 'bg-green-600 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.6)]'
                                    : 'bg-gradient-to-br from-blue-900 to-slate-900 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                                }
              `}>
                                <span className="text-4xl md:text-5xl font-arcade text-white z-10">
                                    {key}
                                </span>

                                {/* Grid texture */}
                                <div className="absolute inset-0 opacity-20" style={{
                                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
                                }} />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Instruction */}
            <p className="text-xs md:text-sm font-arcade text-blue-300 tracking-widest animate-pulse">
                {targetKeys.length > 1 ? 'PRESIONA SIMULTANEAMENTE' : 'PRESIONA LA TECLA'}
            </p>
        </div>
    );
}
