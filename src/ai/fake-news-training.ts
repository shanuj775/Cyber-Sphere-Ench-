export type FakeNewsCategory = 'fake' | 'misleading' | 'real';

export type FakeNewsExample = {
  text: string;
  category: FakeNewsCategory;
};

export const fakeNewsTrainingData: FakeNewsExample[] = [
  { text: 'Government admits secret cure for cancer, doctors hate this trick', category: 'fake' },
  { text: 'New study shows vaccines cause illness, experts warn', category: 'fake' },
  { text: 'Local politician exposed in shocking video, must share now', category: 'fake' },
  { text: 'Breaking: celebrity arrested in surprise scandal', category: 'misleading' },
  { text: 'Scientists say climate change is a hoax based on anonymous sources', category: 'misleading' },
  { text: 'Top 10 foods that doctors do not want you to know about', category: 'misleading' },
  { text: 'Official report confirms economic recovery is ahead', category: 'real' },
  { text: 'Local hospital opens new vaccine clinic to improve community health', category: 'real' },
  { text: 'Research paper published on recycling technology innovation', category: 'real' },
  { text: 'City council approves new park development after public hearing', category: 'real' },
  { text: 'National weather service issues flood warning for coastal communities', category: 'real' },
  { text: 'Expert panel recommends updated cybersecurity standards for critical infrastructure', category: 'real' },
  { text: 'Social media users share hoax report about celebrity death', category: 'fake' },
  { text: 'Study reveals coffee may reduce risk of heart disease, but more research is needed', category: 'real' },
  { text: 'Report claims miracle weight loss drink can burn fat in days', category: 'fake' },
  { text: 'Experts debate whether urban green spaces can improve mental health', category: 'misleading' },
  { text: 'Viral message says the president is resigning tonight, share if you agree', category: 'fake' },
  { text: 'Headline: local school district selects new superintendent after unanimous vote', category: 'real' },
  { text: 'Anonymous source says company is hiding evidence of data breach', category: 'misleading' },
  { text: 'New app promises free gift cards with no purchase required', category: 'fake' },
  { text: 'Health agency confirms flu vaccination campaign will start next month', category: 'real' },
  { text: 'A hidden trick banks do not want you to know about', category: 'fake' },
  { text: 'Government denies the viral rumor about a secret currency ban', category: 'real' },
  { text: 'Multiple unreliable websites claim the actor is dead', category: 'misleading' },
  { text: 'Report: city budget increases for public safety and parks', category: 'real' },
  { text: 'Urgent: share this message to avoid account suspension', category: 'fake' },
  { text: 'Police department releases statement on weekend traffic arrests', category: 'real' },
  { text: 'Experts say this one food will cure diabetes, doctors are shocked', category: 'fake' },
  { text: 'Study examines housing affordability after changes in interest rates', category: 'real' },
  { text: 'Officials investigate unverified claims of election fraud from unnamed sources', category: 'misleading' },
  { text: 'Local charity receives donation for school supplies and community programs', category: 'real' },
  { text: 'Breaking: politician names secret successor in leaked memo', category: 'misleading' },
  { text: 'Hoax alert: text says system update will delete all your files', category: 'fake' },
  { text: 'Media outlets confirm the launch of a new regional train line', category: 'real' },
  { text: 'Report claims that government will ban public meetings tomorrow', category: 'fake' },
  { text: 'Health experts discuss safe travel recommendations for the holiday season', category: 'real' },
  { text: 'Viral posts say the celebrity couple is expecting twins after private ceremony', category: 'misleading' },
  { text: 'Official statement confirms new safety rules for school buses', category: 'real' },
  { text: 'Fake science claim says water can charge your phone instantly', category: 'fake' },
  { text: 'Survey finds vaccination rates remain steady nationwide', category: 'real' },
];
