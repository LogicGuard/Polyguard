
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { 
    WalletReportResult, BridgeSecurityResult, RegulatoryComplianceResult, FirewallAnalysisResult, ThreatMapNode, ChatMessage, PortfolioSnapshot, StakingAnalysisResult, TransactionAnalysisResult, DeFiPortfolioAnalysis, NFTAnalysisResult, SmartContractAuditResult, DAppCertificationResult, GasOptimizationResult, EcosystemHealthResult, PerformanceAnalysisResult, DAOProposalAnalysisResult, GrowthPredictionResult, QuantumAnalysisResult, ZKProofVerificationResult, TokenApproval,
    SecurityAlert,
    OnChainEvent,
    IntelligenceBriefingResult
} from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Advanced Caching System ---
const apiCache = new Map<string, { timestamp: number, data: any }>();
const pendingRequests = new Map<string, Promise<any>>();

function getFromCache<T>(key: string, ttlMs: number): T | null {
    const entry = apiCache.get(key);
    if (entry && (Date.now() - entry.timestamp < ttlMs)) {
        return entry.data as T;
    }
    
    try {
        const stored = sessionStorage.getItem(`pg_cache_${key}`);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Date.now() - parsed.timestamp < ttlMs) {
                return parsed.data as T;
            }
        }
    } catch (e) {}
    
    return null;
}

function setCache(key: string, data: any) {
    const entry = { timestamp: Date.now(), data };
    apiCache.set(key, entry);
    try {
        sessionStorage.setItem(`pg_cache_${key}`, JSON.stringify(entry));
    } catch (e) {}
}

const TTL = {
    SHORT: 10 * 60 * 1000,
    MEDIUM: 30 * 60 * 1000,
    LONG: 120 * 60 * 1000
};

// --- Request Orchestration & Cooldown Notification ---
let isGlobalCoolingDown = false;
let cooldownTimer: any = null;

// Event target for UI to listen to system status changes
export const systemStatusEvents = new EventTarget();

const setCoolingDown = (value: boolean) => {
    isGlobalCoolingDown = value;
    systemStatusEvents.dispatchEvent(new CustomEvent('statusChange', { detail: { isCoolingDown: value } }));
};

export const getSystemStatus = () => ({ isCoolingDown: isGlobalCoolingDown });

class RequestQueue {
    private queue: Array<() => Promise<any>> = [];
    private processing = false;

    async add<T>(fn: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const result = await fn();
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            });
            this.process();
        });
    }

    private async process() {
        if (this.processing || this.queue.length === 0) return;
        this.processing = true;

        while (this.queue.length > 0) {
            const task = this.queue.shift();
            if (task) {
                await task();
                // Add a mandatory delay between ANY non-streaming requests to avoid burst 429s.
                // 4100ms respects the ~15 RPM limit of Gemini Pro.
                await new Promise(res => setTimeout(res, 4100)); 
            }
        }
        this.processing = false;
    }
}

const globalQueue = new RequestQueue();

const handleGeminiError = (error: any): { data: null; error: string } => {
    console.error("Gemini API Error Detail:", error);
    let errorMessage = "An unexpected error occurred.";

    const errorStr = JSON.stringify(error).toLowerCase();
    const isRateLimit = errorStr.includes('429') || errorStr.includes('quota') || errorStr.includes('resource_exhausted') || errorStr.includes('limit');

    if (isRateLimit) {
        errorMessage = "QUOTA_EXHAUSTED: AI limits reached. System entering recovery phase.";
        setCoolingDown(true);
        clearTimeout(cooldownTimer);
        cooldownTimer = setTimeout(() => { setCoolingDown(false); }, 60000);
    } else if (errorStr.includes('500') || errorStr.includes('unavailable')) {
        errorMessage = "UPSTREAM_ERROR: AI service temporarily unavailable.";
    }
    
    return { data: null, error: errorMessage };
}

