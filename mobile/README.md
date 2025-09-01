# InvestiGuard Mobile App

## 📱 Flutter Mobile Application

This directory contains the Flutter mobile application for InvestiGuard.

## 🚧 Status: Coming Soon

The mobile app is currently in development and will include:

- **Content Scanning**: Scan text, documents, and media for fraud detection
- **Real-time Alerts**: Push notifications for critical fraud alerts
- **Offline Mode**: Basic fraud detection without internet connection
- **Biometric Security**: Fingerprint/Face ID authentication
- **Dark Mode**: User preference for app appearance
- **Multi-language Support**: Internationalization support

## 🛠️ Tech Stack

- **Framework**: Flutter 3.x
- **Language**: Dart
- **State Management**: Provider/Riverpod
- **Backend Integration**: REST API + WebSocket
- **Local Storage**: SQLite + SharedPreferences
- **Authentication**: Biometric + JWT tokens

## 📋 Features Roadmap

### Phase 1 (Q2 2024)
- [ ] Basic UI/UX design
- [ ] Authentication system
- [ ] Content scanning interface
- [ ] Results display

### Phase 2 (Q3 2024)
- [ ] Offline capabilities
- [ ] Push notifications
- [ ] User preferences
- [ ] History tracking

### Phase 3 (Q4 2024)
- [ ] Advanced scanning features
- [ ] Social sharing
- [ ] Analytics dashboard
- [ ] Multi-language support

## 🔧 Development Setup

```bash
# Prerequisites
flutter --version  # Flutter 3.x required
dart --version     # Dart 3.x required

# Clone and setup
cd mobile
flutter pub get
flutter run
```

## 📱 Target Platforms

- **iOS**: iOS 12.0+
- **Android**: Android 6.0+ (API level 23+)
- **Web**: Progressive Web App (PWA)

## 🎨 Design System

The mobile app follows the same design principles as the web application:
- Clean, minimal interface
- Investor-trust oriented design
- Consistent color scheme and typography
- Accessibility-first approach

## 🔗 Integration

The mobile app will integrate with:
- **Backend API**: Node.js service
- **AI Service**: FastAPI inference engine
- **Push Notifications**: Firebase Cloud Messaging
- **Analytics**: Firebase Analytics
- **Crash Reporting**: Firebase Crashlytics

## 📄 License

MIT License - see LICENSE file for details
