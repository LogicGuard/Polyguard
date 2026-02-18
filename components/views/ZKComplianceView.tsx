import React, { useState } from 'react';
import { Input } from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import { ViewLoader } from '../common/Loader';
import { simulateZKProofVerification } from '../../services/geminiService';
import { ZKProofVerificationResult } from '../../types';
import { useWallet } from '../../context/WalletContext';

const ZKComplianceView: React.FC = () => {
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ZKProofVerificationResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { account } = useWallet();

    const handleAnalyze = async () => {
        const addressToAnalyze = address.trim() || account;
        if (!addressToAnalyze) {
            setError('Please enter a wallet address or connect your wallet.');
            return;
        }
        setIsLoading(true);
        setResult(null);
        setError(null);

        const { data, error: apiError } = await simulateZKProofVerification(addressToAnalyze);
        if (data) setResult(data);
        if (apiError) setError(apiError);

        setIsLoading(false);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Zero-Knowledge Compliance</h1>
            <p className="text-brand-text-light mb-6">Simulate a privacy-preserving compliance check using Zero-Knowledge proofs.</p>

            <Card className="p-6 max-w-2xl mb-6">
                <div className="flex gap-2">
                    <Input 
                        placeholder="Enter wallet address or connect wallet"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="font-mono flex-1"
                    />
                    <Button onClick={handleAnalyze} disabled={isLoading}>
                        {isLoading ? 'Verifying...' : 'Verify with ZK Proof'}
                    </Button>
                </div>
            </Card>

            {error && <Card className="p-4 bg-red-500/10 border-red-500/30 text-red-400">{error}</Card>}

            {isLoading && <ViewLoader />}

            {result && (
                <div className="space-y-6">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Verification Report</h2>
                         <div className={`p-4 rounded-lg mb-4 ${result.status === 'Verified' ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
                            <p className="font-bold text-lg">Status: {result.status}</p>
                            <p className="text-sm">{result.summary}</p>
                        </div>
                    </Card>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="font-semibold mb-3">Verified Claims</h3>
                            <ul className="space-y-2">
                                {result.verifiedClaims.map((item, i) => (
                                    <li key={i} className={`text-sm flex justify-between items-center ${item.status === 'Verified' ? 'text-green-300' : 'text-red-300'}`}>
                                        <span className="text-brand-text">{item.claim}</span>
                                        <span className="font-bold">{item.status}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                        <Card className="p-6">
                            <h3 className="font-semibold mb-3">Privacy Preserved</h3>
                             <ul className="list-disc list-inside space-y-1 text-sm text-brand-text-light">
                                {result.privacyPreserved.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ZKComplianceView;