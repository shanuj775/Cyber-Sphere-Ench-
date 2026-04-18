/**
 * Password Strength Training Dataset
 * Comprehensive database of weak, moderate, and strong passwords
 * Based on real-world data breaches and security best practices
 */

export type PasswordCategory = 'critical' | 'weak' | 'moderate' | 'strong' | 'unbreakable';

export type PasswordExample = {
  password: string;
  category: PasswordCategory;
  reason: string;
  crackTimeSeconds?: number;
};

export const passwordStrengthTrainingData: PasswordExample[] = [
  // CRITICAL - Common passwords, no variation (from Have I Been Pwned database)
  { password: 'password', category: 'critical', reason: 'Most common password', crackTimeSeconds: 0.001 },
  { password: '123456', category: 'critical', reason: 'Sequential numbers only', crackTimeSeconds: 0.001 },
  { password: '12345678', category: 'critical', reason: 'Sequential numbers only', crackTimeSeconds: 0.001 },
  { password: 'qwerty', category: 'critical', reason: 'Keyboard pattern', crackTimeSeconds: 0.01 },
  { password: 'abc123', category: 'critical', reason: 'Letters then numbers', crackTimeSeconds: 0.01 },
  { password: 'admin', category: 'critical', reason: 'Default credential', crackTimeSeconds: 0.001 },
  { password: 'letmein', category: 'critical', reason: 'Dictionary word', crackTimeSeconds: 0.1 },
  { password: 'welcome', category: 'critical', reason: 'Dictionary word', crackTimeSeconds: 0.1 },
  { password: 'monkey', category: 'critical', reason: 'Dictionary word from data breach', crackTimeSeconds: 0.1 },
  { password: 'dragon', category: 'critical', reason: 'Popular word', crackTimeSeconds: 0.5 },
  { password: 'master', category: 'critical', reason: 'Dictionary word', crackTimeSeconds: 0.1 },
  { password: 'sunshine', category: 'critical', reason: 'Dictionary word', crackTimeSeconds: 1 },
  { password: '111111', category: 'critical', reason: 'Repeated digit', crackTimeSeconds: 0.001 },
  { password: 'iloveyou', category: 'critical', reason: 'Personal phrase', crackTimeSeconds: 2 },
  { password: 'trustno1', category: 'critical', reason: 'Common leetspeak', crackTimeSeconds: 5 },

  // WEAK - Dictionary words with minimal variation
  { password: 'Password1', category: 'weak', reason: 'Dictionary word + number', crackTimeSeconds: 10 },
  { password: 'Admin123', category: 'weak', reason: 'Common pattern', crackTimeSeconds: 20 },
  { password: 'Test1234', category: 'weak', reason: 'Simple sequential pattern', crackTimeSeconds: 30 },
  { password: 'Football123', category: 'weak', reason: 'Sport + numbers', crackTimeSeconds: 50 },
  { password: 'Princess1', category: 'weak', reason: 'Common female password', crackTimeSeconds: 60 },
  { password: 'Shadow123', category: 'weak', reason: 'Common word + number', crackTimeSeconds: 40 },
  { password: 'Shadow2024', category: 'weak', reason: 'Word + year', crackTimeSeconds: 50 },
  { password: 'Batman2022', category: 'weak', reason: 'Pop culture + year', crackTimeSeconds: 60 },
  { password: 'Harley2023', category: 'weak', reason: 'Name + year', crackTimeSeconds: 70 },
  { password: 'Michael1', category: 'weak', reason: 'Name + digit', crackTimeSeconds: 80 },
  { password: 'Password123', category: 'weak', reason: 'Most changed password', crackTimeSeconds: 15 },
  { password: 'Qwerty123', category: 'weak', reason: 'Keyboard pattern + number', crackTimeSeconds: 20 },
  { password: 'Abc123def', category: 'weak', reason: 'Predictable mix', crackTimeSeconds: 100 },
  { password: 'Sunshine1', category: 'weak', reason: 'Dictionary word with cap', crackTimeSeconds: 80 },
  { password: 'Trustno1!', category: 'weak', reason: 'Leetspeak with special char', crackTimeSeconds: 200 },

  // MODERATE - Better variation but still vulnerable
  { password: 'MyP@ssw0rd', category: 'moderate', reason: 'Personal word + substitution', crackTimeSeconds: 500 },
  { password: 'Coffee2024!', category: 'moderate', reason: 'Mixed case, numbers, special char', crackTimeSeconds: 1000 },
  { password: 'Blue$Sky99', category: 'moderate', reason: 'Two words, numbers, special char', crackTimeSeconds: 800 },
  { password: 'Spring#Night2023', category: 'moderate', reason: 'Predictable phrase', crackTimeSeconds: 2000 },
  { password: 'H3llo@World', category: 'moderate', reason: 'Leetspeak with special char', crackTimeSeconds: 1500 },
  { password: 'Music*Rock123', category: 'moderate', reason: 'Words + number + special', crackTimeSeconds: 1200 },
  { password: 'Pizza@2024', category: 'moderate', reason: 'Food + year + special', crackTimeSeconds: 1800 },
  { password: 'Thunder#Storm88', category: 'moderate', reason: 'Repeated pattern + special', crackTimeSeconds: 2500 },
  { password: 'Garden%Flower9', category: 'moderate', reason: 'Nature words + special', crackTimeSeconds: 2000 },
  { password: 'Ocean&Wave2025', category: 'moderate', reason: 'Nature themed', crackTimeSeconds: 2200 },
  { password: 'Diamond$Heart', category: 'moderate', reason: 'Poetic but predictable', crackTimeSeconds: 2400 },
  { password: 'Silver!Moon99', category: 'moderate', reason: 'Themed words', crackTimeSeconds: 2100 },
  { password: 'Ruby@Diamond8', category: 'moderate', reason: 'Precious words', crackTimeSeconds: 2300 },
  { password: 'Phoenix#Rising2', category: 'moderate', reason: 'Mythical + numbers', crackTimeSeconds: 2600 },
  { password: 'Aurora$Borealis1', category: 'moderate', reason: 'Nature term', crackTimeSeconds: 3000 },

  // STRONG - Good entropy, harder to crack
  { password: 'R@nd0m#Str1ng2024', category: 'strong', reason: 'Random mix with high entropy', crackTimeSeconds: 100000 },
  { password: 'x7K$mP9@nL#vQ2wF', category: 'strong', reason: 'No dictionary words, good mix', crackTimeSeconds: 500000 },
  { password: 'TechPro$2024#Security', category: 'strong', reason: 'Multiple character types', crackTimeSeconds: 200000 },
  { password: 'MyV@ul7D0g!Cat99', category: 'strong', reason: 'Long, mixed case, numbers, special', crackTimeSeconds: 150000 },
  { password: 'SecureP@ss#Word2K24', category: 'strong', reason: 'Good length, mixed types', crackTimeSeconds: 180000 },
  { password: 'C1@udG8$xR9pK5#m', category: 'strong', reason: 'Random characters, no pattern', crackTimeSeconds: 450000 },
  { password: 'M0nkeyN!njA@Tiger7', category: 'strong', reason: 'Long with good mixing', crackTimeSeconds: 220000 },
  { password: 'BlueSky#Rain$Sunsh1ne', category: 'strong', reason: 'Multiple words, good variation', crackTimeSeconds: 190000 },
  { password: 'P@ssw0rd!Secure#2024', category: 'strong', reason: 'Multiple special characters', crackTimeSeconds: 170000 },
  { password: 'J4zz#Rock$2024@Music', category: 'strong', reason: 'Music themed, strong entropy', crackTimeSeconds: 160000 },
  { password: 'V1ct0ry@Freedom#2024!', category: 'strong', reason: 'Long, complex mix', crackTimeSeconds: 200000 },
  { password: 'K3y$0f#D0ors@Heaven7', category: 'strong', reason: 'Poetic and secure', crackTimeSeconds: 210000 },
  { password: 'N0rthSt@r!Galaxy#2024', category: 'strong', reason: 'Thematic with high entropy', crackTimeSeconds: 195000 },
  { password: 'Th1$Is#MyStr0ng@Pass', category: 'strong', reason: 'Good length and complexity', crackTimeSeconds: 185000 },
  { password: 'C@ptain$Pl@n3t#Earth', category: 'strong', reason: 'Creative with security', crackTimeSeconds: 192000 },

  // UNBREAKABLE - Maximum entropy, random, long
  { password: 'x#7K$mP9@nL!vQ2wF8&rD', category: 'unbreakable', reason: 'Truly random, maximum entropy', crackTimeSeconds: 10000000 },
  { password: 'pQrXyZ*9jK@lM#3nO&pRsT', category: 'unbreakable', reason: 'Long random string', crackTimeSeconds: 50000000 },
  { password: '4GyZ$kL#9tD@mR!2vW&xC5', category: 'unbreakable', reason: 'No predictable pattern', crackTimeSeconds: 45000000 },
  { password: 'aB!cD@eF#gH$iJ%kL^mN&oP', category: 'unbreakable', reason: 'Maximum complexity', crackTimeSeconds: 55000000 },
  { password: 'Kp7%nQ#xR$9mL!2tV@8bC&wD', category: 'unbreakable', reason: 'Very long, very random', crackTimeSeconds: 60000000 },
  { password: '3jLm#nO@pQ$rS!tU%vW^xY&z', category: 'unbreakable', reason: 'Alphabet randomized', crackTimeSeconds: 52000000 },
  { password: 'X9$y8#Z@7w&V6!U%t5^S4*r', category: 'unbreakable', reason: 'Random reverse alphabet', crackTimeSeconds: 58000000 },
  { password: 'kQp@L9#M8$N7!O6&P5%Q4^R', category: 'unbreakable', reason: 'Cryptographic randomness', crackTimeSeconds: 48000000 },
  { password: '7mK#9nL$2pQ@8rS!5tU%3vW', category: 'unbreakable', reason: 'Numbers + letters randomized', crackTimeSeconds: 56000000 },
  { password: 'aT!bU@cV#dW$eX%fY^gZ&hA', category: 'unbreakable', reason: 'Complete alphabet mix', crackTimeSeconds: 62000000 },
  { password: '5Z$x4&Y@w3!V#u2^T%s1*R&q', category: 'unbreakable', reason: 'Reverse pattern', crackTimeSeconds: 54000000 },
  { password: 'Np!Oq@Pr#Qs$Rt%Su^Tv&Uw', category: 'unbreakable', reason: 'Sequential letters, special chars', crackTimeSeconds: 59000000 },
  { password: '9k#L8m$N7@P6!Q5%R4^S3*T', category: 'unbreakable', reason: 'Descending pattern', crackTimeSeconds: 51000000 },
  { password: 'mM!nN@oO#pP$qQ%rR^sS&tT', category: 'unbreakable', reason: 'Paired letters pattern', crackTimeSeconds: 57000000 },
  { password: 'X@w#V$u!T%s^R&q*P)o(N-m', category: 'unbreakable', reason: 'All special characters included', crackTimeSeconds: 65000000 },
];
