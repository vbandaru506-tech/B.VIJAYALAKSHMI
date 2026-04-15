import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2 } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Track } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'VOID_SIGNAL_01',
    artist: 'UNKNOWN_ENTITY',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73456.mp3',
    cover: 'https://picsum.photos/seed/glitch1/200/200',
  },
  {
    id: '2',
    title: 'NEURAL_DECAY',
    artist: 'MACHINE_02',
    url: 'https://cdn.pixabay.com/audio/2022/01/21/audio_31743c58bd.mp3',
    cover: 'https://picsum.photos/seed/glitch2/200/200',
  },
  {
    id: '3',
    title: 'STATIC_DREAM',
    artist: 'CORE_DUMP',
    url: 'https://cdn.pixabay.com/audio/2021/11/25/audio_91b32e02d9.mp3',
    cover: 'https://picsum.photos/seed/glitch3/200/200',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      const newTime = (value[0] / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
  };

  return (
    <div className="w-full max-w-md border-4 border-[#ff00ff] bg-black p-6 relative overflow-hidden screen-tear font-mono">
      <div className="absolute top-0 left-0 bg-[#ff00ff] text-black px-2 text-[8px] font-bold">
        AUDIO_MODULE_v2.1
      </div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />

      <div className="flex items-center gap-6 mb-8">
        <div className="relative w-24 h-24 flex-shrink-0 border-2 border-[#00ffff]">
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover grayscale contrast-150"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-[#00ffff]/20 animate-pulse" />
          )}
        </div>

        <div className="flex flex-col overflow-hidden">
          <h3 className="text-lg font-bold text-[#00ffff] truncate glitch-text" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-[10px] text-[#ff00ff] uppercase tracking-wider">
            SOURCE: {currentTrack.artist}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            onValueChange={handleProgressChange}
            className="cursor-crosshair"
          />
          <div className="flex justify-between text-[8px] text-[#00ffff]/40 uppercase tracking-widest">
            <span>00:00:00</span>
            <span>STREAM_ACTIVE</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevTrack}
            className="text-[#00ffff] hover:bg-[#00ffff] hover:text-black rounded-none border border-[#00ffff]"
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button
            onClick={togglePlay}
            className="bg-transparent border-2 border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black rounded-none w-16 h-16 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextTrack}
            className="text-[#00ffff] hover:bg-[#00ffff] hover:text-black rounded-none border border-[#00ffff]"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-[#ff00ff]/20">
          <Volume2 className="w-3 h-3 text-[#ff00ff]" />
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={(val) => setVolume(val[0])}
            className="w-32"
          />
        </div>
      </div>
    </div>
  );
};
