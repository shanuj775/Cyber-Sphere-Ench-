/**
 * Malicious Link Scanner Training Dataset
 * Comprehensive database of suspicious URLs from internet & social media
 * Based on phishing, malware, and credential theft patterns
 */

export type LinkThreatLevel = 'safe' | 'suspicious' | 'dangerous' | 'critical';

export type MaliciousLinkExample = {
  url: string;
  threatLevel: LinkThreatLevel;
  threats: string[];
  reason: string;
  source?: string; // Where it was found
};

export const maliciousLinkTrainingData: MaliciousLinkExample[] = [
  // SAFE URLs - for comparison
  { url: 'https://www.google.com', threatLevel: 'safe', threats: [], reason: 'Legitimate major search engine', source: 'General' },
  { url: 'https://www.github.com/username/repo', threatLevel: 'safe', threats: [], reason: 'Legitimate code repository', source: 'GitHub' },
  { url: 'https://www.amazon.com/dp/B0D12345', threatLevel: 'safe', threats: [], reason: 'Legitimate e-commerce product page', source: 'Amazon' },
  { url: 'https://stackoverflow.com/questions/123456', threatLevel: 'safe', threats: [], reason: 'Legitimate developer Q&A site', source: 'StackOverflow' },
  { url: 'https://www.wikipedia.org/wiki/Topic', threatLevel: 'safe', threats: [], reason: 'Legitimate reference encyclopedia', source: 'Wikipedia' },
  { url: 'https://www.reddit.com/r/programming', threatLevel: 'safe', threats: [], reason: 'Legitimate social discussion platform', source: 'Reddit' },

  // SUSPICIOUS URLs - Low risk
  { url: 'http://example.com', threatLevel: 'suspicious', threats: ['Unencrypted HTTP'], reason: 'No HTTPS encryption', source: 'Email' },
  { url: 'https://examp1e.com', threatLevel: 'suspicious', threats: ['Domain typosquatting'], reason: 'Similar to legitimate domain', source: 'Phishing email' },
  { url: 'https://secure-verify-account.tk', threatLevel: 'suspicious', threats: ['Suspicious domain'], reason: 'Generic domain with .tk extension', source: 'Email' },
  { url: 'https://amazon-account-update.ru', threatLevel: 'suspicious', threats: ['Suspicious domain', 'Foreign extension'], reason: 'Impersonating Amazon', source: 'Phishing email' },
  { url: 'https://bit.ly/random-link', threatLevel: 'suspicious', threats: ['Shortened URL'], reason: 'URL obfuscation with shortened link', source: 'Twitter' },
  { url: 'https://goo.gl/verify123', threatLevel: 'suspicious', threats: ['Shortened URL'], reason: 'URL hidden behind shortener', source: 'Email' },
  { url: 'https://tinyurl.com/paypal-secure', threatLevel: 'suspicious', threats: ['Shortened URL'], reason: 'Potential phishing link', source: 'SMS' },

  // DANGEROUS URLs - Medium risk
  { url: 'https://paypal-verify-now.com', threatLevel: 'dangerous', threats: ['Domain impersonation', 'Phishing'], reason: 'Fake PayPal domain', source: 'Email' },
  { url: 'https://apple-account-security.net', threatLevel: 'dangerous', threats: ['Domain impersonation', 'Phishing'], reason: 'Fake Apple domain', source: 'SMS' },
  { url: 'https://verify-amazon-account.xyz', threatLevel: 'dangerous', threats: ['Domain impersonation', 'Phishing'], reason: 'Impersonating Amazon verification', source: 'Email' },
  { url: 'https://microsoft365-password-reset.com', threatLevel: 'dangerous', threats: ['Domain impersonation', 'Phishing'], reason: 'Fake Microsoft domain', source: 'Phishing email' },
  { url: 'https://login-google-accounts.com', threatLevel: 'dangerous', threats: ['Domain impersonation', 'Phishing'], reason: 'Fake Google login page', source: 'Email' },
  { url: 'http://192.168.1.1:8080/admin', threatLevel: 'dangerous', threats: ['Suspicious IP', 'Potential malware'], reason: 'Direct IP address hosting', source: 'Phishing email' },
  { url: 'https://download-free-games.co.uk/installer.exe', threatLevel: 'dangerous', threats: ['Executable file', 'Potential malware'], reason: 'Suspicious executable download', source: 'Torrent site' },
  { url: 'https://free-movie-streaming.ru/player.zip', threatLevel: 'dangerous', threats: ['Archive file', 'Potential malware'], reason: 'Suspicious file download', source: 'Email' },
  { url: 'https://update-windows-security.xyz/setup.exe', threatLevel: 'dangerous', threats: ['Fake update', 'Malware'], reason: 'Fake Windows security update', source: 'Pop-up ad' },
  { url: 'https://crypto-trading-bot.xyz/installer', threatLevel: 'dangerous', threats: ['Scam', 'Potential trojan'], reason: 'Fake trading bot', source: 'Facebook ad' },

  // CRITICAL URLs - High risk
  { url: 'https://secure.paypa1.com/login', threatLevel: 'critical', threats: ['Domain spoofing', 'Phishing', 'Credential theft'], reason: 'Typosquatting PayPal (1 vs l)', source: 'Email' },
  { url: 'https://www-apple-id.com/account', threatLevel: 'critical', threats: ['Domain impersonation', 'Phishing'], reason: 'Impersonating Apple ID login', source: 'Email' },
  { url: 'https://icloud-account-verify.ru/sign-in', threatLevel: 'critical', threats: ['Domain impersonation', 'Russian domain'], reason: 'Fake iCloud login', source: 'Phishing email' },
  { url: 'https://netflix-billing.tk/payment', threatLevel: 'critical', threats: ['Domain impersonation', 'Payment theft'], reason: 'Fake Netflix payment page', source: 'Email' },
  { url: 'https://bank-security-update.xyz/verify', threatLevel: 'critical', threats: ['Banking fraud', 'Credential theft'], reason: 'Fake banking update', source: 'Email' },
  { url: 'https://linkedin-profile-alert.ru/confirm-identity', threatLevel: 'critical', threats: ['Domain impersonation', 'Phishing'], reason: 'Fake LinkedIn verification', source: 'Email' },
  { url: 'https://stripe-payment-verify.com/account', threatLevel: 'critical', threats: ['Domain impersonation', 'Payment theft'], reason: 'Fake Stripe account page', source: 'Email' },
  { url: 'http://admin:password@192.168.1.1', threatLevel: 'critical', threats: ['Embedded credentials', 'Router attack'], reason: 'Exposed credentials in URL', source: 'Scammer forum' },
  { url: 'https://malware-distribution-center.ru/payload.exe', threatLevel: 'critical', threats: ['Malware', 'Trojan', 'Ransomware'], reason: 'Known malware distribution', source: 'Dark web' },
  { url: 'https://ransomware-kit.tk/installer.bin', threatLevel: 'critical', threats: ['Ransomware', 'Critical threat'], reason: 'Ransomware distribution site', source: 'Hacking forum' },

  // PHISHING-SPECIFIC
  { url: 'https://ebay-account-suspended.net', threatLevel: 'dangerous', threats: ['Domain impersonation', 'Phishing'], reason: 'Fake eBay account suspended page', source: 'Email' },
  { url: 'https://dropbox-verify-documents.com', threatLevel: 'dangerous', threats: ['Domain impersonation', 'Phishing'], reason: 'Fake Dropbox document verification', source: 'Email' },
  { url: 'https://twitter-suspicious-login.xyz', threatLevel: 'dangerous', threats: ['Domain impersonation', 'Phishing'], reason: 'Fake Twitter login alert', source: 'Email' },
  { url: 'https://instagram-action-required.com', threatLevel: 'dangerous', threats: ['Domain impersonation', 'Phishing'], reason: 'Fake Instagram action required page', source: 'Instagram DM' },
  { url: 'https://facebook-security-alert.ru', threatLevel: 'dangerous', threats: ['Domain impersonation', 'Phishing'], reason: 'Fake Facebook security alert', source: 'Email' },

  // CREDENTIAL THEFT
  { url: 'https://gmail-password-reset.xyz/account', threatLevel: 'critical', threats: ['Credential theft', 'Email compromise'], reason: 'Fake Gmail password reset', source: 'Email' },
  { url: 'https://yahoo-mail-verify.net/login', threatLevel: 'critical', threats: ['Credential theft'], reason: 'Fake Yahoo mail login', source: 'Email' },
  { url: 'https://outlook-account-security.tk/signin', threatLevel: 'critical', threats: ['Credential theft'], reason: 'Fake Outlook login page', source: 'Email' },

  // MALWARE/RANSOMWARE
  { url: 'https://flash-player-update.exe', threatLevel: 'critical', threats: ['Malware', 'Ransomware'], reason: 'Fake Flash Player update with malware', source: 'Email' },
  { url: 'https://java-security-patch.zip', threatLevel: 'dangerous', threats: ['Malware'], reason: 'Fake Java security patch', source: 'Email' },
  { url: 'https://system-repair-tool.ru/install.exe', threatLevel: 'critical', threats: ['Malware', 'Scareware'], reason: 'Fake system repair tool', source: 'Pop-up' },
  { url: 'https://antivirus-pro-download.xyz', threatLevel: 'dangerous', threats: ['Fake antivirus', 'Scareware'], reason: 'Fake antivirus installer', source: 'Email' },

  // TYPOSQUATTING
  { url: 'https://www.gogle.com', threatLevel: 'suspicious', threats: ['Typosquatting'], reason: 'Typosquatting Google', source: 'Phishing email' },
  { url: 'https://www.facbook.com', threatLevel: 'suspicious', threats: ['Typosquatting'], reason: 'Typosquatting Facebook', source: 'Email' },
  { url: 'https://www.amaz0n.com', threatLevel: 'suspicious', threats: ['Typosquatting', '0 vs O'], reason: 'Typosquatting Amazon', source: 'Email' },
  { url: 'https://www.redd1t.com', threatLevel: 'suspicious', threats: ['Typosquatting'], reason: 'Typosquatting Reddit', source: 'Email' },

  // SUSPICIOUS TLDs/EXTENSIONS
  { url: 'https://bank-security-verify.tk', threatLevel: 'suspicious', threats: ['Suspicious TLD'], reason: '.tk domain (known for abuse)', source: 'Email' },
  { url: 'https://paypal-account.ru', threatLevel: 'dangerous', threats: ['Russian domain', 'Phishing'], reason: '.ru domain impersonating PayPal', source: 'Email' },
  { url: 'https://apple-store.xyz', threatLevel: 'dangerous', threats: ['Suspicious TLD'], reason: '.xyz generic TLD', source: 'Email' },
  { url: 'https://netflix-premium.co.uk', threatLevel: 'suspicious', threats: ['Domain impersonation'], reason: 'Unusual Netflix domain extension', source: 'Email' },

  // SUSPICIOUS PARAMETERS
  { url: 'https://secure.example.com/login?redirect=http://malicious.ru', threatLevel: 'dangerous', threats: ['Open redirect'], reason: 'URL with malicious redirect parameter', source: 'Email' },
  { url: 'https://example.com/page?id=<script>alert(1)</script>', threatLevel: 'dangerous', threats: ['XSS injection'], reason: 'Script injection in URL parameter', source: 'Email' },
  { url: 'https://example.com/page?user=admin&password=123456', threatLevel: 'critical', threats: ['Exposed credentials'], reason: 'Credentials exposed in URL', source: 'Email' },
  { url: 'https://banking-app.com/verify?token=abc123def&userId=12345&account=9876543210', threatLevel: 'dangerous', threats: ['Account data exposure'], reason: 'Account data in URL', source: 'Email' },

  // FAKE SOCIAL MEDIA/APP LINKS
  { url: 'https://whatsapp-desktop-download.xyz', threatLevel: 'dangerous', threats: ['App impersonation'], reason: 'Fake WhatsApp desktop app', source: 'Email' },
  { url: 'https://telegram-app-update.ru', threatLevel: 'dangerous', threats: ['App impersonation'], reason: 'Fake Telegram update', source: 'Telegram' },
  { url: 'https://discord-voice-update.com', threatLevel: 'dangerous', threats: ['App impersonation'], reason: 'Fake Discord update', source: 'Discord' },
];
