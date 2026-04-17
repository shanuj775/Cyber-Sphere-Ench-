'use server';
/**
 * @fileOverview A Genkit flow for scanning and analyzing URLs for security threats.
 */

import { ai } from '@/ai/genkit';
import { analyzeLinkLocally, hasAiCredentials } from '@/ai/local-analysis';
import { z } from 'genkit';

const LinkScannerInputSchema = z.object({
  url: z.string().describe('The URL to scan for potential threats.'),
});
export type LinkScannerInput = z.infer<typeof LinkScannerInputSchema>;

const LinkScannerOutputSchema = z.object({
  isSafe: z.boolean().describe('Whether the link is determined to be safe.'),
  riskScore: z.number().min(0).max(100).describe('A risk score from 0 (safe) to 100 (critical).'),
  threats: z.array(z.string()).describe('List of potential threats identified (e.g., Phishing, Malware).'),
  details: z.string().describe('Detailed analysis of the URL structure and known patterns.'),
  recommendation: z.string().describe('Actionable advice for the user.'),
});
export type LinkScannerOutput = z.infer<typeof LinkScannerOutputSchema>;

export async function scanLink(input: LinkScannerInput): Promise<LinkScannerOutput> {
  return linkScannerFlow(input);
}

const linkScannerPrompt = ai.definePrompt({
  name: 'linkScannerPrompt',
  input: { schema: LinkScannerInputSchema },
  output: { schema: LinkScannerOutputSchema },
  prompt: `You are a web security expert. Analyze the following URL for potential threats like phishing, malware distribution, or deceptive redirects.

URL: {{{url}}}

Evaluate the domain reputation, suspicious URL parameters, and known malicious patterns. Provide a risk score and clear recommendations.`,
});

const linkScannerFlow = ai.defineFlow(
  {
    name: 'linkScannerFlow',
    inputSchema: LinkScannerInputSchema,
    outputSchema: LinkScannerOutputSchema,
  },
  async (input) => {
    if (!hasAiCredentials()) {
      return analyzeLinkLocally(input.url);
    }

    try {
      const { output } = await linkScannerPrompt(input);
      return output ?? analyzeLinkLocally(input.url);
    } catch (error) {
      console.error('AI link scan failed; using local fallback.', error);
      return analyzeLinkLocally(input.url);
    }
  }
);
