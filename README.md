# Dear Past Me

A mobile app where people share advice they'd give to their past selves. Browse through wisdom from others by swiping, or add your own note across time.

Built with React Native and Expo. Works on iOS, Android, and macOS from a single codebase.

---

## Screenshots

Read screen — swipe through advice cards  
Write screen — submit your own wisdom

---

## Prerequisites

- [Node.js](https://nodejs.org) (LTS version recommended)
- [Expo Go](https://expo.dev/go) installed on your phone (iOS or Android)

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/dearpastself.git
cd dearpastself
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Start the development server

```bash
npx expo start
```

### 4. Open on your device

- Scan the QR code in your terminal with your phone camera (iOS) or the Expo Go app (Android)
- Your phone and computer must be on the same WiFi network

---

## Project Structure

```
dearpastself/
├── App.js          # Main app — all screens and components
├── index.js        # Entry point (registers the root component)
├── app.json        # Expo configuration
├── package.json    # Dependencies
├── babel.config.js # Babel config for Expo
└── assets/         # Icons and splash screen images
```

---

## Features

- **Read** — swipe left or right through advice cards
- **Write** — submit advice for a specific age, with your current age, an optional name, and a signature line
- **Persistent storage** — submissions are saved locally on device via AsyncStorage
- **200 character limit** — keeps advice concise and readable
- **Dark mode** — warm dark theme throughout

---

## Running on Simulator

**iOS Simulator** (requires Xcode on Mac):
```bash
npx expo start
# Press 'i' in the terminal
```

**Android Emulator** (requires Android Studio):
```bash
npx expo start
# Press 'a' in the terminal
```

---

## Dependencies

| Package | Purpose |
|---|---|
| `expo` | Core Expo SDK |
| `react-native` | Mobile UI framework |
| `@react-native-async-storage/async-storage` | Local data persistence |

---

## Notes

- This version stores data locally on each device. A future version will sync submissions across users via a shared backend.
- Expo SDK 54 is required to match the current Expo Go release.
