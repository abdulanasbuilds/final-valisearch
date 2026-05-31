## Cloudflare “one-click” deploy checklist (non-technical)

This app is set up so it can **deploy successfully even if you haven’t added API keys yet**.
When keys are missing, the app will show clear “Setup required” messages instead of crashing.

---

## 1) Cloudflare Pages settings

When Cloudflare asks for build settings:

- **Build command:** `npm run build`
- **Build output directory:** `.output/public`

---

## 2) Minimum environment variables (recommended)

If you want signup/login to work, add these in Cloudflare Pages → Settings → Environment variables:

**Public (normal env vars):**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_URL` (your deployed URL, e.g. `https://your-app.pages.dev` or your custom domain)

**Secret (keep private):**
- `SUPABASE_SERVICE_ROLE_KEY`

If you skip these, the marketing pages can still load, but login/registration will show “Setup required”.

---

## 3) Payments (add later)

You asked for Stripe (default) + Flutterwave (fallback). You can add these later:

**Stripe (Secrets):**
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_PRO_MONTHLY`
- `STRIPE_PRICE_PRO_ANNUAL`
- `STRIPE_PRICE_BUSINESS_MONTHLY`
- `STRIPE_PRICE_BUSINESS_ANNUAL`

**Flutterwave (Secrets):**
- `FLUTTERWAVE_SECRET_KEY`
- `FLUTTERWAVE_CURRENCY` (example: `USD`)

If you don’t add them yet, upgrade buttons will show a simple “Payments are not configured yet” message.

---

## 4) AI / research APIs (add later)

The analysis engine is intentionally blocked until these are set (so users don’t trigger broken jobs):

**Secrets:**
- `OPENROUTER_API_KEY`
- `TRIGGER_PROJECT_ID`
- `TRIGGER_SECRET_KEY`

When these are missing, the app will still run, but starting an analysis will show a clear setup message.

---

## 5) Quick smoke test after deploy (2 minutes)

After Cloudflare says “Deployment successful”, check:

1. Open the homepage (`/`) → should load.
2. Open `/pricing`, `/privacy`, `/terms` → should load.
3. If Supabase env vars are set: try `/register` and create an account.
4. If AI keys are NOT set yet: try starting an analysis → you should get a friendly “not configured yet” message (not a crash).

