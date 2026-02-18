
import React, { useState, useEffect, useRef } from 'react';
import { Textarea } from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import { analyzeWithGemini } from '../../services/geminiService';
import ResultDisplay from '../common/ResultDisplay';
import { AuditorIcon, CpuIcon, ShieldCheckIcon, ActivityIcon } from '../Icons';
import { motion, AnimatePresence } from 'framer-motion';

const SmartContractAuditorView: React.FC = () => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
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

        const prompt = `Act as an expert smart contract auditor. Analyze the following Solidity code. Identify security vulnerabilities, categorize them by severity (Critical, High, Medium, Low), and suggest gas optimization improvements. Provide a professional audit report in Markdown format.\n\n\`\`\`solidity\n${code}\n\`\`\``;
        
        const { data, error: apiError } = await analyzeWithGemini(prompt);
        
        clearInterval(logIntervalRef.current);
        
        if (apiError) {
            setError(apiError);
        } else {
            setResult(data);
            setScanProgress(100);
        }

        setIsLoading(false);
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
                <div className="lg:col-span-6 flex flex-col h-[500px] lg:h-full overflow-hidden">
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
                <div className="lg:col-span-6 flex flex-col h-[500px] lg:h-full overflow-hidden">
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
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col overflow-hidden"
                            >
                                <div className="bg-[#0A0A0A] border border-white/10 border-b-0 p-2 px-4 flex justify-between items-center text-[10px] font-mono text-gray-500 rounded-t-sm">
                                    <div className="flex items-center gap-4">
                                        <span className="text-green-400 font-bold uppercase tracking-widest">Audit_Report.md</span>
                                    </div>
                                    <ShieldCheckIcon className="w-3.5 h-3.5 text-green-500" />
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar border border-white/10 bg-[#050505] p-2">
                                    <ResultDisplay content={result} />
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
