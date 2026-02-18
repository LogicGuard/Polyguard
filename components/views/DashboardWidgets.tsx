
import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import { GlobeIcon, CpuIcon, LayersIcon } from '../Icons';
import { motion } from 'framer-motion';

// --- Shared Telemetry Components ---
const Sparkline: React.FC<{ data: number[], color: string, height?: number }> = ({ data, color, height = 30 }) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 100;
    const step = width / (data.length - 1);

    const points = data.map((val, i) => {
        const x = i * step;
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            <motion.path
                d={`M ${points}`}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
            />
             <motion.path
                d={`M ${points} L ${width},${height} L 0,${height} Z`}
                fill={color}
                fillOpacity="0.05"
                stroke="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
            />
        </svg>
    );
}

export const SystemVitalsStrip: React.FC = () => {
    const [marketData, setMarketData] = useState({
        price: Array.from({length: 12}, () => 0.72 + Math.random() * 0.02),
        tvl: Array.from({length: 12}, () => 840 + Math.random() * 10),
    });
    const [loadHistory, setLoadHistory] = useState(Array.from({length: 40}, () => 35 + Math.random() * 15));
    const [threats, setThreats] = useState([
        { name: 'PHISHING_NODE', count: 14, color: 'bg-red-500' },
        { name: 'EXPLOIT_VECTOR', count: 6, color: 'bg-orange-500' },
        { name: 'MALICIOUS_TX', count: 22, color: 'bg-blue-500' },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMarketData(prev => ({
                price: [...prev.price.slice(1), prev.price[prev.price.length - 1] + (Math.random() - 0.5) * 0.01],
                tvl: [...prev.tvl.slice(1), prev.tvl[prev.tvl.length - 1] + (Math.random() - 0.5) * 2],
            }));
            setLoadHistory(prev => {
                const nextLoad = Math.min(100, Math.max(10, prev[prev.length - 1] + (Math.random() - 0.5) * 12));
                return [...prev.slice(1), nextLoad];
            });
            // Drift threat counts slightly
            setThreats(prev => prev.map(t => ({
                ...t,
                count: Math.max(0, t.count + Math.floor(Math.random() * 3) - 1)
            })));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const currentLoad = loadHistory[loadHistory.length - 1];

    return (
        <Card className="h-full grid grid-cols-12 divide-x divide-white/5 bg-[#080808] p-0 overflow-hidden border-white/10 shadow-xl">
            {/* 1. Market Telemetry (Col 4) */}
            <div className="col-span-4 p-4 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-3">
                    <GlobeIcon className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-[0.2em] font-bold">Network_Pulse</span>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <div className="flex justify-between items-baseline mb-1">
                            <span className="text-[10px] text-gray-400 font-bold font-mono">MATIC</span>
                            <span className="text-[10px] text-white font-mono font-bold">${marketData.price[marketData.price.length - 1].toFixed(3)}</span>
                        </div>
                        <Sparkline data={marketData.price} color="#3b82f6" height={30} />
                    </div>
                    <div>
                        <div className="flex justify-between items-baseline mb-1">
                            <span className="text-[10px] text-gray-400 font-bold font-mono">TVL_PROX</span>
                            <span className="text-[10px] text-white font-mono font-bold">${marketData.tvl[marketData.tvl.length - 1].toFixed(0)}M</span>
                        </div>
                        <Sparkline data={marketData.tvl} color="#8b5cf6" height={30} />
                    </div>
                </div>
            </div>

            {/* 2. Congestion Heatmap (Col 5) */}
            <div className="col-span-5 p-4 flex flex-col justify-between relative">
                 <div className="flex justify-between items-center mb-3 z-10">
                    <div className="flex items-center gap-2">
                        <CpuIcon className="w-3.5 h-3.5 text-purple-500" />
                        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-[0.2em] font-bold">Latency_Load</span>
                    </div>
                    <div className="flex items-center gap-2">
                         <span className={`text-[10px] font-mono font-bold ${currentLoad > 80 ? 'text-red-500' : currentLoad > 60 ? 'text-yellow-500' : 'text-green-400'}`}>
                            {Math.round(currentLoad)}%
                        </span>
                    </div>
                </div>
                <div className="flex-1 flex items-end gap-[1.5px] w-full relative z-10">
                     {loadHistory.map((load, i) => (
                        <motion.div
                            key={i}
                            className={`flex-1 rounded-t-[1px] opacity-70 ${load > 85 ? 'bg-red-500' : load > 65 ? 'bg-yellow-500' : 'bg-blue-600'}`}
                            style={{ height: `${load}%` }}
                            animate={{ height: `${load}%` }}
                            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                        />
                     ))}
                </div>
                {/* Background Grid Accent */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{backgroundImage: 'linear-gradient(#fff 0.5px, transparent 0.5px), linear-gradient(90deg, #fff 0.5px, transparent 0.5px)', backgroundSize: '12px 12px'}}></div>
            </div>

            {/* 3. Threat Distribution (Col 3) */}
            <div className="col-span-3 p-4 flex flex-col justify-between bg-black/20">
                <div className="flex items-center gap-2 mb-3">
                    <LayersIcon className="w-3.5 h-3.5 text-red-500" />
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-[0.2em] font-bold">Threat_Matrix</span>
                </div>
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                    {threats.map((cat) => (
                        <div key={cat.name} className="w-full">
                            <div className="flex justify-between text-[8px] mb-1 text-gray-600 font-mono font-bold uppercase tracking-tighter">
                                <span>{cat.name}</span>
                                <span className="text-gray-400">{cat.count}</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    className={`h-full rounded-full ${cat.color} opacity-60 shadow-[0_0_8px_rgba(255,255,255,0.1)]`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(cat.count / 40) * 100}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export const MarketPulseWidget: React.FC<{id?:string}> = ({id}) => <div id={id}>Deprecated: Use SystemVitalsStrip</div>;
export const ThreatCategoryWidget: React.FC<{id?:string}> = ({id}) => <div id={id}>Deprecated: Use SystemVitalsStrip</div>;
export const NetworkLoadWidget: React.FC<{id?:string}> = ({id}) => <div id={id}>Deprecated: Use SystemVitalsStrip</div>;
