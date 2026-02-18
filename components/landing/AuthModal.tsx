
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../common/Card';
import { Input } from '../common/Input';
import Button from '../common/Button';
import { PolygonIcon, WalletIcon } from '../Icons';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode: 'login' | 'signup';
    onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode, onSuccess }) => {
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API Call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        onSuccess();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-sm"
                >
                    <Card className="p-0 bg-[#0C0C0C] border border-white/10 relative overflow-hidden shadow-2xl">
                        
                        {/* Header */}
                        <div className="bg-[#050505] p-6 border-b border-white/5 flex flex-col items-center">
                            <PolygonIcon className="w-8 h-8 text-white mb-4" />
                            <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
                                {mode === 'login' ? 'Identity Verification' : 'New User Registration'}
                            </h2>
                            <p className="text-[10px] text-gray-500 font-mono mt-1">
                                {mode === 'login' ? 'ACCESS_LEVEL: RESTRICTED' : 'INITIALIZING_PROFILE...'}
                            </p>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase font-mono">User Identifier</label>
                                    <Input 
                                        type="email" 
                                        placeholder="EMAIL_ADDRESS" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-[#050505] border-white/10 text-xs font-mono focus:border-blue-500 rounded-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase font-mono">Access Key</label>
                                    <Input 
                                        type="password" 
                                        placeholder="PASSWORD" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="bg-[#050505] border-white/10 text-xs font-mono focus:border-blue-500 rounded-sm"
                                    />
                                </div>

                                <Button type="submit" className="w-full py-3 mt-2 rounded-sm text-xs font-bold uppercase bg-white text-black hover:bg-gray-200 border-none" disabled={isLoading}>
                                    {isLoading ? 'Verifying...' : (mode === 'login' ? 'Authenticate' : 'Register')}
                                </Button>
                            </form>

                            <div className="relative my-6 text-center">
                                <span className="bg-[#0C0C0C] px-2 text-[10px] text-gray-600 font-mono uppercase relative z-10">Alternative Auth</span>
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/5"></div>
                                </div>
                            </div>

                            <Button variant="secondary" className="w-full py-2.5 rounded-sm text-xs font-bold uppercase border-white/10 hover:bg-white/5 bg-transparent" onClick={onSuccess} Icon={WalletIcon}>
                                Wallet Signature
                            </Button>

                            <div className="mt-6 text-center text-xs font-mono text-gray-500">
                                {mode === 'login' ? (
                                    <>
                                        No ID found?{' '}
                                        <button onClick={() => setMode('signup')} className="text-white hover:underline">
                                            Create Entry
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        ID exists?{' '}
                                        <button onClick={() => setMode('login')} className="text-white hover:underline">
                                            Authenticate
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        {/* Footer Status */}
                         <div className="bg-[#050505] py-2 px-6 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-gray-600 uppercase">
                            <span>Encrypted: AES-256</span>
                            <span>Secure Connection</span>
                        </div>

                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AuthModal;
