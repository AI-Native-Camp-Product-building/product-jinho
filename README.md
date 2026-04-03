# Bugside

See all your Next.js, Supabase, and Vercel errors in one terminal pane — no browser switching.

```
npm run dev 2>&1 | npx bugside dev
```

![Bugside TUI screenshot](https://bugside.vercel.app/og.png)

---

## Why

When building with Next.js + Supabase + Vercel, errors are scattered across:
- Terminal (Next.js runtime/compile errors)
- Browser console (client-side errors, Supabase API failures)
- Vercel dashboard (build/function errors)

Bugside consolidates all three into one always-visible terminal panel, so you never lose focus.

---

## Install

```bash
npm install -g bugside
# or use without installing
npx bugside dev
```

---

## Usage

### Pipe from `next dev`

```bash
npm run dev 2>&1 | npx bugside dev
```

### With `vercel dev`

```bash
vercel dev 2>&1 | npx bugside dev
```

Bugside reads stdin and automatically opens a proxy on port `3001`. Browse your app at `http://localhost:3001` instead of `localhost:3000` to capture browser and Supabase errors.

---

## What it captures

| Source | Errors |
|--------|--------|
| **Next.js** | Runtime errors (`⨯`), compile failures, hydration mismatches, type errors |
| **Supabase** | API errors (4xx/5xx from `/rest/v1/` requests), network failures |
| **Vercel** | Function errors, HTTP 5xx, build failures |

---

## How it works

1. **Stdin parser** — strips ANSI codes and parses Next.js/Vercel log lines using official log symbols (`⨯` `✓` `⚠`)
2. **Browser proxy** — runs on `:3001`, injects a script that intercepts `window.fetch` and `window.onerror`, sends errors to a local collector
3. **Supabase proxy** — same proxy intercepts Supabase REST API calls and reports 4xx/5xx responses
4. **TUI** — renders errors in a fullscreen Ink (React) panel with source badges, timestamps, and file locations

---

## Options

```
bugside dev [options]

Options:
  -p, --port <port>  Next.js dev server port (default: 3000)
  -h, --help         display help
```

---

## Landing page

[bugside.vercel.app](https://bugside.vercel.app)
