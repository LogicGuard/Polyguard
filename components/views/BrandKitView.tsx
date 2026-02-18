
import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheckIcon, ZapIcon, LayersIcon, PlusIcon, RefreshIcon, CheckCircleIcon, CheckIcon, SearchIcon } from '../Icons';
import CyberpunkLogo from '../landing/CyberpunkLogo';

const COLORS = [
    { name: 'Polygon Purple', hex: '#7B3FE4', role: 'Primary Brand / Accents', rgb: '123, 63, 228' },
    { name: 'Pure Dark', hex: '#020202', role: 'Primary Background', rgb: '2, 2, 2' },
    { name: 'Institutional Gray', hex: '#EAEAEA', role: 'Primary Typography', rgb: '234, 234, 234' },
    { name: 'Cyber Blue', hex: '#3B82F6', role: 'Signal / Action Info', rgb: '59, 130, 246' },
    { name: 'Alert Red', hex: '#EF4444', role: 'Threat / Critical State', rgb: '239, 68, 68' },
];

const ASSETS = [
    { title: 'Vector Logo Pack', format: 'SVG', size: '12.4 KB', type: 'Logo', mime: 'image/svg+xml' },
    { title: 'Raster UI Assets', format: 'PNG', size: '2.8 MB', type: 'Icons', mime: 'image/png' },
    { title: 'Identity Guidelines', format: 'PDF', size: '1.4 MB', type: 'Media', mime: 'application/pdf' },
    { title: 'SOC_Banners_V1', format: 'JPG', size: '4.2 MB', type: 'Graphics', mime: 'image/jpeg' },
];

