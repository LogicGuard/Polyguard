
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Card from '../common/Card';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
    CpuIcon, GlobeIcon, LayersIcon, SearchIcon, ZapIcon, ActivityIcon, ComplianceIcon,
    BookIcon, CodeIcon, ClockIcon, ChevronDownIcon, CheckCircleIcon, TrendingUpIcon, 
    ShieldCheckIcon, AuditorIcon, FirewallIcon, StarIcon, PlusIcon
} from '../Icons';
import ResultDisplay from '../common/ResultDisplay';
import { useNavigation } from '../../context/NavigationContext';
import Button from '../common/Button';

interface DocArticle {
    id: string;
    title: string;
    icon: React.FC<any>;
    sphere: 'Core_Logic' | 'Infrastructure' | 'Security_Ops' | 'Dev_Resources' | 'Compliance';
    readTime: string;
    version: string;
    content: string;
    status: 'Verified' | 'Beta' | 'Internal';
    author: string;
    schematicId: string;
}

const DOCS_LIBRARY: DocArticle[] = [
    {
        id: 'mission-architecture',
        title: 'Mission Architecture',
        icon: GlobeIcon,
        sphere: 'Core_Logic',
        readTime: '4m',
        version: 'v4.0.0',
        status: 'Verified',
        author: 'Chief_Architect',
        schematicId: '0xPG-771',
        content: `
# Operational Intelligence: Mission Architecture
PolyGuard v4 serves as the definitive security infrastructure layer for the Polygon AggLayer ecosystem.

## Infrastructure Pillars
*   **Decentralized Intelligence:** Distributed LLM kernels processing 1.4B+ signals daily.
*   **Predictive Shielding:** Pre-execution transaction analysis with <400ms latency.
*   **Sovereign Compliance:** Privacy-preserving ZK-proof verification for institutional assets.

> [!INFO]
> PolyGuard version 4.0 utilizes the Gemini 3 Pro kernel for 94.2% precision in zero-day exploit detection.

## The Defense Matrix
Our architecture is designed for zero-regression security. By decoupling the analysis kernel from the execution nodes, we ensure that security updates can be hot-swapped without impacting chain finality.
        `
    },
    {
        id: 'heuristic-kernel',
        title: 'Heuristic Kernel Specs',
        icon: CpuIcon,
        sphere: 'Core_Logic',
        readTime: '12m',
        version: 'v4.1.2',
        status: 'Verified',
        author: 'Kernel_Lead',
        schematicId: '0xPG-202',
        content: `
# Deep-Dive: Heuristic Kernel Logic
The PolyGuard Kernel translates raw EVM bytecode into a multi-dimensional vector space to identify malicious intent.

## The Inference Loop
1.  **Normalization:** Bytecode is decompiled into high-level opcodes.
2.  **Pattern Matching:** The Gemini model identifies recursive call patterns (Reentrancy) and logical inconsistencies.
3.  **Risk Scoring:** A probability matrix determines the "Defcon" level of the transaction.

### Detection Matrix
| Vector | Type | Complexity | Accuracy |
|--------|------|------------|----------|
| REENTRANCY | Logic | High | 98.4% |
| FLASH_LOAN | Economic | Extreme | 92.1% |
| ORACLE_MANIP | External | Medium | 96.5% |

\`\`\`javascript
// Kernel Logic Abstract
async function analyze(bytecode) {
  const vectors = await kernel.extract(bytecode);
  const verdict = await kernel.classify(vectors);
  return verdict.score > 0.85 ? 'BLOCKED' : 'ALLOWED';
}
\`\`\`

> [!CRITICAL]
> All kernel inferences are backed by cryptographic signatures to prevent man-in-the-middle attacks on security verdicts.
        `
    },
    {
        id: 'agglayer-protocol',
        title: 'AggLayer State Sync',
        icon: LayersIcon,
        sphere: 'Infrastructure',
        readTime: '15m',
        version: 'v1.2.0',
        status: 'Beta',
        author: 'Network_Ops',
        schematicId: '0xPG-110',
        content: `
# AggLayer V1: State Synchronization
PolyGuard connects directly to the Polygon Unified Bridge to secure state transitions across multiple ZK-Rollups.

## Pessimistic Proof Verification
Every state update submitted to the AggLayer is intercepted by the PolyGuard Firewall. If a malicious state transition is detected, an automatic "Pessimistic Pause" is broadcast to all peer nodes.

### Logic Flow
*   **Ingestion:** State root hashes are polled from CDK chains.
*   **Verification:** ZK-proofs are re-validated in the secure enclave.
*   **Finality:** Verdicts are pushed to the Aggregator contract.

> [!WARNING]
> High-latency nodes (>800ms) will be temporarily throttled to prevent mempool congestion during state sync events.
        `
    },
    {
        id: 'pessimistic-prover',
        title: 'Pessimistic Prover',
        icon: ShieldCheckIcon,
        sphere: 'Infrastructure',
        readTime: '18m',
        version: 'v1.0.8',
        status: 'Verified',
        author: 'ZK_Architect',
        schematicId: '0xPG-330',
        content: `
# Core Infrastructure: Pessimistic Proving
The Pessimistic Prover is a mandatory security component that ensures no chain can exit with more assets than it has deposited.

## Circuit Logic
The prover generates a proof for every cross-chain transaction, verifying that the delta of assets remains non-negative across the entire AggLayer network.

| Component | Responsibility | Latency |
|-----------|----------------|---------|
| Asset_Map | Balance tracking | <10ms |
| Proof_Gen | SNARK generation | 240ms |
| Verification | Contract call | 45ms |

> [!INFO]
> Failure to submit a Pessimistic Proof within 12 blocks results in an automatic quarantine of the specific CDK chain.
        `
    },
    {
        id: 'soc-sop',
        title: 'SOC Response SOP',
        icon: ActivityIcon,
        sphere: 'Security_Ops',
        readTime: '10m',
        version: 'v2.2.0',
        status: 'Verified',
        author: 'Security_Lead',
        schematicId: '0xPG-404',
        content: `
# SOP: Threat Mitigation Protocols
The Security Operations Center (SOC) manages the manual override and heuristic calibration for the PolyGuard Firewall.

## Defcon Levels
1.  **Nominal:** Standard heuristic filtering active.
2.  **Elevated:** 20% lower threshold for "Blocked" verdicts.
3.  **Critical:** Automatic pause for all unverified bridge contracts.

## Incident Escalation
\`\`\`bash
# Triggering an emergency circuit breaker
polyguard-cli trigger-pause --target 0x... --reason "Reentrancy_Pattern_Detected"
\`\`\`

> [!SUCCESS]
> The v2.2 firewall has neutralized 100% of reported flash-loan vectors in the last quarter through autonomous mitigation.
        `
    },
    {
        id: 'mempool-shield',
        title: 'Mempool Shielding',
        icon: FirewallIcon,
        sphere: 'Security_Ops',
        readTime: '8m',
        version: 'v3.1.2',
        status: 'Beta',
        author: 'Ops_Specialist',
        schematicId: '0xPG-440',
        content: `
# Real-Time Mempool Shielding
PolyGuard monitors the public mempool and private RPC relays (like Flashbots) to identify malicious signatures before they reach a block.

## Pattern Recognition
Our kernel uses "Temporal Heuristics" to identify sequences of transactions that, when combined, form an exploit (e.g., multi-block sandwich attacks or liquidation loops).

### Shield Parameters
*   **Scan Depth:** 100 pending transactions.
*   **Signature Library:** 14,000+ known exploit fragments.
*   **Mitigation:** Automatic front-running of "Cancel" transactions for high-value targets.
        `
    },
    {
        id: 'sdk-integration',
        title: 'Developer Core SDK',
        icon: CodeIcon,
        sphere: 'Dev_Resources',
        readTime: '20m',
        version: 'v0.9.1',
        status: 'Verified',
        author: 'SDK_Maintainer',
        schematicId: '0xPG-912',
        content: `
# PolyGuard SDK Reference
Install the core library to protect your frontend and backend infrastructure.

## Installation
\`\`\`bash
npm install @polyguard/shield-sdk
\`\`\`

## Advanced Implementation
Implement the \`ShieldContext\` to provide real-time feedback to your users during the signing process:

\`\`\`typescript
import { ShieldProvider, useShield } from '@polyguard/shield-sdk';

function TransactionButton({ tx }) {
    const { analyze, status } = useShield();
    
    const handleSign = async () => {
        const report = await analyze(tx);
        if (report.riskLevel > 0.8) {
            alert("Warning: Critical Threat Detected!");
            return;
        }
        // Proceed with wallet signature
    };

    return <button onClick={handleSign} disabled={status === 'busy'}>Sign TX</button>;
}
\`\`\`
        `
    },
    {
        id: 'api-buffer-specs',
        title: 'API Buffer Specs',
        icon: ZapIcon,
        sphere: 'Dev_Resources',
        readTime: '15m',
        version: 'v2.0.0',
        status: 'Internal',
        author: 'Core_Dev',
        schematicId: '0xPG-880',
        content: `
# System Spec: API Buffer
The API Buffer serves as a rate-limited high-performance gateway for institutional data extraction.

## Endpoints
*   **GET /v1/threats:** Returns active global threat vectors.
*   **POST /v1/simulate:** Executes a pre-execution state simulation.
*   **GET /v1/audit/{address}:** Retrieves cached audit results.

### Rate Limits
| Tier | RPM | Daily Quota |
|------|-----|-------------|
| Scout | 15 | 100 |
| Vanguard | 60 | 5,000 |
| Guardian | Unlimited | Unlimited |
        `
    },
    {
        id: 'compliance-zk',
        title: 'ZK Compliance Logic',
        icon: ComplianceIcon,
        sphere: 'Compliance',
        readTime: '10m',
        version: 'v3.1.0',
        status: 'Verified',
        author: 'Compliance_Officer',
        schematicId: '0xPG-550',
        content: `
# Privacy-Preserving Compliance
We leverage Zero-Knowledge Proofs to ensure institutional users meet regulatory requirements without revealing sensitive metadata.

## Proof Circuits
The **ZK-Audit-V2** circuit verifies:
1.  Asset source is not flagged in Sanction Databases.
2.  Transaction volume is within per-account liquidity limits.
3.  Ownership is verified via cryptographic signature.

**Result:** A boolean "Verified" status with zero metadata leakage to the public mempool.
        `
    },
    {
        id: 'regulatory-circuits',
        title: 'Regulatory Circuits',
        icon: AuditorIcon,
        sphere: 'Compliance',
        readTime: '25m',
        version: 'v1.4.0',
        status: 'Internal',
        author: 'Legal_Lead',
        schematicId: '0xPG-560',
        content: `
# Advanced ZK-Circuits for Regulation
This specification details the mathematical construction of compliance proofs used for MiCA and FATF Travel Rule adherence.

## Circuit Definitions
We utilize the **Halo2** proof system to generate compact proofs for complex financial constraints.

### Constraint Examples
*   **KYC_Binding:** Proves that the public key corresponds to a verified ID in the decentralized identity (DID) registry.
*   **Threshold_Proof:** Proves the transaction is under the $10,000 reporting threshold without revealing the exact amount.

> [!INFO]
> These proofs are generated client-side to ensure that PolyGuard servers never touch raw PII (Personally Identifiable Information).
        `
    }
];