async function generateContentWithRetry(model: string, contents: any, config?: any): Promise<GenerateContentResponse> {
    if (isGlobalCoolingDown) {
        throw new Error("SYSTEM_CONGESTION: Cooling down to respect API limits.");
    }

    return globalQueue.add(async () => {
        const maxRetries = 2; 
        let attempt = 0;
        
        while (attempt < maxRetries) {
            try {
                return await ai.models.generateContent({ model, contents, config });
            } catch (error: any) {
                attempt++;
                const errorStr = JSON.stringify(error).toLowerCase();
                const is429 = errorStr.includes('429') || errorStr.includes('quota') || errorStr.includes('resource_exhausted') || errorStr.includes('limit');
                
                if (is429) {
                    setCoolingDown(true);
                    clearTimeout(cooldownTimer);
                    cooldownTimer = setTimeout(() => { setCoolingDown(false); }, 60000);
                }

                if (attempt < maxRetries && (is429 || errorStr.includes('500'))) {
                    const delay = Math.pow(attempt + 1, 2) * 3000; 
                    await new Promise(res => setTimeout(res, delay));
                } else {
                    throw error;
                }
            }
        }
        throw new Error("EXHAUSTED_RETRIES");
    });
}

export async function analyzeWithGemini(prompt: string): Promise<{ data: string | null; error: string | null }> {
    const cacheKey = `text_${btoa(prompt).substring(0, 32)}`;
    
    if (pendingRequests.has(cacheKey)) {
        try {
            const data = await pendingRequests.get(cacheKey);
            return { data, error: null };
        } catch (e) {
            return handleGeminiError(e);
        }
    }

    try {
        const cached = getFromCache<string>(cacheKey, TTL.MEDIUM);
        if (cached) return { data: cached, error: null };

        const requestPromise = (async () => {
            const model = 'gemini-3-pro-preview';
            const response = await generateContentWithRetry(model, prompt);
            const text = response.text || "";
            if (text) setCache(cacheKey, text);
            return text;
        })();

        pendingRequests.set(cacheKey, requestPromise);
        const data = await requestPromise;
        return { data, error: null };
    } catch (error) {
        return handleGeminiError(error);
    } finally {
        pendingRequests.delete(cacheKey);
    }
}

async function analyzeWithStructuredSchema<T>(prompt: string, schema: any, cacheKey?: string, ttl: number = TTL.SHORT): Promise<{ data: T | null; error: string | null }> {
    const internalCacheKey = cacheKey || `struct_${btoa(prompt).substring(0, 32)}`;

    if (pendingRequests.has(internalCacheKey)) {
        try {
            const data = await pendingRequests.get(internalCacheKey);
            return { data, error: null };
        } catch (e) {
            return handleGeminiError(e);
        }
    }

    try {
        const cached = getFromCache<T>(internalCacheKey, ttl);
        if (cached) return { data: cached, error: null };

        const requestPromise = (async () => {
            const model = 'gemini-3-pro-preview';
            const response = await generateContentWithRetry(model, prompt, {
                responseMimeType: "application/json",
                responseSchema: schema,
            });
            
            const jsonText = response.text?.trim() || "";
            if (!jsonText) throw new Error("EMPTY_RESPONSE");
            
            const data = JSON.parse(jsonText) as T;
            if (cacheKey) setCache(cacheKey, data);
            return data;
        })();

        pendingRequests.set(internalCacheKey, requestPromise);
        const data = await requestPromise;
        return { data, error: null };
    } catch (error) {
        return handleGeminiError(error);
    } finally {
        pendingRequests.delete(internalCacheKey);
    }
}

// Live API Session helper
export const connectToLiveAssistant = (callbacks: any) => {
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: 'You are PolyGuard Specialist, a highly technical crypto security AI. You assist users with real-time analysis of Polygon network threats, wallet security, and smart contract audits. Be concise, technical, and alert.',
      inputAudioTranscription: {},
      outputAudioTranscription: {},
    },
  });
};

export async function getTokenApprovals(address: string): Promise<{ data: TokenApproval[] | null; error: string | null }> {
    const prompt = `Identify active token approvals for Polygon wallet: ${address}. JSON list.`;
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                tokenName: { type: Type.STRING },
                tokenSymbol: { type: Type.STRING },
                tokenAddress: { type: Type.STRING },
                spenderName: { type: Type.STRING },
                spenderAddress: { type: Type.STRING },
                allowance: { type: Type.STRING },
            },
            required: ['tokenName', 'tokenSymbol', 'tokenAddress', 'spenderName', 'spenderAddress', 'allowance']
        }
    };
    return analyzeWithStructuredSchema<TokenApproval[]>(prompt, schema, `approvals_${address}`, TTL.SHORT);
}

