# FarmToPalm

FarmToPalm is an Android terminal app that integrates with a Veinshine palm scanner SDK and NFC, plus a backend API and web dashboard for enrollment, authentication, attendance, and meal events.

## Monorepo structure

- **terminal-android/** – Android app (Kotlin, Jetpack Compose, Room, WorkManager)
- **backend/** – Node.js + Fastify + Postgres API
- **dashboard/** – Next.js web dashboard

## Prerequisites

- **Android:** Android Studio, JDK 11+, Android SDK 26+
- **Backend/Dashboard:** Node.js 18+, Docker & Docker Compose
- **SDK:** Extract `palm-android-sdk-veinshine-v1.3.14-L.zip` (see below)

---

## 1. Backend (Docker Compose)

From repo root:

```bash
cd backend
cp .env.example .env
# Edit .env: DATABASE_URL, JWT_SECRET, BIOMETRIC_ENC_KEY, etc.
npm install
npm run migrate
npm run seed
```

Run with Docker:

```bash
# From farm-to-palm/
docker compose up -d
# Backend: http://localhost:3000
# Postgres: localhost:5432
```

Or run backend locally (Postgres still in Docker):

```bash
docker compose up -d postgres
cd backend && npm run dev
```

---

## 2. Dashboard

```bash
cd dashboard
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:3000
npm install
npm run dev
```

Open http://localhost:3001 (or port shown). Default admin: `admin@farmtopalm.local` / `Admin123!`.

---

## 3. Android Terminal App

### SDK assets (required for real palm hardware)

Extract from **`palm-android-sdk-veinshine-v1.3.14-L.zip`** (e.g. at `/mnt/data/` or your path):

```bash
# From farm-to-palm/
./scripts/extract-sdk.sh /path/to/palm-android-sdk-veinshine-v1.3.14-L.zip
```

Or manually:

- **JAR/AAR** → `terminal-android/app/libs/`
- **.so** → `terminal-android/app/src/main/jniLibs/arm64-v8a/` (and other ABIs if present)
- **Model files** → `terminal-android/app/src/main/assets/models/`

Without the SDK, the app runs with “SDK not wired” and mock enrollment/identify.

### Build and run

```bash
cd terminal-android
./gradlew assembleDebug
# Install: ./gradlew installDebug
# Or open in Android Studio and Run
```

First launch: enter activation code **`FARM-PALM-001`** (after running backend seed) and API base URL (e.g. `http://10.0.2.2:3000` for emulator). Set admin PIN when prompted (default first-time PIN: **1234**).

### Physical device (palm reader): "Test connection" fails but Mac browser works

If the **Mac browser** can open `http://<YOUR-MAC-IP>:3000/` but the **palm device** gets `ConnectException` / "Failed to connect", the problem is the **network path**, not the app.

Do these in order:

1. **Same network**
   - Palm device and Mac must be on the **same Wi‑Fi** (not Mac on Ethernet and device on Wi‑Fi—many routers block Wi‑Fi ↔ Ethernet).
   - **Quick test:** Connect **both Mac and palm device to your phone hotspot**, then try "Test connection" again. If it works → your router is isolating clients; fix router (turn off "client/AP isolation") or run backend where the device can reach it.

2. **Mac firewall**
   - **System Settings → Network → Firewall** (or Security & Privacy → Firewall).
   - Turn firewall **off temporarily** and try "Test connection" again.
   - If it works, turn firewall back on and add an **allow** rule for **Node** (or the terminal process that runs `npm run dev`).

3. **Confirm backend is reachable on the LAN**
   - On your Mac: `curl -i http://127.0.0.1:3000/` and `curl -i http://<YOUR-MAC-IP>:3000/` (e.g. `192.168.1.128`).
   - Both should return `200` and JSON. If only `127.0.0.1` works, the server was bound to localhost only—restart with the backend that listens on `0.0.0.0` (this repo’s backend already does).

4. **Optional: test from another device**
   - From a **phone** on the same Wi‑Fi, open `http://<YOUR-MAC-IP>:3000/health` in the browser.
   - If the phone **cannot** open it → router/firewall/interface issue (same as above).
   - If the phone **can** open it but the palm device still cannot → check palm device Wi‑Fi (e.g. not on Guest Wi‑Fi) and any device-specific firewall/restrictions.

---

## 4. Environment

- **backend/.env** – See `backend/.env.example` (DB, JWT, encryption keys).
- **dashboard/.env.local** – `NEXT_PUBLIC_API_URL` pointing to backend.

---

## 5. Features (MVP)

- **Enrollment** – Register palm (and optional NFC) per student; admin PIN gated.
- **Authentication** – Identify student by palm (local 1:N).
- **Attendance** – Palm match → attendance event; offline-first, syncs to backend.
- **Meals** – NFC tap (and optional palm) → meal event; configurable FAST vs SECURE.
- **Offline sync** – WorkManager every 5 min; bulk upload with retry.
- **Dashboard** – Daily totals, trends, exceptions, terminal status, CSV export.

---

## 6. Multi-terminal

Designed for one terminal initially; backend and schema support multiple terminals and schools. Terminal identity is set at activation.
