#!/usr/bin/env bash
# Uses only the JDK and official Android SDK build tools; no Gradle dependencies.
set -euo pipefail
cd "$(dirname "$0")/.."
SDK_ROOT="${ANDROID_SDK_ROOT:-${ANDROID_HOME:-}}"
if [[ -z "$SDK_ROOT" ]]; then echo 'Set ANDROID_SDK_ROOT to an installed Android SDK.' >&2; exit 1; fi
BUILD_TOOLS="$SDK_ROOT/build-tools/35.0.0"
ANDROID_JAR="$SDK_ROOT/platforms/android-35/android.jar"
for command_path in "$BUILD_TOOLS/aapt2" "$BUILD_TOOLS/d8" "$BUILD_TOOLS/zipalign" "$BUILD_TOOLS/apksigner" "$ANDROID_JAR"; do
    [[ -f "$command_path" ]] || { echo "Missing SDK component: $command_path" >&2; exit 1; }
done
OUT="$PWD/build/android"
rm -rf "$OUT"
mkdir -p "$OUT/assets/game/assets" "$OUT/classes" "$OUT/dex" "$OUT/generated" "$OUT/dist"
cp index.html "$OUT/assets/game/"
cp assets/*.webp "$OUT/assets/game/assets/"
node tests/game.cjs
"$BUILD_TOOLS/aapt2" compile --dir android/res -o "$OUT/resources.zip"
"$BUILD_TOOLS/aapt2" link -o "$OUT/base.apk" -I "$ANDROID_JAR" \
    --manifest android/AndroidManifest.xml --java "$OUT/generated" \
    -A "$OUT/assets" "$OUT/resources.zip"
find android/java "$OUT/generated" -name '*.java' -print > "$OUT/sources.list"
javac -encoding UTF-8 -source 8 -target 8 -classpath "$ANDROID_JAR" -d "$OUT/classes" @"$OUT/sources.list"
find "$OUT/classes" -name '*.class' -print > "$OUT/classes.list"
"$BUILD_TOOLS/d8" --lib "$ANDROID_JAR" --min-api 23 --output "$OUT/dex" @"$OUT/classes.list"
cp "$OUT/base.apk" "$OUT/unsigned.apk"
(cd "$OUT/dex" && zip -q "$OUT/unsigned.apk" classes.dex)
"$BUILD_TOOLS/zipalign" -f 4 "$OUT/unsigned.apk" "$OUT/aligned.apk"
APK="$OUT/dist/PixelQuest-v0.8.0-android.apk"
# This is an intentionally public development certificate, not a production secret.
"$BUILD_TOOLS/apksigner" sign --ks android/debug.keystore --ks-key-alias androiddebugkey \
    --ks-pass pass:android --key-pass pass:android --out "$APK" "$OUT/aligned.apk"
"$BUILD_TOOLS/apksigner" verify --verbose --print-certs "$APK" | tee "$OUT/dist/signature.txt"
"$BUILD_TOOLS/aapt2" dump badging "$APK" | tee "$OUT/dist/package.txt"
python3 android/verify-apk.py "$APK"
(cd "$OUT/dist" && sha256sum PixelQuest-v0.8.0-android.apk > SHA256SUMS.txt)
echo "APK ready: $APK"
