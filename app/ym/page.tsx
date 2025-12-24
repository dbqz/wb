"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { IconArrowLeft, IconHeart } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import { Fireworks } from "fireworks-js";

// 一句一句显示的动画组件
function AnimatedSentence({ sentence, delay }: { sentence: string; delay: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.8 }}
    >
      {sentence}
    </motion.span>
  );
}

// 背景音乐组件
function BackgroundMusic({ onConfirm }: { onConfirm: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [musicUrl, setMusicUrl] = useState<string>("");
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    // 获取音乐信息
    fetch("/api/music?msg=雨爱(人声弱化1.05x)&n=1")
      .then((res) => res.json())
      .then((data) => {
        if (data.music) {
          const proxyAudioUrl = `/api/audio?url=${encodeURIComponent(data.music)}`;
          setMusicUrl(proxyAudioUrl);
        }
      })
      .catch((error) => console.error("Error fetching music:", error));
  }, []);

  const handleConfirm = () => {
    setShowPrompt(false);
    onConfirm();
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.log("播放失败:", error);
      });
    }
  };

  const handleCancel = () => {
    setShowPrompt(false);
    onConfirm();
  };

  return (
    <>
      {/* 音乐播放提示框 */}
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-white/10"
          >
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                  <IconHeart className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  播放背景音乐？
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  为您准备了一首特别的歌曲
                </p>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-all text-sm sm:text-base font-medium"
                >
                  稍后
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-lg transition-all text-sm sm:text-base font-medium shadow-lg"
                >
                  播放
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* 音频元素 */}
      {musicUrl && (
        <audio
          ref={audioRef}
          src={musicUrl}
          loop
          className="hidden"
        />
      )}
    </>
  );
}

function LoveTimer() {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const startDate = new Date("2025-12-24T09:00:00");

    const updateTimer = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTime({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="text-xl sm:text-2xl md:text-3xl text-white font-mono"
    >
      {time.days} 天 {time.hours} 时 {time.minutes} 分 {time.seconds} 秒
    </motion.div>
  );
}

// 浮动的心形组件
function FloatingHeart({ delay = 0, leftPosition = 50 }: { delay?: number; leftPosition?: number }) {
  const [randomX] = useState(() => Math.random() * 200 - 100);
  const [randomX2] = useState(() => Math.random() * 200 - 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 0, x: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [-100, -300, -500, -700],
        x: [0, randomX, randomX2, 0],
      }}
      transition={{
        duration: 10,
        delay: delay,
        repeat: Infinity,
        repeatDelay: 2,
      }}
      className="absolute bottom-0"
      style={{ left: `${leftPosition}%` }}
    >
      <IconHeart className="w-8 h-8 text-pink-500/40 fill-pink-500/40" />
    </motion.div>
  );
}

