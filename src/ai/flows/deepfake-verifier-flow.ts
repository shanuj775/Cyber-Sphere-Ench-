'use server';
/**
 * @fileOverview A Genkit flow for verifying the authenticity of digital media (Deepfake detection).
 */

import { ai } from '@/ai/genkit';
import { analyzeDeepfakeLocally, hasAiCredentials } from '@/ai/local-analysis';
import { z } from 'genkit';

const DeepfakeVerifierInputSchema = z.object({
  photoDataUri: z.string().describe("A photo to analyze, as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type DeepfakeVerifierInput = z.infer<typeof DeepfakeVerifierInputSchema>;

const DeepfakeVerifierOutputSchema = z.object({
  isDeepfake: z.boolean().describe('Whether the image shows signs of AI manipulation.'),
  confidence: z.number().min(0).max(100).describe('Confidence level in the detection result.'),
  anomalies: z.array(z.string()).describe('Specific visual anomalies detected (e.g., inconsistent lighting, unnatural edge blending).'),
  summary: z.string().describe('Technical summary of the analysis findings.'),
});
export type DeepfakeVerifierOutput = z.infer<typeof DeepfakeVerifierOutputSchema>;

export async function verifyDeepfake(input: DeepfakeVerifierInput): Promise<DeepfakeVerifierOutput> {
  return deepfakeVerifierFlow(input);
}

const deepfakePrompt = ai.definePrompt({
  name: 'deepfakePrompt',
  input: { schema: DeepfakeVerifierInputSchema },
  output: { schema: DeepfakeVerifierOutputSchema },
  prompt: `You are a digital forensics expert specializing in AI-generated media detection.
Analyze the provided image for signs of deepfake manipulation, such as GAN artifacts, inconsistent textures, unnatural facial features, lighting mismatches, or metadata anomalies.

Image data URI:
{{media url=photoDataUri}}

If the image cannot be inspected in full, infer manipulation risk from metadata, format, or anomalies. Answer only in the requested JSON schema.`,
});

const deepfakeVerifierFlow = ai.defineFlow(
  {
    name: 'deepfakeVerifierFlow',
    inputSchema: DeepfakeVerifierInputSchema,
    outputSchema: DeepfakeVerifierOutputSchema,
  },
  async (input) => {
    if (!hasAiCredentials()) {
      return analyzeDeepfakeLocally(input.photoDataUri);
    }

    try {
      const { output } = await deepfakePrompt(input);
      return output ?? analyzeDeepfakeLocally(input.photoDataUri);
    } catch (error) {
      console.error('AI deepfake verification failed; using local fallback.', error);
      return analyzeDeepfakeLocally(input.photoDataUri);
    }
  }
);
