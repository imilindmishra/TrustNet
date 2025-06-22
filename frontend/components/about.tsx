"use client"

import { motion } from "framer-motion"

// Updated feature descriptions to be more specific and impressive
const features = [
  {
    title: "Hybrid Scoring Engine",
    description: "Combines Google's PageRank algorithm to measure network influence with NLP sentiment analysis on peer endorsements for a nuanced, hybrid score.",
  },
  {
    title: "Multi-Source Data Graph",
    description: "Constructs a comprehensive graph by ingesting real collaboration records from IPFS, identity data from Ceramic (simulated), and social endorsements from Lens (simulated).",
  },
  {
    title: "ZK-Powered Privacy",
    description: "Features a complete, end-to-end Zero-Knowledge pipeline using Groth16 and an on-chain verifier contract on Optimism to enable private attestations.",
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
            {/* Updated main description */}
            <p className="text-lg text-gray-400 max-w-3xl leading-relaxed">
              TrustNet is a decentralized reputation protocol designed to replace pitch-based fundraising with a verifiable, data-driven system. By analyzing a contributor's on-chain and off-chain history, we construct a dynamic social trust graph to help DAOs and VCs identify credible partners with proven track records.
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