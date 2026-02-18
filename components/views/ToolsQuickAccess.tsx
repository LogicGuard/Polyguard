import React from 'react';
import Card from '../common/Card';
import { 
    TransactionIcon, 
    ShieldCheckIcon, 
    WalletIcon, 
    AuditorIcon, 
    GasIcon, 
    FirewallIcon,
    PortfolioIcon,
    NFTIcon
} from '../Icons';
import { useNavigation } from '../../context/NavigationContext';
import { motion } from 'framer-motion';

const tools = [
    { 
        id: 'transaction', 
        label: 'TX Analyzer', 
        icon: TransactionIcon,
        targetPrimary: 'real-time-security',
        targetSecondary: 'transaction-analysis',
        color: 'text-purple-400',
        borderColor: 'border-purple-500/20'
    },
    { 
        id: 'scanner', 
        label: 'Contract Scanner', 
        icon: ShieldCheckIcon,
        targetPrimary: 'security-audits',
        targetSecondary: 'smart-contract-scanner',
        color: 'text-blue-400',
        borderColor: 'border-blue-500/20'
    },
    { 
        id: 'wallet', 
        label: 'Wallet Report', 
        icon: WalletIcon,
        targetPrimary: 'asset-intelligence',
        targetSecondary: 'wallet-report',
        color: 'text-green-400',
        borderColor: 'border-green-500/20'
    },
    { 
        id: 'portfolio', 
        label: 'Portfolio Analysis', 
        icon: PortfolioIcon,
        targetPrimary: 'asset-intelligence',
        targetSecondary: 'portfolio-analysis',
        color: 'text-indigo-400',
        borderColor: 'border-indigo-500/20'
    },
    { 
        id: 'nft', 
        label: 'NFT Analysis', 
        icon: NFTIcon,
        targetPrimary: 'asset-intelligence',
        targetSecondary: 'nft-analysis',
        color: 'text-pink-400',
        borderColor: 'border-pink-500/20'
    },
    { 
        id: 'auditor', 
        label: 'Logic Auditor', 
        icon: AuditorIcon,
        targetPrimary: 'security-audits',
        targetSecondary: 'smart-contract-auditor',
        color: 'text-cyan-400',
        borderColor: 'border-cyan-500/20'
    },
    { 
        id: 'gas', 
        label: 'Gas Engine', 
        icon: GasIcon,
        targetPrimary: 'optimization-strategy',
        targetSecondary: 'gas-optimizer',
        color: 'text-yellow-400',
        borderColor: 'border-yellow-500/20'
    },
    { 
        id: 'firewall', 
        label: 'Firewall', 
        icon: FirewallIcon,
        targetPrimary: 'real-time-security',
        targetSecondary: 'smart-contract-firewall',
        color: 'text-red-400',
        borderColor: 'border-red-500/20'
    },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const ToolsQuickAccess: React.FC = () => {
    const { navigateTo } = useNavigation();

    return (
        <Card className="p-0 h-full flex flex-col bg-[#050505] overflow-hidden border-white/10 shadow-2xl">
            <div className="p-3 border-b border-white/5 bg-[#080808] flex justify-between items-center">
                <h2 className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] font-bold">Quick_Operations_Uplink</h2>
                <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-white/20"></div>
                    <div className="w-1 h-1 rounded-full bg-white/20"></div>
                </div>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="p-4 grid grid-cols-2 gap-3 flex-1 overflow-y-auto custom-scrollbar"
            >
                {tools.map((tool) => (
                    <motion.div
                        key={tool.id}
                        variants={itemVariants}
                        whileHover={{ 
                          scale: 1.03, 
                          y: -2,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigateTo(tool.targetPrimary, tool.targetSecondary)}
                        className={`bg-black/60 border ${tool.borderColor} rounded-sm flex flex-col items-center justify-center p-3
                                   hover:bg-white/[0.04] transition-all duration-300 cursor-pointer relative group overflow-hidden`}
                    >
                        {/* Hover Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <tool.icon className={`w-6 h-6 mb-2 ${tool.color} group-hover:scale-110 transition-transform duration-300 relative z-10`} />
                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors relative z-10 text-center">{tool.label}</p>
                        
                        {/* Corner Accent */}
                        <div className={`absolute top-0 right-0 w-1 h-1 border-t border-r ${tool.borderColor} group-hover:border-white transition-colors`}></div>
                        <div className={`absolute bottom-0 left-0 w-1 h-1 border-b border-l ${tool.borderColor} group-hover:border-white transition-colors`}></div>
                    </motion.div>
                ))}
            </motion.div>
            <div className="p-2 border-t border-white/5 bg-black/40 text-center">
                 <span className="text-[8px] font-mono text-gray-600 uppercase tracking-tighter">Latency: 14ms // Secure Link Active</span>
            </div>
        </Card>
    );
};

export default ToolsQuickAccess;