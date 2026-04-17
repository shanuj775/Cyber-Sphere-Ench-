'use server';
/**
 * @fileOverview A Genkit flow for evaluating news and article credibility.
 */

import { ai } from '@/ai/genkit';
import { analyzeNewsLocally, hasAiCredentials } from '@/ai/local-analysis';
import { z } from 'genkit';

const DetectFakeNewsInputSchema = z.object({
  article: z.string().describe('The full news article or headline text to analyze.'),
});
export type DetectFakeNewsInput = z.infer<typeof DetectFakeNewsInputSchema>;

const DetectFakeNewsOutputSchema = z.object({
  isFakeNews: z.boolean().describe('True when the article appears to be fake or misleading.'),
  confidence: z.number().min(0).max(100).describe('Confidence score in the fake news assessment.'),
  category: z.enum(['fake', 'misleading', 'real']).describe('The credibility category assigned to the article.'),
  reasoning: z.string().describe('Explanation of why the article was flagged or cleared.'),
  flaggedSignals: z.array(z.string()).describe('Specific suspicious signals detected in the article.'),
});
export type DetectFakeNewsOutput = z.infer<typeof DetectFakeNewsOutputSchema>;

export async function detectFakeNews(
  input: DetectFakeNewsInput
): Promise<DetectFakeNewsOutput> {
  return detectFakeNewsFlow(input);
}

const detectFakeNewsPrompt = ai.definePrompt({
  name: 'detectFakeNewsPrompt',
  input: { schema: DetectFakeNewsInputSchema },
  output: { schema: DetectFakeNewsOutputSchema },
  prompt: `You are a fact-checking analyst focusing on media credibility.
Read the full article text and decide whether it is likely fake news, misleading content, or a real news report.

Article:
{{{article}}}

Respond in JSON format exactly matching the output schema.`,
});

const detectFakeNewsFlow = ai.defineFlow(
  {
    name: 'detectFakeNewsFlow',
    inputSchema: DetectFakeNewsInputSchema,
    outputSchema: DetectFakeNewsOutputSchema,
  },
  async input => {
    if (!hasAiCredentials()) {
      return analyzeNewsLocally(input.article);
    }

    try {
      const { output } = await detectFakeNewsPrompt(input);
      return output ?? analyzeNewsLocally(input.article);
    } catch (error) {
      console.error('AI fake news detection failed; using local fallback.', error);
      return analyzeNewsLocally(input.article);
    }
  }
);
