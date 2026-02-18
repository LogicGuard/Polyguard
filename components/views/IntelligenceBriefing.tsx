import React, { useState, useEffect, useCallback } from 'react';
import Card from '../common/Card';
import SkeletonLoader from '../common/Loader';
import { getIntelligenceBriefing } from '../../services/geminiService';
import { RefreshIcon, GlobeIcon } from '../Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { GenerateContentResponse } from '@google/genai';

const IntelligenceBriefing: React.FC = () => {
    const [response, setResponse] = useState<GenerateContentResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBriefing = useCallback(async () => {
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
        <div className="p-6 space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <SkeletonLoader className="h-4 w-1/3" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20 animate-pulse"></div>
            </div>
            <div className="flex-1 space-y-4">
                 <SkeletonLoader className="h-3 w-full" />
                 <SkeletonLoader className="h-3 w-5/6" />
                 <SkeletonLoader className="h-3 w-4/6" />
                 <div className="pt-4 space-y-2">
                    <SkeletonLoader className="h-3 w-full" />
                    <SkeletonLoader className="h-3 w-full" />
                    <SkeletonLoader className="h-3 w-2/3" />
                 </div>
                 <div className="pt-8 space-y-3">
                    <SkeletonLoader className="h-2 w-1/4" />
                    <div className="flex gap-2">
                        <SkeletonLoader className="h-6 w-20" />
                        <SkeletonLoader className="h-6 w-24" />
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
            <div className="h-full flex flex-col p-4 bg-black/40">
                <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-3">
                    <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-sm"></div>
                        Intel_Stream // Grounded
                    </h2>
                     <button onClick={fetchBriefing} disabled={isLoading} className="p-1 hover:bg-white/10 rounded-sm transition-all group">
                        <RefreshIcon className={`w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-5 pr-2 text-[11px] font-mono text-gray-400 leading-relaxed">
                    <div className="whitespace-pre-wrap">{text}</div>
                    
                    {groundingChunks.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-white/5">
                            <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <GlobeIcon className="w-3 h-3" /> Citations
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {groundingChunks.map((chunk: any, i: number) => (
                                    chunk.web && (
                                        <a 
                                            key={i}
                                            href={chunk.web.uri}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-2 py-1 bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all rounded-sm text-[8px] flex items-center gap-1.5 group"
                                        >
                                            <span className="text-blue-500">[{i + 1}]</span>
                                            <span className="truncate max-w-[120px] group-hover:text-white transition-colors">{chunk.web.title}</span>
                                        </a>
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[7px] font-mono text-gray-700 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><div className="w-1 h-1 bg-gray-800"></div> REAL_TIME_GROUNDING_ACTIVE</span>
                    <span>VER: 3.2.0</span>
                </div>
            </div>
        );
    };

    return (
        <Card className="h-full cyber-card p-0 bg-transparent overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
                <motion.div
                    key={isLoading ? 'loading' : error ? 'error' : 'content'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                >
                    {isLoading ? renderLoadingState() : response ? renderBriefing() : (
                        <div className="p-8 h-full flex flex-col items-center justify-center text-center">
                            <RefreshIcon className="w-8 h-8 text-red-500/20 mb-4" />
                            <p className="text-[9px] font-mono text-red-500 uppercase tracking-widest leading-relaxed max-w-[150px]">{error}</p>
                            <button onClick={fetchBriefing} className="mt-4 text-[8px] font-mono text-blue-500 underline uppercase tracking-tighter">Retry_Link</button>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </Card>
    );
};

export default IntelligenceBriefing;