# Brain in a Browser

A one-page MVP for privacy-first, in-browser AI chat using React, Vite, Tailwind CSS, WebGPU, and `@mlc-ai/web-llm`.

## Highlights

- Runs a single local model in the browser with WebGPU
- Shows capability, warmup, cache, and streaming states in the UI
- Keeps one active conversation in memory with stop, retry, reset, and clear-cache utilities
- Surfaces privacy boundaries clearly for demos, classrooms, and shared displays

## Development

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run preview
```

## GitHub Pages

This project is configured to deploy to GitHub Pages from GitHub Actions.

```bash
npm run build:pages
```

- Production builds read `BASE_PATH` first, then fall back to the current GitHub repository name from `GITHUB_REPOSITORY`.
- For this repository, `npm run build:pages` emits a build that serves correctly from `/brain-in-a-browser/`.
- The workflow file is `.github/workflows/deploy-pages.yml`.
- In the GitHub repository settings, set Pages to use `GitHub Actions` as the source.
