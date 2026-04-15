import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00ffff] font-sans selection:bg-[#ff00ff] selection:text-black relative overflow-hidden">
      {/* CRT & Noise Overlays */}
      <div className="crt-overlay" />
      <div className="static-noise" />
      
      {/* Glitchy Header */}
      <header className="relative z-10 p-6 border-b-4 border-[#ff00ff] bg-black/80 flex justify-between items-center screen-tear">
        <div className="flex flex-col">
          <h1 
            className="text-4xl font-mono glitch-text uppercase tracking-tighter" 
            data-text="SYSTEM_RECALL::NEON_SNAKE"
          >
            SYSTEM_RECALL::NEON_SNAKE
          </h1>
          <span className="text-[10px] font-mono text-[#ff00ff] animate-pulse">
            STATUS: UNSTABLE // CORE_TEMP: CRITICAL
          </span>
        </div>
        <div className="flex gap-4 text-xs font-mono">
          <span className="border border-[#00ffff] px-2 py-1 hover:bg-[#00ffff] hover:text-black cursor-crosshair transition-all">
            [LOG_OUT]
          </span>
          <span className="border border-[#ff00ff] px-2 py-1 hover:bg-[#ff00ff] hover:text-black cursor-crosshair transition-all">
            [TERMINAL]
          </span>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center justify-center gap-16 min-h-[calc(100vh-120px)]">
        {/* Left Side: Cryptic Data */}
        <div className="hidden xl:flex flex-col gap-12 w-64 font-mono text-[10px] text-[#ff00ff]/60">
          <div className="space-y-4 border-l-2 border-[#00ffff] pl-4">
            <p className="text-[#00ffff] font-bold underline">ENCRYPTION_LAYER_01</p>
            <p>0x4A 0x2F 0x99 0xBC</p>
            <p>0x12 0xEE 0x34 0xAA</p>
            <p>0x90 0x01 0xCF 0x88</p>
          </div>
          
          <div className="space-y-4 border-l-2 border-[#ff00ff] pl-4">
            <p className="text-[#ff00ff] font-bold underline">NEURAL_LINK_SYNC</p>
            <div className="h-1 w-full bg-[#ff00ff]/20 overflow-hidden">
              <motion.div 
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="h-full w-1/3 bg-[#ff00ff]"
              />
            </div>
            <p>LATENCY: 0.002ms</p>
            <p>PACKET_LOSS: 0%</p>
          </div>
        </div>

        {/* Center: Snake Game */}
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="absolute -inset-4 border-2 border-[#00ffff] opacity-20 animate-ping pointer-events-none" />
          <SnakeGame />
        </motion.div>

        {/* Right Side: Music Player */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-12"
        >
          <MusicPlayer />
          
          {/* Cryptic Warning */}
          <div className="p-6 border-2 border-[#ff00ff] bg-black/40 font-mono relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#ff00ff] text-black px-2 text-[8px] font-bold">
              WARNING
            </div>
            <h4 className="text-xs font-bold text-[#ff00ff] mb-4 uppercase tracking-widest">
              PROTOCOL_FAILURE::DETECTED
            </h4>
            <p className="text-[10px] text-[#00ffff]/80 leading-relaxed">
              &gt; SENSORY_INPUT_OVERLOAD_IN_PROGRESS<br/>
              &gt; DO_NOT_ATTEMPT_TO_DISCONNECT<br/>
              &gt; THE_VOID_IS_LISTENING<br/>
              &gt; [REDACTED]
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 border-t-2 border-[#00ffff] bg-black text-center font-mono text-[8px] tracking-[1em] text-[#00ffff]/40">
        VOID_OS_v4.0.4 // NO_RIGHTS_RESERVED // WE_ARE_WATCHING
      </footer>
    </div>
  );
}
