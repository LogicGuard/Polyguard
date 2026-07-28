
import React, { useState, useEffect, useCallback } from 'react';
import Card from '../common/Card';
import { getSecurityAlerts, getOnChainEvents, systemStatusEvents, getSystemStatus } from '../../services/geminiService';
import { SecurityAlert, OnChainEvent } from '../../types';
import { OnChainIcon, ThreatIcon, LightbulbIcon, BridgeIcon, DAOIcon, GasIcon, FirewallIcon, TransactionIcon, ActivityIcon, ShieldCheckIcon, RefreshIcon } from '../Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigation } from '../../context/NavigationContext';
import { ListSkeleton } from '../common/Loader';

const MAX_ITEMS = 40; 
// Polling interval significantly increased and randomized to avoid synchronous quota bursts
const POLL_INTERVAL_BASE = 150000; // Increased to 2.5 minutes base

const RealTimeMonitor: React.FC = () => {
    const { navigateTo } = useNavigation();
    const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
    const [events, setEvents] = useState<OnChainEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'alerts' | 'events'>('alerts');
    const [isPaused, setIsPaused] = useState(false);
    const [isCongested, setIsCongested] = useState(getSystemStatus().isCoolingDown);

    useEffect(() => {
        const handleStatusChange = (e: any) => {
            setIsCongested(e.detail.isCoolingDown);
        };
        systemStatusEvents.addEventListener('statusChange', handleStatusChange);
        return () => systemStatusEvents.removeEventListener('statusChange', handleStatusChange);
    }, []);

    const fetchData = useCallback(async (isInitial = false) => {
        if (getSystemStatus().isCoolingDown) {
            console.debug("Fetch suppressed: System in cooldown");
            return;
        }
        
        if (isInitial) setIsLoading(true);
        else setIsRefreshing(true);
        
        setError(null);
        try {
            const [alertsResult, eventsResult] = await Promise.all([
                getSecurityAlerts(),
                getOnChainEvents()
            ]);
            
            if (alertsResult.data) {
                setAlerts(prev => {
                    const newItems = alertsResult.data!.filter(n => !prev.some(p => p.id === n.id));
                    return [...newItems, ...prev].slice(0, MAX_ITEMS);
                });
            }
             if (eventsResult.data) {
                setEvents(prev => {
                    const newItems = eventsResult.data!.filter(n => !prev.some(p => p.id === n.id));
                    return [...newItems, ...prev].slice(0, MAX_ITEMS);
                });
            }

            if (alertsResult.error || eventsResult.error) {
                const err = alertsResult.error || eventsResult.error;
                if (!err?.includes('QUOTA')) {
                    setError(err);
                }
            }
        } catch (e) {
            console.error("Monitor fetch error", e);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        // Initial fetch with a more aggressive random delay to stagger with other component mounts
        const delay = 1000 + Math.random() * 5000;
        const timer = setTimeout(() => fetchData(true), delay);
        return () => clearTimeout(timer);
    }, [fetchData]);

    useEffect(() => {
        const scheduleNext = () => {
            const jitter = Math.random() * 60000; // 1 minute jitter
            return setTimeout(() => {
                if (!getSystemStatus().isCoolingDown && !isPaused) {
                    fetchData();
                }
                scheduleNext();
            }, POLL_INTERVAL_BASE + jitter);
        };

        const timer = scheduleNext();
        return () => clearTimeout(timer);
    }, [fetchData, isPaused]);

    const formatTimeAgo = (isoString: string) => {
        try {
            const date = new Date(isoString);
            const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
            if (seconds < 60) return `${seconds}s`;
            const minutes = Math.floor(seconds / 60);
            return `${minutes}m`;
        } catch (e) {
            return 'now';
        }
    };

    const getAlertStyles = (severity: SecurityAlert['severity']) => {
        switch (severity) {
            case 'Info': return { Icon: LightbulbIcon, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
            case 'Warning': return { Icon: ThreatIcon, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
            case 'Critical': return { Icon: FirewallIcon, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
            default: return { Icon: LightbulbIcon, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' };
        }
    };
    
    const getEventStyles = (type: OnChainEvent['type']) => {
        switch (type) {
            case 'Contract Deployment': return { Icon: OnChainIcon, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' };
            case 'High-Value Transfer': return { Icon: TransactionIcon, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' };
            case 'DAO Vote': return { Icon: DAOIcon, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' };
            case 'Flash Loan': return { Icon: GasIcon, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
            case 'Bridge Transfer': return { Icon: BridgeIcon, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' };
            default: return { Icon: OnChainIcon, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' };
        }
    };

    const renderList = (items: (SecurityAlert | OnChainEvent)[]) => {
        return (
            <div className="space-y-1.5 pr-1.5 h-full overflow-y-auto custom-scrollbar pb-4 flex flex-col relative">
                <AnimatePresence initial={false}>
                    {items.map((item, idx) => {
                        if (!item) return null;
                        const isAlert = 'severity' in item;
                        const { color, bg, border, Icon } = isAlert 
                            ? getAlertStyles((item as SecurityAlert).severity) 
                            : getEventStyles((item as OnChainEvent).type);
                        
                        const title = isAlert ? (item as SecurityAlert).title : (item as OnChainEvent).type;
                        const description = isAlert ? (item as SecurityAlert).description : (item as OnChainEvent).details;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className={`flex flex-col gap-2 p-3 rounded-sm border ${border} ${bg} bg-opacity-[0.02] hover:bg-opacity-[0.06] transition-all group cursor-default relative overflow-hidden`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 p-1 rounded-sm ${bg} bg-opacity-20 flex-shrink-0`}>
                                        <Icon className={`w-3.5 h-3.5 ${color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <span className={`text-[10px] font-black uppercase tracking-tight ${color} truncate`}>
                                                {title}
                                            </span>
                                            <span className="text-[8px] font-mono text-gray-600 font-bold uppercase ml-2">{formatTimeAgo(item.timestamp)}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 leading-tight font-mono line-clamp-2">
                                            {description}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="mt-2 pt-2 border-t border-white/5 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => navigateTo('real-time-security', 'transaction-analysis')}
                                        className="text-[8px] font-mono font-black uppercase px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5"
                                    >
                                        Inspect
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                {items.length === 0 && !isLoading && (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-20 py-20">
                         <ActivityIcon className="w-8 h-8 mb-4" />
                         <span className="text-[9px] font-mono uppercase tracking-[0.4em]">Buffer_Empty</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Card className="p-0 h-full flex flex-col bg-[#050505] tactical-border shadow-2xl min-h-0 relative">
            {isRefreshing && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-20 pointer-events-none flex items-center justify-center">
                    <div className="px-4 py-2 bg-black/60 border border-white/10 text-[9px] font-mono text-blue-400 font-black uppercase tracking-widest animate-pulse">
                        Refreshing_Buffer...
                    </div>
                </div>
            )}

            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#080808] flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${isCongested ? 'bg-red-500' : isPaused ? 'bg-yellow-500' : 'bg-green-500'} animate-flicker shadow-[0_0_8px_currentColor]`}></div>
                    <h2 className="text-[10px] font-mono font-black uppercase text-white tracking-[0.3em]">
                        Signal_Stream
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => fetchData()}
                        disabled={isRefreshing || isCongested}
                        className={`p-1.5 rounded-sm transition-all ${isRefreshing ? 'opacity-50' : 'hover:bg-white/5 text-gray-500 hover:text-white'}`}
                        title="Force Refresh"
                    >
                        <RefreshIcon className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                    <div className="flex gap-1 bg-black/40 p-1 rounded-sm border border-white/5">
                        {['alerts', 'events'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-2 py-1 text-[8px] font-mono font-black uppercase transition-all ${activeTab === tab ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-400'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="p-4 flex-1 min-h-0 bg-[#030303] relative overflow-hidden flex flex-col">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-10"></div>
                {!isLoading && !isCongested && (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="h-full min-h-0 flex flex-col"
                        >
                            {activeTab === 'alerts' ? renderList(alerts) : renderList(events)}
                        </motion.div>
                    </AnimatePresence>
                )}
                {isLoading && !isCongested && <ListSkeleton items={6} className="mt-2" />}
                {isCongested && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-red-950/10 m-2 border border-red-500/20">
                        <ThreatIcon className="w-8 h-8 text-red-500 mb-4 animate-pulse" />
                        <span className="text-[10px] font-mono text-red-400 font-black uppercase tracking-widest leading-relaxed">
                            QUOTA_THRESHOLD: Signal stream throttled.
                        </span>
                        <span className="text-[8px] text-gray-600 font-mono mt-2 uppercase italic tracking-tighter">System is cooling down to prevent lock-out.</span>
                        <button 
                            onClick={() => window.location.reload()}
                            className="mt-6 text-[9px] font-mono text-blue-400 hover:text-white border border-blue-500/20 px-4 py-2 hover:bg-blue-500/10 transition-all uppercase font-black"
                        >
                            Reset_Kernel
                        </button>
                    </div>
                )}
            </div>
            
            <div className="p-2 border-t border-white/5 bg-black/80 backdrop-blur-md flex justify-between items-center text-[7px] font-mono text-gray-700 uppercase tracking-widest flex-shrink-0">
                 <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="w-2.5 h-2.5" />
                    Handshake Status: {isCongested ? 'THROTTLED' : 'STABLE'}
                 </div>
                 <span>P_ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
            </div>
        </Card>
    );
};

export default RealTimeMonitor;
