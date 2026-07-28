
import React from 'react';
import Card from '../common/Card';
import { motion } from 'framer-motion';

export const DashboardMetricCard: React.FC<{ 
    label: string, value: string, sub: string, icon: React.FC<any>, color: string, glow?: string 
}> = ({ label, value, sub, icon: Icon, color, glow }) => (
    <Card className="p-4 bg-[#080808] border-white/5 hover:border-white/10 transition-all group relative overflow-hidden" style={glow ? { boxShadow: `0 0 20px ${glow}` } : {}}>
        <div className="absolute top-0 right-0 p-2 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
            <Icon className="w-12 h-12 text-white" />
        </div>
        <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-3 h-3 ${color}`} />
                <span className="text-[8px] font-mono text-gray-600 uppercase tracking-[0.2em] font-black">{label}</span>
            </div>
            <div className={`text-2xl font-black text-white tracking-tighter font-mono`}>{value}</div>
            <div className="flex items-center gap-2">
                <div className={`w-1 h-1 rounded-full ${color.replace('text-', 'bg-')} animate-pulse`}></div>
                <span className="text-[7px] font-mono text-gray-700 uppercase font-black tracking-widest">{sub}</span>
            </div>
        </div>
    </Card>
);

export const SystemVitalsStrip: React.FC = () => (
    // FIX: Removed unsupported 'title' prop from Card component.
    <Card className="h-full bg-[#080808] p-0 border-white/5 overflow-hidden flex flex-col shadow-xl rounded-none">
        <div className="flex-1 p-4 flex flex-col justify-center gap-4">
            <div className="space-y-1.5">
                <div className="flex justify-between text-[8px] font-mono uppercase">
                    <span className="text-gray-600">Core_Compute_Load</span>
                    <span className="text-white">42%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-none overflow-hidden">
                    <motion.div className="h-full bg-blue-500" animate={{ width: '42%' }} />
                </div>
            </div>
            <div className="space-y-1.5">
                <div className="flex justify-between text-[8px] font-mono uppercase">
                    <span className="text-gray-600">Buffer_Memory_Saturation</span>
                    <span className="text-white">18%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-none overflow-hidden">
                    <motion.div className="h-full bg-purple-500" animate={{ width: '18%' }} />
                </div>
            </div>
        </div>
        <div className="p-2 bg-black/60 text-center border-t border-white/5">
            <span className="text-[7px] font-mono text-blue-500/60 uppercase font-black tracking-[0.3em]">Optimization: Nominal</span>
        </div>
    </Card>
);