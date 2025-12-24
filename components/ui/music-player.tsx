"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { IconPlayerPlay, IconPlayerPause, IconVolume, IconVolumeOff } from "@tabler/icons-react";

interface MusicData {
  title: string;
  singer: string;
  music: string;
  cover: string;
}

export const MusicPlayer = () => {
  const [musicData, setMusicData] = useState<MusicData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // 通过代理获取歌曲信息
    fetch("/api/music?msg=雨爱(人声弱化1.05x)&n=1")
      .then((res) => res.json())
      .then((data) => {
        if (data.music) {
          // 将音频 URL 也通过代理
          const proxyAudioUrl = `/api/audio?url=${encodeURIComponent(data.music)}`;
          setMusicData({
            title: data.title,
            singer: data.singer,
            music: proxyAudioUrl, // 使用代理后的音频 URL
            cover: data.cover,
          });
        }
      })
      .catch((error) => console.error("Error fetching music:", error));
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!musicData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.div
        animate={{ width: isExpanded ? "auto" : "64px" }}
        transition={{ duration: 0.3 }}
        className="bg-neutral-900/90 backdrop-blur-md rounded-lg shadow-lg border border-white/10 overflow-hidden"
      >
        {/* 音频通过我们的代理服务器请求 */}
        <audio
          ref={audioRef}
          src={musicData.music}
          loop
          onEnded={() => setIsPlaying(false)}
        />
        
        <div className="flex items-center p-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0"
          >
            <img
              src={musicData.cover}
              alt={musicData.title}
              className="w-12 h-12 rounded object-cover hover:opacity-80 transition-opacity"
            />
          </button>
          
          <motion.div
            initial={false}
            animate={{
              width: isExpanded ? "auto" : 0,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 ml-2">
              <div className="flex-1 min-w-0 max-w-[140px]">
                <p className="text-white text-xs font-medium truncate">
                  {musicData.title}
                </p>
                <p className="text-gray-400 text-[10px] truncate">{musicData.singer}</p>
              </div>
              <div className="flex gap-1 mr-1">
                <button
                  onClick={togglePlay}
                  className="p-1.5 rounded hover:bg-white/10 text-white transition-colors"
                >
                  {isPlaying ? (
                    <IconPlayerPause className="w-4 h-4" />
                  ) : (
                    <IconPlayerPlay className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  {isMuted ? (
                    <IconVolumeOff className="w-4 h-4" />
                  ) : (
                    <IconVolume className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
