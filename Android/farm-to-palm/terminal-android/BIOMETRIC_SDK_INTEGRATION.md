# Palm biometric SDK integration

The app uses **PalmSdkBridge**: when the Veinshine JAR and native libs are present, the bridge uses the real SDK (PalmSdk.initialize, Device.create → open, IVeinshine capture/compare); otherwise mock. This doc describes how to add the SDK files and what the bridge does.

---

## 1) Where to wire the SDK (vendor layer)

**File:** `app/src/main/java/com/farmtopalm/terminal/biometric/PalmSdkBridge.kt`

**1. Drop in artifacts:** JAR: copy from zip `palm-android-sdk-v1.3.14-L/libs/palm-android-sdk-v1.3.14.jar` → `app/libs/`. Native libs: copy zip `libs/arm64-v8a/*.so` and `libs/armeabi-v7a/*.so` → `app/src/main/jniLibs/arm64-v8a/` and `app/src/main/jniLibs/armeabi-v7a/` (e.g. libpalm_sdk.so, libstream_jni.so, libc++_shared.so). Gradle already has `fileTree(dir: 'libs', include: ['*.jar', '*.aar'])`.

**2. Veinshine classes:** Bridge looks for `com.api.stream.PalmSdk` and `com.api.stream.Device`. If both are on the classpath it uses real flow: PalmSdk.initialize(), Device.create(context, …) → device.open(IOpenCallback), then capturePalmOnce / compareFeatureScore on the opened device. Result objects use public fields (rgbFeature, irFeature, score; CompareOutput.rgbScore, irScore).


So: the same class is used for both “mock” and “real”; right now every branch is mock. If the JAR is not on the classpath, the bridge uses mock capture and compare.

---

## 2) Where the palm manager is created (DI)

**File:** `app/src/main/java/com/farmtopalm/terminal/di/AppModule.kt`

```kotlin
fun palmBiometricManager(context: Context): PalmBiometricManager {
    return PalmBiometricManagerImpl(context, AppDatabase.getInstance(context).palmTemplateDao())
}
```

This **always** returns `PalmBiometricManagerImpl`. There is no `BuildConfig` or flag yet to choose mock vs vendor. When you add a real implementation (e.g. `VendorPalmBiometricManager`), change this to return that for device/production builds.

---

## 3) Exact lines to change (once you have the vendor SDK)

### A) Wire vendor **init** (PalmBiometricManagerImpl.kt, around line 34–37)

- After `modelsPath = PalmSdkInstaller.getModelsPath(context)`:
  - Call the vendor init API, e.g. `VeinshineSDK.init(context, modelsPath)` (or whatever the zip/jar provides).
- Remove or replace the log: `"Palm SDK init ...; vendor init not wired."` so you only log when still using mock.

### B) Wire vendor **open** (PalmBiometricManagerImpl.kt, around line 48–52)

- Before `open = true`:
  - Request USB permission if the device is USB: `UsbManager.requestPermission(device, pendingIntent)` then `UsbManager.openDevice(device)`.
  - Or call the vendor open API, e.g. `VeinshineSDK.openDevice()`.
- Set `open = true` only after the real open succeeds.
- Remove or replace the log: `"Palm device open (mocked); wire vendor open()."`.

### C) Wire **capture** (PalmBiometricManagerImpl.kt)

- **captureForEnroll** (lines 68–80): Replace the mock `mockRgb` / `mockIr` with the vendor API that returns RGB + IR feature bytes and quality (e.g. `VeinshineSDK.captureForEnroll(hand)`).
- **captureForIdentify** (lines 82–95): Same idea; use the vendor API for identify capture instead of `"mock_identify_rgb_..."`.

### D) Wire **identify / compare** (PalmBiometricManagerImpl.kt, lines 96–134)

- Either:
  - Use a vendor 1:N API, e.g. `VeinshineSDK.identify(rgbFeature, irFeature)` → matchId + score; then map matchId to `studentId` and return `IdentifyResult(studentId, confidence)`.
  - Or keep loading templates from `palmTemplateDao.getAllSync()` and replace `compareMock(capture, t)` with the vendor **compare** API (probe feature vs decrypted template → score). Use the same threshold (e.g. 0.7f) and return `IdentifyResult` or `Result.Error("No match", null)`.

### E) Optional: switch mock vs vendor in DI (AppModule.kt)

- Add `BuildConfig.USE_VENDOR_PALM_SDK` (see below).
- In `palmBiometricManager()`:
  - If `BuildConfig.USE_VENDOR_PALM_SDK` (or you have a real implementation): return the vendor-backed implementation.
  - Else: return `PalmBiometricManagerImpl` (current mock).

