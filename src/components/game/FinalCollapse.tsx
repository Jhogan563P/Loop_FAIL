import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import r3_sentado from '@/assets/robots/r3_sentado.gif';

interface FinalCollapseProps {
    onRestart: () => void;
}

export default function FinalCollapse({ onRestart }: FinalCollapseProps) {
    const navigate = useNavigate();

    const handleRestart = () => {
        console.log('FinalCollapse: restart button clicked - before onRestart');
        try {
            onRestart(); // Reset game state
            console.log('FinalCollapse: onRestart() executed');
        } catch (err) {
            console.error('FinalCollapse: error calling onRestart', err);
        }

        try {
            console.log('FinalCollapse: navigating to / (welcome page)');
            navigate('/');
            console.log("FinalCollapse: navigate('/') called");
        } catch (err) {
            console.error('FinalCollapse: navigate error', err);
        }
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

                    {/* Volver a la página de inicio (reemplaza botón de reinicio) */}
                    <div className="mt-8 flex items-center gap-4">
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            onClick={() => {
                                console.log('FinalCollapse: volver a la página de inicio clicked');
                                try {
                                    onRestart();
                                    console.log('FinalCollapse: onRestart() executed before navigation');
                                } catch (err) {
                                    console.error('FinalCollapse: error calling onRestart', err);
                                }
                                try {
                                    navigate('/');
                                } catch (err) {
                                    console.error('FinalCollapse: navigate error', err);
                                }
                            }}
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-arcade border-2 border-blue-400 transition-colors shadow-lg shadow-blue-500/50"
                        >
                            VOLVER A LA PÁGINA DE INICIO
                        </motion.button>

                        {/* Optional: quick restart without navigation (keeps on same page) */}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            onClick={() => {
                                console.log('FinalCollapse: reiniciar sin navegar clicked');
                                try {
                                    onRestart();
                                    console.log('FinalCollapse: onRestart() executed (stay on page)');
                                } catch (err) {
                                    console.error('FinalCollapse: error calling onRestart', err);
                                }
                            }}
                            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-arcade border-2 border-gray-600 transition-colors shadow-lg shadow-black/50"
                        >
                            REINICIAR (QUEDARSE)
                        </motion.button>
                    </div>
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
