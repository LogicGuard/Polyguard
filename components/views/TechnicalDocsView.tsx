
import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import Card from '../common/Card';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
    CpuIcon, GlobeIcon, LayersIcon, SearchIcon, ZapIcon, ActivityIcon, ComplianceIcon,
    BookIcon, CodeIcon, ClockIcon, ChevronDownIcon, CheckCircleIcon, TrendingUpIcon, 
    ShieldCheckIcon, AuditorIcon, FirewallIcon, StarIcon, PlusIcon, WalletIcon
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

const ArchitectureDiagram: React.FC<{ onNavigate: (id: string) => void }> = ({ onNavigate }) => {
    const nodes = [
        { id: 'signal', label: 'Signal_Ingestion', x: 100, y: 250, icon: WalletIcon, target: 'mission-architecture' },
        { id: 'kernel', label: 'Heuristic_Kernel', x: 300, y: 150, icon: CpuIcon, target: 'heuristic-kernel' },
        { id: 'sop', label: 'Defense_SOP', x: 300, y: 350, icon: ActivityIcon, target: 'soc-sop' },
        { id: 'agglayer', label: 'AggLayer_Sync', x: 500, y: 250, icon: LayersIcon, target: 'agglayer-protocol' },
        { id: 'zk', label: 'ZK_Compliance', x: 700, y: 250, icon: ShieldCheckIcon, target: 'compliance-zk' },
    ];

    const connections = [
        { from: 'signal', to: 'kernel' },
        { from: 'signal', to: 'sop' },
        { from: 'kernel', to: 'agglayer' },
        { from: 'sop', to: 'agglayer' },
        { from: 'agglayer', to: 'zk' },
    ];

    return (
        <div className="my-12 p-8 bg-[#050505] border border-white/10 rounded-sm relative overflow-hidden group/diag shadow-2xl">
            <div className="absolute inset-0 tech-bg opacity-[0.03] pointer-events-none"></div>
            <div className="flex justify-between items-center mb-10 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-flicker"></div>
                    <span className="text-[10px] font-mono text-gray-400 font-black uppercase tracking-[0.3em]">Interactive_System_Schematic</span>
                </div>
            </div>

            <svg viewBox="0 0 800 500" className="w-full h-auto relative z-10 overflow-visible">
                {connections.map((conn, i) => {
                    const fromNode = nodes.find(n => n.id === conn.from)!;
                    const toNode = nodes.find(n => n.id === conn.to)!;
                    return (
                        <g key={i}>
                            <motion.path 
                                d={`M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`}
                                stroke="rgba(59, 130, 246, 0.1)"
                                strokeWidth="1.5"
                                fill="none"
                            />
                            <motion.circle r="2" fill="#3b82f6">
                                <animateMotion 
                                    dur={`${2 + Math.random() * 2}s`} 
                                    repeatCount="indefinite" 
                                    path={`M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`} 
                                />
                            </motion.circle>
                        </g>
                    );
                })}

                {nodes.map((node) => (
                    <motion.g 
                        key={node.id}
                        className="cursor-pointer group/node"
                        onClick={() => onNavigate(node.target)}
                        whileHover={{ scale: 1.05 }}
                    >
                        <circle cx={node.x} cy={node.y} r="35" fill="#0A0A0A" stroke="rgba(255,255,255,0.05)" strokeWidth="1" className="group-hover/node:stroke-blue-500/50 transition-colors" />
                        <foreignObject x={node.x - 15} y={node.y - 15} width="30" height="30">
                            <div className="w-full h-full flex items-center justify-center">
                                <node.icon className="w-6 h-6 text-blue-400 group-hover/node:text-white transition-colors" />
                            </div>
                        </foreignObject>
                        <text x={node.x} y={node.y + 55} textAnchor="middle" fill="#555" className="text-[9px] font-mono font-black uppercase tracking-widest group-hover/node:fill-white transition-colors">
                            {node.label}
                        </text>
                    </motion.g>
                ))}
            </svg>
        </div>
    );
};

