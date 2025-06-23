"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image" // 1. Import the Next.js Image component

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-sm border-b border-gray-900" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* 2. Replaced the simple text div with a flex container for the logo and text */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <Image
            src="/logo.png" // Assumes logo.png is in your /public folder
            alt="TrustNet Logo"
            width={28}
            height={28}
            className="h-7 w-7" // Adjust size as needed
          />
          <span className="text-xl font-medium text-white">TrustNet</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => scrollToSection("about")}
            className="text-gray-400 hover:text-white transition-colors duration-200 text-sm relative group"
          >
            About
            <div className="absolute bottom-0 left-0 w-0 h-px bg-cyan-500 group-hover:w-full transition-all duration-300" />
          </button>
          <button
            onClick={() => scrollToSection("tool")}
            className="text-gray-400 hover:text-white transition-colors duration-200 text-sm relative group"
          >
            Tool
            <div className="absolute bottom-0 left-0 w-0 h-px bg-cyan-500 group-hover:w-full transition-all duration-300" />
          </button>
          <Link 
            href="/docs"
            className="text-sm text-gray-400 hover:text-white transition-colors duration-200 relative group"
          >
            Docs
            <div className="absolute bottom-0 left-0 w-0 h-px bg-cyan-500 group-hover:w-full transition-all duration-300" />
          </Link>
        </nav>

      </div>
    </motion.header>
  )
}