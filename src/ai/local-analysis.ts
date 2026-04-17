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

export function hasAiCredentials() {
  return Boolean(
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY
  );
}

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
    .replace(/[^a-z0-9\s]/g, ' ')
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

  for (const example of fakeNewsTrainingData) {
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
    threshold: 8,
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

export function analyzeNewsLocally(article: string): DetectFakeNewsOutput {
  const text = article.toLowerCase();
  const { score, signals: modelSignals } = scoreArticleWithModel(article);
  const signals: string[] = [...modelSignals];

  const checkPatterns: Array<[RegExp, string]> = [
    [/\b(shocking|unbelievable|miracle|secret revealed|clickbait)\b/, 'Clickbait or sensational language'],
    [/\b(anonymous sources|unnamed experts|experts say|sources say)\b/, 'Unverified or anonymous sourcing'],
    [/\b(must read|must share|share this|viral|before it disappears)\b/, 'Urgent sharing pressure'],
    [/\b(admits|confirms|exposes|exposed|hates this)\b/, 'Sensational confirmation language'],
    [/\b(bit\.ly|tinyurl|t\.co|goo\.gl)\b/, 'Shortened or obfuscated URL present'],
    [/\b(free gift|win money|earn cash|make money)\b/, 'Too-good-to-be-true reward language'],
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

  const isFakeNews = score >= fakeNewsModel.threshold || signals.length >= 2 || Boolean(leaderSignal);
  const category: FakeNewsCategory = leaderSignal
    ? 'fake'
    : isFakeNews
      ? score >= fakeNewsModel.threshold * 2
        ? 'fake'
        : 'misleading'
      : 'real';

  const confidence = Math.min(
    100,
    Math.max(
      50,
      Math.round(35 + score * 3 + signals.length * 7 + (category === 'real' ? 0 : 5) + (leaderSignal ? 15 : 0))
    )
  );

  const uniqueSignals = Array.from(new Set(signals)).slice(0, 6);
  const reasoning = isFakeNews
    ? `A trained credibility model flagged this content based on: ${uniqueSignals.join(', ')}.`
    : 'A trained credibility model did not find strong fake-news indicators. Verify publication sources and official reporting before acting.';

  return {
    isFakeNews,
    confidence,
    category,
    reasoning,
    flaggedSignals: uniqueSignals,
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
    { test: /bit\.ly|tinyurl|t\.co|goo\.gl/i, label: 'Shortened URL' },
    { test: /login|verify|secure|account|update|wallet|bank/i, label: 'Credential-themed domain' },
    { test: /\d+\.\d+\.\d+\.\d+/, label: 'Raw IP address host' },
    { test: /xn--/i, label: 'Possible punycode impersonation' },
  ];

  for (const pattern of suspiciousHostPatterns) {
    if (pattern.test.test(hostname)) {
      riskScore += 20;
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
  return {
    isDeepfake: false,
    confidence: 35,
    anomalies: [],
    summary: 'A local placeholder scan was performed; this is not a definitive forensic verdict.',
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