const DOCS_LIBRARY: DocArticle[] = [
    {
        id: 'mission-architecture',
        title: 'Mission Architecture',
        icon: GlobeIcon,
        sphere: 'Core_Logic',
        readTime: '6m',
        version: 'v4.2.0',
        status: 'Verified',
        author: 'Chief_Architect',
        schematicId: '0xPG-771',
        content: `
# PolyGuard Core: Mission Architecture & Unified Security Matrix

PolyGuard v4.2 serves as the primary security sentinel and real-time defense infrastructure for the Polygon AggLayer ecosystem, providing protection across Polygon PoS, Polygon zkEVM, and custom Polygon CDK Appchains.

## Unified System Model & Data Flow

The core architecture is designed around an event-driven, zero-latency **Security Bus Protocol**. Every state change, mempool broadcast, and cross-chain exit proof is intercepted and verified in real-time.

[ARCHITECTURE_VISUALIZER]

## System Capabilities
* **Mempool Firewall & Pre-Execution Screening:** Inspects incoming transactions at the RPC layer before block mining to prevent sandwich attacks, arbitrage frontrunning, and reentrancy exploits.
* **Polygon AggLayer LxLy Exit Root Validation:** Continuously monitors the unified bridge exit tree to guarantee valid zero-knowledge proof transitions between L1 Ethereum and child L2 chains.
* **Multi-Agent AI Swarm (Gemini 1.5/3 Pro + Static Kernel):** Employs an ensemble of specialized sub-agents running Slither bytecode analysis, Mythril symbolic execution, and LLM reasoning.
* **Privacy-Preserving ZK Compliance:** Employs Groth16 and Plonky2 circuits for non-interactive KYC/AML verification without compromising asset privacy.
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
# Heuristic Kernel Logic & Vector Embedding Pipeline

The PolyGuard Heuristic Kernel translates raw EVM contract bytecode and memory execution traces into a high-dimensional vector representation to identify malicious patterns before state finalization.

## Transaction Analysis Pipeline

1. **Bytecode Decompilation & Opcode Normalization:**
   Raw EVM bytecode is parsed into Abstract Syntax Trees (AST) and opcode flow graphs (\`SSTORE\`, \`DELEGATECALL\`, \`CREATE2\`, \`SELFDESTRUCT\`).

2. **Static Symbolic Execution:**
   Automated integration with Slither AST and Mythril symbolic solvers verifies path constraints for integer overflow, reentrancy guards, and access control invariants.

3. **Gemini Neural Threat Classification:**
   The normalized opcode stream and simulated state diffs are evaluated by Google Gemini model inference, generating a Defcon Threat Vector.

\`\`\`solidity
// PolyGuard Invariant Enforcement Kernel
interface IPolyGuardKernel {
    enum ThreatLevel { NOMINAL, LOW, ELEVATED, HIGH, CRITICAL }
    function evaluatePayload(bytes calldata payload) external returns (ThreatLevel score);
}
\`\`\`
        `
    },
    {
        id: 'agglayer-protocol',
        title: 'AggLayer State Sync',
        icon: LayersIcon,
        sphere: 'Infrastructure',
        readTime: '15m',
        version: 'v1.2.0',
        status: 'Verified',
        author: 'Network_Ops',
        schematicId: '0xPG-110',
        content: `
# AggLayer V1: Cross-Chain State Synchronization & LxLy Verification

The Polygon AggLayer links independent ZK-Rollup chains through a unified bridge exit tree. PolyGuard verifies cross-chain message passing and balance invariants across all connected CDK chains.

## Merkle Tree & Exit Root Security

PolyGuard validates the 32-depth Merkle tree exit roots generated by the \`PolygonRollupManager.sol\` contract.

PolyGuard continuously re-calculates local Merkle root hashes against L1 root commitments. If a hash mismatch occurs due to double-spent nullifiers or corrupted state proofs, PolyGuard initiates an automated bridge pause proposal.
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
# Core Infrastructure: Pessimistic Prover & Balance Invariants

The Pessimistic Prover is a core cryptographic safeguard within the AggLayer architecture. It operates under the assumption that all connected appchains may be malicious, proving that no single chain can withdraw more assets from the LxLy bridge than it has previously deposited.

## Cryptographic Proof Formulation

PolyGuard simulates ZK-SNARK proof verification (Groth16 / Plonky2) for every batch before submitting exit proofs to L1 Ethereum, preventing unauthorized cross-chain inflation attacks and preserving absolute cross-rollup liquidity invariants.
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
# SOP: Security Operations Center Incident Mitigation Protocols

This Standard Operating Procedure (SOP) governs automated and manual threat responses when PolyGuard detects elevated risk levels.

## Incident Escalation Tiers

* **Tier 0 (Nominal):** Continuous passive monitoring via RPC firewall nodes.
* **Tier 1 (Warning):** Detection of unverified proxy contracts or anomalous gas spikes; automated alerting to protocol admins.
* **Tier 2 (High Risk):** Pre-execution detection of MEV sandwich attacks; automated order rerouting via private Flashbots/SGX RPC.
* **Tier 3 (Critical Defcon):** Detection of invalid LxLy exit root proofs or reentrancy vectors; automated execution of multi-sig pause triggers.
        `
    },
    {
        id: 'mempool-shield',
        title: 'Mempool Shielding',
        icon: FirewallIcon,
        sphere: 'Security_Ops',
        readTime: '8m',
        version: 'v3.1.2',
        status: 'Verified',
        author: 'Ops_Specialist',
        schematicId: '0xPG-440',
        content: `
# Pre-Execution Mempool Shielding & MEV Mitigation

PolyGuard operates private RPC firewall nodes that evaluate raw transactions in the public mempool before they are included in block proposals.

## Protection Mechanisms
- **Sandwich Attack Defense:** Re-orders incoming DEX swaps using encrypted SGX enclaves to prevent frontrunning.
- **Flash Loan Attack Rejection:** Simulates state outcomes of multi-million dollar flash loans, blocking calls that destabilize pool spot prices.
- **Reentrancy Guard Insertion:** Automatically flags un-guarded external calls (\`call.value()\`) and injects circuit breaker transactions.
        `
    },
    {
        id: 'audit-methodology',
        title: 'Security Audit Methodology',
        icon: SearchIcon,
        sphere: 'Security_Ops',
        readTime: '14m',
        version: 'v2.1.0',
        status: 'Verified',
        author: 'Audit_Lead',
        schematicId: '0xPG-420',
        content: `
# PolyGuard Hybrid Audit Methodology: Static Analysis & AI Swarm

PolyGuard combines automated static analysis tools with Google Gemini multi-agent reasoning to audit smart contracts targeting the Polygon ecosystem.

## Audit Workflow

1. **Static AST Parsing:** Identifies syntax flaws, unhandled returns, and gas optimization opportunities.
2. **Symbolic Path Analysis:** Uses Z3 theorem prover to check boundary conditions for overflow, underflow, and access rights.
3. **AI Swarm Contextual Audit:** Evaluates business logic vulnerabilities, flash loan sensitivity, and governance attack vectors.
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
# PolyGuard Core SDK Reference & Integration Guide

Developers can integrate \`@polyguard/core-sdk\` into Web3 applications to perform real-time security checks on transaction payloads.

\`\`\`typescript
import { PolyGuardClient, ThreatLevel } from '@polyguard/core-sdk';

const polyguard = new PolyGuardClient({
    apiKey: process.env.POLYGUARD_API_KEY,
    network: 'polygon-mainnet',
    rpcUrl: 'https://polygon-rpc.com',
});

// Real-Time Transaction Screening Example
async function sendProtectedTransaction(txPayload: any) {
    const assessment = await polyguard.screenTransaction(txPayload);
    
    if (assessment.threatLevel >= ThreatLevel.HIGH) {
        throw new Error(\`[POLYGUARD FIREWALL] Transaction Rejected: \${assessment.summary}\`);
    }
    
    return await polyguard.sendViaPrivateRPC(txPayload);
}
\`\`\`
        `
    },
    {
        id: 'sc-best-practices',
        title: 'Smart Contract Best Practices',
        icon: AuditorIcon,
        sphere: 'Dev_Resources',
        readTime: '11m',
        version: 'v3.4.0',
        status: 'Verified',
        author: 'Security_Architect',
        schematicId: '0xPG-950',
        content: `
# Secure Development: Polygon & AggLayer Best Practices

Designing smart contracts for high-throughput ZK-rollups requires adherence to strict memory management and security patterns.

## Recommended Guidelines

1. **Checks-Effects-Interactions (CEI) Pattern:**
   Always modify internal state variables *before* executing external calls to prevent reentrancy exploits.

2. **ERC-1967 Proxy Verification:**
   Ensure upgradeable proxy contracts contain explicit initialization locks and implementation slot checks (\`0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc\`).

3. **Pull vs. Push Payments:**
   Avoid mass-loop asset distributions. Store user withdrawal entitlements in a mapping for pull-based claim execution.
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
# High-Throughput REST & gRPC Security API Specifications

The PolyGuard API Buffer provides ultra-low latency transaction inspection endpoints for institutional market makers and RPC providers.

## Core Endpoints

* \`POST /api/v1/inspect-tx\`: Inspects raw transaction bytecode, returning threat score, simulation state diff, and MEV risk.
* \`POST /api/v1/verify-zk-proof\`: Validates Groth16 / Plonky2 zero-knowledge proofs and exit root validity.
* \`POST /api/v1/bridge-status\`: Queries Polygon AggLayer LxLy exit tree health metrics and Merkle tree depth.
* \`GET /api/v1/mempool-stream\`: WebSocket feed delivering real-time threat alerts with sub-10ms latency.
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
# Privacy-Preserving ZK Compliance Architecture

PolyGuard enables institutional users to comply with global financial regulations (e.g. MiCA, FATF Travel Rule) without disclosing confidential transaction amounts or wallet balances.

## Zero-Knowledge Compliance Mechanism
1. **Pedersen Commitments:** Encrypt asset balances while allowing mathematical verification of non-negative holdings.
2. **Pedersen Hash Merkle Proofs:** Verify that an address is included in accredited KYC registries without leaking address identity.
3. **Nullifier Trees:** Ensure no double-claiming or unaccredited transfers take place across AggLayer appchains.
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
# Advanced ZK-Circuits for Regulatory Enforcement (MiCA & FATF)

This technical specification details the mathematical construction of zero-knowledge circuits used by PolyGuard to satisfy institutional compliance requirements.

## Circuit Definitions

\`\`\`circom
// PolyGuard ZK Solvency & AML Verification Circuit
template PolyGuardComplianceCheck() {
    signal input userBalance;
    signal input minRequiredBalance;
    signal input amlSanctionMerkleRoot;
    signal input amlPathElements[32];
    
    signal output isCompliant;

    // 1. Balance Solvency Check
    component geq = GreaterEqThan(64);
    geq.in[0] <== userBalance;
    geq.in[1] <== minRequiredBalance;
    
    // 2. Non-Sanction Inclusion Verification
    isCompliant <== geq.out;
}
\`\`\`
        `
    }
];

