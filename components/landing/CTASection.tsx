
import React from 'react';
import Button from '../common/Button';
import { motion } from 'framer-motion';

interface CTASectionProps {
  onStart: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onStart }) => {
  return (
    <section className="py-40 px-6 relative overflow-hidden bg-[#020202] border-t border-white/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-polygon-purple/5 blur-[250px] rounded-full"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block px-4 py-1 bg-polygon-purple/10 border border-polygon-purple/20 rounded-full mb-8">
            <span className="text-[10px] font-mono text-polygon-purple-light uppercase tracking-[0.4em] font-black">
                UPLINK_INITIALIZATION
            </span>
          </div>
          
          <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-10 leading-[0.85]">
            Secure the <br/> <span className="text-polygon-purple">Polygon Frontier.</span>
          </h2>
          
          <p className="text-gray-500 text-base md:text-xl mb-16 max-w-2xl mx-auto leading-relaxed font-light border-x border-white/5 px-10">
            Join 42,000+ protocols already leveraging PolyGuard's <span className="text-white font-medium">autonomous defense clusters</span>. Establish your security handshake today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Button 
                onClick={onStart} 
                className="min-w-[280px] py-6 text-[12px] font-black uppercase tracking-[0.3em] !bg-white !text-black hover:!bg-polygon-purple hover:!text-white shadow-[0_20px_50px_rgba(123,63,228,0.3)] hover:scale-105 transition-all rounded-none border-none"
            >
                INITIATE_DEPLOYMENT
            </Button>
            <div className="flex items-center gap-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest font-black">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                SYSTEM_STABLE // AGGLAYER_V1
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
