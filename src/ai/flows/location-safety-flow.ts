'use server';
/**
 * @fileOverview A Genkit flow for assessing regional cybersecurity risks based on geographical data.
 */

import { ai } from '@/ai/genkit';
import { analyzeLocationLocally, hasAiCredentials } from '@/ai/local-analysis';
import { z } from 'genkit';

const LocationSafetyInputSchema = z.object({
  location: z.string().describe('The city, state, or country to analyze.'),
});
export type LocationSafetyInput = z.infer<typeof LocationSafetyInputSchema>;

const LocationSafetyOutputSchema = z.object({
  safetyLevel: z.enum(['Safe', 'Moderate', 'High Risk', 'Critical']),
  topThreats: z.array(z.string()),
  regionalStats: z.object({
    phishingRate: z.string(),
    networkAttacks: z.string(),
    dataBreaches: z.string(),
  }),
  advice: z.string().describe('Actionable advice for users in this region.'),
});
export type LocationSafetyOutput = z.infer<typeof LocationSafetyOutputSchema>;

export async function analyzeLocationSafety(input: LocationSafetyInput): Promise<LocationSafetyOutput> {
  return locationSafetyFlow(input);
}

const locationPrompt = ai.definePrompt({
  name: 'locationPrompt',
  input: { schema: LocationSafetyInputSchema },
  output: { schema: LocationSafetyOutputSchema },
  prompt: `You are a global cyber-intelligence agent. Provide a regional threat landscape report for the specified location.

Location: {{{location}}}

Identify common cyber threats, regional statistics (simulated based on general trends), and provide security advice tailored to this area.`,
});

const locationSafetyFlow = ai.defineFlow(
  {
    name: 'locationSafetyFlow',
    inputSchema: LocationSafetyInputSchema,
    outputSchema: LocationSafetyOutputSchema,
  },
  async (input) => {
    if (!hasAiCredentials()) {
      return analyzeLocationLocally(input.location);
    }

    try {
      const { output } = await locationPrompt(input);
      return output ?? analyzeLocationLocally(input.location);
    } catch (error) {
      console.error('AI location safety analysis failed; using local fallback.', error);
      return analyzeLocationLocally(input.location);
    }
  }
);
