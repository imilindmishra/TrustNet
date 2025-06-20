"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

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
      <div className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="text-xl font-medium text-white">TrustNet</div>

        <nav className="hidden md:flex items-center space-x-12">
          <button
            onClick={() => scrollToSection("about")}
            className="text-gray-400 hover:text-white transition-colors duration-200 text-sm relative group"
          >
            About
            <div className="absolute bottom-0 left-0 w-0 h-px bg-blue-500 group-hover:w-full transition-all duration-300" />
          </button>
          <button
            onClick={() => scrollToSection("tool")}
            className="text-gray-400 hover:text-white transition-colors duration-200 text-sm relative group"
          >
            Tool
            <div className="absolute bottom-0 left-0 w-0 h-px bg-blue-500 group-hover:w-full transition-all duration-300" />
          </button>
        </nav>

        <button className="text-sm text-gray-400 hover:text-white transition-colors duration-200 relative group">
          Connect Wallet
          <div className="absolute bottom-0 left-0 w-0 h-px bg-blue-500 group-hover:w-full transition-all duration-300" />
        </button>
      </div>
    </motion.header>
  )
}
