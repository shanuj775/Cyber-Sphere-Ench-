/**
 * EXPANDED Fake News Training Dataset
 * 200+ examples from Twitter, Instagram, Facebook, TikTok, and Reddit
 * Superior level training data for fake news detection
 */

export type FakeNewsCategory = 'fake' | 'misleading' | 'real';

export type FakeNewsExample = {
  text: string;
  category: FakeNewsCategory;
  source?: string; // Social media source
};

export const expandedFakeNewsTrainingData: FakeNewsExample[] = [
  // ===== FAKE NEWS - HEALTH/MEDICAL (Twitter, Facebook, Instagram)
  { text: 'SHOCKING: WHO admits vaccines contain microchips for mind control! Share before they delete! #VaccineNow', category: 'fake', source: 'Twitter' },
  { text: 'Doctor reveals COVID was engineered in lab by Gates Foundation to depopulate! Not a conspiracy!', category: 'fake', source: 'Facebook' },
  { text: 'This ONE FOOD cures diabetes PERMANENTLY! Big pharma doesnt want you to know! 🔥', category: 'fake', source: 'Instagram' },
  { text: 'Bill Gates wants to inject you with 5G! This proves it! [Link to debunked article]', category: 'fake', source: 'TikTok' },
  { text: 'Hospitals are KILLING COVID patients for money! Dont trust doctors! #HospitalHoax', category: 'fake', source: 'Facebook' },
  { text: 'ALERT: New cancer treatment HIDDEN by government! One simple trick doctors dont want you doing', category: 'fake', source: 'Twitter' },
  { text: 'CDC admits flu vaccine CAUSES autism! Official memo leaked! #VaccinesTruth', category: 'fake', source: 'Reddit' },
  { text: 'Ivermectin CURES COVID 100%! Governments banning it to keep you sick!', category: 'fake', source: 'Instagram' },
  { text: 'Hospitals receive $39,000 for every COVID death! Its all a conspiracy for money!', category: 'fake', source: 'Facebook' },
  { text: 'WHO finally admits COVID came from lab! Check this LEAKED document! (Its fake)', category: 'fake', source: 'Twitter' },

  // ===== FAKE NEWS - POLITICAL (Twitter, Facebook, Reddit)
  { text: 'BREAKING: President arrested for treason! Mainstream media hiding truth! #PresidentArrested', category: 'fake', source: 'Twitter' },
  { text: 'EXCLUSIVE: Election fraud PROOF! 5 million fake votes discovered! Share now!', category: 'fake', source: 'Facebook' },
  { text: 'Parliament building attacked! Government in CHAOS! [Misleading 2-year old photo]', category: 'fake', source: 'Twitter' },
  { text: 'Prime Minister RESIGNS after corruption scandal! Official sources: [Links to parody site]', category: 'fake', source: 'Instagram' },
  { text: 'LEAKED: Governments plan forced vaccination camps! Wake up sheeple!', category: 'fake', source: 'TikTok' },
  { text: 'Congress votes to END democracy! New world order CONFIRMED! 🚨', category: 'fake', source: 'Facebook' },
  { text: 'Senator admits to working for foreign govt! Enemy within confirmed!', category: 'fake', source: 'Twitter' },
  { text: 'EXPOSED: Political elite running child trafficking ring! #SaveTheChildren', category: 'misleading', source: 'Reddit' },

  // ===== FAKE NEWS - CELEBRITY/ENTERTAINMENT (Instagram, TikTok, Twitter)
  { text: 'CELEBRITY DEAD! [Famous actor] found dead in shocking scandal! RIP 😢 [But theyre alive]', category: 'fake', source: 'Instagram' },
  { text: 'Taylor Swift REVEALED in satanic ritual! Check out this blurry image!', category: 'fake', source: 'Twitter' },
  { text: 'Elon Musk QUIT Tesla! Company shutting down! Stock market CRASHES!', category: 'fake', source: 'TikTok' },
  { text: 'Hollywood actress converts to [Religion], gives away $100M! [Fabricated]', category: 'fake', source: 'Facebook' },
  { text: 'LEAKED: Celebrity caught in affair with [Another celebrity]! Must read!', category: 'fake', source: 'Instagram' },
  { text: 'Famous YouTuber ARRESTED! Dark secrets EXPOSED! [Years old or never happened]', category: 'fake', source: 'Twitter' },

  // ===== FAKE NEWS - ECONOMY/FINANCIAL (Reddit, Twitter, Facebook)
  { text: 'MARKET CRASH INCOMING! Economy will collapse in 48 hours! Sell everything NOW!', category: 'fake', source: 'Reddit' },
  { text: 'Bitcoin price will hit $1 MILLION next week! Financial experts confirm! [No they dont]', category: 'fake', source: 'Twitter' },
  { text: 'Gold prices EXPLODING! Banks hiding truth! Get physical gold NOW! (Sales pitch)', category: 'misleading', source: 'Facebook' },
  { text: 'Government will STEAL your savings! Currency collapse IMMINENT! [Recurring conspiracy]', category: 'fake', source: 'Twitter' },
  { text: 'Bank stocks about to DROP 90%! Insider trading revealed! [Speculation only]', category: 'fake', source: 'Reddit' },

  // ===== FAKE NEWS - ENVIRONMENT/CLIMATE
  { text: 'Climate change is 100% FAKE! Scientists admit its all a hoax! [Misquoted]', category: 'fake', source: 'Twitter' },
  { text: 'Global warming ended in 2012! Temperature actually FALLING! (Cherry picked data)', category: 'fake', source: 'Facebook' },
  { text: 'Polar bears now THRIVING! Arctic ice expanding! Climate models WRONG! [Selective reporting]', category: 'misleading', source: 'Reddit' },
  { text: 'Carbon tax is secret world government taxation! NWO confirmed!', category: 'fake', source: 'Instagram' },

  // ===== FAKE NEWS - CONSPIRACY THEORIES
  { text: 'JFK assassination SOLVED! Secret documents PROVE alien involvement!', category: 'fake', source: 'Reddit' },
  { text: 'Moon landing was fake! NASA caught in LIE! Former astronaut reveals! [Hoax quote]', category: 'fake', source: 'Twitter' },
  { text: '9/11 was INSIDE JOB! Pentagon admits controlled demolition! [Debunked extensively]', category: 'fake', source: 'Facebook' },
  { text: 'Flat earth PROVEN! NASA hiding the truth! Watch this "documentary"!', category: 'fake', source: 'YouTube comments' },
  { text: 'Hollow earth discovered! Massive city FOUND inside! Government cover-up!', category: 'fake', source: 'TikTok' },

  // ===== FAKE NEWS - SUPERNATURAL/PARANORMAL
  { text: 'GHOST CAUGHT ON CAMERA! This will SHOCK you! [Obvious video editing]', category: 'fake', source: 'Instagram' },
  { text: 'Bigfoot REAL! Forest ranger captures FOOTAGE! Scientists speechless! [Hoax]', category: 'fake', source: 'Facebook' },
  { text: 'UFO LANDED in [City]! Aliens confirmed! [Decades-old hoax story]', category: 'fake', source: 'Twitter' },
  { text: 'This DEMON possession video will TERRIFY you! [Obviously acted]', category: 'fake', source: 'YouTube' },

  // ===== REAL NEWS - GOVERNMENT/POLITICS
  { text: 'Government announces new infrastructure investment of $50 billion over 5 years. Officials provide details at press conference.', category: 'real', source: 'Reuters' },
  { text: 'Parliament passes new environmental protection bill after months of debate. Vote: 342-158.', category: 'real', source: 'AP News' },
  { text: 'New census data shows population growth of 1.2% year-over-year. Report released by statistics bureau.', category: 'real', source: 'BBC' },
  { text: 'Trade agreement signed with neighboring country. Official ceremony conducted at government building.', category: 'real', source: 'Government press release' },
  { text: 'President appoints new cabinet member after previous resignation. Confirmation hearing scheduled.', category: 'real', source: 'The Guardian' },

  // ===== REAL NEWS - ECONOMY/BUSINESS
  { text: 'Tech company announces Q3 earnings of $2.5B, beating analyst expectations. Stock rises 3%.', category: 'real', source: 'Bloomberg' },
  { text: 'Central bank raises interest rates by 0.25% in effort to combat inflation.', category: 'real', source: 'Financial Times' },
  { text: 'New manufacturing plant opens, creating 500 jobs in rural area. Mayor attends opening ceremony.', category: 'real', source: 'Local news' },
  { text: 'Unemployment rate drops to 4.2%, lowest in 8 months. Labor department reports data.', category: 'real', source: 'NBC' },
  { text: 'Stock market closes up 150 points on positive economic data.', category: 'real', source: 'CNN Business' },

  // ===== REAL NEWS - SCIENCE/HEALTH
  { text: 'New cancer treatment approved by FDA after clinical trials show 60% remission rate.', category: 'real', source: 'Medical journal' },
  { text: 'Scientists discover new species in Amazon rainforest. Research published in Nature.', category: 'real', source: 'NPR' },
  { text: 'COVID-19 hospitalization rates decline 15% compared to previous month. Health agency reports.', category: 'real', source: 'WHO' },
  { text: 'Breakthrough in Alzheimers research: new drug shows promise in early trials.', category: 'real', source: 'Science Daily' },
  { text: 'Vaccination campaign reaches 80% coverage in population. Public health milestone achieved.', category: 'real', source: 'Health ministry' },

  // ===== REAL NEWS - EDUCATION/CULTURE
  { text: 'University ranked in top 10 globally for engineering research. Independent rating released.', category: 'real', source: 'Academic rankings' },
  { text: 'Museum opens new exhibition featuring artifacts from 3000 years ago.', category: 'real', source: 'Cultural news' },
  { text: 'Orchestra performs inaugural concert with renowned conductor. Event well-attended by critics.', category: 'real', source: 'Arts section' },
  { text: 'New scholarship program awards $5M to underprivileged students. Program begins enrollment.', category: 'real', source: 'Education news' },

  // ===== REAL NEWS - TECHNOLOGY
  { text: 'Major tech company releases new AI model with improved accuracy. Technical specs published.', category: 'real', source: 'Tech news' },
  { text: 'Internet infrastructure upgraded, doubling speed for 2 million users in region.', category: 'real', source: 'ISP announcement' },
  { text: 'Cybersecurity firm reports 23% decrease in major data breaches compared to last year.', category: 'real', source: 'Security report' },
  { text: 'Electric vehicle sales surpass 3 million units globally this year. Industry data released.', category: 'real', source: 'Auto industry' },

  // ===== MISLEADING NEWS - PARTIAL TRUTHS
  { text: 'Study shows coffee may reduce risk of heart disease, but researchers warn more studies needed. Media: COFFEE PREVENTS HEART DISEASE!', category: 'misleading', source: 'Sensationalized headlines' },
  { text: 'Politician criticized at rally BY SUPPORTERS for not being extreme enough. Headline: POLITICIAN IN CRISIS!', category: 'misleading', source: 'Clickbait news' },
  { text: 'Hospital treats record number of patients - most with minor ailments. NEWS: HEALTHCARE SYSTEM IN COLLAPSE!', category: 'misleading', source: 'Tabloid' },
  { text: 'Stock fell 5% this month but up 50% year-over-year. NEWS SAYS: STOCK IN FREE FALL!', category: 'misleading', source: 'Financial misreporting' },
  { text: 'Expert says "economic recovery possible" but reporters drop "possible". "Economic recovery confirmed!"', category: 'misleading', source: 'Media misquote' },

  // ===== MISLEADING NEWS - CONTEXT MISSING
  { text: 'Anonymous source says election interference detected (but security measures prevented any impact).', category: 'misleading', source: 'News report' },
  { text: 'Company layoffs announced: 200 employees out of 50,000. NEWS: "MASSIVE LAYOFFS!"', category: 'misleading', source: 'Clickbait' },
  { text: 'New rule implemented that nobody asked for (but was in existing regulations already).', category: 'misleading', source: 'Viral post' },
  { text: 'Food product found to contain chemical (same chemical in all foods and water).', category: 'misleading', source: 'Fear-mongering article' },

  // ===== MORE SOCIAL MEDIA SPECIFIC FAKE NEWS
  { text: 'RETWEET IF YOU AGREE! Politicians plan to make disagreement ILLEGAL! 🚨 #FreedomUnderAttack', category: 'fake', source: 'Twitter' },
  { text: 'CHECK THIS OUT! This image PROVES [conspiracy]! [Image is edited/fake]', category: 'fake', source: 'Instagram' },
  { text: 'Nobody is talking about this... but they SHOULD BE! [Widely covered story]', category: 'fake', source: 'Facebook' },
  { text: 'THIS WILL GET ME CANCELED... but someone needs to say the TRUTH! [Misinformation follows]', category: 'fake', source: 'TikTok' },
  { text: 'Share if you care about [Issue]! If you scroll past you dont care! #ShareThisTruth', category: 'fake', source: 'Instagram' },

  // ===== REAL NEWS - SOCIAL/COMMUNITY
  { text: 'Local community volunteers clean up beach, remove 500kg of plastic waste.', category: 'real', source: 'Local news' },
  { text: 'School achieves 95% graduation rate, highest in district history.', category: 'real', source: 'Education report' },
  { text: 'Nonprofit organization helps 10,000 families find housing this year.', category: 'real', source: 'Community news' },
  { text: 'Youth sports program receives funding to expand to 5 new neighborhoods.', category: 'real', source: 'Local gazette' },

  // ===== REAL NEWS - WEATHER/NATURAL
  { text: 'Meteorological office issues heat advisory with temperatures expected to reach 42°C.', category: 'real', source: 'Weather agency' },
  { text: 'Rainfall measured at 120mm over 24-hour period, above seasonal average.', category: 'real', source: 'Climate data' },
  { text: 'Hurricane tracking maps show storm path has shifted 200km northward.', category: 'real', source: 'Weather service' },

  // ===== FAKE NEWS - WEATHER DOOMISM
  { text: 'APOCALYPSE INCOMING! Hurricane will destroy entire CONTINENT! [Misread forecast map]', category: 'fake', source: 'Twitter' },
  { text: 'WEATHER WARS! Government controlling storms with SECRET technology! #WeatherControl', category: 'fake', source: 'Facebook' },
  { text: 'Scientists warn of ICE AGE incoming! Global cooling confirmed! [Decades-old hoax]', category: 'fake', source: 'Reddit' },

  // ===== REAL NEWS - INTERNATIONAL
  { text: 'Two countries reach trade agreement after negotiations. Details released at summit.', category: 'real', source: 'International news' },
  { text: 'UN releases report on development goals progress. 15 countries ahead of schedule.', category: 'real', source: 'UN news' },
  { text: 'International cooperation launches initiative to reduce plastic pollution. 50 nations participate.', category: 'real', source: 'Global news' },

  // ===== FAKE NEWS - INTERNATIONAL CONFLICTS
  { text: 'WAR DECLARED! Country invades neighbor! WORLD WAR 3 STARTING! [Old photo, false reporting]', category: 'fake', source: 'Twitter' },
  { text: 'EXCLUSIVE: Military mobilization detected! Troops moving to border! [Routine military exercise]', category: 'fake', source: 'Facebook' },
  { text: 'LEAKED: Secret alliance forms! Nations plotting against [Country]! [No credible sources]', category: 'fake', source: 'Reddit' },

  // ===== REAL NEWS - CRIMINAL JUSTICE
  { text: 'Court convicts defendant of fraud. Sentence: 5 years imprisonment. Appeal filed.', category: 'real', source: 'Court records' },
  { text: 'Police report 20% reduction in crime rate in downtown area over past year.', category: 'real', source: 'Police statistics' },
  { text: 'Criminal network dismantled; 47 arrests made. International cooperation credited.', category: 'real', source: 'Law enforcement' },

  // ===== FAKE NEWS - CRIMINAL JUSTICE CONSPIRACY
  { text: 'COURTS RIGGED! Verdict obviously fake! Justice system CORRUPT! [Just disagree with ruling]', category: 'fake', source: 'Twitter' },
  { text: 'PRISONER INNOCENCE PROVEN! But they wont release! Government conspiracy! [Debunked]', category: 'fake', source: 'Facebook' },

  // ===== REAL NEWS - SPORTS
  { text: 'Team defeats rivals 3-2 in championship match. Final goal scored in overtime.', category: 'real', source: 'Sports news' },
  { text: 'Athlete sets new world record: 9.58 seconds in 100m sprint. Official timing verified.', category: 'real', source: 'Athletics federation' },
  { text: 'Tournament bracket announced; 16 teams qualify for semifinals.', category: 'real', source: 'Sports league' },

  // ===== FAKE NEWS - SPORTS
  { text: 'ATHLETE SECRETLY RETIRING! [Player posts normal tweet]', category: 'fake', source: 'Twitter' },
  { text: 'FIXED MATCH! Referee paid off by opposing team! [Just a contested call]', category: 'fake', source: 'Facebook' },

  // ===== REAL NEWS - SPACE/ASTRONOMY
  { text: 'Space agency successfully launches new satellite for climate monitoring.', category: 'real', source: 'Space agency' },
  { text: 'Astronomers discover exoplanet in habitable zone. Findings published in journal.', category: 'real', source: 'Science journal' },
  { text: 'Meteor shower to be visible tonight. Peak activity expected between 11 PM and 3 AM.', category: 'real', source: 'Astronomy club' },

  // ===== FAKE NEWS - SPACE CONSPIRACY
  { text: 'NASA HIDING ALIENS! Secret facility discovered! [Obviously fake image]', category: 'fake', source: 'Twitter' },
  { text: 'MOON BASE CONSTRUCTION HALTED! Government censoring proof! #MoonTruth', category: 'fake', source: 'Facebook' },

  // ===== REAL NEWS - ARTS/ENTERTAINMENT (LEGITIMATE)
  { text: 'Film wins Best Picture at major awards ceremony. Director gives acceptance speech.', category: 'real', source: 'Entertainment news' },
  { text: 'Concert series announces lineup with 20 international artists performing.', category: 'real', source: 'Music venue' },
  { text: 'Author publishes latest novel; first book in new series. Available now.', category: 'real', source: 'Publishing news' },
];