const BrandKitView: React.FC = () => {
    const [downloadingStates, setDownloadingStates] = useState<Record<number, 'idle' | 'preparing' | 'downloading' | 'complete'>>({});
    const [copiedColor, setCopiedColor] = useState<string | null>(null);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedColor(text);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    const triggerFileDownload = (index: number) => {
        const asset = ASSETS[index];
        let blob: Blob;

        if (asset.format === 'SVG') {
            const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
    <rect width="500" height="500" fill="#020202"/>
    <!-- Outer Shield Frame -->
    <path d="M250 50 L450 150 V350 L250 450 L50 350 V150 L250 50Z" fill="none" stroke="#7b3fe4" stroke-width="20" stroke-linejoin="round"/>
    <!-- Inner Geometric Core -->
    <path d="M250 120 L370 200 L250 280 L130 200 Z" fill="#7b3fe4"/>
    <path d="M250 280 L370 360 L250 440 L130 360 Z" fill="#7b3fe4" opacity="0.7"/>
    <!-- Institutional Typography Mock -->
    <text x="250" y="480" font-family="Arial, sans-serif" font-size="24" fill="#ffffff" text-anchor="middle" font-weight="bold" letter-spacing="10">POLYGUARD DEFENSE</text>
    <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
    </defs>
</svg>`.trim();
            blob = new Blob([svgContent], { type: 'image/svg+xml' });
        } else if (asset.format === 'PNG' || asset.format === 'JPG') {
            // Create a valid 1x1 base64 encoded pixel but with a larger blob size to simulate weight
            const base64Pixel = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
            const byteCharacters = atob(base64Pixel);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            blob = new Blob([byteArray], { type: asset.mime });
        } else {
            // Generate a Professional Technical Spec Text File (Mime: PDF is tricky, usually we'd serve a real file)
            const docContent = `
[SYSTEM_DOCUMENTATION_HEADER]
VERSION: 3.2.0-PRO
AUTH_LEVEL: INSTITUTIONAL
ENCRYPTION: AES-256-GCM
--------------------------------------------------
PROJECT: POLYGUARD SECURITY AGENT
MODULE: BRAND_IDENTITY_PROTOCOL
TIMESTAMP: ${new Date().toISOString()}

1. CORE MISSION
PolyGuard operates as the primary defense layer for the Polygon AggLayer. 
The visual identity reflects strength, transparency, and geometric precision.

2. COLOR REQUISITIONS
- POLYGON_PURPLE: #7B3FE4 (Signal Base)
- CYBER_BLUE: #3B82F6 (Action State)
- ALERT_RED: #EF4444 (Threat Vector)

3. TYPOGRAPHY KERNEL
Primary Sans: Inter (Variable)
Secondary Mono: JetBrains Mono (Technical)

[SECURE_PAYLOAD_TERMINATED]
`.trim();
            blob = new Blob([docContent], { type: 'text/plain' });
        }
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const fileName = `${asset.title.toLowerCase().replace(/\s+/g, '_')}_v3.${asset.format.toLowerCase()}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleDownload = async (index: number) => {
        if (downloadingStates[index] && downloadingStates[index] !== 'idle' && downloadingStates[index] !== 'complete') return;

        setDownloadingStates(prev => ({ ...prev, [index]: 'preparing' }));
        await new Promise(r => setTimeout(r, 800));
        setDownloadingStates(prev => ({ ...prev, [index]: 'downloading' }));
        await new Promise(r => setTimeout(r, 1800));
        
        triggerFileDownload(index);
        setDownloadingStates(prev => ({ ...prev, [index]: 'complete' }));

        setTimeout(() => {
            setDownloadingStates(prev => ({ ...prev, [index]: 'idle' }));
        }, 3000);
    };

    return (
        <div className="max-w-6xl mx-auto pb-24">
            <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-polygon-purple/10 border border-polygon-purple/20 rounded-sm">
                        <LayersIcon className="w-8 h-8 text-polygon-purple-light" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-white leading-none">Identity Protocol</h1>
                        <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-widest">System_Specs // Asset_Repository // Version_3.2</p>
                    </div>
                </div>
                <div className="hidden lg:flex gap-4">
                    <div className="text-right">
                        <div className="text-[8px] font-mono text-gray-600 uppercase font-black">Release</div>
                        <div className="text-xs font-mono font-bold text-white uppercase">Q2_2025_DEPLOY</div>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div className="text-right">
                        <div className="text-[8px] font-mono text-gray-600 uppercase font-black">Auth_Link</div>
                        <div className="text-xs font-mono font-bold text-green-500 uppercase">VERIFIED_SECURE</div>
                    </div>
                </div>
            </div>

            {/* Logo Previews Contexts */}
            <section className="mb-20">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-1 h-4 bg-polygon-purple"></div>
                    <h2 className="text-[11px] font-mono font-black text-white uppercase tracking-[0.4em]">Logotype_Matrix</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-16 flex items-center justify-center bg-[#020202] border-white/10 relative overflow-hidden group">
                        <div className="absolute inset-0 tech-bg opacity-[0.03]"></div>
                        <CyberpunkLogo className="scale-150 relative z-10" />
                        <div className="absolute bottom-4 left-4 text-[7px] font-mono text-gray-700 uppercase font-black">Context: Dark_Uplink</div>
                    </Card>
                    <Card className="p-16 flex items-center justify-center bg-white border-transparent group">
                        <CyberpunkLogo className="scale-150 brightness-0" />
                        <div className="absolute bottom-4 left-4 text-[7px] font-mono text-gray-400 uppercase font-black">Context: Document_Print</div>
                    </Card>
                    <Card className="p-16 flex items-center justify-center bg-polygon-purple border-transparent group overflow-hidden">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <CyberpunkLogo hideText className="scale-[3.5] opacity-20 absolute -right-4 -bottom-4" />
                        <CyberpunkLogo hideText className="scale-[2.5] brightness-200" />
                        <div className="absolute bottom-4 left-4 text-[7px] font-mono text-purple-200 uppercase font-black">Context: Brand_Primary</div>
                    </Card>
                </div>
            </section>

            {/* Color Palette Grid */}
            <section className="mb-20">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-1 h-4 bg-blue-500"></div>
                    <h2 className="text-[11px] font-mono font-black text-white uppercase tracking-[0.4em]">Chromatic_Protocol</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                    {COLORS.map((color, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => copyToClipboard(color.hex)}
                            className="flex flex-col cursor-pointer group"
                        >
                            <div 
                                className="h-40 w-full rounded-sm border border-white/10 mb-4 transition-all duration-300 group-hover:scale-[1.02] group-hover:border-white/30 relative flex items-center justify-center overflow-hidden" 
                                style={{ backgroundColor: color.hex }}
                            >
                                <AnimatePresence>
                                    {copiedColor === color.hex && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 z-10"
                                        >
                                            <CheckIcon className="w-3 h-3 text-green-500" />
                                            <span className="text-[10px] font-mono text-white font-bold uppercase">Copied</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PlusIcon className="w-3 h-3 text-white/50" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xs font-black text-white uppercase tracking-tight">{color.name}</h3>
                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] font-mono text-blue-400 font-bold">{color.hex}</p>
                                    <span className="text-[8px] font-mono text-gray-700 font-black">RGB: {color.rgb}</span>
                                </div>
                                <p className="text-[9px] font-mono text-gray-600 uppercase leading-none pt-1">{color.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Typography Specimen */}
            <section className="mb-20">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-1 h-4 bg-white"></div>
                    <h2 className="text-[11px] font-mono font-black text-white uppercase tracking-[0.4em]">Typographic_Engine</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="p-10 bg-[#080808] border-white/10 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.02] scale-[4] rotate-12 pointer-events-none font-black text-white">INTER</div>
                        <span className="text-[8px] font-mono text-gray-600 uppercase font-black block mb-6 tracking-[0.2em]">Primary_Sans: Inter / Regular - Black</span>
                        <div className="space-y-6">
                            <p className="text-5xl font-black text-white tracking-tighter leading-none">ABCDEFGHIJK <br/> LMNOPQRSTUV</p>
                            <p className="text-2xl font-bold text-gray-300 leading-tight">THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG.</p>
                            <div className="pt-4 flex gap-4">
                                <div className="text-[10px] font-mono text-blue-500 uppercase font-black">Kern: Auto</div>
                                <div className="text-[10px] font-mono text-blue-500 uppercase font-black">Case: Adaptive</div>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-10 bg-[#080808] border-white/10 font-mono relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-4 opacity-[0.02] scale-[4] rotate-12 pointer-events-none font-black text-white">MONO</div>
                        <span className="text-[8px] font-mono text-gray-600 uppercase font-black block mb-6 tracking-[0.2em]">Secondary_Mono: JetBrains Mono / Bold</span>
                        <div className="space-y-6">
                            <p className="text-4xl font-bold text-blue-400 tracking-tighter leading-none">0123456789 <br/> !@#$%^&*()</p>
                            <p className="text-xl text-gray-400 tracking-tight bg-white/5 p-3 rounded-sm">CONST_CORE_SIGNAL = 0x7B3FE4;</p>
                            <div className="pt-4 flex gap-4">
                                <div className="text-[10px] font-mono text-gray-600 uppercase font-black">Ligatures: ON</div>
                                <div className="text-[10px] font-mono text-gray-600 uppercase font-black">Style: Fixed</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Asset Payloads */}
            <section>
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-1 h-4 bg-green-500"></div>
                    <h2 className="text-[11px] font-mono font-black text-white uppercase tracking-[0.4em]">Operational_Resources</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {ASSETS.map((asset, i) => {
                        const state = downloadingStates[i] || 'idle';
                        return (
                            <Card key={i} className="p-8 bg-[#0C0C0C] border-white/5 hover:border-polygon-purple/40 transition-all flex flex-col group relative overflow-hidden rounded-none">
                                {state === 'downloading' && (
                                    <motion.div 
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '100%' }}
                                        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                                        className="absolute bottom-0 left-0 h-1 bg-polygon-purple w-full z-20 shadow-[0_0_10px_#7b3fe4]"
                                    />
                                )}
                                
                                <div className="flex justify-between items-start mb-8">
                                    <div className="p-3 bg-white/5 rounded-sm group-hover:bg-polygon-purple/20 transition-all duration-500">
                                        <ShieldCheckIcon className={`w-5 h-5 transition-colors duration-500 ${state === 'complete' ? 'text-green-500' : 'text-gray-500 group-hover:text-polygon-purple-light'}`} />
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[8px] font-mono text-gray-600 uppercase font-black block mb-1">Payload_Type</span>
                                        <span className="text-[9px] font-mono text-white uppercase font-black tracking-widest">{asset.type}</span>
                                    </div>
                                </div>

                                <h4 className="text-sm font-black text-white uppercase mb-1 group-hover:text-polygon-purple-light transition-colors">{asset.title}</h4>
                                <p className="text-[10px] font-mono text-gray-600 uppercase mb-8">{asset.format} // {asset.size}</p>
                                
                                <Button 
                                    variant="secondary" 
                                    className={`w-full text-[10px] py-4 border-white/10 rounded-none font-black uppercase tracking-widest transition-all duration-500 ${
                                        state === 'complete' ? '!border-green-500/50 !text-green-400 bg-green-500/5' : 
                                        state !== 'idle' ? '!border-polygon-purple/50' : 
                                        'group-hover:border-polygon-purple/60 group-hover:text-white group-hover:bg-polygon-purple/5'
                                    }`}
                                    onClick={() => handleDownload(i)}
                                >
                                    {state === 'idle' && (
                                        <span className="flex items-center gap-2"><RefreshIcon className="w-3.5 h-3.5" /> REQUISITION</span>
                                    )}
                                    {state === 'preparing' && (
                                        <span className="flex items-center gap-2"><RefreshIcon className="w-3.5 h-3.5 animate-spin" /> LINKING...</span>
                                    )}
                                    {state === 'downloading' && (
                                        <span className="flex items-center gap-2"><ZapIcon className="w-3.5 h-3.5 animate-pulse" /> INGESTING</span>
                                    )}
                                    {state === 'complete' && (
                                        <span className="flex items-center gap-2"><CheckCircleIcon className="w-3.5 h-3.5" /> DELIVERED</span>
                                    )}
                                </Button>
                            </Card>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default BrandKitView;
