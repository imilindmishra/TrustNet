// File: trustnet/frontend/app/docs/page.tsx (Complete Final Version)

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'TrustNet | Documentation',
  description: 'Technical documentation and API reference for the TrustNet Social Trust Graph Agent.',
}

// Reusable component for section titles
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl font-light border-b border-gray-800 pb-3 mb-8 text-white">{children}</h2>
);

// Reusable component for styled code blocks with titles
const CodeBlock = ({ title, code }: { title: string, code: string }) => (
  <div className="my-6">
    <p className="text-sm text-gray-400 mb-2">{title}:</p>
    <pre className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-sm text-gray-300 font-mono overflow-x-auto">
      <code>{code}</code>
    </pre>
  </div>
);

// Reusable component for ordered list items
const FlowStep = ({ number, title, children }: { number: number, title: string, children: React.ReactNode }) => (
    <li className="mb-4 ml-6">
        <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-800 text-cyan-400 rounded-full -left-4 font-bold">
            {number}
        </span>
        <h3 className="font-medium text-white">{title}</h3>
        <p className="text-sm text-gray-400">{children}</p>
    </li>
);

// Reusable component for the API reference sections
const ApiReference = ({ method, path, description, children }: { method: 'GET' | 'POST', path: string, description: string, children: React.ReactNode }) => {
  const methodColor = method === 'GET' ? 'text-blue-400' : 'text-green-400';
  return (
    <div className="border border-gray-800 rounded-lg p-6 mb-8">
      <div className="flex items-center space-x-4">
        <span className={`font-mono text-lg font-bold ${methodColor}`}>{method}</span>
        <code className="text-lg text-gray-300">{path}</code>
      </div>
      <p className="mt-4 text-gray-400">{description}</p>
      <div className="border-t border-gray-800 my-4"></div>
      {children}
    </div>
  );
};

export default function DocsPage() {
  return (
    <main className="bg-black text-gray-300 min-h-screen">
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        <div className="mb-12">
            <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
            </Link>
        </div>

        <h1 className="text-5xl font-extralight text-white mb-4">TrustNet Documentation</h1>
        <p className="text-lg text-gray-400 mb-20">
          An overview of the architecture, features, and operational flows of the TrustNet Agent.
        </p>

        <div className="space-y-20">
          
          <section id="pipeline-flow">
            <SectionTitle>Data & Scoring Pipeline Flow</SectionTitle>
            <ol className="relative border-l border-gray-700">
                <FlowStep number={1} title="Data Seeding">
                    The process begins with the `collectData.js` script. It reads from multiple mock data sources (collaborations, endorsements, profiles) and populates the `interactions` collection in our MongoDB Atlas database.
                </FlowStep>
                <FlowStep number={2} title="Graph Construction">
                    The `buildGraph.py` script reads the raw data from the `interactions` collection and uses the `networkx` library to construct a weighted, directed graph of all entities and their relationships.
                </FlowStep>
                <FlowStep number={3} title="Sentiment Analysis (NLP)">
                    For `endorsement` interactions, the script uses a pre-trained Hugging Face model to perform sentiment analysis on the endorsement text, assigning a positive or negative value to the interaction.
                </FlowStep>
                <FlowStep number={4} title="PageRank Calculation">
                    The script runs the PageRank algorithm on the weighted graph. This calculates a base score for each node based on its network influence and the importance of its connections.
                </FlowStep>
                <FlowStep number={5} title="Hybrid Score & Normalization">
                    The sentiment score boost is applied to the base PageRank score to create a final hybrid score. This score is then normalized to a 0-100 scale for easy interpretation.
                </FlowStep>
                 <FlowStep number={6} title="Save to Database">
                    The final, normalized scores are saved to the `trust_scores` collection in MongoDB, ready to be served by the API.
                </FlowStep>
            </ol>
          </section>

          <section id="zk-flow">
            <SectionTitle>Zero-Knowledge Verification Flow</SectionTitle>
            <ol className="relative border-l border-gray-700">
                <FlowStep number={1} title="API Request">
                    A user sends a POST request to the `/verify-endorsement` endpoint with private inputs (in our proof-of-concept, `a` and `b`).
                </FlowStep>
                <FlowStep number={2} title="Off-Chain Proof Generation">
                    The Node.js backend uses the `snarkjs` library and the pre-compiled circuit artifacts (`.wasm`, `.zkey`) to generate a valid Groth16 cryptographic proof and public signals.
                </FlowStep>
                <FlowStep number={3} title="On-Chain Verification">
                    The backend, acting as a relayer, sends this generated proof to our `Groth16Verifier.sol` smart contract, which is live on the Optimism Sepolia testnet.
                </FlowStep>
                <FlowStep number={4} title="API Response">
                    The smart contract's `verifyProof` function returns `true` or `false`. The backend relays this on-chain verification result back to the user.
                </FlowStep>
            </ol>
          </section>

          <section id="api-reference">
            <SectionTitle>API Reference</SectionTitle>
            
            <ApiReference 
                method="GET" 
                path="/trust-score/{address}" 
                description="Retrieves the calculated hybrid trust score for a given wallet address."
            >
              <CodeBlock 
                title="Example Request (cURL)"
                code={`curl https://backend-nvi1.onrender.com/trust-score/0xGURU`}
              />
              <CodeBlock 
                title="Success Response (200 OK)"
                code={JSON.stringify({ address: '0xGURU', score: 100.0 }, null, 2)}
              />
               <CodeBlock 
                title="Error Response (404 Not Found)"
                code={JSON.stringify({ error: 'Score not found for this address.' }, null, 2)}
              />
            </ApiReference>

            <ApiReference
                method="POST"
                path="/verify-endorsement"
                description="Generates a ZK proof for a simple computation and verifies it using an on-chain smart contract."
            >
               <CodeBlock 
                title="Example Request (cURL)"
                code={`curl -X POST -H "Content-Type: application/json" \\\n  -d '{"a": "3", "b": "2"}' \\\n  https://backend-nvi1.onrender.com/verify-endorsement`}
              />
               <CodeBlock 
                title="Success Response (200 OK)"
                code={JSON.stringify({
                  message: 'On-chain verification successful!',
                  isVerified: true,
                  publicOutput: '5'
                }, null, 2)}
              />
            </ApiReference>
          </section>

        </div>
      </div>
    </main>
  )
}