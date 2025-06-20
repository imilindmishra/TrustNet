
"use client"
import { motion } from "framer-motion"

interface TrustScoreResult {
  address: string
  score: number
}

interface ResultCardProps {
  result: TrustScoreResult
}

export default function ResultCard({ result }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6 py-8 border-t border-gray-800 flow-line"
    >
      <div className="space-y-2">
        <p className="text-sm text-gray-500">Trust Score</p>
        
        <div className="text-5xl font-light text-cyan-400 glow-box">
          {result.score.toFixed(4)}
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-500">Address</p>
        <div className="p-3 bg-gray-900/30 rounded border border-gray-800 glow-box">
          <code className="text-sm text-gray-400 font-mono break-all block">
            {result.address}
          </code>
        </div>
      </div>
    </motion.div>
  )
}