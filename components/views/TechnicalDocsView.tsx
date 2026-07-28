
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
        readTime: '4m',
        version: 'v4.0.0',
        status: 'Verified',
        author: 'Chief_Architect',
        schematicId: '0xPG-771',
        content: `
# Operational Intelligence: Mission Architecture
PolyGuard v4 serves as the definitive security infrastructure layer for the Polygon AggLayer ecosystem.

## Modular Interconnectivity
The system is built on a "Continuum" model where individual modules interact via a high-speed data bus. This allows for isolated failure domains and parallel heuristic processing.

[ARCHITECTURE_VISUALIZER]

## Infrastructure Pillars
*   **Decentralized Intelligence:** Distributed LLM kernels processing 1.4B+ signals daily.
*   **Predictive Shielding:** Pre-execution transaction analysis with <400ms latency.
*   **Sovereign Compliance:** Privacy-preserving ZK-proof verification for institutional assets.
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
# PolyGuard: Security Audit Methodology
Our proprietary approach to securing high-TVL Polygon protocols combines automated heuristics with rigorous formal verification.
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
# Secure Development: Best Practices
Architecting resilient smart contracts for the Polygon AggLayer requires adherence to strict isolation and safety patterns.
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
                                    <Button variant="secondary" className="text-[9px] px-8 py-3 !rounded-none relative z-10 font-bold">
                                        EXFIL_OFFLINE_DOCS.PDF
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
