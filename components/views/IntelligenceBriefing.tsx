
import React, { useState, useEffect, useCallback } from 'react';
import Card from '../common/Card';
import SkeletonLoader from '../common/Loader';
import { getIntelligenceBriefing, getSystemStatus, systemStatusEvents } from '../../services/geminiService';
import { RefreshIcon, GlobeIcon, ActivityIcon, ThreatIcon } from '../Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { GenerateContentResponse } from '@google/genai';

const IntelligenceBriefing: React.FC = () => {
    const [response, setResponse] = useState<GenerateContentResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCongested, setIsCongested] = useState(getSystemStatus().isCoolingDown);

    useEffect(() => {
        const handleStatusChange = (e: any) => setIsCongested(e.detail.isCoolingDown);
        systemStatusEvents.addEventListener('statusChange', handleStatusChange);
        return () => systemStatusEvents.removeEventListener('statusChange', handleStatusChange);
    }, []);

    const fetchBriefing = useCallback(async () => {
        if (getSystemStatus().isCoolingDown) {
            setError("QUOTA_THRESHOLD: Signal stream throttled.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        const { data, error: apiError } = await getIntelligenceBriefing();
        if (data) {
            setResponse(data);
        } else {
            setError(apiError || "SYSTEM_ERROR: Briefing link failed.");
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchBriefing();
    }, [fetchBriefing]);
    
    const renderLoadingState = () => (
        <div className="p-6 space-y-6 h-full flex flex-col bg-black/40">
            <div className="flex justify-between items-center mb-2">
                <SkeletonLoader className="h-4 w-1/3 bg-white/5" />
                <div className="w-2 h-2 rounded-full bg-blue-500/20 animate-pulse"></div>
            </div>
            <div className="flex-1 space-y-4">
                 <SkeletonLoader className="h-3 w-full bg-white/5" />
                 <SkeletonLoader className="h-3 w-5/6 bg-white/5" />
                 <SkeletonLoader className="h-3 w-4/6 bg-white/5" />
                 <div className="pt-4 space-y-2">
                    <SkeletonLoader className="h-3 w-full bg-white/5" />
                    <SkeletonLoader className="h-3 w-full bg-white/5" />
                 </div>
                 <div className="pt-8 space-y-3">
                    <div className="flex gap-2">
                        <SkeletonLoader className="h-6 w-20 bg-white/5" />
                        <SkeletonLoader className="h-6 w-24 bg-white/5" />
                    </div>
                 </div>
            </div>
        </div>
    );
    
    const renderBriefing = () => {
        if (!response) return null;
        
        const text = response.text || "";
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        return (
            <div className="h-full flex flex-col p-4 bg-[#050505] relative overflow-hidden">
                {/* Visual Signal Decorator */}
                <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
                    <ActivityIcon className="w-32 h-32 text-blue-500" />
                </div>

                <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4 relative z-10">
                    <div className="flex flex-col">
                        <h2 className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-white flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-none animate-flicker"></div>
                            Strategic_Debrief // S1
                        </h2>
                        <span className="text-[7px] font-mono text-gray-600 uppercase mt-1 tracking-widest font-black">Priority_Alpha // Grounded_Inference</span>
                    </div>
                     <button onClick={fetchBriefing} disabled={isLoading || isCongested} className="p-2 hover:bg-white/5 border border-white/5 rounded-sm transition-all group disabled:opacity-30">
                        <RefreshIcon className={`w-4 h-4 text-gray-600 group-hover:text-blue-400 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-3 text-[12px] font-mono text-gray-400 leading-relaxed relative z-10">
                    <div className="whitespace-pre-wrap selection:bg-blue-500/30 selection:text-white border-l border-white/10 pl-6 py-2">
                        {text}
                    </div>
                    
                    {groundingChunks.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <h3 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                <GlobeIcon className="w-3.5 h-3.5 text-blue-400" /> Referenced_Intelligence
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                {groundingChunks.map((chunk: any, i: number) => (
                                    chunk.web && (
                                        <a 
                                            key={i}
                                            href={chunk.web.uri}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-2 bg-white/[0.02] border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all rounded-none text-[9px] flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-blue-500 font-black">[{i + 1}]</span>
                                                <span className="truncate max-w-[180px] text-gray-400 group-hover:text-white transition-colors uppercase font-bold">{chunk.web.title}</span>
                                            </div>
                                            <span className="text-[8px] text-gray-700 font-black group-hover:text-blue-400 transition-colors">LINK_EXT</span>
                                        </a>
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-3 border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-gray-700 uppercase tracking-widest font-black relative z-10">
                    <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-800 rounded-sm"></div> 
                        PKT_INTEGRITY: 100%
                    </span>
                    <span className="text-blue-500/40">SIG_G3_PRO</span>
                </div>
            </div>
        );
    };

    return (
        <Card className="h-full tactical-border p-0 bg-transparent overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
                <motion.div
                    key={isLoading ? 'loading' : error ? 'error' : 'content'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                >
                    {isLoading ? renderLoadingState() : response ? renderBriefing() : (
                        <div className="p-8 h-full flex flex-col items-center justify-center text-center bg-black/40">
                            <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-sm mb-6">
                                <ThreatIcon className="w-8 h-8 text-red-500/20 mx-auto" />
                            </div>
                            <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-black leading-relaxed max-w-[180px]">{error}</p>
                            {!isCongested && (
                                <button onClick={fetchBriefing} className="mt-6 px-6 py-2 bg-white/5 border border-white/10 text-[9px] font-mono text-blue-500 hover:text-white hover:bg-blue-500 transition-all uppercase tracking-widest font-black">
                                    RE_INITIALIZE_LINK
                                </button>
                            )}
                            {isCongested && (
                                <span className="mt-6 text-[8px] font-mono text-gray-600 uppercase">Wait for system cooldown...</span>
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </Card>
    );
};

export default IntelligenceBriefing;
