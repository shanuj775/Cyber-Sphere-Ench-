"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.tools": "Tools",
    "nav.dashboard": "Dashboard",
    "nav.admin": "Admin",
    "nav.login": "Login",
    "home.hero.badge": "Real-time Defensive Mesh Active",
    "home.hero.title1": "The Sovereign",
    "home.hero.title2": "Perimeter.",
    "home.hero.desc": "Enterprise-grade AI security protocols protecting digital identities and fostering global justice through SDG-16 alignment.",
    "home.hero.btn1": "Deploy Suite",
    "home.hero.btn2": "Access Node",
    "home.ticker.scans": "Identity Scans",
    "home.ticker.threats": "Threats Neutralized",
    "home.ticker.uptime": "Global Uptime",
    "home.ticker.nodes": "SDG-16 Certified Nodes",
    "home.intel.title": "Live Intelligence Feed",
    "home.intel.desc": "Our global mesh network provides real-time telemetry on emerging threats and identity verification protocols.",
    "home.sdg.badge": "Global Mandate",
    "home.sdg.title": "Building Trust via SDG-16",
    "home.sdg.desc": "Cyber-Sphere empowers citizens and institutions to combat digital crime, fostering a just and secure global society through accessible AI-powered defense tools.",
    "home.sdg.item1.title": "Public Justice",
    "home.sdg.item1.desc": "Equal access to security tools for every digital citizen.",
    "home.sdg.item2.title": "Strong Institutions",
    "home.sdg.item2.desc": "Hardening government nodes against cyber aggression.",
    "home.sdg.item3.title": "Inclusive Trust",
    "home.sdg.item3.desc": "Reducing fraud and fostering safe digital commerce.",
    "home.tech.title": "Engineered for Absolute Integrity.",
    "home.tech.desc": "Our technology stack leverages advanced neural networks and decentralized node structures to ensure that every scan, verification, and alert is executed with mathematical precision.",
    "home.tech.li1": "Quantum-resistant encryption layers",
    "home.tech.li2": "Federated learning for threat intelligence",
    "home.tech.li3": "Real-time heuristic anomaly detection",
    "tools.fakeMessage": "Fake Message Detection",
    "tools.fakeNews": "Fake News Detection",
    "tools.linkScanner": "Malicious Link Scanner",
    "tools.passwordChecker": "Password Strength",
    "tools.deepfakeVerifier": "Deepfake Verifier",
    "tools.malwareScanner": "File Malware Scanner",
    "tools.qrScanner": "QR Security Scanner",
    "tools.portScanner": "Port Scanner",
    "tools.locationSafety": "Location Risk Analysis",
    "dashboard.status": "System Status: Optimal",
    "dashboard.welcome": "Welcome back, Specialist. Your digital perimeter is currently secure.",
    "dashboard.recentScans": "Recent Scans",
    "dashboard.threatsBlocked": "Threats Blocked",
    "dashboard.coverage": "Protection Coverage",
    "dashboard.coverageDesc": "Based on tools utilized and safety best practices.",
    "dashboard.intel": "Daily Security Intel",
    "dashboard.activity": "Recent Scan Activity",
    "dashboard.noActivity": "No recent activity detected.",
    "dashboard.landscape": "Threat Landscape",
    "emergency.button": "PANIC",
    "footer.rights": "",
    "footer.desc": "Empowering the global digital society with next-generation security intelligence. Committed to SDG-16 for a more just and secure future."
  },
  hi: {
    "nav.home": "होम",
    "nav.tools": "टूल्स",
    "nav.dashboard": "डैशबोर्ड",
    "nav.admin": "एडमिन",
    "nav.login": "लॉगिन",
    "home.hero.badge": "रियल-टाइम डिफेंसिव मेश सक्रिय",
    "home.hero.title1": "संप्रभु",
    "home.hero.title2": "परिधि।",
    "home.hero.desc": "एंटरप्राइज-ग्रेड एआई सुरक्षा प्रोटोकॉल डिजिटल पहचान की रक्षा करते हैं और एसडीजी-16 संरेखण के माध्यम से वैश्विक न्याय को बढ़ावा देते हैं।",
    "home.hero.btn1": "सूट तैनात करें",
    "home.hero.btn2": "एक्सेस नोड",
    "home.ticker.scans": "पहचान स्कैन",
    "home.ticker.threats": "खतरे बेअसर",
    "home.ticker.uptime": "ग्लोबल अपटाइम",
    "home.ticker.nodes": "एसडीजी-16 प्रमाणित नोड्स",
    "home.intel.title": "लाइव इंटेलिजेंस फीड",
    "home.intel.desc": "हमारा ग्लोबल मेश नेटवर्क उभरते खतरों और पहचान सत्यापन प्रोटोकॉल पर वास्तविक समय टेलीमेट्री प्रदान करता है।",
    "home.sdg.badge": "वैश्विक जनादेश",
    "home.sdg.title": "एसडीजी-16 के माध्यम से विश्वास बनाना",
    "home.sdg.desc": "साइबर-स्फेयर नागरिकों और संस्थानों को डिजिटल अपराध का मुकाबला करने के लिए सशक्त बनाता है, सुलभ एआई-संचालित रक्षा उपकरणों के माध्यम से एक न्यायपूर्ण और सुरक्षित वैश्विक समाज को बढ़ावा देता है।",
    "home.sdg.item1.title": "सार्वजनिक न्याय",
    "home.sdg.item1.desc": "प्रत्येक डिजिटल नागरिक के लिए सुरक्षा उपकरणों तक समान पहुंच।",
    "home.sdg.item2.title": "मजबूत संस्थान",
    "home.sdg.item2.desc": "साइबर आक्रामकता के खिलाफ सरकारी नोड्स को सख्त करना।",
    "home.sdg.item3.title": "समावेशी विश्वास",
    "home.sdg.item3.desc": "धोखाधड़ी कम करना और सुरक्षित डिजिटल वाणिज्य को बढ़ावा देना।",
    "home.tech.title": "पूर्ण अखंडता के लिए तैयार।",
    "home.tech.desc": "हमारा टेक्नोलॉजी स्टैक उन्नत तंत्रिका नेटवर्क और विकेंद्रीकृत नोड संरचनाओं का लाभ उठाता है ताकि यह सुनिश्चित किया सके कि प्रत्येक स्कैन, सत्यापन और अलर्ट गणितीय सटीकता के साथ निष्पादित किया जाए।",
    "home.tech.li1": "क्वांटम-प्रतिरोधी एन्क्रिप्शन परतें",
    "home.tech.li2": "खतरा खुफिया जानकारी के लिए संघित शिक्षा",
    "home.tech.li3": "रियल-टाइम हेयुरिस्टिक विसंगति का पता लगाना",
    "tools.fakeMessage": "नकली संदेश का पता लगाना",
    "tools.fakeNews": "नकली समाचार पहचान",
    "tools.linkScanner": "मैलिसियस लिंक स्कैनर",
    "tools.passwordChecker": "पासवर्ड की मजबूती",
    "tools.deepfakeVerifier": "डीपफेक सत्यापनकर्ता",
    "tools.malwareScanner": "फ़ाइल मैलवेयर स्कैनर",
    "tools.qrScanner": "QR सुरक्षा स्कैनर",
    "tools.portScanner": "पोर्ट स्कैनर",
    "tools.locationSafety": "स्थान जोखिम विश्लेषण",
    "dashboard.status": "सिस्टम स्थिति: अनुकूल",
    "dashboard.welcome": "वापस स्वागत है, विशेषज्ञ। आपकी डिजिटल परिधि वर्तमान में सुरक्षित है।",
    "dashboard.recentScans": "हाल के स्कैन",
    "dashboard.threatsBlocked": "ब्लॉक किए गए खतरे",
    "dashboard.coverage": "सुरक्षा कवरेज",
    "dashboard.coverageDesc": "उपयोग किए गए उपकरणों और सुरक्षा सर्वोत्तम प्रथाओं के आधार पर।",
    "dashboard.intel": "दैनिक सुरक्षा खुफिया",
    "dashboard.activity": "हालिया स्कैन गतिविधि",
    "dashboard.noActivity": "कोई हालिया गतिविधि नहीं मिली।",
    "dashboard.landscape": "खतरा परिदृश्य",
    "emergency.button": "पैनिक",
    "footer.rights": "",
    "footer.desc": "अगली पीढ़ी की सुरक्षा खुफिया जानकारी के साथ वैश्विक डिजिटल समाज को सशक्त बनाना। अधिक न्यायपूर्ण और सुरक्षित भविष्य के लिए एसडीजी-16 के प्रति प्रतिबद्ध।"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
