import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import r3_sentado from '@/assets/robots/r3_sentado.gif';

interface FinalCollapseProps {
    onRestart: () => void;
}

export default function FinalCollapse({ onRestart }: FinalCollapseProps) {
    const navigate = useNavigate();

    const handleRestart = () => {
        console.log('Restart requested');
        onRestart(); // Reset game state
        navigate('/'); // Go to welcome page
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-8"
        >
            {/* Glitch overlay */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-b from-blue-900/50 via-transparent to-blue-900/50 animate-pulse" />
            </div>

            {/* Scanlines */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
                }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-8 max-w-2xl">
                {/* Final robot state - r3_sentado */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                >
                    <img
                        src={r3_sentado}
                        alt="Robot final state"
                        className="max-w-md pixelated"
                    />

                    {/* Chromatic aberration effect */}
                    <div className="absolute inset-0 mix-blend-screen">
                        <div className="w-full h-full bg-red-500 opacity-20 translate-x-1" />
                        <div className="w-full h-full bg-blue-500 opacity-20 -translate-x-1" />
                    </div>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center space-y-6"
                >
                    <h1 className="text-3xl md:text-4xl font-arcade text-blue-400 leading-relaxed">
                        COLAPSO TOTAL
                    </h1>

                    <div className="space-y-4 text-gray-400 font-arcade text-sm leading-relaxed">
                        <p>
                            EL SISTEMA HA FALLADO
                        </p>
                        <p className="text-xs max-w-md">
                            PERO EN EL FRACASO ENCONTRAMOS ARMONIA
                        </p>
                        <p className="text-xs max-w-md text-gray-500">
                            CADA ERROR ES PARTE DEL PROCESO ITERATIVO
                        </p>
                    </div>

                    {/* Restart button */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        onClick={handleRestart}
                        className="mt-8 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-arcade border-2 border-blue-400 transition-colors shadow-lg shadow-blue-500/50 cursor-pointer"
                    >
                        REINTENTAR
                    </motion.button>
                </motion.div>
            </div>

            {/* Distortion effect */}
            <motion.div
                animate={{
                    opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent pointer-events-none"
            />
        </motion.div>
    );
}