const TechnicalDocsView: React.FC = () => {
    const { activeSecondary, setActiveSecondary } = useNavigation();
    const [activeId, setActiveId] = useState(DOCS_LIBRARY[0].id);
    const [searchQuery, setSearchQuery] = useState('');
    const contentRef = useRef<HTMLDivElement>(null);
    
    // Progress Tracking
    const { scrollYProgress } = useScroll({ container: contentRef });
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    useEffect(() => {
        if (activeSecondary && DOCS_LIBRARY.some(d => d.id === activeSecondary)) {
            setActiveId(activeSecondary);
        }
    }, [activeSecondary]);

    const activeDoc = useMemo(() => 
        DOCS_LIBRARY.find(d => d.id === activeId) || DOCS_LIBRARY[0]
    , [activeId]);

    const spheres = ['Core_Logic', 'Infrastructure', 'Security_Ops', 'Dev_Resources', 'Compliance'] as const;

    const handleSelect = (id: string) => {
        setActiveId(id);
        setActiveSecondary(id);
        if (contentRef.current) contentRef.current.scrollTop = 0;
    };

    const filteredDocs = DOCS_LIBRARY.filter(d => 
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.sphere.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col lg:flex-row h-full min-h-[600px] gap-0 lg:gap-6 overflow-hidden max-w-[1800px] mx-auto pb-10 lg:pb-0">
            
            {/* 1. SIDEBAR: KNOWLEDGE GRAPH NAVIGATION */}
            <aside className="w-full lg:w-72 flex flex-col flex-shrink-0">
                <Card className="flex flex-col h-full p-0 bg-[#080808] border-white/10 overflow-hidden shadow-2xl relative">
                    <div className="absolute inset-0 tech-bg opacity-5 pointer-events-none"></div>
                    
                    {/* Search Header */}
                    <div className="p-4 border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-20">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-1.5 bg-blue-500/10 rounded-sm border border-blue-500/20">
                                <BookIcon className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none">Knowledge_Graph</h3>
                                <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Library_v4.2_Stable</span>
                            </div>
                        </div>
                        
                        <div className="relative group">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 transition-colors group-focus-within:text-blue-500" />
                            <input 
                                type="text"
                                placeholder="Filter Knowledge..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#030303] border border-white/5 rounded-sm py-2.5 pl-9 pr-4 text-[10px] font-mono text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder-gray-700"
                            />
                        </div>
                    </div>

                    {/* Hierarchical Document Tree */}
                    <nav className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6 pb-20">
                        {spheres.map(sphere => {
                            const sphereDocs = filteredDocs.filter(d => d.sphere === sphere);
                            if (sphereDocs.length === 0) return null;
                            
                            return (
                                <div key={sphere} className="space-y-1">
                                    <div className="px-3 mb-2 flex items-center gap-2">
                                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] font-mono whitespace-nowrap">{sphere.replace('_', ' ')}</span>
                                        <div className="h-px bg-white/5 flex-1"></div>
                                    </div>
                                    {sphereDocs.map(doc => (
                                        <button
                                            key={doc.id}
                                            onClick={() => handleSelect(doc.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm text-left transition-all relative group ${
                                                activeId === doc.id ? 'bg-blue-500/10 text-white' : 'text-gray-500 hover:bg-white/[0.03] hover:text-gray-300'
                                            }`}
                                        >
                                            {activeId === doc.id && (
                                                <motion.div layoutId="activeDocIndicator" className="absolute left-0 top-0 bottom-0 w-[2px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                            )}
                                            <doc.icon className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${activeId === doc.id ? 'text-blue-400' : 'group-hover:text-white opacity-40 group-hover:opacity-100'}`} />
                                            <span className="text-[10px] font-bold uppercase tracking-wide truncate font-mono flex-1">{doc.title}</span>
                                            <span className="text-[7px] font-mono text-gray-700 group-hover:text-gray-500 transition-colors">{doc.version.split('.')[0]}</span>
                                        </button>
                                    ))}
                                </div>
                            );
                        })}
                        {filteredDocs.length === 0 && (
                            <div className="p-8 text-center">
                                <SearchIcon className="w-6 h-6 text-gray-800 mx-auto mb-2 opacity-20" />
                                <p className="text-[8px] font-mono text-gray-600 uppercase tracking-widest leading-relaxed">No_Matches_Found_In_Library</p>
                            </div>
                        )}
                    </nav>

                    {/* Persistent HUD Footer */}
                    <div className="p-4 bg-black/90 backdrop-blur-md border-t border-white/5 space-y-2 sticky bottom-0 z-20">
                        <div className="flex justify-between items-center text-[8px] font-mono text-gray-600 uppercase">
                            <span>Sys_Status:</span>
                            <span className="text-white font-bold tracking-widest">STABLE</span>
                        </div>
                        <div className="flex justify-between items-center text-[8px] font-mono text-gray-600 uppercase">
                            <span>Integrity:</span>
                            <span className="text-green-500 font-bold flex items-center gap-1">
                                <CheckCircleIcon className="w-2 h-2" /> 100% OK
                            </span>
                        </div>
                    </div>
                </Card>
            </aside>

            {/* 2. MAIN CONTENT: ARTICLE ENGINE */}
            <main className="flex-1 flex flex-col min-w-0 h-full relative">
                <Card className="flex-1 p-0 overflow-hidden bg-[#030303] border-white/10 flex flex-col relative">
                    <div className="absolute inset-0 tech-bg opacity-[0.03] pointer-events-none"></div>
                    
                    {/* Sticky HUD: Article Metadata */}
                    <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#080808]/80 backdrop-blur-xl z-20 flex-shrink-0">
                        <div className="flex items-center gap-6 overflow-hidden">
                            {/* Breadcrumbs */}
                            <div className="flex items-center gap-2 text-[9px] font-mono text-gray-500 uppercase tracking-widest overflow-hidden truncate">
                                <span>Protocol</span>
                                <span className="opacity-20">/</span>
                                <span className="text-blue-400/80">{activeDoc.sphere}</span>
                                <span className="opacity-20">/</span>
                                <span className="text-white truncate font-bold">{activeDoc.title}</span>
                            </div>
                            <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
                            <div className="hidden sm:flex items-center gap-4 text-[9px] font-mono text-gray-500 uppercase tracking-widest flex-shrink-0">
                                <span className="flex items-center gap-1.5"><ClockIcon className="w-3 h-3" /> {activeDoc.readTime} Read</span>
                                <span className="flex items-center gap-1.5"><CodeIcon className="w-3 h-3" /> {activeDoc.version}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest ${
                                activeDoc.status === 'Verified' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                                activeDoc.status === 'Beta' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                                'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                            }`}>
                                {activeDoc.status}
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar Tracking */}
                    <motion.div 
                        className="h-[1px] bg-blue-500 shadow-[0_0_15px_#3b82f6] z-30"
                        style={{ scaleX, transformOrigin: "0%" }}
                    />

                    {/* Document Viewport */}
                    <div ref={contentRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-20 relative">
                        <motion.div
                            key={activeId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-4xl mx-auto"
                        >
                            {/* Page Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 border-b border-white/5 pb-10 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <activeDoc.icon className="w-6 h-6 text-blue-500" />
                                        <span className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.5em]">Schematic_ID_{activeDoc.schematicId}</span>
                                    </div>
                                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">{activeDoc.title}</h1>
                                </div>
                                <div className="text-left md:text-right">
                                    <div className="text-[8px] font-mono text-gray-600 uppercase font-black tracking-widest">Author_Identifier</div>
                                    <div className="text-[10px] font-mono text-white flex items-center md:justify-end gap-2 mt-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                        {activeDoc.author}
                                    </div>
                                    <div className="mt-4 flex gap-2 md:justify-end">
                                        <div className="px-2 py-1 bg-white/5 border border-white/10 text-[8px] font-mono text-gray-400 rounded-sm">LANG: EN_US</div>
                                        <div className="px-2 py-1 bg-white/5 border border-white/10 text-[8px] font-mono text-gray-400 rounded-sm">ENC: AES_256</div>
                                    </div>
                                </div>
                            </div>

                            <ResultDisplay content={activeDoc.content} />

                            {/* Related Actions Primitives */}
                            <div className="mt-24 pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card 
                                    onClick={() => handleSelect('sdk-integration')}
                                    className="p-8 bg-white/[0.02] border-white/5 hover:border-blue-500/30 transition-all group/cta cursor-pointer rounded-none relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-2 opacity-5 group-hover/cta:opacity-10 transition-opacity">
                                        <CodeIcon className="w-24 h-24 text-white" />
                                    </div>
                                    <div className="flex items-start gap-5 relative z-10">
                                        <div className="p-3 bg-blue-500/10 rounded-sm border border-blue-500/10 group-hover/cta:bg-blue-500 group-hover/cta:text-black transition-all">
                                            <CodeIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-[12px] font-black text-white uppercase mb-2 tracking-widest">Core_Integration</h4>
                                            <p className="text-[10px] text-gray-500 font-mono uppercase leading-relaxed tracking-tight">Deploy the core SDK buffer and established defense primitives.</p>
                                        </div>
                                    </div>
                                </Card>
                                <Card 
                                    onClick={() => handleSelect('soc-sop')}
                                    className="p-8 bg-white/[0.02] border-white/5 hover:border-polygon-purple/30 transition-all group/cta cursor-pointer rounded-none relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-2 opacity-5 group-hover/cta:opacity-10 transition-opacity">
                                        <FirewallIcon className="w-24 h-24 text-white" />
                                    </div>
                                    <div className="flex items-start gap-5 relative z-10">
                                        <div className="p-3 bg-polygon-purple/10 rounded-sm border border-polygon-purple/10 group-hover/cta:bg-polygon-purple group-hover/cta:text-white transition-all">
                                            <FirewallIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-[12px] font-black text-white uppercase mb-2 tracking-widest">Policy_SOP</h4>
                                            <p className="text-[10px] text-gray-500 font-mono uppercase leading-relaxed tracking-tight">Configure firewall logic gates and autonomous mitigation rulesets.</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Institutional Footer */}
                            <div className="mt-40 p-8 bg-[#080808] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none"></div>
                                <div className="space-y-1 text-center md:text-left relative z-10">
                                    <p className="text-[11px] text-gray-300 font-black uppercase tracking-[0.3em]">End of Specification</p>
                                    <p className="text-[9px] text-gray-600 font-mono uppercase tracking-widest">Verified by PolyGuard Global Defense Cluster // SIG: {Math.random().toString(36).substr(2, 16).toUpperCase()}</p>
                                </div>
                                <Button variant="secondary" className="text-[9px] px-8 py-3 !border-white/10 hover:!bg-white/5 !rounded-none relative z-10">
                                    EXFIL_OFFLINE_DOCS.PDF
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </Card>
            </main>
        </div>
    );
};

export default TechnicalDocsView;
