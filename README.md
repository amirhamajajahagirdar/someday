# Someday

Someday lets people write a note, choose a future date to remember, and share it through one server. The app uses Node.js 24 or newer, Node's built-in HTTP server and SQLite support, and no npm dependencies. Notes are stored in the server database at `data/someday.db`; the browser does not use local storage.

## Start on this PC

1. Install Node.js 24 or newer from [nodejs.org](https://nodejs.org/).
2. Open Command Prompt in the Someday folder and check `node --version`.
3. Double-click `start-someday.cmd`, or run `npm start` in that folder.
4. Open [http://127.0.0.1:8000](http://127.0.0.1:8000).

No `npm install` is needed. Keep the launcher window open while using the app. If port 8000 is busy, run `node server.mjs --host 127.0.0.1 --port 8001` and open [http://127.0.0.1:8001](http://127.0.0.1:8001).

## Let other devices on your Wi-Fi connect

1. Run `ipconfig` in Command Prompt and find the **IPv4 Address** under the Wi-Fi adapter.
2. Double-click `start-someday-lan.cmd`, or run `npm run lan`.
3. On another device on that Wi-Fi, open `http://YOUR-PC-IP:8000`, using the address from step 1.
4. In Windows Defender Firewall, allow Node.js for **Private networks only**. Do not allow Public networks.

Each connected device reads and writes to the same SQLite database on the server PC. New letters appear in **Your letters** with their opening dates. Letter content stays sealed for all regular visitors until that date; the `/admin` dashboard requires the admin password and can preview sealed letters, including their saved creation timestamps.

## Access and privacy

Anyone who can reach the site can create letters and read them after their opening date. The `/admin` dashboard is password-protected and has a sign-in rate limit; its session expires after 12 hours or when you sign out. The password is verified using a salted scrypt hash, and the browser session uses an HTTP-only, SameSite cookie. The app uses HTTP, so the password and note traffic are not encrypted in transit; only use it on a trusted local network. Do not expose this build to the public internet or put private notes in it.

Public hosting is not configured. A public version should add sign-in and authorization if notes are meant to be private, and should use HTTPS plus persistent storage (SQLite volume or a managed database). Free hosting plans may discard local files, so confirm persistent database storage before depending on a provider. This build does not provide cloud sync or public hosting setup.

## Commands

```cmd
npm start       :: local-only, 127.0.0.1:8000
npm run lan     :: trusted LAN, 0.0.0.0:8000
npm test        :: automated tests
```
