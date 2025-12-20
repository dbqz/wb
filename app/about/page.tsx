"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { IconBrandGithub, IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    <div className="text-2xl md:text-3xl text-white font-mono">
      {time.days} 天 {time.hours} 时 {time.minutes} 分 {time.seconds} 秒
    </div>
  );
}

export default function AboutPage() {
  const { scrollY } = useScroll();
  const opacity1 = useTransform(scrollY, [0, 400], [1, 0]);
  const scale1 = useTransform(scrollY, [0, 400], [1, 0.8]);

  return (
    <div className="bg-black relative">
      {/* 固定的星空背景 */}
      <div className="fixed inset-0 overflow-hidden">
        <ShootingStars />
        <StarsBackground />
      </div>

      <Link
        href="/"
        className="fixed top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-all hover:scale-105 group text-white"
      >
        <IconArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">返回</span>
      </Link>

      {/* 第一部分：关于我 - 滚动时缩放消失 */}
      <motion.div
        style={{ opacity: opacity1, scale: scale1 }}
        className="sticky top-0 min-h-screen text-white flex items-center justify-center px-4 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-12 text-white">
            关于我
          </h1>
          <div className="space-y-8">
            <TextGenerateEffect
              words="你好 我是忘本 这是我的个人网站 记录着我的生活 学习和成长 在这里 你可以看到我的照片 项目和一些个人想法 感谢你的访问"
              className="text-xl md:text-2xl"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.5 }}
              className="pt-8"
            >
              <a
                href="https://github.com/dbqz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-all hover:scale-105 group"
              >
                <IconBrandGithub className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                <span className="text-lg font-medium">查看详细信息</span>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* 第二部分：暗恋文案和时长 */}
      <div className="min-h-screen relative z-10 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <TextGenerateEffect
            words="有些人 注定只能藏在心底 成为最温柔的秘密"
            className="text-2xl md:text-4xl text-white"
          />
          <TextGenerateEffect
            words="我喜欢你 像风走了八千里 不问归期"
            className="text-2xl md:text-4xl text-white"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            viewport={{ once: true }}
            className="pt-8"
          >
            <LoveTimer />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
