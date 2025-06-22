// File: tool.tsx (Final Corrected Version)

"use client"
import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import AnalysisCard from "@/components/AnalysisCard" // Import the new AnalysisCard

// Define the full analysis object structure from your API
interface AnalysisResult {
  address: string
  finalScore: number
  scoreBreakdown: {
    pageRankScore: number
    sentimentBoost: number
  }
  networkAnalysis: {
    collaborations: number
    endorsementsReceived: number
  }
  endorsementQuality: {
    sentimentLabel: string
    positiveCount: number
    negativeCount: number
  }
}

export default function Tool() {
  const [address, setAddress] = useState("")
  const [result, setResult] = useState<AnalysisResult | null>(null) // Use the new interface
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const checkTrustScore = async () => {
    if (!address.trim()) {
      setError("Please enter a valid wallet address")
      return
    }

    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      // This is the correct fetch call that uses the environment variable
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trust-score/${address.trim()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch trust score");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
      setResult(null); 
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkTrustScore();
  }

  return (
    <section id="tool" className="py-32 bg-black">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">Check Trust Score</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Enter an Ethereum wallet address to view its credibility metrics.
          </p>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="space-y-8 p-8 glow-box rounded-lg border border-gray-900">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="0x..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-700 text-white placeholder-gray-500 py-4 px-0 focus:outline-none focus:border-blue-500 transition-colors duration-200 flow-line"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !address.trim()}
                className="w-full py-4 text-white bg-white/5 hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg glow-box hover:shadow-blue-500/20"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </div>
                ) : (
                  "Check Score"
                )}
              </button>
            </form>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            {/* This will now render our new, detailed analysis card */}
            {result && <AnalysisCard result={result} />}
          </div>
        </motion.div>
      </div>
    </section>
  )
}