# Pacific Bank

Pacific Bank is a university assignment MVP for a calm, trustworthy finance application.

## Architecture

| Layer | Technology |
| --- | --- |
| Frontend | React 19 + TypeScript, built with Vite, styled with Tailwind CSS |
| Backend | Python FastAPI serverless function (`api/index.py`) |
| Database | Supabase (Postgres + Auth). The API talks to Supabase with the anon key for auth and the service key for database writes |
| Deploy | Vercel serves the built frontend and rewrites `/api/*` to the Python function (`vercel.json`) |

The frontend never talks to Supabase directly; it calls the FastAPI endpoints through
`src/api/client.ts`. In local development the Vite dev server proxies `/api` to
`http://127.0.0.1:8000`, so no CORS middleware is required. In production the frontend and
API share one Vercel domain.

## Environment variables (backend only)

Copy `.env.example` to `.env` and fill in your Supabase values:

```bash
cp .env.example .env
```

| Variable | Used by | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | `api/index.py` | Supabase project URL |
| `SUPABASE_ANON_KEY` | `api/index.py` | Verifies auth tokens (safe for the client, but still kept server-side here) |
| `SUPABASE_SERVICE_KEY` | `api/index.py` | Server-only key for signup and database reads/writes |

These are read by the Python process only and must never be shipped to the browser or
committed to git (`.env` is git-ignored).

## Folder structure

```
.
├── api/
│   └── index.py          FastAPI app: /api/signup, /api/login, POST+GET /api/applications
├── public/               Static assets
├── src/
│   ├── api/client.ts     Typed fetch helpers + ApiError for the FastAPI endpoints
│   ├── components/       Reusable UI (Alert, AppShell, Button, FormInput, FormSection,
│   │                     SpotlightCard, StepProgress)
│   ├── screens/          LoginScreen, PersonalDetailsScreen, EmploymentDetailsScreen,
│   │                     FinancialInformationScreen, SuccessScreen
│   ├── utils/validation.ts  Shared client-side validation + formatting helpers
│   ├── App.tsx           Step router / application state
│   └── main.tsx          React entry point
├── index.html            Vite entry, sets the "Pacific Bank" document title
├── vercel.json           Rewrites /api/* to the Python function
└── vite.config.ts        Dev server with /api -> 127.0.0.1:8000 proxy
```

## Run locally

Frontend (terminal 1):

```bash
npm install
npm run dev        # http://localhost:5173
```

Backend (terminal 2):

```bash
pip install -r requirements.txt
uvicorn api.index:app --reload --port 8000
```

The Vite dev server proxies `/api` to the FastAPI process, so browse to
http://localhost:5173 and the whole app works end to end.

## Deploy on Vercel

1. Push the repository to GitHub/GitLab.
2. Import the project in Vercel. It is auto-detected as a Vite site.
3. Add the three environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_KEY`) in Project Settings → Environment Variables, for
   Production and Preview.
4. Keep the default build command (`npm run build`) and output directory (`dist`).
5. `vercel.json` already routes `/api/*` to `api/index.py`, so no extra configuration is
   needed. Redeploy after changing environment variables.

## App journey

Login / Create account → Personal Details → Employment Details → Financial Information → Success Confirmation

## Component reuse

| Component | File | Used on |
| --- | --- | --- |
| `Button` | `src/components/Button.tsx` | `LoginScreen`, `PersonalDetailsScreen`, `EmploymentDetailsScreen`, `FinancialInformationScreen`, `SuccessScreen` |
| `FormSection` | `src/components/FormSection.tsx` | `LoginScreen`, `PersonalDetailsScreen`, `EmploymentDetailsScreen`, `FinancialInformationScreen`, `SuccessScreen` |
| `FormInput` | `src/components/FormInput.tsx` | `LoginScreen`, `PersonalDetailsScreen`, `EmploymentDetailsScreen`, `FinancialInformationScreen` |
| `SpotlightCard` | `src/components/SpotlightCard.tsx` | `LoginScreen` (trust message), `SuccessScreen` (application summary) |

Supporting components: `Alert` (Login, Financial, Success), `StepProgress` (the three form
screens), `AppShell` (all five screens).

## Prompts used

The following prompts guided the build, in order:

1. Scaffold a calm, trustworthy finance MVP named "Pacific Bank" with Vite, React,
   TypeScript and Tailwind, plus a FastAPI backend and Supabase auth.
2. Add a five-screen journey (login/signup → personal → employment → financial → success)
   with a shared app shell, progress indicator, required-field validation and Back
   navigation.
3. Extract reusable components (`Button`, `FormSection`, `FormInput`) and use each one on
   at least two screens.
4. Add a 21st.dev-style `SpotlightCard` with a mouse-following glow, an optional eyebrow
   label and composable children, used on the Login and Success screens.
5. Harden the API: no CORS middleware, generic error messages (never raw exception text),
   `HTTPBearer(auto_error=False)` with a 401 for missing tokens, date-of-birth validation
   (no future dates, applicants must be 18+) on both client and server, and no logging of
   passwords, tokens or keys.