export async function getPortfolioSnapshot(address: string): Promise<{ data: PortfolioSnapshot | null; error: string | null }> {
    const prompt = `Security score (0-100) and risk level for ${address} on Polygon.`;
    const schema = {
        type: Type.OBJECT,
        properties: { securityScore: { type: Type.NUMBER }, riskLevel: { type: Type.STRING } },
        required: ['securityScore', 'riskLevel']
    };
    return analyzeWithStructuredSchema<PortfolioSnapshot>(prompt, schema, `snapshot_${address}`, TTL.MEDIUM);
}

export async function getIntelligenceBriefing(): Promise<{ data: GenerateContentResponse | null; error: string | null }> {
    try {
        const response = await generateContentWithRetry(
            "gemini-3-pro-preview",
            "Provide a high-level technical intelligence briefing for the Polygon network. Include recent security threats and DeFi sentiment from the last 24 hours.",
            {
                tools: [{ googleSearch: {} }],
            }
        );
        return { data: response, error: null };
    } catch (error) {
        return handleGeminiError(error) as any;
    }
}

export async function getSecurityAlerts(): Promise<{ data: SecurityAlert[] | null; error: string | null }> {
    const prompt = `2 new security alerts for Polygon.`;
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING },
                timestamp: { type: Type.STRING },
                severity: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
            },
            required: ['id', 'timestamp', 'severity', 'title', 'description']
        }
    };
    return analyzeWithStructuredSchema<SecurityAlert[]>(prompt, schema, 'security_alerts', TTL.MEDIUM);
}

export async function getOnChainEvents(): Promise<{ data: OnChainEvent[] | null; error: string | null }> {
    const prompt = `2 recent on-chain events for Polygon.`;
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING },
                timestamp: { type: Type.STRING },
                type: { type: Type.STRING },
                details: { type: Type.STRING },
                address: { type: Type.STRING }
            },
            required: ['id', 'timestamp', 'type', 'details', 'address']
        }
    };
    return analyzeWithStructuredSchema<OnChainEvent[]>(prompt, schema, 'onchain_events', TTL.MEDIUM);
}

export async function analyzeWalletReport(address: string): Promise<{ data: WalletReportResult | null; error: string | null }> {
    const prompt = `Analyze wallet ${address} on Polygon.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            riskLevel: { type: Type.STRING },
            securityScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            positivePoints: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: {type: Type.STRING}, detail: {type: Type.STRING}}, required: ['title', 'detail'] } },
            risks: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: {type: Type.STRING}, detail: {type: Type.STRING}, severity: { type: Type.STRING }}, required: ['title', 'detail', 'severity'] } },
        },
        required: ['riskLevel', 'securityScore', 'summary', 'positivePoints', 'risks']
    };
    return analyzeWithStructuredSchema<WalletReportResult>(prompt, schema, `wallet_report_${address}`, TTL.MEDIUM);
}

export async function analyzeBridgeSecurity(address: string): Promise<{ data: BridgeSecurityResult | null; error: string | null }> {
    const prompt = `Analyze bridge security at ${address}.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            securityScore: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, rating: { type: Type.STRING }, summary: { type: Type.STRING } }, required: ['score', 'rating', 'summary'] },
            withdrawalSafety: { type: Type.OBJECT, properties: { risk: { type: Type.STRING }, summary: { type: Type.STRING } }, required: ['risk', 'summary'] },
            liquidityRisk: { type: Type.OBJECT, properties: { risk: { type: Type.STRING }, summary: { type: Type.STRING } }, required: ['risk', 'summary'] }
        },
        required: ['securityScore', 'withdrawalSafety', 'liquidityRisk']
    };
    return analyzeWithStructuredSchema<BridgeSecurityResult>(prompt, schema);
}

