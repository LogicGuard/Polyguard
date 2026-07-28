
import React, { useState, useEffect, useRef } from 'react';
import { Textarea } from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import { analyzeSmartContractAudit } from '../../services/geminiService';
import { SmartContractAuditResult } from '../../types';
import { AuditorIcon, CpuIcon, ShieldCheckIcon, ActivityIcon, ZapIcon, ThreatIcon } from '../Icons';
import { motion, AnimatePresence } from 'framer-motion';

const SmartContractAuditorView: React.FC = () => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<SmartContractAuditResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [scanProgress, setScanProgress] = useState(0);
    const [mockLogs, setMockLogs] = useState<string[]>([]);
    
    const logIntervalRef = useRef<any>(null);

    const logMessages = [
        "INITIALIZING_KERNEL...",
        "DECOMPILING_BYTECODE...",
        "MAPPING_CONTROL_FLOW_GRAPH...",
        "CHECKING_REENTRANCY_VECTORS...",
        "VERIFYING_ACCESS_CONTROL...",
        "OPTIMIZING_GAS_PATHS...",
        "RUNNING_STATIC_ANALYSIS...",
        "GEMINI_INFERENCE_IN_PROGRESS...",
        "GENERATING_FINAL_REPORT..."
    ];

    const handleAnalyze = async () => {
        if (!code.trim()) {
            setError('VALIDATION_ERROR: Source code buffer empty.');
            return;
        }
        setIsLoading(true);
        setResult(null);
        setError(null);
        setScanProgress(0);
        setMockLogs([]);

        let logIdx = 0;
        logIntervalRef.current = setInterval(() => {
            if (logIdx < logMessages.length) {
                setMockLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${logMessages[logIdx]}`]);
                setScanProgress((logIdx + 1) * (100 / logMessages.length));
                logIdx++;
            }
        }, 800);

        const { data, error: apiError } = await analyzeSmartContractAudit(code);
        
        clearInterval(logIntervalRef.current);
        
        if (apiError) {
            setError(apiError);
        } else {
            setResult(data);
            setScanProgress(100);
        }

        setIsLoading(false);
    };

    const getSeverityStyles = (severity: string) => {
        const s = severity.toLowerCase();
        if (s.includes('critical') || s.includes('high')) return 'text-red-400 bg-red-500/10 border-red-500/20';
        if (s.includes('medium')) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
        if (s.includes('low')) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
        return 'text-gray-400 bg-white/5 border-white/10';
    };

    return (
        <div className="min-h-full lg:h-[calc(100vh-140px)] flex flex-col max-w-[1600px] mx-auto pb-10 lg:pb-0">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-sm">
                        <AuditorIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold uppercase tracking-widest text-white">Algorithmic Auditor v3</h1>
                        <p className="text-[10px] text-gray-500 font-mono">Formal Verification // Static Analysis Kernel</p>
                    </div>
                </div>
                <div className="flex items-center gap-6 self-end sm:self-auto">
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] text-gray-600 uppercase font-bold font-mono">Kernel_Status</span>
                        <span className="text-[10px] text-green-500 font-mono uppercase">Active_Ready</span>
                    </div>
                    <div className="flex flex-col items-end border-l border-white/10 pl-6">
                        <span className="text-[8px] text-gray-600 uppercase font-bold font-mono">Network</span>
                        <span className="text-[10px] text-blue-400 font-mono uppercase">Polygon_PoS</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                {/* EDITOR SIDE */}
                <div className="lg:col-span-5 flex flex-col h-[400px] lg:h-full overflow-hidden">
                     <div className="bg-[#0A0A0A] border border-white/10 border-b-0 p-2 px-4 flex justify-between items-center text-[10px] font-mono text-gray-500 rounded-t-sm">
                        <div className="flex items-center gap-4">
                            <span className="text-white font-bold">SOURCE_BUFFER.SOL</span>
                        </div>
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-white/5"></div>
                            <div className="w-2 h-2 rounded-full bg-white/5"></div>
                        </div>
                    </div>
                     <Card className="p-0 flex-1 relative flex flex-col cyber-card overflow-hidden">
                        <div className="absolute inset-0 bg-[#020202] pointer-events-none"></div>
                        <Textarea 
                            placeholder='// INJECT SOURCE CODE FOR AUDIT...'
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="font-mono text-xs bg-transparent border-none focus:ring-0 resize-none h-full p-6 leading-relaxed text-gray-300 z-10 custom-scrollbar"
                        />
                        
                        {!code && (
                             <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                <CpuIcon className="w-24 lg:w-32 h-24 lg:h-32 text-white" />
                             </div>
                        )}

                        <div className="absolute bottom-4 right-4 z-20">
                            <Button 
                                onClick={handleAnalyze} 
                                disabled={isLoading} 
                                className="!px-6 lg:!px-10 py-3 lg:py-4 shadow-2xl bg-white text-black hover:bg-gray-200 border-none group text-[10px]"
                            >
                                <span className="flex items-center gap-2 lg:gap-3 uppercase">
                                    {isLoading ? 'Analyzing' : 'Execute_Audit'}
                                    <ActivityIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`} />
                                </span>
                            </Button>
                        </div>
                    </Card>
                </div>
            
                {/* OUTPUT SIDE */}
                <div className="lg:col-span-7 flex flex-col h-full min-h-0">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex flex-col gap-4"
                            >
                                <Card className="flex-1 cyber-card p-6 bg-[#050505] flex flex-col font-mono text-[10px]">
                                    <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-blue-500 animate-pulse rounded-sm"></div>
                                            <span className="text-white font-bold uppercase tracking-widest">Processing_Uplink</span>
                                        </div>
                                        <span className="text-blue-400">{Math.round(scanProgress)}%</span>
                                    </div>
                                    
                                    <div className="flex-1 overflow-y-auto space-y-1 text-gray-500 custom-scrollbar pr-2">
                                        {mockLogs.map((log, i) => (
                                            <div key={i} className="flex gap-4">
                                                <span className="opacity-20 select-none">L_0{i+1}</span>
                                                <span className={i === mockLogs.length - 1 ? 'text-white' : ''}>{log}</span>
                                            </div>
                                        ))}
                                        <div className="animate-pulse inline-block w-2 h-3 bg-blue-500 ml-11 mt-1"></div>
                                    </div>

                                    <div className="mt-8">
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                className="h-full bg-blue-500"
                                                animate={{ width: `${scanProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ) : result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="h-full flex flex-col overflow-y-auto custom-scrollbar pr-2 space-y-6"
                            >
                                {/* Summary HUD */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Card className="p-4 bg-[#080808] border-white/10 flex flex-col justify-center items-center text-center">
                                        <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-1">Security_Score</span>
                                        <div className={`text-4xl font-black font-mono ${result.securityScore > 80 ? 'text-green-500' : result.securityScore > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                            {result.securityScore}
                                        </div>
                                    </Card>
                                    <Card className="p-4 bg-[#080808] border-white/10 flex flex-col justify-center items-center text-center">
                                        <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-1">Risk_Level</span>
                                        <div className={`text-xl font-black font-mono uppercase ${result.riskLevel === 'Low' ? 'text-green-500' : 'text-red-500'}`}>
                                            {result.riskLevel}
                                        </div>
                                    </Card>
                                    <Card className="p-4 bg-blue-500/5 border-blue-500/20 flex flex-col justify-center">
                                        <p className="text-[9px] font-mono text-gray-400 leading-tight italic">
                                            <span className="text-blue-500 font-bold mr-1">Summary:</span>
                                            {result.summary}
                                        </p>
                                    </Card>
                                </div>

                                {/* Vulnerabilities Breakdown */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-2 border-l-2 border-red-500 pl-4">
                                        <ThreatIcon className="w-5 h-5 text-red-500" />
                                        <h2 className="text-sm font-black text-white uppercase tracking-widest">Security_Vulnerabilities</h2>
                                    </div>
                                    
                                    {result.vulnerabilities.length === 0 ? (
                                        <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-sm text-center">
                                            <ShieldCheckIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                            <p className="text-xs font-mono text-green-400 uppercase">No Immediate Vulnerabilities Detected</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-3">
                                            {result.vulnerabilities.map((v, i) => (
                                                <Card key={i} className={`p-4 border group hover:scale-[1.01] transition-all ${getSeverityStyles(v.severity)}`}>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="text-xs font-black uppercase tracking-tight">{v.title}</h3>
                                                        <span className="text-[8px] font-bold px-2 py-0.5 border border-current rounded-sm uppercase tracking-widest">
                                                            {v.severity}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] font-mono opacity-70 leading-relaxed">{v.description}</p>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Gas Optimizations Breakdown */}
                                <div className="space-y-4 pb-12">
                                    <div className="flex items-center gap-3 mb-2 border-l-2 border-yellow-500 pl-4">
                                        <ZapIcon className="w-5 h-5 text-yellow-500" />
                                        <h2 className="text-sm font-black text-white uppercase tracking-widest">Gas_Optimization_Buffer</h2>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-3">
                                        {result.gasOptimizations.map((g, i) => (
                                            <Card key={i} className="p-4 bg-white/[0.02] border-white/5 group hover:border-yellow-500/30 transition-all">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h3 className="text-[11px] font-bold text-gray-200 uppercase">{g.suggestion}</h3>
                                                    <span className="text-[9px] font-mono text-yellow-500 font-bold">Est. Save: {g.estimatedSaving}</span>
                                                </div>
                                                <p className="text-[10px] font-mono text-gray-500 leading-relaxed">{g.details}</p>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                className="h-full flex items-center justify-center border border-white/5 border-dashed bg-white/[0.01] rounded-sm"
                            >
                                <div className="text-center opacity-30">
                                    <CpuIcon className="w-12 lg:w-16 h-12 lg:h-16 mx-auto mb-4 text-gray-600" />
                                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em]">Awaiting_Input_Buffer</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SmartContractAuditorView;
