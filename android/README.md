# PGSO Android App

This directory contains the Android project for the PGSO mobile app.

## Prerequisites

- Android Studio installed
- Android SDK installed
- Java Development Kit (JDK) 17+ installed

## Building from Android Studio

1. Open the Android project in Android Studio:

   ```
   npm run cap:open:android
   ```

2. Once Android Studio opens, you can build and run the app using the standard Android Studio tools.

## Troubleshooting

### Gradle Issues

If you encounter gradle permission issues on Linux/Mac:

```
npm run cap:fix-permissions
```

### Live Reload for Development

To use live reload during development:

```
npm run cap:dev
```

This will start the development server with your local IP address and configure the app to connect to it.

### Building for Production

To build for production:

```
npm run cap:prod
```

This will configure the app for production use and build the Next.js app for production.

## Customizing the Android App

- App icon: Replace the files in `android/app/src/main/res/mipmap-*`
- Splash screen: Modify `android/app/src/main/res/drawable/splash.png`
- App name: Edit in `capacitor.config.ts` and `android/app/src/main/res/values/strings.xml`
- Theme colors: Edit in `android/app/src/main/res/values/colors.xml`
