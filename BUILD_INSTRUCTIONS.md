# MindForge — APK Build Guide

## ✅ All files ready — app.js is included

`www/js/app.js` is included in this package. No manual copy needed.

---

## Prerequisites (one-time setup)

### 1. Install Node.js
Download from https://nodejs.org (LTS version, 18+).

### 2. Install Java JDK 17
Download from https://adoptium.net  
After install, verify: `java -version`

### 3. Install Android Studio
Download from https://developer.android.com/studio  
During setup, tick:
- Android SDK
- Android SDK Platform (API 34)
- Android Virtual Device (for emulator)

After install:  
Open Android Studio → More Actions → SDK Manager → SDK Tools tab → tick **Android SDK Command-line Tools** → Apply.

### 4. Set environment variables

**macOS / Linux** — add to `~/.bashrc` or `~/.zshrc`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk          # macOS
# export ANDROID_HOME=$HOME/Android/Sdk               # Linux
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/build-tools/34.0.0
```

**Windows** — set in System → Environment Variables:
```
ANDROID_HOME = C:\Users\<you>\AppData\Local\Android\Sdk
PATH += %ANDROID_HOME%\cmdline-tools\latest\bin
PATH += %ANDROID_HOME%\platform-tools
PATH += %ANDROID_HOME%\build-tools\34.0.0
```

Restart your terminal after.

### 5. Accept Android SDK licences
```bash
yes | sdkmanager --licenses
```

### 6. Install Cordova globally
```bash
npm install -g cordova
```

---

## Building the APK (3 commands)

```bash
cd mindforge-apk
npm install
cordova platform add android
cordova build android
```

APK will be at:
```
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

### Install directly on Infinix GT 30 / XOS 15 (USB debug on):
```bash
adb install platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

Or copy the APK to your phone and open it to sideload.

---

## Offline Operation ✅ Fully Verified

- ✅ No Google Fonts — system font stack used
- ✅ All questions bundled in `www/js/data.js`
- ✅ No external CDN calls in HTML, CSS, or JS
- ✅ app.js — no fetch/XMLHttpRequest calls
- ✅ localStorage works in Cordova WebView
- ✅ CSP set to `default-src 'self' data: gap:` — blocks external by design

---

## Infinix GT 30 / XOS 15 — Sideload Steps

1. On phone: **Settings → Additional Settings → Developer Options** (tap Build Number 7× to unlock)
2. Enable **USB Debugging** and **Install via USB**
3. Connect phone to PC via USB → choose **File Transfer** mode
4. Run: `adb devices` — your device should appear
5. Run: `adb install app-debug.apk`

Or just copy the APK to your phone storage and open it with any file manager.

---

## Project Structure

```
mindforge-apk/
├── config.xml          ← Cordova project manifest
├── package.json        ← npm/Cordova deps
├── res/
│   ├── icon/icon.png   ← App icon (1024×1024)
│   └── screen/splash.png
└── www/                ← Web app
    ├── index.html
    ├── css/style.css   ← System fonts, fully offline
    └── js/
        ├── data.js     ✅ All quiz questions
        └── app.js      ✅ Complete app logic
```

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `ANDROID_HOME not set` | Set env vars (see Prerequisites §4) |
| `SDK license not accepted` | Run `yes \| sdkmanager --licenses` |
| `Gradle build failed` | Ensure Java 17 is active (`java -version`) |
| `adb: command not found` | Add `platform-tools` to PATH |
| App crashes on launch | Open `chrome://inspect` on desktop, connect phone, click Inspect |
| Blank white screen | Check JS console via chrome://inspect |
| Infinix won't install | Enable "Install unknown apps" for your file manager |
