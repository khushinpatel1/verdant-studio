# Cloudflare Pages — Deploy Runbook

Pastures is a fully static Astro build. No SSR adapter is needed.
`npm run build` produces a complete `dist/` folder ready to upload.

---

## One-time setup (Cloudflare dashboard)

1. Log into [dash.cloudflare.com](https://dash.cloudflare.com) and go to **Workers & Pages → Create → Pages → Connect to Git** (or "Upload" for manual).
2. Connect your GitHub/GitLab repo (you'll need to push a remote first — see "Push a remote" below).
3. Set the build configuration:

   | Setting | Value |
   |---|---|
   | Framework preset | Astro |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | *(leave blank — project root)* |
   | Node version | `20` (set via env var `NODE_VERSION=20`) |

4. Click **Save and Deploy**. First deploy takes ~1 min.

---

## Push a remote (do this first)

```bash
# From inside ~/Dev/pastures — uppercase Dev, not lowercase
git remote add origin git@github.com:YOUR_USERNAME/pastures.git
git push -u origin main
```

Then connect the repo in the Cloudflare dashboard above.

---

## Manual deploy (no CI, `wrangler` CLI)

If you prefer to deploy from the command line without connecting git:

```bash
# One-time install (already in your global node if you have wrangler)
npm install -g wrangler

# Authenticate (opens browser)
wrangler login

# Build + deploy
npm run build
npx wrangler pages deploy dist --project-name=pastures
```

Wrangler will print the deployed URL (e.g. `https://pastures.pages.dev`).

**Note: YOU must run this command with your own Cloudflare credentials. The project is
deploy-ready but only the account owner can trigger the actual publish.**

---

## Custom domain

In Cloudflare Pages → your project → **Custom domains** → Add domain.
Point your domain's DNS to the Pages deployment (Cloudflare handles the cert automatically).

---

## Environment variables

This project has no required env vars at build time.
If you add server-side secrets later (e.g. a form handler), set them in
Pages → Settings → Environment variables.

---

## What's in `public/`

- `_headers` — security headers + long-term cache for hashed `_astro/` assets.
- `_redirects` — placeholder file; add 301 redirects here as the site grows.

Both files are copied verbatim into `dist/` by Astro and interpreted by
Cloudflare Pages automatically.
