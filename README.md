# CapZ AI - Data Structures & Algorithms Learning App 📚

A comprehensive React Native Expo app for learning Data Structures & Algorithms with AI-powered assistance.

## Features ✨

### 📱 **Multi-Tab Interface**
- **Library**: Browse subjects and lectures
- **Capture**: Voice recording and note-taking
- **Profile**: User profile and settings
- **Study**: Complete DSA learning system

### 🎓 **Study System (Study Tab)**
- **Library View**: Subject cards with progress tracking
- **Session View**: 5 specialized tabs per lecture:
  - 📝 **Notes**: Detailed lecture content
  - 🤖 **ChatBot**: Gemini AI tutor (note-restricted answers)
  - 📊 **Diagrams**: ASCII art data structure visualizations
  - 🎵 **Audio**: Text-to-speech lecture playback with speed control
  - 📅 **Schedule**: Study tasks and deadlines
  - 📄 **PDF**: Embedded lecture materials

### 🔐 **Authentication**
- Google OAuth integration
- Secure user sessions

### 🎨 **UI/UX**
- Dark theme optimized for mobile
- Smooth navigation with Expo Router
- Responsive design

## Setup Instructions 🚀

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Configure Gemini AI**
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Update `.env` file:
```env
EXPO_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. **Start the App**
```bash
npx expo start
```

### 4. **Run on Device**
- Scan QR code with Expo Go app
- Or use Android/iOS simulators

## Project Structure 📁

```
WinterHackathon-TEAM_NAME-CapZ/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Tab navigation
│   │   ├── index.tsx        # SmartLibrary (Google Drive)
│   │   ├── capture.tsx      # Voice capture
│   │   ├── profile.tsx      # User profile
│   │   └── library.tsx      # Study system
│   └── _layout.tsx          # Root layout
├── components/
│   ├── Library.tsx          # Subject cards
│   ├── Session.tsx          # Tab container
│   ├── NotesTab.tsx         # Lecture notes
│   ├── ChatBot.tsx          # AI assistant
│   ├── DiagramsTab.tsx      # Data structures
│   ├── AudioTab.tsx         # TTS player
│   ├── ScheduleTab.tsx      # Study schedule
│   └── PDFTab.tsx           # Lecture PDF
├── data/
│   ├── sessions.js          # Lecture data
│   └── dsNotes.json         # DSA content
├── context/
│   └── AuthContext.tsx      # Authentication
└── assets/
    └── ds-lecture.html      # PDF content
```

## Key Technologies 🛠️

- **React Native** with Expo SDK
- **Expo Router** for navigation
- **Google Gemini AI** for chatbot
- **Expo Speech** for text-to-speech
- **React Native WebView** for PDF display
- **Google OAuth** for authentication

## Development Notes 📝

- All components are TypeScript-ready
- Dark theme with consistent styling
- AI responses restricted to lecture notes only
- Environment variables for secure API keys
- Modular component architecture

## API Keys Required 🔑

1. **Gemini API Key**: For AI chatbot functionality
2. **Google OAuth**: For Drive integration (configured in AuthContext)

## Contributing 🤝

1. Focus on React Native Expo development
2. Maintain dark theme consistency
3. Test on both iOS and Android
4. Follow TypeScript best practices

---

**Built for Winter Hackathon - TEAM_NAME** ❄️