export async function analyzeRegulatoryCompliance(identifier: string): Promise<{ data: RegulatoryComplianceResult | null; error: string | null }> {
    const prompt = `Analyze regulatory compliance for ${identifier}.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            amlRisk: { type: Type.OBJECT, properties: { level: { type: Type.STRING }, summary: { type: Type.STRING }, flags: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['level', 'summary', 'flags'] },
            complianceStatus: { type: Type.OBJECT, properties: { status: { type: Type.STRING }, summary: { type: Type.STRING } }, required: ['status', 'summary'] },
            legalRisk: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, summary: { type: Type.STRING } }, required: ['score', 'summary'] }
        },
        required: ['amlRisk', 'complianceStatus', 'legalRisk']
    };
    return analyzeWithStructuredSchema<RegulatoryComplianceResult>(prompt, schema);
}

export async function analyzeTransactionWithFirewall(targetContract: string, txData: string): Promise<{ data: FirewallAnalysisResult | null; error: string | null }> {
    const prompt = `Firewall simulation for target ${targetContract} and data ${txData}.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            status: { type: Type.STRING },
            summary: { type: Type.STRING },
            threatType: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            suggestedActions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['status', 'summary', 'threatType', 'confidence', 'suggestedActions']
    };
    return analyzeWithStructuredSchema<FirewallAnalysisResult>(prompt, schema);
}

export async function analyzeTransaction(txData: string): Promise<{ data: TransactionAnalysisResult | null; error: string | null }> {
    const prompt = `Analyze transaction risk for ${txData}.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            riskLevel: { type: Type.STRING },
            summary: { type: Type.STRING },
            warnings: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, detail: { type: Type.STRING }, severity: { type: Type.STRING } }, required: ['title', 'detail', 'severity'] } },
            transactionFlow: { type: Type.OBJECT, properties: { from: { type: Type.STRING }, to: { type: Type.STRING }, value: { type: Type.STRING }, action: { type: Type.STRING } }, required: ['from', 'to', 'value', 'action'] }
        },
        required: ['riskLevel', 'summary', 'warnings', 'transactionFlow']
    };
    return analyzeWithStructuredSchema<TransactionAnalysisResult>(prompt, schema);
}

export async function analyzeQuantumResistance(address: string): Promise<{ data: QuantumAnalysisResult | null; error: string | null }> {
    const prompt = `Quantum resistance analysis for ${address}.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            readinessStatus: { type: Type.STRING },
            summary: { type: Type.STRING },
            vulnerableComponents: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { component: { type: Type.STRING }, detail: { type: Type.STRING } }, required: ['component', 'detail'] } },
            pqcRecommendations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { algorithm: { type: Type.STRING }, useCase: { type: Type.STRING } }, required: ['algorithm', 'useCase'] } },
            migrationPath: { type: Type.STRING },
        },
        required: ['readinessStatus', 'summary', 'vulnerableComponents', 'pqcRecommendations', 'migrationPath']
    };
    return analyzeWithStructuredSchema<QuantumAnalysisResult>(prompt, schema);
}

export async function simulateZKProofVerification(address: string): Promise<{ data: ZKProofVerificationResult | null; error: string | null }> {
    const prompt = `ZK Proof simulation for ${address}.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            status: { type: Type.STRING },
            summary: { type: Type.STRING },
            verifiedClaims: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { claim: { type: Type.STRING }, status: { type: Type.STRING } }, required: ['claim', 'status'] } },
            privacyPreserved: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['status', 'summary', 'verifiedClaims', 'privacyPreserved']
    };
    return analyzeWithStructuredSchema<ZKProofVerificationResult>(prompt, schema);
}

export async function getNamesForAddresses(addresses: string[]): Promise<{ data: Record<string, { name: string; symbol: string }> | null; error: string | null }> {
    const prompt = `Project names and symbols for: ${addresses.join(', ')}.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            results: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: { address: { type: Type.STRING }, name: { type: Type.STRING }, symbol: { type: Type.STRING } },
                    required: ['address', 'name', 'symbol']
                }
            }
        },
        required: ['results']
    };
    const result = await analyzeWithStructuredSchema<{ results: any[] }>(prompt, schema, `names_${addresses.join('_')}`, TTL.LONG);
    if (result.data) {
        const mapped: Record<string, { name: string; symbol: string }> = {};
        result.data.results.forEach(item => { mapped[item.address] = { name: item.name, symbol: item.symbol }; });
        return { data: mapped, error: null };
    }
    return { data: null, error: result.error };
}
