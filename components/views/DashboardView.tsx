
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useWallet } from '../../context/WalletContext';
import { systemStatusEvents, getSystemStatus } from '../../services/geminiService';
import IntelligenceBriefing from './IntelligenceBriefing';
import RealTimeMonitor from './RealTimeMonitor';
import NetworkMatrix from './NetworkMatrix';
import ToolsQuickAccess from './ToolsQuickAccess';
import HeuristicMatrix from './HeuristicMatrix';
import ActivityHeatmap from './ActivityHeatmap';
import { DashboardMetricCard, SystemVitalsStrip } from './DashboardWidgets';
import { GlobeIcon, ShieldCheckIcon, ActivityIcon, ZapIcon, ThreatIcon, CpuIcon } from '../Icons';

const DashboardView: React.FC = () => {
    const { account } = useWallet();
    const [isCongested, setIsCongested] = useState(getSystemStatus().isCoolingDown);

    useEffect(() => {
        const handleStatusChange = (e: any) => setIsCongested(e.detail.isCoolingDown);
        systemStatusEvents.addEventListener('statusChange', handleStatusChange);
        return () => systemStatusEvents.removeEventListener('statusChange', handleStatusChange);
    }, []);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants: Variants = {
        hidden: { y: 10, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } }
    };

    return (
        <div className="relative h-full w-full bg-[#020202] overflow-hidden flex flex-col p-4 gap-4 select-none">
            {/* Minimal Background Elements */}
            <div className="absolute inset-0 tech-bg opacity-[0.03] pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.02] to-transparent pointer-events-none"></div>
            
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 flex flex-col gap-4 relative z-10 overflow-hidden"
            >
                {/* 1. TOP OPERATIONS RIBBON (QUICK START) */}
                <motion.div variants={itemVariants} className="flex-shrink-0">
                    <ToolsQuickAccess />
                </motion.div>

                {/* 2. TELEMETRY STRIP */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
                    <motion.div variants={itemVariants}>
                        <DashboardMetricCard label="Global_Nodes" value="1,024" sub="99.9% UPTIME" icon={GlobeIcon} color="text-blue-400" />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <DashboardMetricCard label="Security_Index" value="98.2" sub="NOMINAL_STATE" icon={ShieldCheckIcon} color="text-green-500" />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <DashboardMetricCard label="Assets_Secured" value="$1.42B" sub="VERIFIED_DATA" icon={ActivityIcon} color="text-gray-400" />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <DashboardMetricCard label="Active_Shields" value="42,091" sub="KERNEL_ONLINE" icon={ZapIcon} color="text-blue-500" />
                    </motion.div>
                </div>

                {/* 3. MAIN OPERATIONAL HUD - RESTRUCTURED GRID */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
                    
                    {/* LEFT AREA: TOPOLOGY & HEURISTICS */}
                    <div className="lg:col-span-8 flex flex-col gap-4 min-h-0 overflow-hidden">
                        <div className="flex-[3] grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
                             <motion.div variants={itemVariants} className="md:col-span-8 min-h-0 h-full">
                                <NetworkMatrix />
                             </motion.div>
                             <motion.div variants={itemVariants} className="md:col-span-4 min-h-0 h-full">
                                <ActivityHeatmap />
                             </motion.div>
                        </div>
                        
                        <div className="flex-[2] grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0">
                            <motion.div variants={itemVariants} className="md:col-span-7 min-h-0 h-full">
                                <HeuristicMatrix />
                            </motion.div>
                            <motion.div variants={itemVariants} className="md:col-span-5 min-h-0 h-full">
                                <IntelligenceBriefing />
                            </motion.div>
                        </div>
                    </div>

                    {/* RIGHT AREA: LIVE FEED & VITALS */}
                    <div className="lg:col-span-4 flex flex-col gap-4 min-h-0 overflow-hidden">
                        <motion.div variants={itemVariants} className="flex-[3] min-h-0 h-full">
                            <RealTimeMonitor />
                        </motion.div>
                        <motion.div variants={itemVariants} className="flex-[1] min-h-0 h-full">
                            <SystemVitalsStrip />
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* ALERT SYSTEM */}
            <AnimatePresence>
                {isCongested && (
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
                        className="fixed bottom-6 right-6 z-[200] w-80 bg-[#0A0A0A] border border-blue-900/30 shadow-2xl p-4 tactical-border"
                    >
                        <div className="flex items-center gap-3 text-blue-500 mb-2">
                            <ThreatIcon className="w-4 h-4 animate-pulse" />
                            <span className="text-[10px] font-black font-mono uppercase tracking-widest">Buffer_Threshold</span>
                        </div>
                        <p className="text-[9px] font-mono text-gray-500 uppercase leading-relaxed">
                            System throughput calibrated for high-density signals.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardView;
