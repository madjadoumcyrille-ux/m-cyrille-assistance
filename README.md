# M. Cyrille assistance

A mobile-friendly multilingual assistant interface created for Cyrille, supporting English, French, and Arabic.

## Features in this starter
- Responsive chat interface for phones and desktop
- Server-side AI endpoint (the API key stays on the server)
- Demo mode if no AI key is configured
- Browser speech recognition and read-aloud where supported
- English/French/Arabic selection, with basic Arabic right-to-left layout
- Local chat history and preferences stored in the browser
- External web-search handoff
- Clearly simulated smart-device controls
- Web app manifest

## Run locally
1. Install Node.js LTS from https://nodejs.org/
2. Download the repository.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Optionally add your AI provider key to `OPENAI_API_KEY` in `.env`.
6. Run `npm start` and open http://localhost:3000.

Do not commit `.env` or paste an API key into HTML/JavaScript. API usage may incur charges. The default model is `gpt-4.1-mini`; change `OPENAI_MODEL` to a model available to your account.

## Deploy using Render
1. Sign in to https://render.com/ and choose **New → Blueprint** (or create a Web Service).
2. Connect GitHub and select `madjadoumcyrille-ux/m-cyrille-assistance`.
3. If using Blueprint, Render reads `render.yaml`. Otherwise set build command `npm install`, start command `npm start`.
4. In the service's Environment settings, add `OPENAI_API_KEY` as a secret. Optionally add `OPENAI_MODEL`.
5. Deploy and open the public URL Render provides.

The app runs in demo mode until a valid server-side key is configured. Never commit secrets.

## Important limitations
- This is a web app, not a native Android APK or iOS app package.
- Voice features depend on browser support and microphone permission.
- Web search opens an external search engine; it does not return integrated sourced results.
- Smart-device controls are simulations only and do not control real hardware.
- Chat and preferences are saved locally in the current browser; no user account/cloud sync is included.
- Before a public launch, consider authentication, rate limiting, privacy disclosures, and usage limits.
