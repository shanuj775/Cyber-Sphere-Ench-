/**
 * Fake Message Detection Training Dataset
 * Social Media & Internet-based phishing, scam, and malicious message patterns
 * Data from Twitter, Instagram, Facebook, WhatsApp, Telegram, Discord, etc.
 */

export type MessageCategory = 'phishing' | 'scam' | 'fake' | 'legitimate';

export type FakeMessageExample = {
  message: string;
  category: MessageCategory;
  source?: string; // Social media source
};

export const fakeMessageTrainingData: FakeMessageExample[] = [
  // PHISHING - Banking/Account verification
  { message: 'Your PayPal account needs verification. Click here immediately: https://bit.ly/paypal-verify', category: 'phishing', source: 'Twitter DM' },
  { message: 'Apple Security Alert: Unusual activity detected. Verify your account: http://apple-secure.com/verify', category: 'phishing', source: 'Email' },
  { message: 'Your Amazon account will be suspended. Confirm payment info: https://amazon-security.tk', category: 'phishing', source: 'Facebook' },
  { message: 'Google Account Login Alert. Confirm your password here: tinyurl.com/google-confirm', category: 'phishing', source: 'Email' },
  { message: 'Bank of America - Unusual transaction detected. Verify now: https://bofa-verify.xyz', category: 'phishing', source: 'SMS' },
  { message: 'Your Steam account has been compromised. Reset password: https://goo.gl/steam-reset', category: 'phishing', source: 'Discord' },
  { message: 'URGENT: Instagram account locked. Verify identity immediately: https://instagram-confirm.ru', category: 'phishing', source: 'Instagram DM' },
  { message: 'Netflix - Your subscription payment failed. Update payment: https://netflix-billing.xyz', category: 'phishing', source: 'Email' },
  { message: 'LinkedIn Security: Unauthorized access attempt. Verify: https://linkedin-secure.ru', category: 'phishing', source: 'LinkedIn' },
  { message: 'Your Uber account was used in a location you dont recognize. Confirm: https://uber-verify.tk', category: 'phishing', source: 'WhatsApp' },

  // SCAMS - Money/Prize winning
  { message: 'CONGRATULATIONS! You won $5000 in the Google Play Lottery! Click to claim: https://bit.ly/claim-prize', category: 'scam', source: 'Facebook' },
  { message: 'Free Amazon gift card $500! INSTANT DELIVERY: https://amazon-gift-free.tk | SHARE NOW!', category: 'scam', source: 'Twitter' },
  { message: 'DONT MISS OUT: Get $2000 FREE from Apple. LIMITED TIME: https://apple-free-money.ru', category: 'scam', source: 'Instagram' },
  { message: 'Bitcoin price going DOWN now! Make 5x profit trading with us! Join 50k+ members https://crypto-profit.xyz', category: 'scam', source: 'Telegram' },
  { message: 'Earn $500/day from home! NO EXPERIENCE NEEDED! Work from your phone: https://money-from-home.tk', category: 'scam', source: 'Facebook' },
  { message: 'TESLA STOCK: Insider information! Price will 10x this month! Limited slots: https://stock-secret.xyz', category: 'scam', source: 'Twitter' },
  { message: 'You matched! Click to see who just liked you: https://dating-premium.tk | Your secret admirer is waiting', category: 'scam', source: 'Instagram DM' },
  { message: 'EMERGENCY: You have unclaimed IRS tax refund of $8,456! Claim now: https://irs-refund.tk', category: 'scam', source: 'Email' },
  { message: 'Inheritance Alert! A relative left you $2.5 Million! Claim details: https://inheritance-claim.ru', category: 'scam', source: 'WhatsApp' },
  { message: 'Your friend sent you $100 on PayPal! Click to accept: goo.gl/paypal-accept', category: 'scam', source: 'SMS' },

  // ROMANCE/INVESTMENT SCAMS - Twitter/Instagram
  { message: 'Hey beautiful 😍 I noticed your profile. Im a successful trader making $10k/day. Interested in learning? https://crypto-trading.xyz', category: 'scam', source: 'Instagram DM' },
  { message: 'Hi love, Ive been admiring you. Im an investment banker. Lets connect on WhatsApp: +1-999-555-1234', category: 'scam', source: 'Facebook' },
  { message: 'Your profile caught my eye 💕 Im working abroad making huge money. Want to be my partner? Click: https://wealth-program.tk', category: 'scam', source: 'Twitter DM' },
  { message: 'I cant stop thinking about you 🥰 Let me help you make money. Ive made $50k this month https://guaranteed-profit.ru', category: 'scam', source: 'Instagram DM' },

  // MALWARE/FAKE UPDATES - Discord, Telegram
  { message: 'URGENT: Windows 11 Critical Security Update. Download now or your computer WILL BE HACKED: https://windows-update-fix.exe', category: 'phishing', source: 'Email' },
  { message: 'Your iPhone needs urgent iOS update! Security flaw discovered! Update here: https://ios-security-patch.xyz', category: 'phishing', source: 'SMS' },
  { message: 'ALERT: Your Android phone is infected with 7 VIRUSES! Download cleaner now: https://android-virus-cleaner.apk', category: 'phishing', source: 'Facebook' },
  { message: 'Adobe Flash Player MUST UPDATE IMMEDIATELY! System at risk: https://adobe-flash-security.exe', category: 'phishing', source: 'Email' },

  // FAKE GIVEAWAYS - Social Media
  { message: '🎁 GIVEAWAY TIME! 🎁 We are giving away 100 iPhone 15 Pro Max! FOLLOW + RETWEET + DM to enter! https://giveaway-enter.tk', category: 'scam', source: 'Twitter' },
  { message: '🚗 ELON MUSK GIVEAWAY 🚗 First 50 people to join our Telegram channel win a FREE TESLA! https://telegram-giveaway.xyz', category: 'scam', source: 'Facebook' },
  { message: 'FREE PLAYSTATION 5! Just verify your age with your payment info: https://ps5-giveaway.tk', category: 'scam', source: 'Instagram' },
  { message: 'MEME CONTEST: Share this meme and win $1000 CASH! Tag 10 friends! https://meme-contest.xyz', category: 'scam', source: 'TikTok' },

  // IMPERSONATION - Fake Celebrity/Brand
  { message: 'Hi, this is Elon Musk. I want to give away 100 BTC to my followers. Send 1 BTC first to verify. Address: 1A1z7agoat...', category: 'scam', source: 'Twitter' },
  { message: 'Official Apple Store here 🍎 We are running a special promotion ONLY today. Get 90% off ALL products: https://apple-90off.tk', category: 'scam', source: 'Facebook' },
  { message: 'This is Microsoft Support. We detected malware on your PC. Please call: 1-800-555-XXXX immediately!', category: 'phishing', source: 'Pop-up' },
  { message: 'REAL ELON MUSK: Join my new trading platform and make 500% return guaranteed: https://elon-trading.ru', category: 'scam', source: 'Instagram' },

  // LEGITIMATE MESSAGES - for comparison
  { message: 'Hey, its me John! Can we catch up this weekend?', category: 'legitimate', source: 'WhatsApp' },
  { message: 'Your flight booking confirmation #A1B2C3 for tomorrow at 2:30 PM. Gate will be announced 1 hour before departure.', category: 'legitimate', source: 'Email' },
  { message: 'Team meeting rescheduled to 3 PM today in Conference Room B. See you there!', category: 'legitimate', source: 'Slack' },
  { message: 'Your Amazon order #123-456-789 has been shipped. Tracking: https://amazon.com/track/123456789', category: 'legitimate', source: 'Email' },
  { message: 'Reminder: Your doctors appointment is tomorrow at 10 AM. Call to reschedule: (555) 123-4567', category: 'legitimate', source: 'SMS' },
  { message: 'GitHub: Your repository has been successfully backed up.', category: 'legitimate', source: 'Email' },
  { message: 'Got the assignment completed! Sending you the files now.', category: 'legitimate', source: 'Discord' },
  { message: 'Great work on the project presentation today! Well done!', category: 'legitimate', source: 'Teams' },

  // ADVANCED PHISHING - More subtle
  { message: 'Your AWS account has unusual activity. Please login to verify: https://aws-verify-account.com', category: 'phishing', source: 'Email' },
  { message: 'Confirm your Stripe payment method for charges on 12/15. Verify: https://stripe-confirm.net', category: 'phishing', source: 'Email' },
  { message: 'Microsoft 365 - Your password will expire in 24 hours. Update now: https://office365-pwdchange.net', category: 'phishing', source: 'Email' },

  // ADVANCED SCAMS - More sophisticated
  { message: 'Hi, I work for Amazon corporate recruitment. We saw your profile and would like to offer you a job. Remote position, $80k/year starting. Click for more: https://amazon-jobs-apply.tk', category: 'scam', source: 'LinkedIn' },
  { message: 'Forex trading opportunity! Our algorithm makes 99% accurate predictions. Invest $100, get $10k return in 48 hours GUARANTEED: https://forex-guaranteed.xyz', category: 'scam', source: 'Facebook' },
  { message: 'Your insurance claim has been approved for $12,500. Process payment here to receive funds: https://insurance-claim-process.tk', category: 'scam', source: 'SMS' },

  // SOCIAL ENGINEERING - Community/Friends
  { message: 'Hey its Sarah from work! Can you transfer me $50? Its urgent, my card declined! Send to venmo: sarah.work.88', category: 'scam', source: 'SMS' },
  { message: 'Brother, Im stuck in UK, lost my passport. Need $500 for emergency ticket home. Can you send Western Union? Urgent!!!', category: 'scam', source: 'WhatsApp' },
  { message: 'Its your Mom. I got a new number. I need you to buy Google Play cards ($500 worth) and read the codes back to me for a church donation.', category: 'scam', source: 'SMS' },

  // CREDENTIAL HARVESTING - Fake Forms
  { message: 'To continue using Facebook, please update your security info: https://facebook-update-security.net | Verify account', category: 'phishing', source: 'Email' },
  { message: 'LinkedIn account needs verification. Enter your credentials: https://linkedin-account-verify.xyz', category: 'phishing', source: 'Email' },

  // MALICIOUS DOWNLOADS
  { message: 'Download the new Discord auto-clicker bot! Get nitro for FREE! https://discord-auto-clicker.exe - Working 100%!', category: 'phishing', source: 'Discord' },
  { message: 'Fortnite free skins generator 2024! NO SURVEY! Download: https://fortnite-free-skins.exe', category: 'phishing', source: 'YouTube comments' },
  { message: 'Minecraft 1.20 hacked client with aimbot + wallhack! Download NOW: https://minecraft-hack-client.zip', category: 'phishing', source: 'Reddit' },

  // FAKE EMERGENCY SCAMS
  { message: 'ALERT! Your Apple ID will be permanently deleted in 24 HOURS due to suspicious activity. Confirm here: https://appleid-confirm-emergency.xyz', category: 'phishing', source: 'SMS' },
  { message: 'WARNING! Your Roblox account has been compromised. Click immediately to secure: https://roblox-account-secure.tk', category: 'phishing', source: 'Email' },
  { message: 'URGENT: Your bank has flagged 7 fraudulent transactions. Verify now: https://bank-fraud-verify.ru', category: 'phishing', source: 'SMS' },

  // DROPSHIPPING/MLM SCAMS
  { message: 'Make $5000/month with our dropshipping course! 1000+ success stories! Limited slots: https://dropshipping-course-apply.tk', category: 'scam', source: 'Facebook' },
  { message: 'Join our exclusive MLM business! Build your network and earn UNLIMITED income! https://mlm-business-join.xyz', category: 'scam', source: 'Instagram' },

  // DATA BREACH SCAM
  { message: 'Your personal data was found in the massive Facebook leak (500M+ users affected). Check if your info was compromised: https://facebook-data-breach-check.ru', category: 'scam', source: 'Email' },
  { message: 'Your password was exposed in the LinkedIn hack. Change it ASAP: https://linkedin-password-reset-urgent.xyz', category: 'phishing', source: 'Email' },
];
