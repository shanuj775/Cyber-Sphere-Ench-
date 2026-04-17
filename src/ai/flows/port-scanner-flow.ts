'use server';
/**
 * @fileOverview A Genkit flow for simulating and analyzing network port vulnerabilities.
 */

import { ai } from '@/ai/genkit';
import { hasAiCredentials, simulatePortsLocally } from '@/ai/local-analysis';
import { z } from 'genkit';

const PortScannerInputSchema = z.object({
  target: z.string().describe('The IP address or hostname to simulate a scan on.'),
});
export type PortScannerInput = z.infer<typeof PortScannerInputSchema>;

const PortScannerOutputSchema = z.object({
  openPorts: z.array(z.object({
    port: z.number(),
    service: z.string(),
    risk: z.enum(['Low', 'Medium', 'High', 'Critical']),
    description: z.string()
  })).describe('List of simulated open ports and their risks.'),
  overallRiskScore: z.number().min(0).max(100),
  summary: z.string().describe('Technical summary of the network security posture.'),
});
export type PortScannerOutput = z.infer<typeof PortScannerOutputSchema>;

export async function simulatePortScan(input: PortScannerInput): Promise<PortScannerOutput> {
  return portScannerFlow(input);
}

const portScannerPrompt = ai.definePrompt({
  name: 'portScannerPrompt',
  input: { schema: PortScannerInputSchema },
  output: { schema: PortScannerOutputSchema },
  prompt: `You are a network security auditing tool. Simulate a port scan for the target: {{{target}}}.

Provide a realistic (but simulated) set of open ports that might be found on such a target (e.g., 80, 443, 22, 3306). 
Assess the risk of each open port based on standard security practices.
Generate a technical summary and an overall risk score.

Target: {{{target}}}`,
});

const portScannerFlow = ai.defineFlow(
  {
    name: 'portScannerFlow',
    inputSchema: PortScannerInputSchema,
    outputSchema: PortScannerOutputSchema,
  },
  async (input) => {
    if (!hasAiCredentials()) {
      return simulatePortsLocally(input.target);
    }

    try {
      const { output } = await portScannerPrompt(input);
      return output ?? simulatePortsLocally(input.target);
    } catch (error) {
      console.error('AI port scan simulation failed; using local fallback.', error);
      return simulatePortsLocally(input.target);
    }
  }
);
