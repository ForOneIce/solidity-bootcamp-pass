import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Play, Pause, Repeat, X, Volume2, VolumeX } from 'lucide-react';

interface LyricLine {
  time: number;
  text: string;
}

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  // Load and parse lyrics
  useEffect(() => {
    fetch('/womenstory.lrc')
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n');
        const parsedLyrics: LyricLine[] = [];
        
        const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
        
        lines.forEach(line => {
          const match = timeRegex.exec(line);
          if (match) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseInt(match[2], 10);
            const milliseconds = parseInt(match[3], 10);
            
            // Convert to seconds
            const time = minutes * 60 + seconds + milliseconds / (match[3].length === 3 ? 1000 : 100);
            const textContent = line.replace(timeRegex, '').trim();
            
            if (textContent) {
              parsedLyrics.push({ time, text: textContent });
            }
          }
        });
        
        setLyrics(parsedLyrics);
      })
      .catch(err => console.error('Failed to load lyrics', err));
  }, []);

  // Listen for custom event to start playing
  useEffect(() => {
    const handlePlayMusic = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(err => console.log('Playback failed:', err));
      }
    };

    window.addEventListener('play-music', handlePlayMusic);
    return () => window.removeEventListener('play-music', handlePlayMusic);
  }, []);

  // Handle time update for lyrics
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const time = audioRef.current.currentTime;
    setCurrentTime(time);

    // Find current lyric
    let newIndex = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (time >= lyrics[i].time) {
        newIndex = i;
      } else {
        break;
      }
    }

    if (newIndex !== currentLyricIndex) {
      setCurrentLyricIndex(newIndex);
      // Scroll to lyric
      if (lyricsContainerRef.current && newIndex !== -1) {
        const container = lyricsContainerRef.current;
        const innerWrapper = container.children[0];
        if (innerWrapper && innerWrapper.children.length > newIndex) {
          const activeElement = innerWrapper.children[newIndex] as HTMLElement;
          container.scrollTo({
            top: activeElement.offsetTop - container.clientHeight / 2 + activeElement.clientHeight / 2,
            behavior: 'smooth'
          });
        }
      }
    }
  };

  const handleEnded = () => {
    if (!isLooping) {
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const toggleLoop = () => {
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
      setIsLooping(!isLooping);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/womenstory.mp3"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Floating Button */}
      <div className="fixed top-1/2 -translate-y-1/2 right-4 lg:right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="group relative"
            >
              <button
                onClick={() => setIsOpen(true)}
                className="bg-white/10 backdrop-blur-md p-3 lg:p-4 rounded-full border border-white/20 shadow-lg hover:bg-white/20 transition-all hover:scale-110 hover:shadow-indigo-500/50 flex items-center justify-center"
              >
                <Music className={`w-5 h-5 lg:w-6 lg:h-6 text-indigo-300 ${isPlaying ? 'animate-pulse' : ''}`} />
                {isPlaying && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-pink-500 rounded-full animate-ping"></span>
                )}
              </button>
              
              {/* Tooltip */}
              <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 px-3 py-1.5 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-sm border border-white/10">
                《我们的故事》
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded Player */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="absolute top-1/2 -translate-y-1/2 right-0 w-72 sm:w-80 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden flex flex-col origin-right"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-indigo-300" />
                  <span className="text-sm font-medium text-white">我们的故事</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Visualizer & Lyrics */}
              <div className="p-4 flex flex-col gap-4">
                {/* Visualizer (CSS based) */}
                <div className="flex items-end justify-center gap-1 h-12">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 bg-gradient-to-t from-indigo-500 to-pink-400 rounded-t-sm"
                      animate={isPlaying ? {
                        height: ['20%', '100%', '40%', '80%', '30%']
                      } : { height: '10%' }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: 'easeInOut',
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </div>

                {/* Lyrics Scroller */}
                <div 
                  ref={lyricsContainerRef}
                  className="h-24 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative mask-image-fade"
                  style={{
                    maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
                  }}
                >
                  <div className="py-10 flex flex-col gap-2">
                    {lyrics.length > 0 ? lyrics.map((lyric, index) => (
                      <p 
                        key={index}
                        className={`text-center text-sm transition-all duration-300 ${
                          index === currentLyricIndex 
                            ? 'text-white font-medium scale-105 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
                            : 'text-white/40 scale-95'
                        }`}
                      >
                        {lyric.text}
                      </p>
                    )) : (
                      <p className="text-center text-sm text-white/40">加载歌词中...</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="p-4 bg-black/30 flex items-center justify-center gap-6">
                <button 
                  onClick={toggleMute}
                  className={`transition-colors ${isMuted ? 'text-pink-400' : 'text-white/70 hover:text-white'}`}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                
                <button 
                  onClick={togglePlay}
                  className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full border border-white/20 text-white transition-all hover:scale-105"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                </button>
                
                <button 
                  onClick={toggleLoop}
                  className={`transition-colors ${isLooping ? 'text-indigo-400' : 'text-white/70 hover:text-white'}`}
                >
                  <Repeat className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
