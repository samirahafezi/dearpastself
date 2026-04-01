# Dear Past Me

A mobile app where people share advice they'd give to their past selves. Browse through wisdom from others by swiping, or add your own note across time.

Built with React Native and Expo. Works on iOS, Android, and web from a single codebase.

Live at: https://samirahafezi.github.io/dearpastself/

---

## Dev

```bash
npm install --legacy-peer-deps
npx expo start
```

- Press `i` for iOS Simulator, `a` for Android Emulator, or `w` for browser
- For mobile device: scan the QR code with Expo Go (phone and computer must be on the same WiFi)

---

## Deploying to GitHub Pages

The `docs/` folder is the static web build served by GitHub Pages (from the `main` branch `/docs` folder).

After making changes, rebuild and push:

```bash
npm run build:web
git add docs
git commit -m "Rebuild"
git push
```

GitHub Pages will update automatically within a minute or two.

---

## Project Structure

```
dearpastself/
├── App.js          # Main app — all screens and components
├── index.js        # Entry point
├── app.json        # Expo configuration
├── package.json    # Dependencies
└── assets/         # Icons and splash screen images
```