export default function YmPage() {
  const { scrollY } = useScroll();
  const opacity1 = useTransform(scrollY, [0, 400], [1, 0]);
  const scale1 = useTransform(scrollY, [0, 400], [1, 0.8]);
  
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showQuotes, setShowQuotes] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const fireworksRef = useRef<HTMLDivElement>(null);
  const fireworksInstance = useRef<Fireworks | null>(null);

  // 语录列表
  const quotes = [
    "从今以后 你就是我的全世界",
    "余生很长 我想和你一起走",
    "我会珍惜我们在一起的每一天",
    "无论未来如何 我都会陪在你身边",
    "谢谢你愿意成为我的女朋友",
    "我爱你 杨敏"
  ];

  const handleEnvelopeClick = () => {
    if (!isEnvelopeOpen) {
      setIsEnvelopeOpen(true);
      
      // 触发 confetti 动画 - 10秒
      const duration = 10 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: NodeJS.Timeout = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // 从左侧发射
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#ff69b4', '#ff1493', '#ffc0cb', '#ffb6c1'],
        });
        
        // 从右侧发射
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#ff69b4', '#ff1493', '#ffc0cb', '#ffb6c1'],
        });
      }, 250);
    }
  };

  const handleLoveTextClick = () => {
    console.log("触发烟花");
    setShowFireworks(true);
  };

  useEffect(() => {
    if (showFireworks && fireworksRef.current && !fireworksInstance.current) {
      console.log("初始化烟花");
      fireworksInstance.current = new Fireworks(fireworksRef.current, {
        autoresize: true,
        opacity: 0.5,
        acceleration: 1.05,
        friction: 0.97,
        gravity: 1.5,
        particles: 150,
        traceLength: 3,
        traceSpeed: 10,
        explosion: 8,
        intensity: 30,
        flickering: 50,
        lineStyle: 'round',
        hue: {
          min: 0,
          max: 360
        },
        delay: {
          min: 30,
          max: 60
        },
        rocketsPoint: {
          min: 50,
          max: 50
        },
        lineWidth: {
          explosion: {
            min: 1,
            max: 4
          },
          trace: {
            min: 1,
            max: 2
          }
        },
        brightness: {
          min: 50,
          max: 80
        },
        decay: {
          min: 0.015,
          max: 0.03
        },
        mouse: {
          click: false,
          move: false,
          max: 1
        }
      });
      
      fireworksInstance.current.start();
      console.log("烟花已启动");
      
      // 8秒后停止烟花，开始显示语录
      setTimeout(() => {
        if (fireworksInstance.current) {
          fireworksInstance.current.stop();
          console.log("烟花已停止");
        }
        setShowQuotes(true);
      }, 8000);
    }
  }, [showFireworks]);

  // 语录轮播
  useEffect(() => {
    if (showQuotes && currentQuoteIndex < quotes.length) {
      // 每段语录显示3秒后切换到下一段
      const timer = setTimeout(() => {
        setCurrentQuoteIndex(prev => prev + 1);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showQuotes, currentQuoteIndex, quotes.length]);

  // 语录展示时的爱心 confetti
  useEffect(() => {
    if (showQuotes && currentQuoteIndex < quotes.length) {
      const duration = 3000;
      const animationEnd = Date.now() + duration;

      const heartShape = confetti.shapeFromPath({
        path: 'M167,72.8c2.9-17.9-6.8-35.7-24.3-42.8c-20.6-8.4-44,3.9-52.4,24.5c0,0,0,0,0,0c-8.4-20.6-31.8-32.9-52.4-24.5c-17.5,7.1-27.2,24.9-24.3,42.8c5.3,32.2,76.7,81,76.7,81S159.7,105,167,72.8z'
      });

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ['#ff69b4', '#ff1493', '#ffc0cb', '#ffb6c1'],
          shapes: [heartShape],
          scalar: 3,
          gravity: 0.6,
          drift: 0.5,
          ticks: 400,
          zIndex: 10001,
        });

        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ['#ff69b4', '#ff1493', '#ffc0cb', '#ffb6c1'],
          shapes: [heartShape],
          scalar: 3,
          gravity: 0.6,
          drift: -0.5,
          ticks: 400,
          zIndex: 10001,
        });

        // 中间也发射一些
        if (Math.random() < 0.5) {
          confetti({
            particleCount: 3,
            angle: 90,
            spread: 45,
            origin: { x: 0.5, y: 0.3 },
            colors: ['#ff69b4', '#ff1493', '#ffc0cb', '#ffb6c1'],
            shapes: [heartShape],
            scalar: 2.5,
            gravity: 0.5,
            ticks: 400,
            zIndex: 10001,
          });
        }
      }, 150);

      return () => clearInterval(interval);
    }
  }, [showQuotes, currentQuoteIndex, quotes.length]);

  useEffect(() => {
    return () => {
      if (fireworksInstance.current) {
        fireworksInstance.current.stop();
      }
    };
  }, []);

  return (
    <div className="bg-black relative overflow-hidden">
      {/* 全屏烟花效果 */}
      {showFireworks && (
        <div 
          ref={fireworksRef}
          className="fixed inset-0 z-[9999] bg-black"
          style={{ width: '100vw', height: '100vh' }}
        />
      )}

      {/* 语录展示 */}
      {showQuotes && currentQuoteIndex < quotes.length && (
        <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center px-4">
          <motion.div
            key={currentQuoteIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl w-full"
          >
            <TextGenerateEffect
              words={quotes[currentQuoteIndex]}
              className="text-2xl sm:text-3xl md:text-5xl text-white text-center"
              duration={0.8}
            />
          </motion.div>
        </div>
      )}

      {/* 背景音乐 */}
      <BackgroundMusic onConfirm={() => {}} />
      
      {/* 固定的星空背景 */}
      <div className="fixed inset-0 overflow-hidden">
        <ShootingStars />
        <StarsBackground />
      </div>

      {/* 浮动的心形 */}
      <FloatingHeart delay={0} leftPosition={20} />
      <FloatingHeart delay={1.5} leftPosition={40} />
      <FloatingHeart delay={3} leftPosition={60} />
      <FloatingHeart delay={4.5} leftPosition={80} />
      <FloatingHeart delay={6} leftPosition={30} />
      <FloatingHeart delay={7.5} leftPosition={50} />
      <FloatingHeart delay={9} leftPosition={70} />
      <FloatingHeart delay={10.5} leftPosition={90} />

      <Link
        href="/about"
        className="fixed top-4 left-4 sm:top-8 sm:left-8 z-50 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-all hover:scale-105 group text-white text-sm"
      >
        <IconArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs sm:text-sm font-medium">返回</span>
      </Link>

      {/* 第一部分：YM */}
      <motion.div
        style={{ opacity: opacity1, scale: scale1 }}
        className="sticky top-0 min-h-screen text-white flex items-center justify-center px-4 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-8 md:mb-16 text-white">
              YM
            </h1>
          </motion.div>
          <div className="space-y-8">
            <TextGenerateEffect
              words="从今以后 你就是我的全世界"
              className="text-xl sm:text-2xl md:text-3xl"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* 第二部分：在一起文案 */}
      <div className="min-h-screen relative z-10 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <TextGenerateEffect
              words="我们在一起了 这是我最幸福的时刻"
              className="text-xl sm:text-2xl md:text-4xl text-white"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <TextGenerateEffect
              words="余生很长 我想和你一起走"
              className="text-xl sm:text-2xl md:text-4xl text-white"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="pt-4 md:pt-8"
          >
            <LoveTimer />
          </motion.div>
        </div>
      </div>

      {/* 第三部分：信封 */}
      <div className="min-h-screen relative z-10 flex items-center justify-center px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative max-w-4xl w-full"
        >
          {/* 信封容器 */}
          <div 
            className="relative w-full aspect-[3/2] perspective-1000"
            onClick={(e) => {
              // 检查是否点击的是"挚爱杨敏"
              const target = e.target as HTMLElement;
              if (!target.closest('.love-text')) {
                handleEnvelopeClick();
              }
            }}
          >
            {/* 信封主体 - 更精致的设计 */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 rounded-lg shadow-2xl border-2 border-amber-300/50">
              {/* 多层装饰性边框 */}
              <div className="absolute inset-3 border-2 border-amber-400/40 rounded" />
              <div className="absolute inset-6 border border-amber-500/20 rounded" />
              
              {/* 四角装饰 */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-600/40" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-600/40" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-600/40" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-600/40" />
              
              {/* 中央装饰线条 */}
              <div className="absolute top-1/2 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
              
              {/* 信封底部文字 - 挚爱杨敏 */}
              <div 
                className="love-text absolute bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform z-30"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("点击了挚爱杨敏");
                  handleLoveTextClick();
                }}
              >
                <p className="text-amber-900 text-2xl sm:text-3xl md:text-4xl font-bold tracking-widest pointer-events-auto" style={{ fontFamily: "'KaiTi', 'STKaiti', 'SimKai', serif" }}>
                  挚爱杨敏
                </p>
              </div>
              
              {/* 复古纹理效果 */}
              <div className="absolute inset-0 opacity-10 rounded-lg" 
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 10px,
                    rgba(180, 83, 9, 0.1) 10px,
                    rgba(180, 83, 9, 0.1) 20px
                  )`
                }}
              />
              
              {/* 蜡封印章 */}
              <motion.div
                animate={{
                  scale: isEnvelopeOpen ? 0 : 1,
                  opacity: isEnvelopeOpen ? 0 : 1,
                  rotate: isEnvelopeOpen ? 180 : 0,
                }}
                transition={{ duration: 0.5 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
              >
                {/* 蜡封外圈 */}
                <div className="relative w-24 h-24 bg-gradient-to-br from-red-600 via-red-700 to-red-900 rounded-full shadow-2xl flex items-center justify-center">
                  {/* 蜡封纹理 */}
                  <div className="absolute inset-0 rounded-full opacity-30"
                    style={{
                      backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)`
                    }}
                  />
                  {/* 蜡封边缘 */}
                  <div className="absolute inset-1 border-2 border-red-800/50 rounded-full" />
                  {/* 心形图标 */}
                  <IconHeart className="w-12 h-12 text-amber-100 fill-amber-100 relative z-10" />
                  {/* 装饰小点 */}
                  <div className="absolute top-2 left-1/2 w-1 h-1 bg-amber-200 rounded-full" />
                  <div className="absolute bottom-2 left-1/2 w-1 h-1 bg-amber-200 rounded-full" />
                  <div className="absolute left-2 top-1/2 w-1 h-1 bg-amber-200 rounded-full" />
                  <div className="absolute right-2 top-1/2 w-1 h-1 bg-amber-200 rounded-full" />
                </div>
              </motion.div>
            </div>
            
            {/* 信封盖子 - 更真实的效果 */}
            <motion.div
              animate={{
                rotateX: isEnvelopeOpen ? -180 : 0,
                z: isEnvelopeOpen ? 50 : 0,
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
              style={{
                transformOrigin: "top center",
                transformStyle: "preserve-3d",
              }}
              className="absolute top-0 left-0 right-0 h-1/2 z-10"
            >
              <div className="relative w-full h-full">
                {/* 盖子主体 */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 rounded-t-lg border-2 border-amber-300/50 border-b-0 shadow-lg">
                  {/* 盖子装饰边框 */}
                  <div className="absolute inset-3 border border-amber-400/40 rounded-t" />
                  
                  {/* 盖子纹理 */}
                  <div className="absolute inset-0 opacity-10 rounded-t-lg" 
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                        -45deg,
                        transparent,
                        transparent 10px,
                        rgba(180, 83, 9, 0.1) 10px,
                        rgba(180, 83, 9, 0.1) 20px
                      )`
                    }}
                  />
                </div>
                
                {/* 三角形盖子 */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                  <div 
                    className="w-0 h-0 relative"
                    style={{
                      borderLeft: "calc(50% - 1px) solid transparent",
                      borderRight: "calc(50% - 1px) solid transparent",
                      borderTop: "120px solid #fcd34d",
                      filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
                    }}
                  >
                    {/* 三角形内部装饰 */}
                    <div className="absolute top-[-100px] left-1/2 transform -translate-x-1/2 w-px h-20 bg-amber-600/20" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 信纸 - 包含所有内容 */}
            <motion.div
              animate={{
                y: isEnvelopeOpen ? -320 : 0,
                opacity: isEnvelopeOpen ? 1 : 0,
                scale: isEnvelopeOpen ? 1 : 0.8,
              }}
              transition={{ duration: 1, delay: isEnvelopeOpen ? 0.5 : 0, ease: "easeOut" }}
              className="absolute top-12 left-4 right-4 sm:left-8 sm:right-8 bg-gradient-to-br from-white to-amber-50 rounded-lg shadow-2xl border border-amber-200 z-30 max-h-[500px] sm:max-h-[600px] overflow-y-auto"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <div className="p-6 sm:p-8 md:p-12">
                {/* 信纸多层装饰边框 */}
                <div className="absolute inset-3 border border-amber-300/40 rounded pointer-events-none" />
                <div className="absolute inset-5 border border-amber-300/20 rounded pointer-events-none" />
                
                {/* 四角花纹装饰 */}
                <div className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 border-amber-400/50 pointer-events-none" />
                <div className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-amber-400/50 pointer-events-none" />
                <div className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-amber-400/50 pointer-events-none" />
                <div className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-amber-400/50 pointer-events-none" />
                
                {/* 复古纸张纹理 */}
                <div className="absolute inset-0 opacity-5 rounded-lg pointer-events-none"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      0deg,
                      transparent,
                      transparent 2px,
                      rgba(180, 83, 9, 0.1) 2px,
                      rgba(180, 83, 9, 0.1) 4px
                    )`
                  }}
                />
                
                {/* 信纸内容 */}
                <div className="relative text-black font-serif">
                  <div className="text-center mb-4 sm:mb-6">
                    <p className="text-lg sm:text-xl font-bold text-black mb-2">致 YM</p>
                    <div className="w-20 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />
                  </div>
                  
                  {isEnvelopeOpen && (
                    <>
                      <div className="text-xs sm:text-sm leading-loose text-justify space-y-3 sm:space-y-4">
                        <p className="indent-8">
                          <AnimatedSentence sentence="亲爱的你，当我写下这些文字时，心中满是幸福和感动。" delay={0} />
                          <AnimatedSentence sentence="2025年12月24日，这个特别的日子，我们终于在一起了。" delay={2} />
                          <AnimatedSentence sentence="这一刻，我等了很久，也期待了很久。" delay={4} />
                        </p>
                        
                        <p className="indent-8">
                          <AnimatedSentence sentence="还记得朋友第一次把你介绍给我的时候，我就被你吸引了。" delay={6} />
                          <AnimatedSentence sentence="你的笑容，你的温柔，你的善良，都让我心动不已。" delay={8} />
                          <AnimatedSentence sentence="虽然我们都还在读高中，但我知道，你就是我想要守护的那个人。" delay={10} />
                        </p>
                        
                        <p className="indent-8">
                          <AnimatedSentence sentence="从相识到相知，从朋友到恋人，每一步都让我更加确信，遇见你是我最大的幸运。" delay={12} />
                          <AnimatedSentence sentence="我们一起上学，一起放学，一起分享生活中的点点滴滴。" delay={14} />
                          <AnimatedSentence sentence="这些平凡的日子，因为有你，都变得格外珍贵。" delay={16} />
                        </p>
                        
                        <p className="indent-8">
                          <AnimatedSentence sentence="我知道我们还年轻，未来还有很长的路要走。" delay={18} />
                          <AnimatedSentence sentence="但我想和你一起努力，一起成长，一起面对未来的每一个挑战。" delay={20} />
                          <AnimatedSentence sentence="无论是高考，还是以后的人生，我都想牵着你的手一起走。" delay={22} />
                        </p>
                        
                        <p className="indent-8">
                          <AnimatedSentence sentence="谢谢你愿意成为我的女朋友，让我有机会好好爱你。" delay={24} />
                          <AnimatedSentence sentence="我会珍惜我们在一起的每一天，会努力让你开心快乐。" delay={26} />
                          <AnimatedSentence sentence="余生很长，我想和你一起走。我爱你，YM。" delay={28} />
                        </p>
                      </div>
                      
                      <div className="pt-4 sm:pt-6 text-right space-y-1">
                        <p className="text-[10px] sm:text-xs text-gray-800">@忘本</p>
                        <p className="text-[9px] sm:text-[10px] text-gray-600">
                          2025年12月24日
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* 提示文字 - 点击打开信封 */}
            {!isEnvelopeOpen && (
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -bottom-12 sm:-bottom-16 left-1/2 transform -translate-x-1/2 text-white text-xs sm:text-sm flex items-center gap-2"
              >
                <IconHeart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500 fill-pink-500" />
                <span>点击打开信封</span>
                <IconHeart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500 fill-pink-500" />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
