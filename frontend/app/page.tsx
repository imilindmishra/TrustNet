// File: frontend/app/page.tsx (Updated with Scroll Animations)

"use client"

import { useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'

import Header from "@/components/header"
import Hero from "@/components/hero"
import About from "@/components/about"
import Tool from "@/components/tool"
import Footer from "@/components/footer"
import MovingDotsBackground from '@/components/MovingDotsBackground' // Make sure this component exists

export default function HomePage() {
  const mainRef = useRef(null);
  
  // Track scroll progress within the main container
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end start"] 
  });

  // Create transform values based on scroll progress
  // Hero section will fade out and move up as user scrolls down (from 0% to 20% scroll)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  // About section will fade in and move up as user scrolls (from 15% to 30% scroll)
  const aboutOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]);
  const aboutY = useTransform(scrollYProgress, [0.15, 0.3], [50, 0]);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      
      {/* --- PERSISTENT BACKGROUND --- */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <MovingDotsBackground />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-950 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>
      
      <Header />
      
      {/* The main content area will now control animations */}
      <main ref={mainRef} className="relative z-10">
        <motion.div style={{ opacity: heroOpacity, y: heroY }}>
          <Hero />
        </motion.div>
        
        <motion.div style={{ opacity: aboutOpacity, y: aboutY }}>
          <About />
        </motion.div>

        {/* The rest of the components can be added here. They will appear after the initial transitions. */}
        <Tool />
      </main>

      <Footer />
    </div>
  )
}