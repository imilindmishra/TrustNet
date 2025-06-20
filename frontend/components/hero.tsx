"use client"

import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24">
      <div className="absolute inset-0 bg-black" />

      {/* Subtle flowing background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
        <motion.h1
          className="text-6xl md:text-8xl font-light mb-8 text-white tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Verifying Trust
        </motion.h1>

        <motion.p
          className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Data-driven credibility scores for Web3 contributors. Mitigate risks, analyze history, build with confidence.
        </motion.p>
      </div>
    </section>
  )
}
