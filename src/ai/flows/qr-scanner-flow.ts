'use server';
/**
 * @fileOverview A Genkit flow for scanning and analyzing QR code content for security risks (Qishing protection).
 */

import { ai } from '@/ai/genkit';
import { analyzeQrLocally, hasAiCredentials } from '@/ai/local-analysis';
import { z } from 'genkit';

const QrScannerInputSchema = z.object({
  qrContent: z.string().describe('The content extracted from the QR code (usually a URL).'),
});
export type QrScannerInput = z.infer<typeof QrScannerInputSchema>;

const QrScannerOutputSchema = z.object({
  isSafe: z.boolean(),
  threatType: z.enum(['None', 'Phishing', 'Malware', 'Suspicious Redirect', 'Data Leak']),
  riskScore: z.number().min(0).max(100),
  analysis: z.string(),
  recommendation: z.string(),
});
export type QrScannerOutput = z.infer<typeof QrScannerOutputSchema>;

export async function scanQrCode(input: QrScannerInput): Promise<QrScannerOutput> {
  return qrScannerFlow(input);
}

const qrPrompt = ai.definePrompt({
  name: 'qrPrompt',
  input: { schema: QrScannerInputSchema },
  output: { schema: QrScannerOutputSchema },
  prompt: `You are a Qishing (QR Phishing) prevention specialist. 
Analyze the following content extracted from a QR code:

Content: {{{qrContent}}}

Evaluate if this leads to a phishing site, a direct file download, or a malicious app store page. 
Provide a safety determination, risk score, and technical analysis.`,
});

const qrScannerFlow = ai.defineFlow(
  {
    name: 'qrScannerFlow',
    inputSchema: QrScannerInputSchema,
    outputSchema: QrScannerOutputSchema,
  },
  async (input) => {
    if (!hasAiCredentials()) {
      return analyzeQrLocally(input.qrContent);
    }

    try {
      const { output } = await qrPrompt(input);
      return output ?? analyzeQrLocally(input.qrContent);
    } catch (error) {
      console.error('AI QR scan failed; using local fallback.', error);
      return analyzeQrLocally(input.qrContent);
    }
  }
);
