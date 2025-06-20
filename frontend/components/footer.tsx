"use client"

import { motion } from "framer-motion"

export default function Footer() {
  return (
    <motion.footer
      className="py-12 bg-black border-t border-gray-900"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-6">
        <div className="text-center">
          <p className="text-sm text-gray-500">© 2025 TrustNet</p>
        </div>
      </div>
    </motion.footer>
  )
}