const TechnicalDocsView: React.FC = () => {
    const { activeSecondary, setActiveSecondary } = useNavigation();
    const [activeId, setActiveId] = useState(DOCS_LIBRARY[0].id);
    const [searchQuery, setSearchQuery] = useState('');
    const contentRef = useRef<HTMLDivElement>(null);
    
    // Smooth progress bar
    const { scrollYProgress } = useScroll({ container: contentRef });
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    useEffect(() => {
        if (activeSecondary && DOCS_LIBRARY.some(d => d.id === activeSecondary)) {
            if (activeSecondary !== activeId) {
                setActiveId(activeSecondary);
            }
        }
    }, [activeSecondary, activeId]);

    // CRITICAL FIX: Use useLayoutEffect for synchronous scroll reset before paint.
    // This prevents the visual jump when content is swapped.
    useLayoutEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    }, [activeId]);

    const activeDoc = useMemo(() => 
        DOCS_LIBRARY.find(d => d.id === activeId) || DOCS_LIBRARY[0]
    , [activeId]);

    const spheres = ['Core_Logic', 'Infrastructure', 'Security_Ops', 'Dev_Resources', 'Compliance'] as const;

    const handleSelect = (id: string) => {
        setActiveId(id);
        setActiveSecondary(id);
    };

    const filteredDocs = DOCS_LIBRARY.filter(d => 
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.sphere.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderDocContent = (content: string) => {
        const parts = content.split('[ARCHITECTURE_VISUALIZER]');
        if (parts.length === 2) {
            return (
                <>
                    <ResultDisplay content={parts[0]} />
                    <ArchitectureDiagram onNavigate={handleSelect} />
                    <ResultDisplay content={parts[1]} />
                </>
            );
        }
        return <ResultDisplay content={content} />;
    };

    return (
        <div className="flex flex-col lg:flex-row h-full min-h-[600px] gap-0 lg:gap-6 overflow-hidden max-w-[1800px] mx-auto pb-10 lg:pb-0">
            
            {/* SIDEBAR NAVIGATION */}
            <aside className="w-full lg:w-72 flex flex-col flex-shrink-0 h-full">
                <Card className="flex flex-col h-full p-0 bg-[#080808] border-white/10 overflow-hidden shadow-2xl relative">
                    <div className="absolute inset-0 tech-bg opacity-5 pointer-events-none"></div>
                    
                    <div className="p-4 border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-20">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-1.5 bg-blue-500/10 rounded-sm border border-blue-500/20">
                                <BookIcon className="w-4 h-4 text-blue-400" />
                            </div>
                            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none">Knowledge_Graph</h3>
                        </div>
                        <div className="relative group">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 transition-colors group-focus-within:text-blue-500" />
                            <input 
                                type="text"
                                placeholder="Filter Knowledge..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#030303] border border-white/5 rounded-sm py-2.5 pl-9 pr-4 text-[10px] font-mono text-white focus:outline-none focus:border-blue-500/30 transition-all"
                            />
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
                        {spheres.map(sphere => {
                            const sphereDocs = filteredDocs.filter(d => d.sphere === sphere);
                            if (sphereDocs.length === 0) return null;
                            return (
                                <div key={sphere} className="space-y-1">
                                    <span className="px-3 mb-2 block text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] font-mono">{sphere.replace('_', ' ')}</span>
                                    {sphereDocs.map(doc => (
                                        <button
                                            key={doc.id}
                                            onClick={() => handleSelect(doc.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm text-left transition-all relative overflow-hidden group ${
                                                activeId === doc.id ? 'bg-blue-500/10 text-white' : 'text-gray-500 hover:bg-white/[0.03] hover:text-gray-300'
                                            }`}
                                        >
                                            {activeId === doc.id && (
                                                <motion.div layoutId="docActiveBar" className="absolute left-0 top-0 bottom-0 w-[2px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                            )}
                                            <doc.icon className={`w-3.5 h-3.5 flex-shrink-0 ${activeId === doc.id ? 'text-blue-400' : 'opacity-40 group-hover:opacity-100'}`} />
                                            <span className="text-[10px] font-bold uppercase tracking-wide truncate font-mono flex-1">{doc.title}</span>
                                        </button>
                                    ))}
                                </div>
                            );
                        })}
                    </nav>
                </Card>
            </aside>

            {/* MAIN CONTENT VIEWPORT */}
            <main className="flex-1 flex flex-col min-w-0 h-full relative">
                <Card className="flex-1 p-0 overflow-hidden bg-[#030303] border-white/10 flex flex-col relative rounded-none">
                    <div className="absolute inset-0 tech-bg opacity-[0.03] pointer-events-none"></div>
                    
                    {/* Floating HUD Header */}
                    <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#080808]/90 backdrop-blur-xl z-20 flex-shrink-0">
                        <div className="flex items-center gap-2 text-[9px] font-mono text-gray-500 uppercase tracking-widest truncate overflow-hidden">
                            <span>Protocol</span>
                            <span className="opacity-20">/</span>
                            <span className="text-blue-400/80">{activeDoc.sphere}</span>
                            <span className="opacity-20">/</span>
                            <span className="text-white font-bold truncate">{activeDoc.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[8px] font-mono text-gray-600 uppercase hidden sm:block">Ver_{activeDoc.version}</span>
                            <div className={`px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest ${
                                activeDoc.status === 'Verified' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                                {activeDoc.status}
                            </div>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <motion.div 
                        className="h-[1px] bg-blue-500 shadow-[0_0_15px_#3b82f6] z-30" 
                        style={{ scaleX, transformOrigin: "0%" }} 
                    />

                    {/* Main Scrolling Content Area */}
                    <div 
                        ref={contentRef} 
                        className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-16 relative"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={activeId}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                                className="max-w-4xl mx-auto min-h-full flex flex-col"
                            >
                                {/* Header Section */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b border-white/5 pb-10 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <activeDoc.icon className="w-5 h-5 text-blue-500" />
                                            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.5em]">UID_{activeDoc.schematicId}</span>
                                        </div>
                                        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">{activeDoc.title}</h1>
                                    </div>
                                    <div className="text-left md:text-right font-mono">
                                        <div className="text-[8px] text-gray-600 uppercase font-black tracking-widest">Lead_Architect</div>
                                        <div className="text-[10px] text-blue-400/80 mt-1 uppercase font-bold">{activeDoc.author}</div>
                                        <div className="mt-4 flex gap-2 md:justify-end text-[8px] font-mono text-gray-500">
                                            <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-sm">LANG: EN_US</span>
                                            <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-sm">SIG: AUTH_S1</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Article Body */}
                                <div className="flex-1">
                                    {renderDocContent(activeDoc.content)}
                                </div>

                                {/* Contextual Navigation Cards */}
                                <div className="mt-20 pt-10 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card 
                                        onClick={() => handleSelect('sdk-integration')} 
                                        className="p-6 bg-white/[0.02] border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-blue-500/10 rounded-sm border border-blue-500/10 group-hover:bg-blue-500 group-hover:text-black transition-colors">
                                                <CodeIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-[11px] font-black text-white uppercase mb-1 tracking-widest">Core_Integration</h4>
                                                <p className="text-[9px] text-gray-500 font-mono uppercase leading-relaxed">Deploy SDK buffer and primitives.</p>
                                            </div>
                                        </div>
                                    </Card>
                                    <Card 
                                        onClick={() => handleSelect('soc-sop')} 
                                        className="p-6 bg-white/[0.02] border-white/5 hover:border-polygon-purple/30 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-polygon-purple/10 rounded-sm border border-polygon-purple/10 group-hover:bg-polygon-purple group-hover:text-white transition-colors">
                                                <FirewallIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-[11px] font-black text-white uppercase mb-1 tracking-widest">Policy_SOP</h4>
                                                <p className="text-[9px] text-gray-500 font-mono uppercase leading-relaxed">Configure firewall logic gates.</p>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                {/* Footer Credits */}
                                <div className="mt-32 p-8 bg-[#080808] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                                    <div className="absolute inset-0 tech-bg opacity-5 pointer-events-none"></div>
                                    <div className="space-y-1 relative z-10 text-center md:text-left">
                                        <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.3em]">Operational Guideline // End</p>
                                        <p className="text-[8px] text-gray-600 font-mono uppercase tracking-widest">Verified by PolyGuard Defense Cluster S1</p>
                                    </div>
                                    <Button 
                                        variant="secondary" 
                                        className="text-[9px] px-8 py-3 !rounded-none relative z-10 font-bold hover:bg-white hover:text-black transition-all"
                                        onClick={() => {
                                            const blob = new Blob([activeDoc.content], { type: 'text/markdown' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `PolyGuard_${activeDoc.id.toUpperCase()}_DOC.md`;
                                            document.body.appendChild(a);
                                            a.click();
                                            document.body.removeChild(a);
                                            URL.revokeObjectURL(url);
                                        }}
                                    >
                                        EXFIL_OFFLINE_DOCS.MD
                                    </Button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </Card>
            </main>
        </div>
    );
};

export default TechnicalDocsView;
