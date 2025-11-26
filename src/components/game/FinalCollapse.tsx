import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import r3_sentado from '@/assets/robots/r3_sentado.gif';

interface FinalCollapseProps {
    onRestart: () => void;
}

export default function FinalCollapse({ onRestart }: FinalCollapseProps) {
    const navigate = useNavigate();

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
            <div className="relative z-10 flex items-center justify-center w-full h-full max-w-4xl px-8">
                {/* Robot image as background layer */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <img
                        src={r3_sentado}
                        alt="Robot final state"
                        className="max-w-2xl max-h-[80vh] object-contain pixelated opacity-40"
                    />

                    {/* Chromatic aberration effect */}
                    <div className="absolute inset-0 mix-blend-screen pointer-events-none">
                        <div className="w-full h-full bg-red-500 opacity-10 translate-x-1" />
                    </div>
                </motion.div>

                {/* Overlay menu - positioned on top of robot */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="relative z-20 text-center space-y-8 bg-black/70 backdrop-blur-sm border-4 border-blue-500/50 p-8 md:p-12 shadow-[0_0_40px_rgba(59,130,246,0.4)] max-w-2xl"
                >
                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-arcade text-blue-400 leading-relaxed drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">
                        COLAPSO TOTAL
                    </h1>

                    {/* Messages */}
                    <div className="space-y-4 text-gray-300 font-arcade text-sm md:text-base leading-relaxed">
                        <p className="text-red-400 animate-pulse">
                            EL SISTEMA HA FALLADO
                        </p>
                        <p className="text-xs md:text-sm">
                            PERO EN EL FRACASO ENCONTRAMOS ARMONIA
                        </p>
                        <p className="text-xs text-gray-500">
                            CADA ERROR ES PARTE DEL PROCESO ITERATIVO
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
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
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-arcade text-sm border-2 border-blue-400 transition-all shadow-lg shadow-blue-500/50 w-full md:w-auto"
                        >
                            MENU PRINCIPAL
                        </motion.button>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                console.log('FinalCollapse: reiniciar sin navegar clicked');
                                try {
                                    onRestart();
                                    console.log('FinalCollapse: onRestart() executed (stay on page)');
                                } catch (err) {
                                    console.error('FinalCollapse: error calling onRestart', err);
                                }
                            }}
                            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-arcade text-sm border-2 border-gray-600 transition-all shadow-lg shadow-black/50 w-full md:w-auto"
                        >
                            REINTENTAR
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