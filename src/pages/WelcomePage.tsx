import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import r1_cantando from '@/assets/robots/r1_cantando.gif';

export default function WelcomePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[url('@/assets/images/bgCanvas.png')] opacity-20 bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/20 to-black" />

            {/* Scanlines */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
                }}
            />

            <div className="relative z-10 flex flex-col items-center gap-12">
                {/* Title */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-6xl md:text-8xl font-arcade text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-600 filter drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                        LOOP FAIL
                    </h1>
                    <p className="text-blue-200 font-arcade text-sm md:text-base tracking-widest animate-pulse">
                        PRESS START TO FAIL
                    </p>
                </motion.div>

                {/* Robot GIF */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative"
                >
                    <img
                        src={r1_cantando}
                        alt="Robot Cantando"
                        className="w-48 h-48 object-contain pixelated"
                    />
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                </motion.div>

                {/* Start Button */}
                <motion.button
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/play')}
                    className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white font-arcade text-xl border-4 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all group relative overflow-hidden"
                >
                    <span className="relative z-10">JUGAR</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </motion.button>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 text-gray-500 font-arcade text-xs">
                © 2025 LOOP FAIL SYSTEM
            </div>
        </div>
    );
}