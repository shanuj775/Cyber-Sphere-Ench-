import { config } from 'dotenv';
config();

import '@/ai/flows/ai-security-chatbot.ts';
import '@/ai/flows/fake-message-detector.ts';
import '@/ai/flows/fake-news-detector.ts';
import '@/ai/flows/link-scanner-flow.ts';
import '@/ai/flows/deepfake-verifier-flow.ts';
import '@/ai/flows/port-scanner-flow.ts';
import '@/ai/flows/malware-scanner-flow.ts';
import '@/ai/flows/location-safety-flow.ts';
import '@/ai/flows/qr-scanner-flow.ts';
import '@/ai/flows/emergency-alert-flow.ts';

