
import React, { useState, useEffect } from 'react';
import { ActivityIcon, GlobeIcon, ShieldCheckIcon } from '../Icons';
import { Input } from '../common/Input';
import Button from '../common/Button';
import { motion } from 'framer-motion';
import { useNavigation } from '../../context/NavigationContext';
import CyberpunkLogo from './CyberpunkLogo';

const Footer: React.FC = () => {
    const [uptime, setUptime] = useState('99.9982');
    const { navigateTo } = useNavigation();
    
    useEffect(() => {
        const interval = setInterval(() => {
            setUptime((99.9980 + Math.random() * 0.001).toFixed(4));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const footerLinks = {
        resources: [
            { label: 'Documentation', primary: 'documentation', secondary: 'intro' },
            { label: 'System_Specs', primary: 'documentation', secondary: 'api-buffer' },
            { label: 'Brand_Kit_V1', primary: 'documentation', secondary: 'brand-kit' },
            { label: 'Node_Health', primary: 'ecosystem-insights', secondary: 'node-health' },
        ],
        protocol: [
            { label: 'Governance', primary: 'ecosystem-insights', secondary: 'dao-advisor' },
            { label: 'Security_Ops', primary: 'real-time-security', secondary: 'security-ops' },
            { label: 'Analytics', primary: 'ecosystem-insights', secondary: 'security-analytics' },
            { label: 'Uplink_SLA', primary: 'documentation', secondary: 'api-buffer' },
        ],
        legal: [
            { label: 'PRIVACY_HANDSHAKE', primary: 'documentation', secondary: 'zk-proofs' },
            { label: 'TERMS_OF_ENGAGEMENT', primary: 'documentation', secondary: 'api-buffer' },
            { label: 'SLA_PROTOCOL', primary: 'documentation', secondary: 'intro' }
        ]
    };

    return (
        <footer className="bg-[#020202] pt-32 pb-12 px-6 border-t border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 tech-bg opacity-[0.02] pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-polygon-purple/30 to-transparent"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-polygon-purple/5 blur-[120px] rounded-full pointer-events-none group-hover:bg-polygon-purple/10 transition-all duration-1000"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
                    
                    <div className="md:col-span-4 space-y-10">
                        <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="cursor-pointer group/brand">
                            <CyberpunkLogo className="scale-90 origin-left transition-transform duration-500 group-hover/brand:scale-[0.92]" />
                            <p className="text-[7px] font-mono text-gray-600 uppercase tracking-[0.6em] font-black mt-1 ml-11">
                                Defense_Infrastructure
                            </p>
                        </div>

                        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm space-y-4 backdrop-blur-sm">
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                                    <span className="text-[10px] font-mono text-gray-400 uppercase font-black tracking-widest">Uptime_Pulse</span>
                                </div>
                                <span className="text-[10px] font-mono text-white font-black">{uptime}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono text-gray-600 uppercase">Region</span>
                                <span className="text-[9px] font-mono text-gray-400 uppercase flex items-center gap-1.5">
                                    <GlobeIcon className="w-3 h-3 text-blue-500" />
                                    POLYGON_S1_ASIA
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono text-gray-600 uppercase">Latency</span>
                                <span className="text-[9px] font-mono text-green-500 uppercase">12ms // Optimal</span>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="font-black text-white mb-8 uppercase text-[10px] tracking-[0.4em] font-mono flex items-center gap-2">
                            <div className="w-1 h-3 bg-polygon-purple"></div>
                            Resources
                        </h4>
                        <ul className="space-y-4">
                            {footerLinks.resources.map((link) => (
                                <li key={link.label}>
                                    <button 
                                        onClick={() => navigateTo(link.primary, link.secondary)}
                                        className="text-[11px] text-gray-500 font-mono font-bold uppercase tracking-widest hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group/link text-left"
                                    >
                                        <span className="opacity-0 group-hover/link:opacity-100 transition-opacity text-polygon-purple">{'>'}</span>
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="md:col-span-2">
                        <h4 className="font-black text-white mb-8 uppercase text-[10px] tracking-[0.4em] font-mono flex items-center gap-2">
                            <div className="w-1 h-3 bg-blue-500"></div>
                            Protocol
                        </h4>
                        <ul className="space-y-4">
                            {footerLinks.protocol.map((link) => (
                                <li key={link.label}>
                                    <button 
                                        onClick={() => navigateTo(link.primary, link.secondary)}
                                        className="text-[11px] text-gray-500 font-mono font-bold uppercase tracking-widest hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group/link text-left"
                                    >
                                        <span className="opacity-0 group-hover/link:opacity-100 transition-opacity text-blue-500">{'>'}</span>
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-4 space-y-8">
                         <div>
                            <h4 className="font-black text-white mb-2 uppercase text-[10px] tracking-[0.4em] font-mono">Intelligence Feed</h4>
                            <p className="text-[10px] text-gray-600 font-light uppercase tracking-widest leading-relaxed">Subscribe to real-time cryptographic vulnerability alerts and protocol health telemetry.</p>
                         </div>
                         <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative group">
                                <Input 
                                    placeholder="EMAIL_IDENTIFIER" 
                                    className="bg-white/[0.03] border-white/10 focus:border-polygon-purple text-xs font-mono py-4 h-auto rounded-none w-full transition-all group-hover:bg-white/[0.05]"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                                    <ShieldCheckIcon className="w-4 h-4 text-polygon-purple" />
                                </div>
                            </div>
                            <Button className="w-full text-[11px] font-black uppercase tracking-[0.3em] rounded-none py-4 !bg-white !text-black hover:!bg-polygon-purple hover:!text-white transition-all duration-500 border-none relative overflow-hidden group/btn">
                                <span className="relative z-10">Establish_Uplink</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col lg:row-reverse lg:flex-row justify-between items-center gap-8 text-[9px] text-gray-700 font-mono font-black tracking-[0.3em]">
                    <div className="flex items-center gap-10">
                        {footerLinks.legal.map(link => (
                            <button 
                                key={link.label}
                                onClick={() => navigateTo(link.primary, link.secondary)}
                                className="hover:text-white transition-colors relative group/sublink uppercase"
                            >
                                {link.label}
                                <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover/sublink:w-full"></div>
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex flex-col lg:items-end items-center gap-2">
                         <p className="uppercase opacity-60">© 2025 POLYGUARD DEFENSE CLUSTER. VERIFIED BY POLYGON AGGLAYER.</p>
                         <div className="flex items-center gap-4 text-[8px] text-gray-800">
                            <span>UID: PG-CORE-3.2.0-PRO</span>
                            <span className="hidden lg:inline">//</span>
                            <span>TX_SECURED: 1,402,891</span>
                         </div>
                    </div>
                </div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-polygon-purple/20 to-transparent blur-[1px] animate-scan-slow"></div>
            
            <style>{`
                @keyframes scan-slow {
                    0% { transform: translateY(0); opacity: 0.2; }
                    50% { transform: translateY(-300px); opacity: 0.5; }
                    100% { transform: translateY(0); opacity: 0.2; }
                }
                .animate-scan-slow {
                    animation: scan-slow 15s ease-in-out infinite;
                }
            `}</style>
        </footer>
    );
};

export default Footer;
