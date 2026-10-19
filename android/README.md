# PIXEL QUEST Android test build

Offline Android WebView package of the browser v0.8.0 game. Application ID:
`ua.gesha.pixelquest`; versionCode 800; min API 23, target API 35. Universal APK:
there are no native libraries or per-ABI requirements. All six WebP images and
the exact index.html are bundled inside the APK. No INTERNET permission.

Landscape orientation, immersive mode, hardware-accelerated WebView, DOM storage
for checkpoints, blur/pause on background, and an exit confirmation on Android Back.
The Android WebView component supplies Canvas and Web Audio. No paid APIs or
external services are required by the installed game.

## Build
Run `bash android/build-apk.sh` with JDK 21, Node, Android SDK platform 35 and
build-tools 35.0.0. GitHub Actions → Android APK builds automatically on changes
and can be run manually. The workflow uploads the APK, SHA256SUMS.txt, package
metadata and certificate verification.

The checked-in debug.keystore is an intentionally public DEVELOPMENT signing
certificate (password android, alias androiddebugkey). Keep it for update
compatibility between test builds. It is not a production/Play Store key.
The app is a testing package, not a Play Store release.

Browser and installed-app saves are separate. Installing over a previous APK
with the same package ID and signing key preserves app data. Clearing app data
or uninstalling removes app saves.

Build references: https://developer.android.com/tools/aapt2 and
https://developer.android.com/tools/apksigner . The pipeline compiles resources
with AAPT2, compiles Java then DEX with D8, aligns and signs with SDK tools.
The verifier checks the bundled HTML/artwork byte-for-byte against the source.
Physical tablet installation and runtime performance still require device testing.
