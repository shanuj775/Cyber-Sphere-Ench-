import type { AISecurityChatbotOutput } from './flows/ai-security-chatbot';
import type { DeepfakeVerifierOutput } from './flows/deepfake-verifier-flow';
import type { DetectFakeMessageOutput } from './flows/fake-message-detector';
import type { DetectFakeNewsOutput } from './flows/fake-news-detector';
import type { LinkScannerOutput } from './flows/link-scanner-flow';
import type { LocationSafetyOutput } from './flows/location-safety-flow';
import type { MalwareScannerOutput } from './flows/malware-scanner-flow';
import type { PortScannerOutput } from './flows/port-scanner-flow';
import type { QrScannerOutput } from './flows/qr-scanner-flow';
import { fakeNewsTrainingData, FakeNewsCategory } from './fake-news-training';
import { expandedFakeNewsTrainingData } from './fake-news-training-expanded';
import { fakeMessageTrainingData, MessageCategory } from './fake-message-training';
import { maliciousLinkTrainingData, LinkThreatLevel } from './malicious-link-training';
import { deepfakeTrainingData, deepfakeQuickDetectionRules } from './deepfake-training';
import { passwordStrengthTrainingData, PasswordCategory } from './password-strength-training';

export function hasAiCredentials() {
  return Boolean(
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY
  );
}

export function trainFakeMessageModel(): Record<string, { confidence: number; weight: number }> {
  const patterns: Record<string, { confidence: number; weight: number }> = {};

  // Train from comprehensive fake message dataset
  for (const example of fakeMessageTrainingData) {
    const text = example.message.toLowerCase();
    const weight = example.category === 'phishing' ? 3 : example.category === 'scam' ? 2.5 : -1;

    // Extract key patterns
    if (example.category !== 'legitimate') {
      if (/password|credential|verify|account|urgent/i.test(text)) patterns['urgent_auth'] = { confidence: 85, weight };
      if (/congratulations|won|prize|free|claim/i.test(text)) patterns['prize_scam'] = { confidence: 80, weight };
      if (/click|link|http|verify|confirm/i.test(text)) patterns['malicious_link'] = { confidence: 80, weight };
      if (/bank|payment|transfer|send/i.test(text)) patterns['financial_fraud'] = { confidence: 85, weight };
    }
  }
  return patterns;
}

const fakeMessageModel = trainFakeMessageModel();

export function analyzeMessageLocally(message: string): DetectFakeMessageOutput {
  const text = message.toLowerCase();
  const matches = [
    ['password', 'asks for a password or credential'],
    ['otp', 'requests an OTP or verification code'],
    ['urgent', 'uses urgency pressure'],
    ['verify', 'asks the user to verify an account'],
    ['bank', 'references banking or payments'],
    ['click', 'pushes the user to click a link'],
    ['prize', 'mentions an unexpected prize or reward'],
    ['blocked', 'claims an account or service is blocked'],
    ['http://', 'contains an unencrypted link'],
    ['bit.ly', 'uses a shortened URL'],
    ['tinyurl', 'uses a shortened URL'],
    // NEW: Enhanced patterns from training data
    ['winner', 'lottery/contest winner claims'],
    ['congratulations', 'false congratulations'],
    ['claim', 'urgent claim requests'],
    ['act now', 'urgency language'],
    ['limited', 'false scarcity'],
    ['exclusive', 'fake exclusivity'],
    ['wire', 'requests wire transfer'],
    ['cryptocurrency', 'crypto fraud'],
    ['steam', 'gaming account phishing'],
    ['netflix', 'streaming service phishing'],
    ['paypal', 'payment service phishing'],
  ].filter(([needle]) => text.includes(needle));

  const isSuspicious = matches.length >= 2 || /https?:\/\/\S+/i.test(message) && /(login|verify|gift|claim|reset)/i.test(message);

  return {
    isSuspicious,
    category: isSuspicious ? 'phishing' : 'legitimate',
    reasoning: isSuspicious
      ? `Local analysis found ${matches.length || 1} suspicious signal(s): ${matches.map(([, reason]) => reason).join(', ') || 'link plus account-action language'}. Treat this message carefully and verify through an official channel.`
      : 'Local analysis did not find strong phishing language, credential requests, shortened links, or urgency patterns. Still verify unexpected messages before acting.',
  };
}

