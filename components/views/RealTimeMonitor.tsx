import React, { useState, useEffect, useCallback } from 'react';
import Card from '../common/Card';
import { getSecurityAlerts, getOnChainEvents, systemStatusEvents, getSystemStatus } from '../../services/geminiService';
import { SecurityAlert, OnChainEvent } from '../../types';
import { OnChainIcon, ThreatIcon, LightbulbIcon, BridgeIcon, DAOIcon, GasIcon, FirewallIcon, TransactionIcon } from '../Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { ListSkeleton } from '../common/Loader';

const MAX_ITEMS = 40; 

const RealTimeMonitor: React.FC = () => {
    const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
    const [events, setEvents] = useState<OnChainEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'alerts' | 'events'>('alerts');
    const [isCongested, setIsCongested] = useState(getSystemStatus().isCoolingDown);

    useEffect(() => {
        const handleStatusChange = (e: any) => {
            setIsCongested(e.detail.isCoolingDown);
        };
        systemStatusEvents.addEventListener('statusChange', handleStatusChange);
        return () => systemStatusEvents.removeEventListener('statusChange', handleStatusChange);
    }, []);

    const fetchInitialData = useCallback(async () => {
        if (getSystemStatus().isCoolingDown) {
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);
        setError(null);
        try {
            const [alertsResult, eventsResult] = await Promise.all([
                getSecurityAlerts(),
                getOnChainEvents()
            ]);
            
            if (alertsResult.data) setAlerts(alertsResult.data);
            if (eventsResult.data) setEvents(eventsResult.data);

            if(alertsResult.error || eventsResult.error) {
                if (!alertsResult.data && !eventsResult.data) {
                     setError(alertsResult.error || eventsResult.error || 'Failed to fetch initial data.');
                }
            }
        } catch (e) {
            setError('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (getSystemStatus().isCoolingDown) return;

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
        }, 600000);

        return () => clearInterval(interval);
    }, []);

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
            <div className="space-y-1.5 pr-2 h-full overflow-y-auto custom-scrollbar pb-4 flex flex-col">
                <AnimatePresence initial={false}>
                    {items.map(item => {
                        if (!item) return null;
                        const isAlert = 'severity' in item;
                        const { color, bg, border } = isAlert 
                            ? getAlertStyles((item as SecurityAlert).severity) 
                            : getEventStyles((item as OnChainEvent).type);
                        
                        const title = isAlert ? (item as SecurityAlert).title : (item as OnChainEvent).type;
                        const description = isAlert ? (item as SecurityAlert).description : (item as OnChainEvent).details;
                        const id = isAlert ? (item as SecurityAlert).id : (item as OnChainEvent).id;

                        return (
                            <motion.div
                                key={id}
                                layout
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className={`flex items-center gap-2 p-2 rounded-sm border ${border} ${bg} bg-opacity-10 hover:bg-opacity-20 transition-all cursor-default group flex-shrink-0`}
                            >
                                <div className={`flex-shrink-0 font-mono text-[8px] w-6 text-right ${color} opacity-60`}>
                                    {formatTimeAgo(item.timestamp)}
                                </div>
                                <div className="w-[1px] h-4 bg-white/5"></div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <span className={`text-[9px] font-bold uppercase tracking-tight ${color} truncate`}>
                                            {title}
                                        </span>
                                    </div>
                                    <p className="text-[9px] text-gray-500 truncate font-mono opacity-80 group-hover:opacity-100 transition-opacity">
                                        {description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <Card className="p-0 h-full flex flex-col bg-[#050505] border-white/10 shadow-xl min-h-0">
            <div className="p-3 border-b border-white/10 flex justify-between items-center bg-[#080808] flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-sm ${isCongested ? 'bg-red-500 animate-pulse' : 'bg-green-500 animate-pulse'}`}></div>
                    <h2 className="text-[9px] font-mono font-bold uppercase text-gray-400 tracking-widest">
                        Signal_Monitor
                    </h2>
                </div>
                <div className="flex gap-1">
                    <button 
                        onClick={() => setActiveTab('alerts')}
                        className={`px-2 py-0.5 text-[8px] font-mono font-bold uppercase rounded-sm border transition-all ${activeTab === 'alerts' ? 'bg-white/10 text-white border-white/20' : 'text-gray-600 border-transparent hover:text-gray-400'}`}
                    >
                        Alerts
                    </button>
                    <button 
                        onClick={() => setActiveTab('events')}
                        className={`px-2 py-0.5 text-[8px] font-mono font-bold uppercase rounded-sm border transition-all ${activeTab === 'events' ? 'bg-white/10 text-white border-white/20' : 'text-gray-600 border-transparent hover:text-gray-400'}`}
                    >
                        Events
                    </button>
                </div>
            </div>
            
            <div className="p-3 flex-1 min-h-0 bg-[#030303] relative overflow-hidden flex flex-col">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none z-10"></div>

                {isLoading && !isCongested && <ListSkeleton items={12} />}
                
                {isCongested && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <ThreatIcon className="w-6 h-6 text-red-500 mb-2 opacity-50" />
                        <p className="text-red-400 text-[9px] font-mono uppercase tracking-widest leading-relaxed">
                            SIGNAL_PAUSED: AI QUOTA LIMIT REACHED. RECOVERY IN PROGRESS.
                        </p>
                    </div>
                )}

                {error && !isCongested && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <ThreatIcon className="w-6 h-6 text-red-500 mb-2 opacity-50" />
                        <p className="text-red-400 text-[9px] font-mono uppercase tracking-widest leading-relaxed">
                            {error}
                        </p>
                    </div>
                )}
                
                {!isLoading && !error && !isCongested && (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="h-full min-h-0 flex flex-col"
                        >
                            {activeTab === 'alerts' ? renderList(alerts) : renderList(events)}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
            <div className="p-1.5 bg-black/40 border-t border-white/5 text-center flex-shrink-0">
                 <span className="text-[7px] font-mono text-gray-700 uppercase">Synchronizing_With_Polygon_S1_Nodes...</span>
            </div>
        </Card>
    );
};

export default RealTimeMonitor;