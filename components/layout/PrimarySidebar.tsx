
import React, { useState, useEffect } from 'react';
import { NavItem } from '../../types';
import CyberpunkLogo from '../landing/CyberpunkLogo';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobeIcon, WalletIcon, ChevronDownIcon } from '../Icons';
import { useWallet } from '../../context/WalletContext';

interface PrimarySidebarProps {
  items: NavItem[];
  activeItem: string;
  activeSubItem: string;
  onItemClick: (id: string) => void;
  onSubItemClick: (id: string) => void;
}

const PrimarySidebar: React.FC<PrimarySidebarProps> = ({ items, activeItem, activeSubItem, onItemClick, onSubItemClick }) => {
  const { account } = useWallet();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toUTCString().slice(17, 25);
  };
  
  const formatAddress = (address: string) => `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

  const subMenuVariants = {
    collapsed: { height: 0, opacity: 0 },
    open: { height: 'auto', opacity: 1 },
  };

  return (
    <aside className="w-20 lg:w-72 bg-[#030303] border-r border-white/5 flex flex-col items-center lg:items-start flex-shrink-0 z-[100] transition-all duration-500 ease-in-out relative group/sidebar">
      {/* Background Decorative Mesh */}
      <div className="absolute inset-0 tech-bg opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"></div>
      
      {/* 1. Brand Header Area - Updated to hide text for a cleaner look */}
      <div className="w-full flex items-center justify-center lg:justify-start p-6 mb-2 flex-shrink-0 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/5 blur-[40px] rounded-full pointer-events-none"></div>
        <CyberpunkLogo hideText={true} className="scale-110 lg:scale-125 origin-left" />
      </div>
      
      {/* 2. Navigation Container */}
      <nav className="flex flex-col w-full px-3 overflow-y-auto custom-scrollbar flex-1 py-4">
        {items.map((item) => {
          const isActive = activeItem === item.id;
          const hasSubItems = item.subItems && item.subItems.length > 0;

          return (
            <div key={item.id} className="w-full">
              <button
                onClick={() => onItemClick(item.id)}
                className={`flex items-center justify-center lg:justify-start gap-4 p-3 text-left transition-all duration-300 relative w-full group overflow-hidden rounded-sm ${
                  isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 bg-white/[0.04] border-x border-white/5 z-0"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveIndicator"
                    className="absolute left-0 top-0 bottom-0 w-[2px] bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-20 animate-pulse-blue"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                <div className={`relative z-10 flex items-center justify-center min-w-[24px] h-6 transition-all duration-500 ${isActive ? 'text-blue-400' : 'group-hover:text-white'}`}>
                  <item.icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''}`} />
                </div>
                
                <span className={`hidden lg:block font-mono text-[11px] uppercase tracking-widest font-bold transition-all duration-300 flex-1 z-10 ${isActive ? 'translate-x-1' : 'opacity-60 group-hover:opacity-100 group-hover:translate-x-1'}`}>
                  {item.label}
                </span>

                {hasSubItems && (
                  <ChevronDownIcon className={`hidden lg:block w-4 h-4 text-gray-600 transition-transform duration-300 z-10 ${isActive ? 'rotate-180' : ''}`} />
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none"></div>
              </button>
              
              <AnimatePresence>
                {isActive && hasSubItems && (
                  <motion.div
                    variants={subMenuVariants}
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-6 pt-1 pb-2 space-y-1">
                        {item.subItems?.map(subItem => {
                            const isSubActive = activeSubItem === subItem.id;
                            return (
                                <button
                                    key={subItem.id}
                                    onClick={() => onSubItemClick(subItem.id)}
                                    className={`w-full flex items-center gap-3 py-1.5 px-3 rounded-sm transition-colors duration-200 ${
                                        isSubActive ? 'text-white' : 'text-gray-600 hover:text-gray-400'
                                    }`}
                                >
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <div className={`w-1 h-1 rounded-full transition-all ${isSubActive ? 'bg-blue-400 scale-150 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-gray-700 group-hover:bg-gray-500'}`}></div>
                                    </div>
                                    <span className="text-[10px] font-mono uppercase tracking-wider hidden lg:block">{subItem.label}</span>
                                </button>
                            )
                        })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
      
      {/* 3. Sidebar Footer HUD */}
      <div className="w-full mt-auto p-4 border-t border-white/5 bg-black/40 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none"></div>
         
         <div className="flex flex-col gap-4 relative z-10">
             {/* Node Status & Time Widget */}
             <div className="hidden lg:flex flex-col gap-3">
                 <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-mono text-gray-600 uppercase font-black">Region</span>
                        <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5">
                           <GlobeIcon className="w-2.5 h-2.5 text-blue-500" />
                           POLYGON_S1_IND
                        </span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-mono text-gray-600 uppercase font-black">UTC_Time</span>
                        <span className="text-[10px] font-mono text-gray-400">{formatTime(time)}</span>
                    </div>
                 </div>

                 <div className="flex items-center justify-between group/vital cursor-help">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-mono text-gray-600 uppercase font-black">Core_Load</span>
                        <div className="flex items-center gap-1 mt-0.5">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className={`h-1.5 w-1 rounded-sm ${i < 4 ? 'bg-blue-500/40' : 'bg-gray-800'}`}></div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                         <span className="text-[10px] font-mono text-gray-500 group-hover/vital:text-white transition-colors uppercase font-bold">V3.1.0</span>
                    </div>
                 </div>
             </div>
             
             {/* Wallet Connection Status */}
             <div className="bg-white/[0.02] border border-white/5 p-2 rounded-sm flex items-center justify-center lg:justify-between group">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <div className={`w-1.5 h-1.5 rounded-full ${account ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div className={`absolute inset-0 w-1.5 h-1.5 rounded-full ${account ? 'bg-green-500' : 'bg-red-500'} animate-ping opacity-75`}></div>
                    </div>
                    <span className="text-[9px] font-mono text-gray-600 uppercase group-hover:text-gray-400 hidden lg:inline">Auth_Link</span>
                </div>
                {account ? (
                    <span className="text-[9px] font-mono text-green-400 hidden lg:inline">{formatAddress(account)}</span>
                ) : (
                    <span className="text-[9px] font-mono text-red-500 uppercase hidden lg:inline">Disconnected</span>
                )}
             </div>
         </div>
      </div>
    </aside>
  );
};

export default PrimarySidebar;
