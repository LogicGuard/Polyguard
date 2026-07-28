
import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheckIcon, ZapIcon, LayersIcon, PlusIcon, RefreshIcon, CheckCircleIcon, CheckIcon, SearchIcon, CodeIcon, ClockIcon } from '../Icons';
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
    <path d="M250 50 L450 150 V350 L250 450 L50 350 V150 L250 50Z" fill="none" stroke="#7b3fe4" stroke-width="20" stroke-linejoin="round"/>
    <path d="M250 120 L370 200 L250 280 L130 200 Z" fill="#7b3fe4"/>
    <path d="M250 280 L370 360 L250 440 L130 360 Z" fill="#7b3fe4" opacity="0.7"/>
    <text x="250" y="480" font-family="Arial, sans-serif" font-size="24" fill="#ffffff" text-anchor="middle" font-weight="bold" letter-spacing="10">POLYGUARD DEFENSE</text>
</svg>`.trim();
            blob = new Blob([svgContent], { type: 'image/svg+xml' });
        } else if (asset.format === 'PNG' || asset.format === 'JPG') {
            const base64Pixel = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
            const byteCharacters = atob(base64Pixel);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            blob = new Blob([byteArray], { type: asset.mime });
        } else {
            const docContent = `
[SYSTEM_DOCUMENTATION_HEADER]
VERSION: 3.2.0-PRO
AUTH_LEVEL: INSTITUTIONAL
ENCRYPTION: AES-256-GCM
--------------------------------------------------
PROJECT: POLYGUARD SECURITY AGENT
MODULE: BRAND_IDENTITY_PROTOCOL
TIMESTAMP: ${new Date().toISOString()}
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
                <div className="grid grid-cols-1 gap-12">
                    {/* Inter Specimen */}
                    <Card className="p-0 bg-[#080808] border-white/10 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] scale-[5] rotate-12 pointer-events-none font-black text-white">INTER</div>
                        
                        <div className="p-6 border-b border-white/5 bg-[#0A0A0A] flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-blue-500/10 rounded-sm border border-blue-500/20">
                                    <ShieldCheckIcon className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Primary_Sans</h3>
                                    <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Inter / Variable / Variable Optical Size</span>
                                </div>
                            </div>
                            <span className="text-[8px] font-mono text-gray-600 uppercase tracking-widest">Weights: 100 - 900</span>
                        </div>

                        <div className="p-10 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
                            <div className="lg:col-span-7 space-y-12">
                                <div className="space-y-4">
                                    <span className="text-[8px] font-mono text-blue-500 uppercase font-bold tracking-[0.3em]">H1_Display</span>
                                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] uppercase">
                                        Sovereign <br/> Defense.
                                    </h1>
                                </div>
                                <div className="space-y-4">
                                    <span className="text-[8px] font-mono text-blue-500 uppercase font-bold tracking-[0.3em]">H2_Heading</span>
                                    <h2 className="text-3xl md:text-5xl font-black text-gray-200 tracking-tight leading-none uppercase">
                                        Algorithmic Integrity <br/> Unified Buffer.
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    <span className="text-[8px] font-mono text-blue-500 uppercase font-bold tracking-[0.3em]">Body_Primary</span>
                                    <p className="text-lg text-gray-400 font-light leading-relaxed max-w-xl">
                                        The quick brown fox jumps over the lazy dog. PolyGuard utilizes Inter as its primary typeface to convey precision, authority, and industrial clarity across all UI primitives.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-5 border-l border-white/5 pl-12 space-y-12">
                                <div>
                                    <span className="text-[8px] font-mono text-gray-600 uppercase font-black block mb-6 tracking-widest">Weight_Scale</span>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-6">
                                            <span className="text-4xl font-black text-white w-12 text-center">Aa</span>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-white font-black uppercase">900 Black</span>
                                                <span className="text-[9px] text-gray-600 font-mono">Mission Critical Headers</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="text-4xl font-bold text-white w-12 text-center">Aa</span>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-white font-bold uppercase">700 Bold</span>
                                                <span className="text-[9px] text-gray-600 font-mono">Module Sub-headings</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="text-4xl font-semibold text-white w-12 text-center">Aa</span>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-white font-semibold uppercase">600 SemiBold</span>
                                                <span className="text-[9px] text-gray-600 font-mono">Interactive Components</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="text-4xl font-normal text-white w-12 text-center">Aa</span>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-white font-normal uppercase">400 Regular</span>
                                                <span className="text-[9px] text-gray-600 font-mono">Standard Interface Text</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-[8px] font-mono text-gray-600 uppercase font-black block mb-6 tracking-widest">Character_Set</span>
                                    <p className="text-sm font-mono text-gray-500 break-all leading-loose tracking-tighter">
                                        ABCDEFGHIJKLMNOPQRSTUVWXYZ <br/>
                                        abcdefghijklmnopqrstuvwxyz <br/>
                                        0123456789 (!@#$%^&*?)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* JetBrains Mono Specimen */}
                    <Card className="p-0 bg-[#080808] border-white/10 font-mono overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] scale-[5] rotate-12 pointer-events-none font-black text-white">MONO</div>
                        
                        <div className="p-6 border-b border-white/5 bg-[#0A0A0A] flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-purple-500/10 rounded-sm border border-purple-500/20">
                                    <CodeIcon className="w-4 h-4 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Secondary_Mono</h3>
                                    <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">JetBrains Mono / Open-Source / Ligatures-Enabled</span>
                                </div>
                            </div>
                            <span className="text-[8px] font-mono text-gray-600 uppercase tracking-widest">Usage: Telemetry / Bytecode / Logs</span>
                        </div>

                        <div className="p-10 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
                            <div className="lg:col-span-7 space-y-12">
                                <div className="space-y-4">
                                    <span className="text-[8px] font-mono text-purple-500 uppercase font-bold tracking-[0.3em]">Code_Block_Display</span>
                                    <div className="bg-black/60 border border-white/5 p-8 rounded-sm font-mono text-sm leading-relaxed text-blue-300">
                                        <p><span className="text-purple-400">async function</span> <span className="text-white">authorize</span>(node: <span className="text-yellow-400">Address</span>) &#123;</p>
                                        <p className="pl-6 text-gray-600 italic">// Verify cryptographic handshake integrity</p>
                                        <p className="pl-6"><span className="text-purple-400">const</span> status = <span className="text-purple-400">await</span> kernel.<span className="text-white">scan</span>(node);</p>
                                        <p className="pl-6"><span className="text-purple-400">return</span> status.integrity === <span className="text-green-400">1.0</span>;</p>
                                        <p>&#125;</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <span className="text-[8px] font-mono text-purple-500 uppercase font-bold tracking-[0.3em]">Telemetry_Stream</span>
                                    <div className="bg-[#050505] p-6 border-l-2 border-purple-500 space-y-1">
                                        <div className="flex gap-4 text-[10px] text-gray-500">
                                            <span className="w-16">14:02:11</span>
                                            <span className="text-blue-400">[SIGNAL]</span>
                                            <span className="text-white">0x7B3FE4...INIT_SYNC_SUCCESS</span>
                                        </div>
                                        <div className="flex gap-4 text-[10px] text-gray-500">
                                            <span className="w-16">14:02:12</span>
                                            <span className="text-purple-400">[KERNEL]</span>
                                            <span className="text-white">SCANNING_MEMPOOL_VECTORS_V4</span>
                                        </div>
                                        <div className="flex gap-4 text-[10px] text-gray-500">
                                            <span className="w-16">14:02:14</span>
                                            <span className="text-red-500">[WARN]</span>
                                            <span className="text-white">HIGH_LATENCY_DETECTED_NODE_S1</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-5 border-l border-white/5 pl-12 space-y-12">
                                <div>
                                    <span className="text-[8px] font-mono text-gray-600 uppercase font-black block mb-6 tracking-widest">Symbol_Library</span>
                                    <div className="grid grid-cols-4 gap-4">
                                        {['=>', '!=', '===', '<=', '&&', '||', '=>', '::'].map((sym, i) => (
                                            <div key={i} className="bg-white/5 p-3 flex items-center justify-center rounded-sm">
                                                <span className="text-xl text-white font-bold">{sym}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[8px] text-gray-600 font-mono mt-4 uppercase">Ligature visual verification enabled.</p>
                                </div>

                                <div>
                                    <span className="text-[8px] font-mono text-gray-600 uppercase font-black block mb-6 tracking-widest">Character_Reference</span>
                                    <p className="text-sm font-mono text-gray-400 break-all leading-loose">
                                        0 1 2 3 4 5 6 7 8 9 <br/>
                                        ! @ # $ % ^ &amp; * ( ) <br/>
                                        {"[ ] { } < > / \\ | : ;"}
                                    </p>
                                    <div className="mt-8 space-y-2">
                                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                                            <span className="text-[9px] text-gray-600 uppercase">Weight: Regular</span>
                                            <span className="text-[11px] text-white">Mono_400</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                                            <span className="text-[9px] text-gray-600 uppercase">Weight: Bold</span>
                                            <span className="text-[11px] text-white font-bold">Mono_700</span>
                                        </div>
                                    </div>
                                </div>
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
