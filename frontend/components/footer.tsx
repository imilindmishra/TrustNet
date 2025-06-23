"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Github, Twitter, Linkedin } from "lucide-react" // Importing icons

export default function Footer() {
  // You can easily update these with your personal links
  const socialLinks = [
    { name: "GitHub", href: "#", icon: <Github size={20} /> },
    { name: "Twitter", href: "#", icon: <Twitter size={20} /> },
    { name: "LinkedIn", href: "#", icon: <Linkedin size={20} /> }
  ];

  const navLinks = [
    { name: "About", href: "/#about" },
    { name: "Tool", href: "/#tool" },
    { name: "Docs", href: "/docs" }
  ];

  return (
    <motion.footer
      className="bg-black border-t border-gray-900"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Column 1: Brand & Description */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="TrustNet Logo" width={32} height={32} />
              <span className="text-xl font-semibold text-white">TrustNet</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs">
              A decentralized reputation engine for a more trustworthy Web3.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="text-center">
            <h3 className="font-semibold text-white mb-4">Navigate</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social Links */}
          <div className="text-center md:text-right">
             <h3 className="font-semibold text-white mb-4">Connect</h3>
             <div className="flex justify-center md:justify-end space-x-4">
                {socialLinks.map((link) => (
                    <a 
                        key={link.name} 
                        href={link.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label={link.name}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        {link.icon}
                    </a>
                ))}
             </div>
          </div>

        </div>

        
      </div>
    </motion.footer>
  )
}