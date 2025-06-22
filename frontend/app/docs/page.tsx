import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, TestTube2, User, Users, Bot } from 'lucide-react'

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

// Reusable component for Persona cards
const PersonaCard = ({ icon, title, description, addresses }: { icon: React.ReactNode, title: string, description: string, addresses: string[] }) => (
    <div className="bg-white/5 border border-gray-800 rounded-lg p-6">
        <div className="flex items-start space-x-4">
            <div className="text-cyan-400 mt-1">{icon}</div>
            <div>
                <h4 className="font-bold text-white">{title}</h4>
                <p className="text-sm text-gray-400 mt-1 mb-3">{description}</p>
                <div className="flex flex-wrap gap-2">
                    {addresses.map(address => (
                        <code key={address} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">{address}</code>
                    ))}
                </div>
            </div>
        </div>
    </div>
);


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
          
          <section>
            <SectionTitle>Example Personas & Test Cases</SectionTitle>
            <div className="grid md:grid-cols-2 gap-4">
                <PersonaCard 
                    icon={<Bot size={20}/>}
                    title="The Highly-Connected Influencer"
                    description="A central node with many positive endorsements. Receives the highest PageRank and a significant sentiment boost."
                    addresses={["0xGURU"]}
                />
                <PersonaCard 
                    icon={<User size={20}/>}
                    title="The Core Contributor"
                    description="An active developer with multiple project collaborations and strong, reciprocal endorsements."
                    addresses={["0xA1", "0xB2"]}
                />
                <PersonaCard 
                    icon={<Users size={20}/>}
                    title="The Organization (DAO)"
                    description="Scores for entities like DAOs are derived from the collective reputation of their contributors."
                    addresses={["DAO1", "ProtocolX", "DAO2"]}
                />
                <PersonaCard 
                    icon={<TestTube2 size={20}/>}
                    title="Other Test Addresses"
                    description="A variety of other contributors included in the dataset to test with."
                    addresses={["0xC3", "0xD4", "0xE5", "0xF6"]}
                />
            </div>
          </section>

          <section id="pipeline-flow">
            <SectionTitle>Data & Scoring Pipeline Flow</SectionTitle>
            <ol className="relative border-l border-gray-700">
                 <FlowStep number={1} title="Data Seeding">The process begins by populating our MongoDB Atlas database with raw interaction data (collaborations, endorsements, profiles) from local JSON sources.</FlowStep>
                 <FlowStep number={2} title="Graph Construction">The Python script reads the raw data and uses the `networkx` library to construct a weighted, directed graph of all entities.</FlowStep>
                 <FlowStep number={3} title="Sentiment Analysis (NLP)">For `endorsement` interactions, a Hugging Face model performs sentiment analysis on the text to calculate a positive or negative score modifier.</FlowStep>
                 <FlowStep number={4} title="PageRank Calculation">The PageRank algorithm runs on the graph, calculating a base score for each node based on its network influence and connection weights.</FlowStep>
                 <FlowStep number={5} title="Hybrid Score & Normalization">The sentiment modifier is applied to the PageRank score, and the final hybrid score is normalized to a 0-100 scale.</FlowStep>
                 <FlowStep number={6} title="Save to Database">The final scores are saved to the `trust_scores` collection in MongoDB, ready to be served by the API.</FlowStep>
            </ol>
          </section>

          <section id="zk-flow">
            <SectionTitle>Zero-Knowledge Verification Flow</SectionTitle>
            <ol className="relative border-l border-gray-700">
                <FlowStep number={1} title="API Request">A POST request is sent to the `/verify-endorsement` endpoint with private inputs.</FlowStep>
                <FlowStep number={2} title="Off-Chain Proof Generation">The Node.js backend uses `snarkjs` and pre-compiled circuit artifacts to generate a valid Groth16 cryptographic proof.</FlowStep>
                <FlowStep number={3} title="On-Chain Verification">The backend relays this proof to our `Groth16Verifier.sol` smart contract on the Optimism Sepolia testnet.</FlowStep>
                <FlowStep number={4} title="API Response">The smart contract's `verifyProof` function returns `true` or `false`, which the API relays back to the client.</FlowStep>
            </ol>
          </section>

          <section id="api-reference">
            <SectionTitle>API Reference</SectionTitle>
            <ApiReference method="GET" path="/trust-score/{address}" description="Retrieves the calculated hybrid trust score for a given wallet address.">
              <CodeBlock title="Example Request (cURL)" code={`curl https://backend-nvi1.onrender.com/trust-score/0xGURU`} />
              <CodeBlock title="Success Response (200 OK)" code={JSON.stringify({ address: '0xGURU', score: 100.0 }, null, 2)} />
            </ApiReference>
            <ApiReference method="POST" path="/verify-endorsement" description="Generates a ZK proof for a simple computation and verifies it on-chain.">
               <CodeBlock title="Example Request (cURL)" code={`curl -X POST -H "Content-Type: application/json" \\\n  -d '{"a": "3", "b": "2"}' \\\n  https://backend-nvi1.onrender.com/verify-endorsement`} />
               <CodeBlock title="Success Response (200 OK)" code={JSON.stringify({ message: 'On-chain verification successful!', isVerified: true, publicOutput: '5' }, null, 2)} />
            </ApiReference>
          </section>

        </div>
      </div>
    </main>
  )
}