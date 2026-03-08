#!/usr/bin/env bash
# Extract palm-android-sdk-veinshine-v1.3.14-L.zip into terminal-android structure.
# Usage: ./scripts/extract-sdk.sh /path/to/palm-android-sdk-veinshine-v1.3.14-L.zip

set -e
ZIP="${1:?Usage: $0 /path/to/palm-android-sdk-veinshine-v1.3.14-L.zip}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LIB_DIR="$ROOT/terminal-android/app/libs"
JNI_DIR="$ROOT/terminal-android/app/src/main/jniLibs"
ASSETS_MODELS="$ROOT/terminal-android/app/src/main/assets/models"
TMP="$ROOT/.sdk-extract"
rm -rf "$TMP"
mkdir -p "$TMP" "$LIB_DIR" "$ASSETS_MODELS"
mkdir -p "$JNI_DIR/arm64-v8a" "$JNI_DIR/armeabi-v7a" "$JNI_DIR/x86" "$JNI_DIR/x86_64"

echo "Extracting $ZIP ..."
unzip -q -o "$ZIP" -d "$TMP"

# Copy jar/aar to app/libs
find "$TMP" -type f \( -name "*.jar" -o -name "*.aar" \) -exec cp {} "$LIB_DIR/" \;

# Copy .so by ABI
for abi in arm64-v8a armeabi-v7a x86 x86_64; do
  find "$TMP" -type f -name "*.so" -path "*$abi*" -exec cp {} "$JNI_DIR/$abi/" \; 2>/dev/null || true
  # Also check common SDK layout: libs/$abi/*.so or jniLibs/$abi/*.so
  for base in "$TMP" "$TMP"/libs "$TMP"/jni "$TMP"/jniLibs; do
    [ -d "$base/$abi" ] && cp -n "$base/$abi"/*.so "$JNI_DIR/$abi/" 2>/dev/null || true
  done
done
# Any .so not in ABI folder: put in arm64-v8a as default
find "$TMP" -type f -name "*.so" ! -path "*arm64*" ! -path "*armeabi*" ! -path "*x86*" -exec cp {} "$JNI_DIR/arm64-v8a/" \; 2>/dev/null || true

# Copy model files to assets/models
find "$TMP" -type f \( -name "*.dat" -o -name "*.bin" -o -name "*.model" -o -name "*.cfg" \) -exec cp {} "$ASSETS_MODELS/" \; 2>/dev/null || true
for dir in models model Models; do
  [ -d "$TMP/$dir" ] && cp -rn "$TMP/$dir/"* "$ASSETS_MODELS/" 2>/dev/null || true
done

rm -rf "$TMP"
echo "Done. Check: $LIB_DIR, $JNI_DIR, $ASSETS_MODELS"
