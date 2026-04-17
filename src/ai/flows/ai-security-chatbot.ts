'use server';
/**
 * @fileOverview An AI cybersecurity expert chatbot that answers questions and provides security guidance.
 *
 * - aiSecurityChatbot - A function that handles the AI chatbot interaction.
 * - AISecurityChatbotInput - The input type for the aiSecurityChatbot function.
 * - AISecurityChatbotOutput - The return type for the aiSecurityChatbot function.
 */

import { ai } from '@/ai/genkit';
import { answerChatLocally, hasAiCredentials } from '@/ai/local-analysis';
import { z } from 'genkit';

const AISecurityChatbotInputSchema = z.object({
  question: z.string().describe('The cybersecurity-related question from the user.'),
});
export type AISecurityChatbotInput = z.infer<typeof AISecurityChatbotInputSchema>;

const AISecurityChatbotOutputSchema = z.object({
  answer: z.string().describe('The AI chatbot\'s answer and security guidance.'),
});
export type AISecurityChatbotOutput = z.infer<typeof AISecurityChatbotOutputSchema>;

export async function aiSecurityChatbot(input: AISecurityChatbotInput): Promise<AISecurityChatbotOutput> {
  return aiSecurityChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSecurityChatbotPrompt',
  input: { schema: AISecurityChatbotInputSchema },
  output: { schema: AISecurityChatbotOutputSchema },
  prompt: `You are an AI cybersecurity expert chatbot named Cyber-Sphere. Your goal is to provide instant answers and personalized security guidance on cybersecurity-related questions. Be helpful, informative, and concise.

User's question: {{{question}}}`,
});

const aiSecurityChatbotFlow = ai.defineFlow(
  {
    name: 'aiSecurityChatbotFlow',
    inputSchema: AISecurityChatbotInputSchema,
    outputSchema: AISecurityChatbotOutputSchema,
  },
  async (input) => {
    if (!hasAiCredentials()) {
      return answerChatLocally(input.question);
    }

    try {
      const { output } = await prompt(input);
      return output ?? answerChatLocally(input.question);
    } catch (error) {
      console.error('AI chatbot failed; using local fallback.', error);
      return answerChatLocally(input.question);
    }
  }
);