---

## 4) BuildConfig flag (optional)

In `app/build.gradle` under `android.defaultConfig`:

```groovy
buildFeatures {
    buildConfig true
}
defaultConfig {
    // ...
    buildConfigField "boolean", "USE_VENDOR_PALM_SDK", "false"
}
```

Then in `buildTypes.release` (or a flavor for the terminal device) set `USE_VENDOR_PALM_SDK` to `true` when you build with the real SDK. In `AppModule.palmBiometricManager()` use `BuildConfig.USE_VENDOR_PALM_SDK` to choose the implementation.

---

## 5) Hardware checklist (Android)

- **USB scanner**
  - `AndroidManifest.xml`: `<uses-feature android:name="android.hardware.usb.host" />`, and an `<intent-filter>` for `USB_DEVICE_ATTACHED` with a `device_filter.xml`.
  - At runtime: `UsbManager.requestPermission(device, pendingIntent)` then `UsbManager.openDevice(device)` before calling vendor open.
- **Vendor init**
  - Call the SDK init (with `modelsPath`) during app startup or before first scan (e.g. in `PalmBiometricManager.initialize()`).
- **Keystore**
  - The app already falls back to plain `SharedPreferences` when Keystore fails (e.g. `Crypto.prefs()` and token encryption). Ensure enrollment/templates are stored and read with the same path so "enrollment saved but no match" is not due to persistence.

---

## 6) What to look for in the vendor zip

- JAR/AAR or `.so` libraries: add to `app/libs` and reference in `app/build.gradle` (e.g. `implementation fileTree(dir: 'libs', include: ['*.jar', '*.aar'])`).
- Init function that takes context and model path.
- Open/close device (and USB permission flow if USB).
- Capture (enroll and identify) returning feature bytes (and quality if available).
- Identify 1:N or Compare 1:1 API (feature vs feature or feature vs template) returning a score or match id.

Once those are wired at the lines above, the same UI will drive the real scanner and you’ll get real matches instead of always "No match".

---

## 7) What "done correctly" looks like in logs

After wiring the real SDK, logs should change from:

- `PalmSdkBridge: no vendor SDK found, using mock`
- `Palm SDK init (mock, models path: ...)`
- `Palm device open (mock)`

to:

- `PalmSdkBridge: loaded Veinshine SDK (com.api.stream.PalmSdk, com.api.stream.Device)`
- `Vendor SDK init OK`
- `Palm SDK init (vendor, models path: ...)`
- `Palm device open (vendor)`
- `Capture success (vendor): rgbBytes=..., irBytes=..., quality=...`

If you still see "(mock)", the vendor JAR is not on the classpath or `VENDOR_SDK_CLASS_NAME` is wrong. To get exact wiring (class name + method names), run: `jar tf app/libs/vendor-sdk.jar | grep -i "sdk\|palm" | head -n 30` and match the bridge’s reflection calls to the vendor’s API.

---

## 8) Troubleshooting

### "Found duplicate classes" / "falling back to extracting from APK"

This wastes RAM and hurts startup; it is usually caused by **Apply Changes** or incremental install leaving a code cache overlay. Fix once and for all:

1. **Uninstall the app** from the device: `adb uninstall com.farmtopalm.terminal`
2. **(Optional)** Clear code cache if the app was debuggable:  
   `adb shell run-as com.farmtopalm.terminal rm -rf code_cache`  
   (Only works before uninstall; after uninstall the data is gone anyway.)
3. **Disable Apply Changes** for this project: Android Studio → Settings → Build, Execution, Deployment → Deployment → turn off "Apply code changes" / "Apply changes and restart activity" when testing on the palm device.
4. **Clean and rebuild**: Build → Clean Project, then Build → Rebuild Project, then install with **Run** (full install).

After a full install without overlay, the duplicate-class and "lock verification" warnings should stop.

### linker: "normalize_path - invalid input: '$$'ORIGIN"

Comes from the **vendor .so** (RPATH/RUNPATH in the native library). The linker ignores it; no app code change. If you build the native lib yourself, fix the rpath to `$ORIGIN` (no quotes). Otherwise safe to ignore.

### KeyStore / EncryptedSharedPreferences failed

On some devices (e.g. embedded terminals) Keystore returns "Unknown error" or -1000. The app **falls back to plain SharedPreferences** and still encrypts template data with an in-process key. No code change needed; logs are kept minimal. For maximum compatibility we use `MasterKey.KeyScheme.AES256_GCM` only (no StrongBox).
