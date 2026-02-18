
import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { analyzeWithGemini } from '../../services/geminiService';
import ResultDisplay from '../common/ResultDisplay';
// FIX: Added ShieldCheckIcon to the imports from Icons.
import { AuditorIcon, ActivityIcon, ZapIcon, ShieldCheckIcon } from '../Icons';
import { motion, AnimatePresence } from 'framer-motion';

const LiveAuditDemo: React.FC = () => {
  const [code, setCode] = useState('// Paste a contract snippet for a quick scan\ncontract SovereignVault {\n    address public operator;\n    mapping(address => uint) public reserves;\n    \n    function secureDeposit() public payable {\n        reserves[msg.sender] += msg.value;\n    }\n}');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleScan = async () => {
    setIsLoading(true);
    const prompt = `Perform a quick security preview scan of this Solidity snippet. Identify immediate vulnerabilities or gas issues. Keep it brief. \n\n\`\`\`solidity\n${code}\n\`\`\``;
    const { data } = await analyzeWithGemini(prompt);
    setResult(data);
    setIsLoading(false);
  };

  return (
    <section className="py-32 px-6 bg-[#050505] border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-polygon-purple/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        <div className="lg:col-span-5 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-polygon-purple/10 border border-polygon-purple/20 rounded-sm">
            <ZapIcon className="w-3.5 h-3.5 text-polygon-purple-light" />
            <span className="text-[10px] font-mono text-polygon-purple-light uppercase tracking-[0.2em] font-black">Heuristic_Kernel_Preview</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">Autonomous <br/><span className="text-polygon-purple">Surveillance</span></h2>
          <p className="text-gray-500 leading-relaxed text-base font-light max-w-md">
            Execute the <span className="text-white font-medium">Gemini Pro security kernel</span> on-demand. Deploy tactical static analysis to identify exploit signatures in sub-second latency.
          </p>
          
          <div className="space-y-4 pt-4 border-l-2 border-white/5 pl-8">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 bg-polygon-purple rounded-full shadow-[0_0_8px_#7b3fe4]"></div>
              <span className="text-[11px] font-mono text-gray-500 uppercase font-bold tracking-widest">94.2% Detection Precision</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 bg-polygon-purple rounded-full shadow-[0_0_8px_#7b3fe4]"></div>
              <span className="text-[11px] font-mono text-gray-500 uppercase font-bold tracking-widest">Zero-Day Vulnerability Mapping</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Card className="p-0 bg-[#080808] border-white/10 overflow-hidden shadow-2xl relative rounded-none">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none scale-150">
                <AuditorIcon className="w-48 h-48 text-white" />
            </div>
            
            <div className="p-4 border-b border-white/5 bg-[#0A0A0A] flex justify-between items-center text-[10px] font-mono text-gray-600 font-black uppercase tracking-widest">
              <div className="flex gap-6">
                <span className="text-white">SOURCE_BUFFER.SOL</span>
                <span className="text-polygon-purple-light/50">Uplink: Active</span>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-white/5"></div>
                <div className="w-2 h-2 rounded-full bg-white/5"></div>
              </div>
            </div>

            <div className="p-0 flex h-[420px]">
                <div className="w-14 bg-[#030303] border-r border-white/5 flex flex-col items-center py-6 font-mono text-[10px] text-gray-800 select-none font-bold">
                    {[...Array(16)].map((_, i) => <span key={i} className="leading-6">{(i + 1).toString().padStart(2, '0')}</span>)}
                </div>
                <div className="flex-1 flex flex-col bg-black/40">
                    <textarea 
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 bg-transparent p-6 font-mono text-xs text-gray-400 focus:outline-none focus:text-white resize-none leading-relaxed transition-colors custom-scrollbar"
                    />
                </div>
            </div>

            <div className="p-5 border-t border-white/5 bg-[#0A0A0A] flex justify-between items-center">
                <div className="text-[9px] font-mono text-gray-600 uppercase font-black tracking-widest">Awaiting_Heuristic_Handshake</div>
                <Button 
                    onClick={handleScan} 
                    disabled={isLoading} 
                    className="text-[11px] px-10 py-4 !bg-white !text-black hover:!bg-polygon-purple hover:!text-white border-none rounded-none shadow-2xl transition-all font-black uppercase tracking-widest"
                >
                    {isLoading ? 'ANALYZING_BUFFER...' : 'EXECUTE_TACTICAL_SCAN'}
                </Button>
            </div>

            <AnimatePresence>
              {result && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="overflow-hidden bg-[#020202] border-t border-polygon-purple/20"
                >
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <ShieldCheckIcon className="w-4 h-4 text-green-500" />
                                <span className="text-[10px] font-mono text-green-500 uppercase font-black tracking-[0.2em]">Heuristic_Output // Integrity_Verified</span>
                            </div>
                            <button onClick={() => setResult(null)} className="text-[9px] text-gray-600 hover:text-white uppercase font-mono font-black tracking-widest">Purge_Log</button>
                        </div>
                        <ResultDisplay content={result} />
                    </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LiveAuditDemo;
