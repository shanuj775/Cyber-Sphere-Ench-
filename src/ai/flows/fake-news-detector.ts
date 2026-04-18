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
  fetchedContent: z.object({
    urlsFound: z.array(z.string()).describe('URLs extracted from the input text.'),
    contentAnalysis: z.array(z.object({
      url: z.string().describe('The URL that was fetched.'),
      contentType: z.enum(['article', 'image', 'pdf', 'video', 'other']).describe('Type of content fetched.'),
      title: z.string().optional().describe('Title or headline of the fetched content.'),
      credibilityScore: z.number().min(0).max(100).describe('Credibility score of the fetched content.'),
      analysis: z.string().describe('Analysis of the fetched content.'),
      suspiciousSignals: z.array(z.string()).describe('Suspicious signals found in fetched content.'),
    })).describe('Analysis of content fetched from URLs.'),
  }).optional().describe('Analysis of linked content and media.'),
});
export type DetectFakeNewsOutput = z.infer<typeof DetectFakeNewsOutputSchema>;

function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex);
  return matches || [];
}

async function analyzeFetchedContent(url: string): Promise<{
  url: string;
  contentType: 'article' | 'image' | 'pdf' | 'video' | 'other';
  title?: string;
  credibilityScore: number;
  analysis: string;
  suspiciousSignals: string[];
}> {
  try {
    // Determine content type from URL
    let contentType: 'article' | 'image' | 'pdf' | 'video' | 'other' = 'other';
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) contentType = 'image';
    else if (url.match(/\.pdf$/i)) contentType = 'pdf';
    else if (url.match(/\.(mp4|avi|mov|wmv)$/i)) contentType = 'video';
    else if (url.includes('youtube.com') || url.includes('youtu.be')) contentType = 'video';
    else contentType = 'article';

    const suspiciousSignals: string[] = [];
    let credibilityScore = 50;
    let analysis = '';
    let title: string | undefined;

    // Basic URL pattern analysis
    if (url.includes('bit.ly') || url.includes('tinyurl') || url.includes('goo.gl')) {
      suspiciousSignals.push('Shortened URL detected');
      credibilityScore -= 20;
    }

    if (url.includes('facebook.com') || url.includes('twitter.com') || url.includes('instagram.com')) {
      suspiciousSignals.push('Social media link - verify source credibility');
      credibilityScore -= 10;
    }

    // Try to fetch content for articles (simplified version)
    if (contentType === 'article') {
      try {
        // For now, we'll use basic URL analysis. In a full implementation, you'd integrate with a web scraping service
        analysis = 'URL pattern analysis completed. Content fetching requires additional setup.';

        // Check for reputable sources
        const reputableDomains = ['bbc.com', 'reuters.com', 'apnews.com', 'nytimes.com', 'washingtonpost.com', 'theguardian.com'];
        const urlDomain = new URL(url).hostname.toLowerCase();
        if (reputableDomains.some(domain => urlDomain.includes(domain))) {
          credibilityScore += 20;
          analysis += ' URL from reputable news source detected.';
        }

        // Check for suspicious domains
        const suspiciousDomains = ['newsbreak.com', 'thegatewaypundit.com', 'breitbart.com', 'infowars.com'];
        if (suspiciousDomains.some(domain => urlDomain.includes(domain))) {
          suspiciousSignals.push('URL from source with history of misinformation');
          credibilityScore -= 25;
        }

      } catch (urlError) {
        analysis = 'Error parsing URL. Basic pattern analysis only.';
        suspiciousSignals.push('URL parsing error');
        credibilityScore -= 5;
      }
    } else if (contentType === 'image') {
      analysis = 'Image content detected. Manual verification recommended for manipulated images.';
      suspiciousSignals.push('Image content - potential for manipulation');
      credibilityScore -= 5;
    } else if (contentType === 'pdf') {
      analysis = 'PDF document detected. Document authenticity should be verified.';
      suspiciousSignals.push('PDF content - verify document source and authenticity');
      credibilityScore -= 5;
    } else if (contentType === 'video') {
      analysis = 'Video content detected. Video source and context should be verified.';
      suspiciousSignals.push('Video content - verify source and context');
      credibilityScore -= 5;
    }

    return {
      url,
      contentType,
      title,
      credibilityScore: Math.max(0, Math.min(100, credibilityScore)),
      analysis,
      suspiciousSignals,
    };
  } catch (error) {
    return {
      url,
      contentType: 'other',
      credibilityScore: 30,
      analysis: `Failed to analyze content: ${error}`,
      suspiciousSignals: ['Content analysis failed'],
    };
  }
}

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
    // Extract URLs from the input text
    const urlsFound = extractUrls(input.article);

    // Analyze fetched content if URLs are found
    let fetchedContent;
    if (urlsFound.length > 0) {
      const contentAnalysis = await Promise.all(
        urlsFound.slice(0, 3).map(url => analyzeFetchedContent(url)) // Limit to 3 URLs to avoid overload
      );
      fetchedContent = {
        urlsFound,
        contentAnalysis,
      };
    }

    if (!hasAiCredentials()) {
      const localResult = analyzeNewsLocally(input.article);
      return {
        ...localResult,
        fetchedContent,
      };
    }

    try {
      const { output } = await detectFakeNewsPrompt(input);
      const result = output ?? analyzeNewsLocally(input.article);

      // Enhance the result with fetched content analysis
      if (fetchedContent) {
        // Adjust confidence based on fetched content analysis
        let confidenceAdjustment = 0;
        const additionalSignals: string[] = [];

        for (const content of fetchedContent.contentAnalysis) {
          if (content.credibilityScore < 40) {
            confidenceAdjustment -= 10;
            additionalSignals.push(...content.suspiciousSignals);
          }
        }

        return {
          ...result,
          confidence: Math.max(0, Math.min(100, result.confidence + confidenceAdjustment)),
          flaggedSignals: [...result.flaggedSignals, ...additionalSignals],
          fetchedContent,
        };
      }

      return {
        ...result,
        fetchedContent,
      };
    } catch (error) {
      console.error('AI fake news detection failed; using local fallback.', error);
      const localResult = analyzeNewsLocally(input.article);
      return {
        ...localResult,
        fetchedContent,
      };
    }
  }
);
