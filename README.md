# Cyber-Sphere | AI Cybersecurity Defense

A professional, high-fidelity AI security platform built with Next.js, Genkit, and Firebase. This application supports SDG-16 (Peace, Justice, and Strong Institutions) by providing accessible security tools.

## 🚀 Deployment Instructions

### 1. Push to GitHub
1. Create a new repository on [GitHub](https://github.com/new).
2. Open your terminal in this project folder.
3. Run the following commands:
   ```bash
   git init
   git add .
   git commit -m "Initial deploy: Cyber-Sphere Security Mesh"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### 2. Deploy to Vercel
1. Go to the [Vercel Dashboard](https://vercel.com/new).
2. Click **Import** next to your new GitHub repository.
3. **Environment Variables**: This is critical. Expand the "Environment Variables" section and add:
   - `GOOGLE_GENAI_API_KEY`: Your Google AI / Gemini API Key.
4. Click **Deploy**.

### 3. Firebase Configuration
The Firebase configuration is already included in `src/firebase/config.ts`. Ensure your Firebase project's **Authentication** and **Firestore** are enabled in the [Firebase Console](https://console.firebase.google.com/).

## 🛠 Features
- **Unique Neural Logo**: Animated identity for a professional feel.
- **AI Security Tools**: Link Scanning, Message Detection, QR Analysis, Deepfake Verification, and Malware Detection.
- **Panic Protocol**: Real-time geolocation dispatch to emergency contacts.
- **Multilingual UI**: Full support for English and Hindi.
- **Light/Dark Mode**: High-contrast, enterprise-grade themes.
