"use client";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { FocusCards } from "@/components/ui/focus-cards";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { MusicPlayer } from "@/components/ui/music-player";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { IconHome, IconUser, IconBriefcase } from "@tabler/icons-react";

export default function Home() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.8]);
  
  const [cards, setCards] = useState<Array<{ title: string; src: string; url: string }>>([]);

  const navItems = [
    {
      name: "首页",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-white" />,
    },
    {
      name: "个人",
      link: "/about",
      icon: <IconUser className="h-4 w-4 text-white" />,
    },
    {
      name: "项目",
      link: "/projects",
      icon: <IconBriefcase className="h-4 w-4 text-white" />,
    },
  ];

  useEffect(() => {
    fetch("https://img.qzwb.asia/feed.json")
      .then((res) => res.json())
      .then((data) => {
        const formattedCards = data.photos.map((photo: any) => ({
          title: photo.title,
          src: photo.src.large.url,
          url: photo.url,
        }));
        setCards(formattedCards);
      })
      .catch((error) => console.error("Error fetching photos:", error));
  }, []);

  return (
    <div className="bg-black relative">
      {/* 固定的星空背景 */}
      <div className="fixed inset-0 overflow-hidden">
        <ShootingStars />
        <StarsBackground />
      </div>

      <FloatingNav navItems={navItems} />
      <MusicPlayer />
      
      <motion.section
        style={{ opacity, scale }}
        className="min-h-screen flex items-center justify-center sticky top-0 relative z-10"
      >
        <TextHoverEffect text="@忘本" />
      </motion.section>
      
      <section className="min-h-screen flex items-center justify-center px-4 py-20 relative z-10">
        {cards.length > 0 ? (
          <FocusCards cards={cards} />
        ) : (
          <div className="text-white">加载中...</div>
        )}
      </section>
    </div>
  );
}
