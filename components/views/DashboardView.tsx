
import React, { useEffect, useState, useMemo } from 'react';
import { useWallet } from '../../context/WalletContext';
import { getPortfolioSnapshot, systemStatusEvents, getSystemStatus } from '../../services/geminiService';
import { PortfolioSnapshot } from '../../types';
import Card from '../common/Card';
import { motion, AnimatePresence } from 'framer-motion';
import IntelligenceBriefing from './IntelligenceBriefing';
import RealTimeMonitor from './RealTimeMonitor';
import ToolsQuickAccess from './ToolsQuickAccess';
import NetworkMatrix from './NetworkMatrix';
import { SystemVitalsStrip } from './DashboardWidgets';
import OnboardingTour, { TourStep } from '../common/OnboardingTour';
import { ThreatIcon } from '../Icons';

const DashboardView: React.FC = () => {
    const { account } = useWallet();
    const [snapshot, setSnapshot] = useState<PortfolioSnapshot | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [isSystemCongested, setIsSystemCongested] = useState(getSystemStatus().isCoolingDown);
    
    const [showIntel, setShowIntel] = useState(false);
    const [showMonitor, setShowMonitor] = useState(false);

    useEffect(() => {
        const handleStatusChange = (e: any) => {
            setIsSystemCongested(e.detail.isCoolingDown);
        };
        systemStatusEvents.addEventListener('statusChange', handleStatusChange);
        return () => systemStatusEvents.removeEventListener('statusChange', handleStatusChange);
    }, []);

    useEffect(() => {
        const fetchPrimaryData = async () => {
            if (!account) {
                setIsLoading(false);
                setTimeout(() => setShowIntel(true), 1000);
                setTimeout(() => setShowMonitor(true), 10000);
                return;
            };
            
            setIsLoading(true);
            const snapshotResult = await getPortfolioSnapshot(account);
            if (!snapshotResult.error) setSnapshot(snapshotResult.data);
            setIsLoading(false);
            
            setTimeout(() => setShowIntel(true), 5000);
            setTimeout(() => setShowMonitor(true), 15000);
        };
        fetchPrimaryData();
    }, [account]);

    const TOUR_STEPS: TourStep[] = [
        { targetId: 'grid-intel', title: 'Intelligence Hub', description: 'Strategic analysis of the Polygon network security state.' },
        { targetId: 'grid-map', title: 'Tactical Topology', description: 'Real-time visualization of node health and infrastructure health.' },
        { targetId: 'grid-vitals', title: 'System Vitals', description: 'Telemetry monitoring network congestion and threat vectors.' },
        { targetId: 'grid-monitor', title: 'Signal Stream', description: 'Low-latency security alert and event processing.' }
    ];

    const securityScoreColor = useMemo(() => {
        if (!snapshot) return 'text-gray-600';
        if (snapshot.securityScore > 80) return 'text-green-400';
        if (snapshot.securityScore > 50) return 'text-yellow-400';
        return 'text-red-400';
    }, [snapshot]);

    return (
        <div className="relative h-full w-full bg-[#020202] overflow-x-hidden flex flex-col">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-50"></div>
            
            <AnimatePresence>
                {isSystemCongested && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-red-500/10 border-b border-red-500/20 px-6 py-2 flex items-center justify-between z-50"
                    >
                        <div className="flex items-center gap-3">
                            <ThreatIcon className="w-4 h-4 text-red-500 animate-pulse" />
                            <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-bold">
                                SYSTEM_NOTICE: AI Quota Exceeded. Entering cooldown.
                            </p>
                        </div>
                        <span className="text-[9px] font-mono text-red-500/50 uppercase hidden sm:inline">Attempting reconnection in 60s</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 lg:p-6 overflow-y-auto lg:overflow-hidden">
                
                {/* COLUMN 1: Intelligence & Defense (Span 3 on Desktop) */}
                <div className="lg:col-span-3 flex flex-col gap-4 min-h-[500px] lg:min-h-0">
                    <div className="flex-[3] min-h-0" id="grid-intel">
                        {showIntel ? (
                            <IntelligenceBriefing />
                        ) : (
                            <Card className="h-full cyber-card flex items-center justify-center p-6 bg-black/20">
                                <div className="text-center">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-sm mx-auto mb-2 animate-pulse"></div>
                                    <span className="text-[9px] font-mono text-gray-700 uppercase tracking-widest">Synchronizing_Briefing...</span>
                                </div>
                            </Card>
                        )}
                    </div>
                    
                    <div className="flex-[1.2] min-h-[140px] lg:min-h-0">
                        <Card className="h-full cyber-card p-0 flex flex-col overflow-hidden bg-black/40 border-white/10">
                            <div className="p-2 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                                <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest">Defense_Core</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse"></div>
                            </div>
                            <div className="flex-1 flex flex-col justify-center items-center p-2 relative">
                                <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                                    <div className="w-24 h-24 border border-white/20 rounded-full"></div>
                                </div>
                                <div className="text-[8px] font-mono text-gray-600 uppercase mb-1 z-10">Security_Level</div>
                                <div className={`text-5xl lg:text-6xl font-bold font-mono tracking-tighter z-10 ${securityScoreColor}`}>
                                    {snapshot ? snapshot.securityScore : (isLoading ? '..' : '--')}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* COLUMN 2: Tactical Matrix & Vitals (Span 6 on Desktop) */}
                <div className="lg:col-span-6 flex flex-col gap-4 min-h-[600px] lg:min-h-0 order-first lg:order-none">
                    <div className="flex-[4] min-h-0 relative" id="grid-map">
                        <NetworkMatrix />
                    </div>
                    
                    <div className="flex-[1.5] min-h-[160px] lg:min-h-0" id="grid-vitals">
                        <SystemVitalsStrip />
                    </div>
                </div>

                {/* COLUMN 3: Signal Stream & Tools (Span 3 on Desktop) */}
                <div className="lg:col-span-3 flex flex-col gap-4 min-h-[600px] lg:min-h-0">
                    <div className="flex-[3] min-h-0" id="grid-monitor">
                        {showMonitor ? (
                            <RealTimeMonitor />
                        ) : (
                            <Card className="h-full flex flex-col bg-[#050505] border-white/10 items-center justify-center p-6">
                                <div className="text-center">
                                    <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
                                    <span className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.2em]">Intercepting_Signals...</span>
                                </div>
                            </Card>
                        )}
                    </div>

                    <div className="flex-[2] min-h-0" id="grid-tools">
                        <ToolsQuickAccess />
                    </div>
                </div>
            </div>
            
            <OnboardingTour 
                steps={TOUR_STEPS}
                isOpen={isTourOpen}
                onClose={() => setIsTourOpen(false)}
                onComplete={() => {
                    setIsTourOpen(false);
                    localStorage.setItem('polyguard_dashboard_tour_seen_v3', 'true');
                }}
            />
        </div>
    );
};

export default DashboardView;
