// File: frontend/components/hero.tsx (Updated with Moving Dots)
"use client"

import { motion } from "framer-motion"
import MovingDotsBackground from "./MovingDotsBackground" // Import the new component

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-6 text-center max-w-4xl">
        <h1 className="text-6xl md:text-8xl font-light mb-8 text-white tracking-tight">
          Verifying Trust
        </h1>

        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Data-driven credibility scores for Web3 contributors. Mitigate risks, analyze history, build with confidence.
        </p>
      </div>
    </section>
  )
}