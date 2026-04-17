'use server';
/**
 * @fileOverview A Genkit flow for detecting fake, scam, or phishing messages.
 *
 * - detectFakeMessage - A function that handles the fake message detection process.
 * - DetectFakeMessageInput - The input type for the detectFakeMessage function.
 * - DetectFakeMessageOutput - The return type for the detectFakeMessage function.
 */

import {ai} from '@/ai/genkit';
import {analyzeMessageLocally, hasAiCredentials} from '@/ai/local-analysis';
import {z} from 'genkit';

const DetectFakeMessageInputSchema = z.object({
  message: z.string().describe('The suspicious message text.'),
});
export type DetectFakeMessageInput = z.infer<typeof DetectFakeMessageInputSchema>;

const DetectFakeMessageOutputSchema = z.object({
  isSuspicious: z
    .boolean()
    .describe(
      'True if the message is likely a fake, scam, or phishing attempt; otherwise, false.'
    ),
  reasoning: z
    .string()
    .describe('Explanation of why the message is considered suspicious or not.'),
  category: z
    .enum(['fake', 'scam', 'phishing', 'legitimate'])
    .describe('The category of the message.'),
});
export type DetectFakeMessageOutput = z.infer<typeof DetectFakeMessageOutputSchema>;

export async function detectFakeMessage(
  input: DetectFakeMessageInput
): Promise<DetectFakeMessageOutput> {
  return detectFakeMessageFlow(input);
}

const detectFakeMessagePrompt = ai.definePrompt({
  name: 'detectFakeMessagePrompt',
  input: {schema: DetectFakeMessageInputSchema},
  output: {schema: DetectFakeMessageOutputSchema},
  prompt: `You are a cybersecurity expert specializing in detecting fake messages, scams, and phishing attempts. Your task is to analyze the provided message and determine if it is suspicious.

Analyze the following message:
{{{message}}}

Provide your assessment in JSON format according to the output schema.`, 
});

const detectFakeMessageFlow = ai.defineFlow(
  {
    name: 'detectFakeMessageFlow',
    inputSchema: DetectFakeMessageInputSchema,
    outputSchema: DetectFakeMessageOutputSchema,
  },
  async input => {
    if (!hasAiCredentials()) {
      return analyzeMessageLocally(input.message);
    }

    try {
      const {output} = await detectFakeMessagePrompt(input);
      return output ?? analyzeMessageLocally(input.message);
    } catch (error) {
      console.error('AI fake message detection failed; using local fallback.', error);
      return analyzeMessageLocally(input.message);
    }
  }
);
