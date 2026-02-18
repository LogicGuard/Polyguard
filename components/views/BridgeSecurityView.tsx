
import React, { useState } from 'react';
import { Input } from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import { ViewLoader } from '../common/Loader';
import { analyzeBridgeSecurity } from '../../services/geminiService';
import { BridgeSecurityResult } from '../../types';
import { ShieldCheckIcon, ThreatIcon, BridgeIcon, ActivityIcon, ZapIcon } from '../Icons';
// FIX: Added AnimatePresence to framer-motion imports to resolve 'Cannot find name AnimatePresence'.
import { motion, AnimatePresence } from 'framer-motion';

const BridgeSecurityView: React.FC = () => {
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<BridgeSecurityResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!address.trim()) {
            setError('Please enter a bridge contract address.');
            return;
        }
        setIsLoading(true);
        setResult(null);
        setError(null);
        
        const { data, error: apiError } = await analyzeBridgeSecurity(address);
        if (data) setResult(data);
        if (apiError) setError(apiError);
        
        setIsLoading(false);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-sm">
                    <BridgeIcon className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-wide text-white">Cross-Chain Shield</h1>
                    <p className="text-xs text-gray-500 font-mono">Bridge Integrity // Liquidity Forensics</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                <div className="lg:col-span-4">
                    <Card className="p-6 bg-[#080808] border-white/10 h-full flex flex-col">
                        <label className="text-[10px] font-bold text-gray-500 uppercase font-mono mb-4 block">Bridge Protocol Entry</label>
                        <Input 
                            placeholder="PROTOCOL_ADDRESS (0x...)"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="font-mono mb-6 bg-black"
                        />
                        <div className="space-y-4 flex-1">
                            <p className="text-[10px] text-gray-600 font-mono leading-relaxed uppercase">
                                Analysis targets withdrawal safety, mint/burn logic, and multi-sig threshold verification.
                            </p>
                        </div>
                        <Button onClick={handleAnalyze} disabled={isLoading} className="w-full justify-center py-4 mt-8">
                            {isLoading ? 'INITIATING_CORE...' : 'EXECUTE_BRIDGE_AUDIT'}
                        </Button>
                    </Card>
                </div>

                <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <Card className="h-full flex items-center justify-center p-12 bg-black border-white/5">
                                <div className="text-center">
                                    <div className="w-12 h-12 border-4 border-t-indigo-500 border-white/5 rounded-full animate-spin mx-auto mb-6"></div>
                                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.4em] animate-pulse">Scanning_Cross_Chain_Vectors...</p>
                                </div>
                            </Card>
                        ) : result ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full"
                            >
                                <Card className="p-6 flex flex-col items-center justify-center text-center bg-[#0C0C0C]">
                                    <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-6">Security_Confidence</div>
                                    <div className="relative w-32 h-32 flex items-center justify-center">
                                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                                            <circle cx="64" cy="64" r="60" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="4" />
                                            <motion.circle 
                                                cx="64" cy="64" r="60" fill="none" 
                                                stroke={result.securityScore.score > 80 ? '#10b981' : '#f59e0b'} 
                                                strokeWidth="4" 
                                                strokeDasharray="377"
                                                initial={{ strokeDashoffset: 377 }}
                                                animate={{ strokeDashoffset: 377 - (377 * result.securityScore.score) / 100 }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                            />
                                        </svg>
                                        <span className="text-4xl font-black font-mono text-white">{result.securityScore.score}</span>
                                    </div>
                                    <p className="text-xs font-mono mt-6 text-gray-400">{result.securityScore.summary}</p>
                                </Card>

                                <div className="space-y-4">
                                    <Card className="p-5 border-green-500/20 bg-green-500/5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Liquidity Status</h3>
                                        </div>
                                        <div className="text-xl font-mono text-green-400 font-black mb-1">{result.liquidityRisk.risk.toUpperCase()}_RISK</div>
                                        <p className="text-[10px] text-gray-500 font-mono leading-tight">{result.liquidityRisk.summary}</p>
                                    </Card>
                                    <Card className="p-5 border-yellow-500/20 bg-yellow-500/5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <ActivityIcon className="w-5 h-5 text-yellow-500" />
                                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Withdrawal Vector</h3>
                                        </div>
                                        <div className="text-xl font-mono text-yellow-400 font-black mb-1">{result.withdrawalSafety.risk.toUpperCase()}_RISK</div>
                                        <p className="text-[10px] text-gray-500 font-mono leading-tight">{result.withdrawalSafety.summary}</p>
                                    </Card>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center border border-white/10 border-dashed bg-white/[0.01] rounded-sm py-20">
                                <BridgeIcon className="w-16 h-16 text-gray-800 mb-6" />
                                <p className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.3em]">Awaiting_Protocol_Signal</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default BridgeSecurityView;
