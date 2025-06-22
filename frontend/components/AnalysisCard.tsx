// File: frontend/components/AnalysisCard.tsx

"use client"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, ArrowRight, GitCommit, Users } from 'lucide-react'

// Define the shape of the full analysis object from the API
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

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="bg-gray-900/50 p-4 rounded-lg text-center border border-gray-800">
        <div className="text-cyan-400 mx-auto w-fit mb-2">{icon}</div>
        <p className="text-2xl font-semibold text-white">{value}</p>
        <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
    </div>
);

export default function AnalysisCard({ result }: { result: AnalysisResult }) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-400";
        if (score >= 60) return "text-yellow-400";
        if (score >= 40) return "text-orange-400";
        return "text-red-400";
    };

    return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border-t border-gray-800 pt-8"
        >
            <div className="text-center mb-8">
                <p className="text-sm text-gray-500">Final Trust Score</p>
                <p className={`text-7xl font-light ${getScoreColor(result.finalScore)}`}>{result.finalScore.toFixed(1)}</p>
                <p className="text-xs text-gray-400 font-mono mt-1">
                    ({result.scoreBreakdown.pageRankScore.toFixed(1)} <span className="text-gray-500">PageRank</span> + {result.scoreBreakdown.sentimentBoost.toFixed(1)} <span className="text-gray-500">Sentiment</span>)
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <StatCard 
                    icon={<GitCommit size={24} />} 
                    label="Collaborations" 
                    value={result.networkAnalysis.collaborations} 
                />
                <StatCard 
                    icon={<Users size={24} />} 
                    label="Endorsements Received" 
                    value={result.networkAnalysis.endorsementsReceived} 
                />
                 <StatCard 
                    icon={<CheckCircle size={24} />} 
                    label="Positive Endorsements" 
                    value={result.endorsementQuality.positiveCount} 
                />
                 <StatCard 
                    icon={<XCircle size={24} />} 
                    label="Negative Endorsements" 
                    value={result.endorsementQuality.negativeCount} 
                />
            </div>
             <div className="mt-4 text-center text-xs text-gray-500">
                Address: <code className="text-gray-400">{result.address}</code>
             </div>
        </motion.div>
    )
}