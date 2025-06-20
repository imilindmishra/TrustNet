"use client"

import { motion } from "framer-motion"

const features = [
  {
    title: "Data-Driven",
    description: "Weighted interactions across platforms",
  },
  {
    title: "On-Chain Analysis",
    description: "IPFS, Ceramic, smart contract integration",
  },
  {
    title: "Privacy Focused",
    description: "ZK-proof verification system",
  },
]

export default function About() {
  return (
    <section id="about" className="py-32 bg-black">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">What is TrustNet?</h2>
            <p className="text-lg text-gray-400 max-w-3xl leading-relaxed">
              A dynamic social trust graph analyzing on-chain and off-chain data to help identify credible contributors.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="space-y-4 p-6 glow-box hover:shadow-blue-500/20 transition-all duration-500 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-medium text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                <div className="flow-line h-px bg-gray-800 mt-4" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
