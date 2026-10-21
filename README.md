# Brain in a Browser

A classroom-friendly AI demo app designed for teachers who want to show students how local, in-browser AI works without relying on a traditional backend chat service.

This app runs a small language model directly in the browser using WebGPU and `@mlc-ai/web-llm`. It is built to be easy to explain on a projector, easy to test on student devices, and clear about what stays local.

## Why Teachers Might Use It

- Demonstrate what "AI running on your own device" actually means
- Compare local inference with cloud-based chat tools in a lesson
- Show students model warmup, download, caching, and streaming behavior in real time
- Use a simple single-page interface that avoids distracting product chrome
- Support privacy discussions with a visible local-only banner and no server-side prompt relay

## What Students See

- A clear header showing model, status, and cache state
- An always-visible privacy banner explaining that prompts stay on device
- A live progress bar during first-time model warmup or download
- A single chat thread with streamed responses
- Simple controls for stop, retry, reset chat, and clear cache

## Classroom Notes

- Best for recent Chromium-based browsers such as Chrome or Edge
- Requires WebGPU support and hardware acceleration
- First launch may take longer because model files need to download
- Later launches should feel faster because the browser caches model assets locally
- The current MVP keeps one conversation in memory and does not provide student accounts, analytics, or cloud sync

## Privacy and Safety

- Prompts are processed locally in the browser
- No server-side prompt storage is included in this MVP
- Model files are downloaded once and then cached by the browser
- Teachers should still remind students that copied or exported text is no longer local-only

## Running It Locally

If you want to test the app before class:

```bash
npm install
npm run dev
```

Then open the local Vite URL in a browser that supports WebGPU.

## Building for Production

If you want a production build for hosting or internal review:

```bash
npm run build
npm run preview
```

## Deploying to GitHub Pages

This project is already configured for GitHub Pages through GitHub Actions, which is useful if you want a shareable classroom demo link.

Build the Pages version locally with:

```bash
npm run build:pages
```

Important details:

- Production builds always use the `/brain-in-a-browser/` base path
- Production bundles are written to the `docs/` directory
- The deployment workflow lives at `.github/workflows/deploy-pages.yml`
- In GitHub repository settings, set Pages to use `GitHub Actions` as the source

## GitHub Pages

To publish updates:

1. Push changes to the `main` branch.
2. Let GitHub Actions run the Pages workflow.
3. Open the published Pages site and test it in the same browser setup you plan to use in class.

## Suggested Teaching Use

- Start by asking students where they think the model is running
- Show the privacy banner before sending the first prompt
- Point out the first-run warmup and cached follow-up loads
- Use a short prompt so students can observe streaming clearly
- Compare the experience with a cloud AI product and discuss tradeoffs
