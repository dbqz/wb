"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { IconArrowLeft, IconHeart } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

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
    fetch("/api/music?msg=谁和我在一起会幸福的&n=1")
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
    const startDate = new Date("2025-10-12T13:14:00");

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
  const [randomX] = useState(() => Math.random() * 100 - 50);
  const [randomX2] = useState(() => Math.random() * 100 - 50);

  return (
    <motion.div
      initial={{ opacity: 0, y: 0, x: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [-100, -200, -300, -400],
        x: [0, randomX, randomX2, 0],
      }}
      transition={{
        duration: 8,
        delay: delay,
        repeat: Infinity,
        repeatDelay: 3,
      }}
      className="absolute bottom-0"
      style={{ left: `${leftPosition}%` }}
    >
      <IconHeart className="w-6 h-6 text-pink-500/30 fill-pink-500/30" />
    </motion.div>
  );
}

export default function CynPage() {
  const { scrollY } = useScroll();
  const opacity1 = useTransform(scrollY, [0, 400], [1, 0]);
  const scale1 = useTransform(scrollY, [0, 400], [1, 0.8]);
  
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [musicConfirmed, setMusicConfirmed] = useState(false);

  return (
    <div className="bg-black relative overflow-hidden">
      {/* 背景音乐 */}
      <BackgroundMusic onConfirm={() => setMusicConfirmed(true)} />
      
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

      {/* 第一部分：CYN */}
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
              CYN
            </h1>
          </motion.div>
          <div className="space-y-8">
            <TextGenerateEffect
              words="有些人 注定只能藏在心底"
              className="text-xl sm:text-2xl md:text-3xl"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* 第二部分：暗恋文案 */}
      <div className="min-h-screen relative z-10 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <TextGenerateEffect
              words="我喜欢你 像风走了八千里 不问归期"
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
              words="你是我的秘密 藏在心底最柔软的地方"
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
            onClick={() => !isEnvelopeOpen && setIsEnvelopeOpen(true)}
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
                    <p className="text-lg sm:text-xl font-bold text-black mb-2">致 CYN</p>
                    <div className="w-20 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />
                  </div>
                  
                  {isEnvelopeOpen && (
                    <>
                      <div className="text-xs sm:text-sm leading-loose text-justify space-y-3 sm:space-y-4">
                        <p className="indent-8">
                          <AnimatedSentence sentence="亲爱的你，当我提笔写下这些文字时，窗外的夕阳正洒在11班的教室里，那是我们相遇的地方。" delay={0} />
                          <AnimatedSentence sentence="高一的时光总是过得那么快，快到我还没来得及好好看你一眼，2026年6月的分班就要到来了。" delay={2} />
                          <AnimatedSentence sentence="我知道，那之后我们可能就不在同一个班级了，甚至可能选择不同的科目，走向不同的方向。" delay={4} />
                        </p>
                        
                        <p className="indent-8">
                          <AnimatedSentence sentence="还记得第一次见到你，是在开学那天，阳光透过窗户照在你的侧脸上，那一刻我的心跳好像漏了一拍。" delay={6} />
                          <AnimatedSentence sentence="从那以后，我总是偷偷地看你，看你认真做题的样子，看你和朋友说笑的样子，看你趴在桌上午休的样子。" delay={8} />
                          <AnimatedSentence sentence="每一个瞬间都深深刻在我的心里，成为我最珍贵的回忆。" delay={10} />
                        </p>
                        
                        <p className="indent-8">
                          <AnimatedSentence sentence="我喜欢你，像风走了八千里，不问归期。" delay={12} />
                          <AnimatedSentence sentence="这份感情深藏心底，不敢言说，却又无法抑制。" delay={13.5} />
                          <AnimatedSentence sentence="我害怕表白会打破我们之间的平静，害怕连现在这样远远看着你的机会都会失去。" delay={15} />
                          <AnimatedSentence sentence="所以我选择沉默，把所有的喜欢都藏在心底最柔软的地方。" delay={17} />
                        </p>
                        
                        <p className="indent-8">
                          <AnimatedSentence sentence="时间一天天过去，离分班的日子越来越近，我的心里满是不舍和遗憾。" delay={19} />
                          <AnimatedSentence sentence="不舍的是即将失去每天见到你的机会，遗憾的是始终没有勇气对你说出那三个字。" delay={21} />
                          <AnimatedSentence sentence="也许这就是青春吧，总有些话来不及说，总有些人来不及爱。" delay={23} />
                        </p>
                        
                        <p className="indent-8">
                          <AnimatedSentence sentence="如果有一天，你无意中看到这封信，希望你不要惊讶，也不要有负担。" delay={25} />
                          <AnimatedSentence sentence="我只是想让你知道，在这个世界上，曾经有一个人那么认真地喜欢过你。" delay={27} />
                          <AnimatedSentence sentence="愿你被这世界温柔以待，愿你的每一天都充满阳光，愿你的未来比我想象的还要美好。" delay={29} />
                        </p>
                        
                        <p className="indent-8">
                          <AnimatedSentence sentence="即使我们终将走向不同的方向，你依然是我高中时光里最美的风景。" delay={31} />
                        </p>
                      </div>
                      
                      <div className="pt-4 sm:pt-6 text-right space-y-1">
                        <p className="text-[10px] sm:text-xs text-gray-800">@忘本</p>
                        <p className="text-[9px] sm:text-[10px] text-gray-600">
                          {new Date().toLocaleDateString('zh-CN', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
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
