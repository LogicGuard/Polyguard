
import React, { useState, useRef, useEffect } from 'react';
import { Input, Textarea } from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import { analyzeTransactionWithFirewall } from '../../services/geminiService';
import { FirewallAnalysisResult } from '../../types';
import { ShieldCheckIcon, ThreatIcon, FirewallIcon, ActivityIcon } from '../Icons';
import { motion, AnimatePresence } from 'framer-motion';

const SmartContractFirewallView: React.FC = () => {
    const [fromAddress, setFromAddress] = useState('');
    const [toAddress, setToAddress] = useState('');
    const [dataField, setDataField] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<FirewallAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const logsEndRef = useRef<HTMLDivElement>(null);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const handleAnalyze = async () => {
        if (!fromAddress.trim() || !toAddress.trim() || !dataField.trim()) {
            setError('MISSING_PARAMETERS: SOURCE, TARGET, and PAYLOAD required.');
            return;
        }
        setIsLoading(true);
        setResult(null);
        setError(null);
        setLogs([]);
        
        addLog(`INIT_SIMULATION: SRC=${fromAddress.substring(0,8)}...`);
        addLog(`SCANNING_TARGET: DEST=${toAddress.substring(0,8)}...`);
        
        setTimeout(() => addLog("LOADING_PROTOCOL_SIGNATURES..."), 500);
        setTimeout(() => addLog("CALCULATING_STATE_TRANSITIONS..."), 1000);

        const { data, error: apiError } = await analyzeTransactionWithFirewall(toAddress, JSON.stringify({ from: fromAddress, data: dataField }));
        
        if (data) {
            setResult(data);
            addLog(`ANALYSIS_COMPLETE: STATUS=${data.status.toUpperCase()}`);
        }
        if (apiError) {
            setError(apiError);
            addLog(`CRITICAL_FAILURE: ${apiError}`);
        }

        setIsLoading(false);
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col">
            <div className="flex items-center gap-3 mb-6 flex-shrink-0">
                <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-sm">
                    <FirewallIcon className="w-6 h-6 text-red-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-wide text-white">Pre-Execution Firewall</h1>
                    <p className="text-xs text-gray-500 font-mono">Deep Packet Inspection // Transaction Shielding</p>
                </div>
            </div>
            
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                <Card className="flex flex-col p-0 bg-[#080808] h-full overflow-hidden border-white/10">
                    <div className="p-3 border-b border-white/10 bg-[#0A0A0A] flex justify-between items-center">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-black">Simulation_Parameters</span>
                    </div>
                    <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
                        <div className="group">
                            <label className="text-[10px] font-bold text-gray-500 uppercase font-mono mb-1.5 block group-focus-within:text-blue-400 transition-colors">Source Address</label>
                            <Input placeholder="0x... (Origin)" value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} className="bg-black border-white/10 text-xs font-mono" />
                        </div>
                        <div className="group">
                            <label className="text-[10px] font-bold text-gray-500 uppercase font-mono mb-1.5 block group-focus-within:text-blue-400 transition-colors">Target Contract</label>
                            <Input placeholder="0x... (Target)" value={toAddress} onChange={(e) => setToAddress(e.target.value)} className="bg-black border-white/10 text-xs font-mono" />
                        </div>
                        <div className="group flex-1 flex flex-col">
                            <label className="text-[10px] font-bold text-gray-500 uppercase font-mono mb-1.5 block group-focus-within:text-blue-400 transition-colors">Call Data (HEX)</label>
                            <Textarea placeholder="0xa9059cbb..." value={dataField} onChange={(e) => setDataField(e.target.value)} className="flex-1 bg-black border-white/10 text-xs font-mono resize-none custom-scrollbar" />
                        </div>
                    </div>
                    <div className="p-4 bg-[#050505] border-t border-white/10">
                        <Button onClick={handleAnalyze} disabled={isLoading} className="w-full justify-center py-4 bg-white text-black hover:bg-gray-200">
                            {isLoading ? 'PROBING_STATE...' : 'INITIALIZE_FIREWALL_SIM'}
                        </Button>
                    </div>
                </Card>

                <Card className="flex flex-col p-0 bg-[#030303] border-white/10 h-full relative overflow-hidden">
                    <div className="p-3 border-b border-white/10 bg-[#0A0A0A] flex justify-between items-center z-10">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-black">Kernel_Log</span>
                        {isLoading && <ActivityIcon className="w-3 h-3 text-green-500 animate-pulse" />}
                    </div>
                    
                    <div className="flex-1 p-4 overflow-y-auto custom-scrollbar font-mono text-[10px] z-10 space-y-1">
                        {logs.map((log, i) => (
                            <div key={i} className="text-gray-500 flex gap-4">
                                <span className="opacity-20 select-none">L_{i.toString().padStart(2,'0')}</span>
                                <span className="text-gray-400">{log}</span>
                            </div>
                        ))}
                        <div ref={logsEndRef} />
                        
                        {result && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 border-t border-white/5 pt-8">
                                <div className={`p-6 border flex items-start gap-4 ${result.status === 'Allowed' ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                    {result.status === 'Allowed' ? <ShieldCheckIcon className="w-10 h-10 text-green-500" /> : <ThreatIcon className="w-10 h-10 text-red-500" />}
                                    <div className="flex-1">
                                        <h2 className={`text-2xl font-black uppercase tracking-widest ${result.status === 'Allowed' ? 'text-green-400' : 'text-red-500'}`}>{result.status}</h2>
                                        <p className="text-gray-300 text-xs mt-1 leading-relaxed">{result.summary}</p>
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-white/[0.02] border border-white/5">
                                        <div className="text-[8px] text-gray-600 uppercase font-black mb-1">Threat_Vector</div>
                                        <div className="text-[10px] text-white font-mono">{result.threatType}</div>
                                    </div>
                                    <div className="p-3 bg-white/[0.02] border border-white/5">
                                        <div className="text-[8px] text-gray-600 uppercase font-black mb-1">AI_Confidence</div>
                                        <div className="text-[10px] text-blue-400 font-mono">{result.confidence}%</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SmartContractFirewallView;
