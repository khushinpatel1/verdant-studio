# Cloudflare Pages — Deploy Runbook

> Historical record. Do not execute from this file. Current state lives in `CLAUDE.md` and `.github/workflows/deploy.yml`.

This repo (formerly `pastures`, renamed to `verdant-studio` in the 2026-06-09 studio
reset — see `_archive/MANIFEST.md` in partnership for CF rename status) is a fully
static Astro build. No SSR adapter is needed. `npm run build` produces a complete
`dist/` folder ready to upload.

---

## Live deployments (as of 2026-06-06)

Account: `khushinpatel1@gmail.com` (`2c60b50d5999c6a3f8f8290cf813e6ac`).
Deployed via `wrangler pages deploy` (direct upload, **not** git-connected).

| What | Link | Notes |
|---|---|---|
| Combined showcase (all skins) | https://pastures.pages.dev | `/`, `/feral`, `/meadow`, `/verdant` |
| **Verdant** (own link) | https://verdant-1wg.pages.dev | newest/strongest skin |
| **Feral** | https://feral-6ze.pages.dev | |
| **Ridge** | https://ridge-98n.pages.dev | |
| **Verda** (Meadow) | https://verda-5xz.pages.dev | |
| Old standalone Verdant (separate repo) | https://verdant.khushinpatel1.workers.dev | SUPERSEDED; kept online |

**Per-skin "own link" technique:** each skin has its own Pages project deploying the
same `dist`, with the root `index.html` swapped to that skin's homepage so the bare
domain lands on it. wrangler dedupes assets by hash, so only `index.html` re-uploads:

```bash
npm run build
cp dist/index.html /tmp/_root.html                 # ridge IS the root already
npx wrangler pages deploy dist --project-name=ridge   --branch main
cp dist/feral/index.html   dist/index.html && npx wrangler pages deploy dist --project-name=feral   --branch main
cp dist/meadow/index.html  dist/index.html && npx wrangler pages deploy dist --project-name=verda   --branch main
cp dist/verdant/index.html dist/index.html && npx wrangler pages deploy dist --project-name=verdant --branch main
cp /tmp/_root.html dist/index.html                 # restore
```

> Cloudflare appends an anti-squatting hash suffix to new `.pages.dev` names
> (`ridge-98n`, `feral-6ze`, …). These are the permanent URLs; use custom domains for clean names.

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
# From inside ~/Dev/verdant-studio — uppercase Dev, not lowercase
git remote add origin git@github.com:khushinpatel1/verdant-studio.git
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
npx wrangler pages deploy dist --project-name=verdant-studio
```

Wrangler will print the deployed URL (e.g. `https://verdant-studio.pages.dev`).

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
