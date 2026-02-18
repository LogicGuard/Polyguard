
import React from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import { GlobeIcon } from '../Icons';

const TopologyNode: React.FC<{ x: number, y: number, label: string, status: 'active' | 'warn' | 'alert' }> = ({ x, y, label, status }) => {
    const color = status === 'active' ? '#3b82f6' : status === 'warn' ? '#fbbf24' : '#ef4444';
    return (
        <motion.g 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="cursor-pointer group"
        >
            <motion.circle 
                cx={x} cy={y} r="3" fill={color} 
                animate={{ r: [3, 5, 3], opacity: [0.6, 1, 0.6] }} 
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} 
            />
            <circle cx={x} cy={y} r="10" fill={color} fillOpacity="0.05" className="group-hover:fill-opacity-20 transition-all" />
            <text 
                x={x + 12} y={y + 4} 
                fill="#555" 
                fontSize="8" 
                fontFamily="JetBrains Mono, monospace" 
                className="uppercase font-bold tracking-tighter group-hover:fill-white transition-colors"
            >
                {label}
            </text>
        </motion.g>
    )
}

const NetworkMatrix: React.FC = () => {
    return (
        <Card className="h-full cyber-card p-0 bg-[#050505] relative flex flex-col group overflow-hidden border-white/10 shadow-2xl">
            {/* Header HUD */}
            <div className="p-3 border-b border-white/5 flex justify-between items-center relative z-20 bg-black/80 backdrop-blur-md">
                <h2 className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.3em] flex items-center gap-2">
                    <GlobeIcon className="w-3.5 h-3.5 text-blue-500" />
                    Tactical_Network_Matrix
                </h2>
                <div className="flex items-center gap-3 text-[8px] font-mono text-gray-500">
                    <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-blue-500"></div> NODES: 06</span>
                    <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-green-500"></div> UPLINK: OK</span>
                </div>
            </div>

            <div className="flex-1 relative cursor-crosshair overflow-hidden bg-black">
                {/* Visual Depth Grids */}
                <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
                <div className="absolute inset-0 opacity-[0.05]" style={{backgroundImage: 'linear-gradient(#444 0.5px, transparent 0.5px), linear-gradient(90deg, #444 0.5px, transparent 0.5px)', backgroundSize: '100px 100px'}}></div>
                
                {/* Radar Sweep Effect */}
                <motion.div 
                    className="absolute top-1/2 left-1/2 w-[150%] h-[150%] origin-center -translate-x-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none"
                    style={{ background: 'conic-gradient(from 0deg, #3b82f6 0deg, transparent 90deg, transparent 360deg)' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />

                <svg width="100%" height="100%" className="relative z-10" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
                    {/* Animated Connection Lines */}
                    <g className="opacity-20">
                        <motion.path 
                            d="M 150 150 L 350 200 L 550 130 L 750 250" 
                            stroke="#3b82f6" strokeWidth="0.5" fill="none" 
                            strokeDasharray="4 4"
                            animate={{ strokeDashoffset: [0, -20] }} 
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.path 
                            d="M 350 200 L 250 350 L 500 400 L 550 130" 
                            stroke="#3b82f6" strokeWidth="0.5" fill="none" 
                            strokeDasharray="4 4"
                            animate={{ strokeDashoffset: [0, 20] }} 
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        />
                    </g>
                    
                    {/* Active Topology Nodes */}
                    <TopologyNode x={150} y={150} label="RPC-PRIMARY" status="active" />
                    <TopologyNode x={350} y={200} label="VAL-07-IND" status="warn" />
                    <TopologyNode x={550} y={130} label="ZK-PROVER-A" status="active" />
                    <TopologyNode x={250} y={350} label="MEM-POOL-S1" status="active" />
                    <TopologyNode x={500} y={400} label="BRIDGE-ETH" status="alert" />
                    <TopologyNode x={750} y={250} label="ZK-EVM-CORE" status="active" />
                </svg>

                {/* Corner Accents */}
                <div className="absolute bottom-4 right-4 p-2 bg-black/60 backdrop-blur-sm border border-white/5 rounded-sm">
                    <div className="text-[7px] font-mono text-gray-500 uppercase leading-none mb-1">Vector_Analysis</div>
                    <div className="text-[10px] font-mono text-blue-400 font-bold tracking-widest">POLYGON_POS_L1</div>
                </div>
            </div>

            <div className="p-2 bg-[#080808] border-t border-white/5 flex justify-between text-[8px] font-mono text-gray-600">
                <span className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-500"></div> SECTOR: ALPHA-4</span>
                <span className="flex items-center gap-2">COORDS: [34.0522 N, 118.2437 W] <div className="w-1 h-1 bg-gray-700"></div></span>
            </div>
        </Card>
    );
};

export default NetworkMatrix;
