# Vendor SDK (Local Install Only)

This project depends on the Veinshine Palm Android SDK.

**Do not commit** vendor SDK artifacts (`.jar`, `.aar`, `.so`) to the repo.

## Install

Run:

```bash
./scripts/install_vendor_sdk.sh /absolute/path/to/palm-android-sdk-v1.3.14-L.zip
```

This copies:

* `palm-android-sdk-v1.3.14-L/libs/palm-android-sdk-v1.3.14.jar`
  → `app/libs/palm-android-sdk-v1.3.14.jar`

Native libraries:

* `palm-android-sdk-v1.3.14-L/libs/arm64-v8a/*.so`
  → `app/src/main/jniLibs/arm64-v8a/`

* `palm-android-sdk-v1.3.14-L/libs/armeabi-v7a/*.so`
  → `app/src/main/jniLibs/armeabi-v7a/` (optional, but safe)

## Verify install

From the project root:

```bash
ls -lah app/libs
ls -lah app/src/main/jniLibs/arm64-v8a
```
