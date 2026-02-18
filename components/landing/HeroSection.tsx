
import React from 'react';
import { motion } from 'framer-motion';
import HeroTypography from './HeroTypography';
import Button from '../common/Button';
import TerminalWidget from './TerminalWidget';
import CyberpunkBackground from './CyberpunkBackground';
import { useNavigation } from '../../context/NavigationContext';

interface HeroSectionProps {
    onStart: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStart }) => {
    const { navigateTo } = useNavigation();

    return (
        <header className="relative min-h-screen pt-20 pb-12 lg:pt-0 px-6 md:px-12 lg:px-24 overflow-hidden flex items-center bg-[#020202]">
            <CyberpunkBackground />
            
            {/* Polygon Institutional Ambient Lighting */}
            <div className="absolute inset-0 bg-gradient-to-b from-polygon-purple/5 via-transparent to-[#030303] pointer-events-none"></div>
            <div className="absolute top-1/4 -right-20 w-[60vw] h-[60vw] bg-polygon-purple/10 blur-[180px] rounded-full pointer-events-none animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-[40vw] h-[40vw] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none"></div>
            
            <div className="scanline"></div>

            <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10">
                <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Status Badge - Moved lower with mt-20 */}
                        <div className="inline-flex items-center gap-2.5 px-3 py-1 border border-white/5 bg-black/40 backdrop-blur-xl mt-20 mb-10 mx-auto lg:mx-0 rounded-full">
                            <div className="flex gap-1.5 items-center">
                                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse shadow-[0_0_6px_rgba(34,197,94,0.8)]"></div>
                                <span className="text-[7px] font-mono text-gray-400 tracking-[0.4em] uppercase font-black opacity-80">
                                    CORE_UPLINK: ACTIVE // AGG_LAYER_V1
                                </span>
                            </div>
                        </div>

                        <div className="mb-8 min-h-[140px] md:min-h-[180px] lg:min-h-[160px]">
                            <HeroTypography 
                                text="Sovereign Defense for Institutional Assets." 
                                highlightWords={['Defense', 'Institutional']}
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-white"
                            />
                        </div>
                        
                        <p className="text-base md:text-lg text-gray-400 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light border-l-2 border-polygon-purple/50 pl-8 py-2">
                            Deploying <span className="text-white font-medium">algorithmic auditing</span>, <span className="text-white font-medium">pre-execution shielding</span>, and <span className="text-white font-medium">tactical reconnaissance</span> to secure the next generation of Polygon infrastructure.
                        </p>
                        
                        <div className="flex flex-wrap justify-center lg:justify-start gap-5">
                            <Button 
                                onClick={onStart}
                                className="min-w-[220px] py-4 text-[12px] !bg-white !text-black hover:!bg-polygon-purple hover:!text-white hover:!scale-105 transition-all shadow-[0_10px_40px_rgba(255,255,255,0.1)] rounded-none"
                            >
                                INITIALIZE_UPLINK
                            </Button>
                            <Button 
                                variant="secondary" 
                                onClick={() => navigateTo('documentation')}
                                className="min-w-[220px] py-4 text-[12px] hover:!bg-white/5 hover:!border-polygon-purple transition-all font-mono rounded-none"
                            >
                                VIEW_SPECIFICATIONS
                            </Button>
                        </div>

                        <div className="mt-16 lg:mt-24 grid grid-cols-3 max-w-lg mx-auto lg:mx-0 gap-8 border-t border-white/10 pt-10">
                            {[
                                { label: 'Audit Latency', val: '0.4s', sub: 'GEMINI_V3_CORE' },
                                { label: 'Node Health', val: '99.9%', sub: 'REAL_TIME_PULSE' },
                                { label: 'Defense Score', val: '98/100', sub: 'CERTIFIED_TRUST' },
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col">
                                    <span className="text-[9px] text-gray-500 font-mono uppercase tracking-[0.2em] mb-1 font-bold">{stat.label}</span>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-2xl text-white font-mono font-bold tracking-tight">{stat.val}</span>
                                    </div>
                                    <span className="text-[8px] text-polygon-purple/80 font-mono font-bold tracking-widest">{stat.sub}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-center items-center relative py-12 lg:py-0">
                    <div className="absolute inset-0 bg-polygon-purple/[0.05] blur-[120px] rounded-full animate-pulse"></div>
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.3, type: "spring" }}
                        className="w-full max-w-lg lg:max-w-none relative"
                    >
                        <div className="absolute -top-10 -right-10 w-32 h-32 border-t-2 border-r-2 border-polygon-purple/20 pointer-events-none hidden xl:block"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 border-b-2 border-l-2 border-polygon-purple/20 pointer-events-none hidden xl:block"></div>
                        
                        <div className="relative z-10 group">
                             <div className="absolute -top-6 -left-6 z-20 bg-polygon-purple/20 border border-polygon-purple/40 px-3 py-1.5 text-[10px] font-mono text-white uppercase tracking-widest hidden md:block backdrop-blur-md shadow-2xl">
                                <span className="animate-ping mr-2 inline-block w-1.5 h-1.5 bg-white rounded-full"></span> AGGLAYER_FEED
                            </div>
                            
                            <div className="transform-gpu transition-transform duration-700 hover:rotate-y-1 hover:rotate-x-1">
                                <TerminalWidget />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30 group hidden lg:flex cursor-pointer hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-gray-500 group-hover:text-polygon-purple transition-colors">INIT_RECONNAISSANCE</span>
                <div className="w-px h-12 bg-gradient-to-b from-polygon-purple/60 to-transparent"></div>
            </div>
        </header>
    );
};

export default HeroSection;