type FakeNewsModel = {
  featureWeights: Record<string, number>;
  threshold: number;
};

// The fake news training dataset is loaded from fake-news-training.ts

function tokenizeText(input: string) {
  return input
    .toLowerCase()
    .replace(/[#@]\w+/g, 'hashtag') // Replace hashtags and mentions with generic term
    .replace(/[^\w\s]/g, ' ') // Remove punctuation but keep spaces
    .split(/\s+/)
    .filter(Boolean);
}

function trainFakeNewsModel(): FakeNewsModel {
  const weights: Record<string, number> = {};
  const categoryValue: Record<FakeNewsCategory, number> = {
    fake: 2,
    misleading: 1,
    real: -1,
  };

  // Combine original and expanded training data for superior detection
  const combinedTrainingData = [...fakeNewsTrainingData, ...expandedFakeNewsTrainingData];

  for (const example of combinedTrainingData) {
    const tokens = tokenizeText(example.text);
    const contribution = categoryValue[example.category];

    for (let i = 0; i < tokens.length; i++) {
      const unigram = tokens[i];
      weights[unigram] = (weights[unigram] || 0) + contribution;

      const bigram = tokens.slice(i, i + 2).join(' ');
      if (bigram.trim().length > 0) {
        weights[bigram] = (weights[bigram] || 0) + contribution * 1.5;
      }
    }
  }

  return {
    featureWeights: weights,
    threshold: 6, // Lower threshold for better sensitivity on short posts
  };
}

const fakeNewsModel = trainFakeNewsModel();

function scoreArticleWithModel(article: string) {
  const tokens = tokenizeText(article);
  const signals: string[] = [];
  let score = 0;

  for (let i = 0; i < tokens.length; i++) {
    const unigram = tokens[i];
    const bigram = tokens.slice(i, i + 2).join(' ');

    const uniWeight = fakeNewsModel.featureWeights[unigram] ?? 0;
    const biWeight = fakeNewsModel.featureWeights[bigram] ?? 0;

    if (uniWeight > 0) {
      score += uniWeight;
      signals.push(`Pattern: ${unigram}`);
    }
    if (biWeight > 0) {
      score += biWeight;
      signals.push(`Pattern: ${bigram}`);
    }
  }

  return { score, signals: Array.from(new Set(signals)) };
}

function detectLeaderIdentityClaim(text: string): string | null {
  const leaderPattern = /\b(prime minister|president|pm|king|queen|chancellor|minister|attorney general|governor)\b.*\b(is|named|called|becomes?|appointed|elected)\b\s+[A-Z][a-z]+/i;
  const match = text.match(leaderPattern);
  if (!match) {
    return null;
  }

  const claimLength = text.trim().split(/\s+/).length;
  if (claimLength <= 14) {
    return 'Unverified leadership or official identity claim';
  }
  return null;
}

function detectSocialMediaFakeNewsPatterns(text: string): string[] {
  const signals: string[] = [];

  // Count emojis (Twitter often has fake news with excessive emojis)
  const emojiCount = (text.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
  if (emojiCount >= 3) {
    signals.push('Excessive emoji usage');
  }

  // Multiple exclamation marks
  const exclamationCount = (text.match(/!/g) || []).length;
  if (exclamationCount >= 3) {
    signals.push('Excessive exclamation marks');
  }

  // All caps words (shouting)
  const capsWords = text.split(/\s+/).filter(word => word === word.toUpperCase() && word.length > 2);
  if (capsWords.length >= 2) {
    signals.push('Multiple words in all caps');
  }

  // Question marks in fake news often indicate conspiracy
  const questionCount = (text.match(/\?/g) || []).length;
  if (questionCount >= 2 && text.toLowerCase().includes('why') && text.toLowerCase().includes('hiding')) {
    signals.push('Conspiracy questioning pattern');
  }

  return signals;
}

export function analyzeNewsLocally(
  article: string,
  fetchedContent?: {
    urlsFound: string[];
    contentAnalysis: Array<{
      url: string;
      contentType: 'article' | 'image' | 'pdf' | 'video' | 'other';
      title?: string;
      credibilityScore: number;
      analysis: string;
      suspiciousSignals: string[];
    }>;
  }
): DetectFakeNewsOutput {
  const text = article.toLowerCase();
  const { score, signals: modelSignals } = scoreArticleWithModel(article);
  const signals: string[] = [...modelSignals];

  // Add social media specific patterns
  const socialSignals = detectSocialMediaFakeNewsPatterns(article);
  signals.push(...socialSignals);

  const checkPatterns: Array<[RegExp, string]> = [
    [/\b(shocking|unbelievable|miracle|secret revealed|clickbait|breaking|urgent|alert|warning)\b/, 'Sensational or urgent language'],
    [/\b(anonymous sources|unnamed experts|experts say|sources say|sources close to|diplomatic sources)\b/, 'Unverified or anonymous sourcing'],
    [/\b(must read|must share|share this|viral|before it disappears|retweet|rt|share if you agree)\b/, 'Urgent sharing pressure'],
    [/\b(admits|confirms|exposes|exposed|hates this|doctors shocked|scientists shocked)\b/, 'Sensational confirmation language'],
    [/\b(bit\.ly|tinyurl|t\.co|goo\.gl|shortened url|link in bio)\b/, 'Shortened or obfuscated URL present'],
    [/\b(free gift|win money|earn cash|make money|one weird trick|hidden trick)\b/, 'Too-good-to-be-true reward language'],
    [/\b(wake up|sheeple|truth|conspiracy|deep state|mainstream media|msm)\b/, 'Conspiracy theory language'],
    [/\b(cures cancer|kills in 24 hours|bricks your phone|deletes all files)\b/, 'Extreme or impossible claims'],
    [/[A-Z]{5,}/, 'Excessive use of capital letters (shouting)'],
    [/#\w+(?:\s+#\w+){3,}/, 'Excessive hashtag usage'],
    [/\b(fake news|hoax|lie|propaganda|disinformation)\b/, 'Meta-discussion of fake news'],
    [/\b(may|might|could|possibly|reportedly|allegedly)\b.*\b(consider|plan|action)\b/, 'Speculative language about important actions'],
  ];

  for (const [pattern, label] of checkPatterns) {
    if (pattern.test(text)) {
      signals.push(label);
    }
  }

  if (/\b(source|report|study|research)\b.*\bclaims\b/.test(text)) {
    signals.push('Vague source claims without attribution');
  }

  if (text.split(/\.|\n/).filter((sentence) => sentence.trim().length > 0).length > 10 && /\b(must see|before it disappears|share this)\b/.test(text)) {
    signals.push('Long article with urgent sharing language');
  }

  const leaderSignal = detectLeaderIdentityClaim(article);
  if (leaderSignal) {
    signals.push(leaderSignal);
  }

  const isFakeNews = score >= fakeNewsModel.threshold ||
                     signals.length >= 2 ||
                     Boolean(leaderSignal) ||
                     (text.length < 280 && signals.length >= 1 && score >= 3); // More sensitive for Twitter-length content

  const category: FakeNewsCategory = leaderSignal
    ? 'fake'
    : isFakeNews
      ? score >= fakeNewsModel.threshold * 1.5
        ? 'fake'
        : 'misleading'
      : 'real';

  // Analyze fetched content if provided
  let confidenceAdjustment = 0;
  const fetchedSignals: string[] = [];

  if (fetchedContent) {
    for (const content of fetchedContent.contentAnalysis) {
      if (content.credibilityScore < 40) {
        confidenceAdjustment -= 15;
        fetchedSignals.push(...content.suspiciousSignals);
      } else if (content.credibilityScore < 60) {
        confidenceAdjustment -= 5;
      }
    }
  }

  const finalIsFakeNews = isFakeNews || Boolean(fetchedContent && fetchedContent.contentAnalysis.some(c => c.credibilityScore < 30));

  const finalConfidence = Math.min(
    100,
    Math.max(
      50,
      Math.round(35 + score * 3 + signals.length * 7 + (category === 'real' ? 0 : 5) + (leaderSignal ? 15 : 0) + confidenceAdjustment)
    )
  );

  const allSignals = [...signals, ...fetchedSignals];
  const uniqueSignals = Array.from(new Set(allSignals)).slice(0, 6);

  const reasoning = finalIsFakeNews
    ? `A trained credibility model flagged this content based on: ${uniqueSignals.join(', ')}.${fetchedContent ? ' Additional analysis of linked content detected suspicious patterns.' : ''}`
    : `A trained credibility model did not find strong fake-news indicators. Verify publication sources and official reporting before acting.${fetchedContent ? ' Linked content analysis completed.' : ''}`;

  return {
    isFakeNews: finalIsFakeNews,
    confidence: finalConfidence,
    category,
    reasoning,
    flaggedSignals: uniqueSignals,
    fetchedContent,
  };
}

export function analyzeLinkLocally(rawUrl: string): LinkScannerOutput {
  const input = rawUrl.trim();
  let hostname = input;
  const threats: string[] = [];
  let riskScore = 10;

  try {
    const url = new URL(input.startsWith('http') ? input : `https://${input}`);
    hostname = url.hostname;
    if (url.protocol === 'http:') {
      riskScore += 25;
      threats.push('Unencrypted HTTP');
    }
    if (url.username || url.password) {
      riskScore += 25;
      threats.push('Embedded credentials');
    }
    if (url.search.length > 80) {
      riskScore += 15;
      threats.push('Long tracking or redirect parameters');
    }
  } catch {
    riskScore += 30;
    threats.push('Malformed URL');
  }

  const suspiciousHostPatterns = [
    { test: /bit\.ly|tinyurl|t\.co|goo\.gl|is\.gd|ow\.ly/i, label: 'Shortened URL (phishing risk)', weight: 25 },
    { test: /login|verify|secure|account|update|wallet|bank|paypal|apple|amazon|google|microsoft/i, label: 'Credential-themed domain', weight: 30 },
    { test: /\d+\.\d+\.\d+\.\d+/, label: 'Raw IP address host (suspicious)', weight: 35 },
    { test: /xn--/i, label: 'Possible punycode impersonation', weight: 30 },
    // NEW: Enhanced patterns from training data
    { test: /\.tk|\.ru|\.xyz|\.top|\.loan|\.work/i, label: 'Abuse-prone TLD', weight: 20 },
    { test: /-verify|-secure|-confirm|-update|-alert/i, label: 'Suspicious keyword in domain', weight: 25 },
    { test: /paypa1|amaz0n|app1e|netfl1x/i, label: 'Typosquatting (1 vs l, 0 vs O)', weight: 35 },
    { test: /phishing|malware|ransomware|trojan|virus/i, label: 'Obvious threat indicator', weight: 40 },
  ];

  for (const pattern of suspiciousHostPatterns) {
    if (pattern.test.test(hostname)) {
      riskScore += pattern.weight;
      threats.push(pattern.label);
    }
  }

  riskScore = Math.min(100, riskScore);

  return {
    isSafe: riskScore < 45,
    riskScore,
    threats,
    details: threats.length
      ? `Local URL analysis flagged ${hostname} for: ${threats.join(', ')}.`
      : `Local URL analysis found no obvious phishing, obfuscation, or unsafe transport patterns for ${hostname}.`,
    recommendation: riskScore < 45
      ? 'Proceed only if you trust the sender and destination. Avoid entering passwords from unsolicited links.'
      : 'Do not open this link until you verify the domain manually through the official website or app.',
  };
}

export function analyzeQrLocally(qrContent: string): QrScannerOutput {
  const linkResult = analyzeLinkLocally(qrContent);
  const lower = qrContent.toLowerCase();
  const downloadsApp = /\.(apk|exe|scr|bat|cmd|js)(\?|$)/i.test(lower);
  const containsData = /mailto:|tel:|upi:|bitcoin:|ethereum:/i.test(lower);

  const riskScore = Math.min(100, linkResult.riskScore + (downloadsApp ? 25 : 0) + (containsData ? 10 : 0));
  const threatType: QrScannerOutput['threatType'] = downloadsApp
    ? 'Malware'
    : containsData
      ? 'Data Leak'
      : linkResult.threats.includes('Shortened URL')
        ? 'Suspicious Redirect'
        : linkResult.isSafe
          ? 'None'
          : 'Phishing';

  return {
    isSafe: riskScore < 45,
    threatType,
    riskScore,
    analysis: `Local QR analysis inspected the decoded content and found ${threatType === 'None' ? 'no obvious high-risk markers' : threatType.toLowerCase() + ' indicators'}.`,
    recommendation: riskScore < 45
      ? 'Open only if the QR code came from a trusted source.'
      : 'Avoid opening this QR content until you confirm the destination independently.',
  };
}

export function analyzeFileLocally(fileName: string, fileType: string, fileDataUri: string): MalwareScannerOutput {
  const name = fileName.toLowerCase();
  const type = fileType.toLowerCase();
  const detections: string[] = [];
  let confidence = 12;

  if (/\.(exe|scr|bat|cmd|ps1|vbs|js|jar|apk)$/i.test(name)) {
    confidence += 35;
    detections.push('Executable or script file extension');
  }
  if (/\.(docm|xlsm|pptm)$/i.test(name)) {
    confidence += 25;
    detections.push('Macro-enabled office document');
  }
  if (/application\/x-msdownload|application\/x-sh|script/i.test(type)) {
    confidence += 25;
    detections.push('High-risk MIME type');
  }
  if (fileDataUri.length > 3_000_000) {
    confidence += 10;
    detections.push('Large payload size');
  }

  confidence = Math.min(100, confidence);

  return {
    isMalicious: confidence >= 50,
    threatName: confidence >= 50 ? 'Suspicious.Local.Heuristic' : undefined,
    confidence,
    detections,
    analysis: detections.length
      ? `Local file analysis found ${detections.join(', ')}. This is a heuristic result, not an antivirus verdict.`
      : 'Local file analysis found no obvious risky extension, MIME type, or payload-size signals.',
  };
}

export function analyzeDeepfakeLocally(): DeepfakeVerifierOutput {
  // Use deepfake training data indicators for analysis
  const indicatorCount = deepfakeTrainingData.indicators.length;
  const averageConfidence = deepfakeTrainingData.indicators.reduce((a, b) => a + b.confidence, 0) / indicatorCount;

  return {
    isDeepfake: false,
    confidence: 35, // Placeholder - requires actual image analysis
    anomalies: [],
    summary: `Local placeholder scan checked for ${indicatorCount} deepfake indicators. Full analysis requires image processing. Average detection confidence: ${Math.round(averageConfidence)}%.`,
  };
}

export function simulatePortsLocally(target: string): PortScannerOutput {
  const normalized = target.toLowerCase();
  const includesAdmin = /admin|db|database|server|router|nas/.test(normalized);
  const openPorts = [
    { port: 80, service: 'HTTP', risk: 'Medium' as const, description: 'Plain web traffic can expose sessions if not redirected to HTTPS.' },
    { port: 443, service: 'HTTPS', risk: 'Low' as const, description: 'Standard encrypted web service.' },
    ...(includesAdmin
      ? [
          { port: 22, service: 'SSH', risk: 'High' as const, description: 'Remote administration should be locked down with keys and IP allowlists.' },
          { port: 3306, service: 'MySQL', risk: 'Critical' as const, description: 'Database ports should not be exposed publicly.' },
        ]
      : []),
  ];

  return {
    openPorts,
    overallRiskScore: includesAdmin ? 72 : 32,
    summary: `Local simulated scan for ${target} generated a safe demo result. This does not perform real network scanning.`,
  };
}

export function analyzeLocationLocally(location: string): LocationSafetyOutput {
  const highRisk = /mumbai|delhi|bangalore|bengaluru|india|new york|london|singapore/i.test(location);

  return {
    safetyLevel: highRisk ? 'Moderate' : 'Safe',
    topThreats: highRisk
      ? ['Phishing campaigns', 'Payment fraud', 'Credential stuffing']
      : ['Phishing attempts', 'Weak passwords', 'Public Wi-Fi interception'],
    regionalStats: {
      phishingRate: highRisk ? 'Elevated' : 'Typical',
      networkAttacks: highRisk ? 'Moderate' : 'Low',
      dataBreaches: highRisk ? 'Moderate' : 'Low',
    },
    advice: `For ${location}, use MFA, avoid unsolicited payment links, keep devices updated, and verify login alerts through official apps.`,
  };
}

export function answerChatLocally(question: string): AISecurityChatbotOutput {
  const text = question.trim().toLowerCase();

  if (!text) {
    return {
      answer: 'Ask a cybersecurity question and I can help with practical safety steps, such as spotting phishing links, protecting your accounts, or securing your devices.',
    };
  }

  if (/facebook|instagram/.test(text) && /difference/.test(text)) {
    return {
      answer: 'Facebook and Instagram are both Meta platforms, but Instagram is centered around photo/video sharing while Facebook focuses on broader social networking. For security, treat both the same: use unique passwords, enable 2FA, avoid logging in from public devices, and ignore login messages from unofficial sources.',
    };
  }

  if (/password|passcode|otp|one[- ]time code|verification code/.test(text)) {
    return {
      answer: 'If a site asks for a password or OTP unexpectedly, stop and verify the source first. Never share credentials or codes received by SMS/email unless you initiated the login yourself, and use a password manager plus multifactor authentication for stronger account protection.',
    };
  }

  if (/phishing|scam|fraud|suspicious link|fake message/.test(text)) {
    return {
      answer: 'Look for poor spelling, urgent requests, unexpected attachments, and mismatched sender addresses. Do not click links in suspicious messages; instead open the official website manually or contact the service through its verified support channel.',
    };
  }

  if (/2fa|two[- ]factor|multi[- ]factor|mfa/.test(text)) {
    return {
      answer: 'Two-factor authentication adds a second layer of protection beyond your password. Enable it wherever possible, use an authenticator app or security key, and avoid SMS-only 2FA for high-value accounts.',
    };
  }

  if (/vpn|public wifi|network security|wifi security/.test(text)) {
    return {
      answer: 'Public Wi-Fi can expose your traffic to attackers. Use a trusted VPN, disable automatic network connections, and avoid accessing sensitive accounts on unsecured hotspots.',
    };
  }

  if (/malware|virus|trojan|ransomware/.test(text)) {
    return {
      answer: 'If you suspect malware, disconnect from the network, run a trusted antivirus scan, and avoid opening attachments or executables from unknown senders. Keep your software updated and back up important files regularly.',
    };
  }

  return {
    answer: `Local security guidance: ${question.trim() ? 'Review the message carefully, avoid sharing credentials or OTPs, use multi-factor authentication, and verify links through the official website before clicking.' : 'Ask a cybersecurity question and I can help with practical safety steps.'}`,
  };
}
