#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/install_vendor_sdk.sh /path/to/palm-android-sdk-v1.3.14-L.zip
#   ./scripts/install_vendor_sdk.sh /path/to/palm-android-sdk-v1.3.14-L
#
# Accepts either the SDK zip file OR the already-unzipped folder (must contain libs/palm-android-sdk-v1.3.14.jar).
# Copies JAR -> app/libs/, .so -> app/src/main/jniLibs/{arm64-v8a,armeabi-v7a}/.

INPUT_PATH="${1:-}"
if [[ -z "$INPUT_PATH" ]]; then
  echo "❌ Missing path."
  echo "Usage: $0 <path-to-zip-or-unzipped-folder>"
  echo "  Zip:   $0 ~/Downloads/palm-android-sdk-v1.3.14-L.zip"
  echo "  Folder: $0 ~/Downloads/palm-android-sdk-v1.3.14-L"
  exit 1
fi
INPUT_PATH="$(eval echo "$INPUT_PATH")"

if [[ ! -e "$INPUT_PATH" ]]; then
  echo "❌ Not found: $INPUT_PATH"
  echo "Use the full path to the SDK zip or the unzipped folder (e.g. palm-android-sdk-v1.3.14-L)."
  exit 1
fi

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ANDROID_APP_DIR="$PROJECT_ROOT/app"
LIBS_DIR="$ANDROID_APP_DIR/libs"
JNI_DIR="$ANDROID_APP_DIR/src/main/jniLibs"
TMP_DIR=""
SDK_ROOT=""

if [[ -d "$INPUT_PATH" ]]; then
  # Already unzipped: use folder directly (must contain libs/palm-android-sdk-v1.3.14.jar)
  SDK_ROOT="$INPUT_PATH"
  echo "📂 Using unzipped folder: $SDK_ROOT"
elif [[ -f "$INPUT_PATH" ]]; then
  TMP_DIR="$(mktemp -d)"
  trap 'rm -rf "$TMP_DIR"' EXIT
  echo "📦 Unzipping to temp: $TMP_DIR"
  unzip -q "$INPUT_PATH" -d "$TMP_DIR"
  SDK_ROOT="$TMP_DIR/palm-android-sdk-v1.3.14-L"
else
  echo "❌ Not a file or directory: $INPUT_PATH"
  exit 1
fi

JAR_SRC="$SDK_ROOT/libs/palm-android-sdk-v1.3.14.jar"
ARM64_SRC="$SDK_ROOT/libs/arm64-v8a"
ARM32_SRC="$SDK_ROOT/libs/armeabi-v7a"

if [[ ! -f "$JAR_SRC" ]]; then
  echo "❌ Expected JAR not found at: $JAR_SRC"
  echo "   The path must be the SDK root (folder containing libs/palm-android-sdk-v1.3.14.jar)."
  exit 1
fi

mkdir -p "$LIBS_DIR" "$JNI_DIR/arm64-v8a" "$JNI_DIR/armeabi-v7a"

echo "➡️  Copying JAR:"
cp -v "$JAR_SRC" "$LIBS_DIR/"

if [[ -d "$ARM64_SRC" ]]; then
  echo "➡️  Copying arm64-v8a .so files:"
  cp -v "$ARM64_SRC"/*.so "$JNI_DIR/arm64-v8a/" 2>/dev/null || true
else
  echo "⚠️  arm64-v8a folder not found: $ARM64_SRC"
fi

if [[ -d "$ARM32_SRC" ]]; then
  echo "➡️  Copying armeabi-v7a .so files:"
  cp -v "$ARM32_SRC"/*.so "$JNI_DIR/armeabi-v7a/" 2>/dev/null || true
else
  echo "⚠️  armeabi-v7a folder not found: $ARM32_SRC"
fi

echo ""
echo "✅ Vendor SDK installed locally."
echo "   JAR:  $LIBS_DIR/palm-android-sdk-v1.3.14.jar"
echo "   SOs:  $JNI_DIR/arm64-v8a/ and $JNI_DIR/armeabi-v7a/"
echo ""
echo "Next:"
echo "  1) Sync Gradle"
echo "  2) Run the app on the terminal device"
