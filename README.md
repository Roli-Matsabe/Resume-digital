# Roli Matsabe — digital resume

A one-page, interactive 3D resume for recruiters and hiring managers. It tells Roli’s story across digital growth, digital transformation, customer experience, and marketing technology, using the supplied CV as the source for roles, dates, qualifications, contact details, and results.

## Develop

Use Node.js 24 (see `.nvmrc`) and npm.

```sh
npm ci
npm run dev
```

Vite starts on port 5173 by default. In the cloud workspace, if your home directory is read-only, install with `npm ci --cache /tmp/resume-digital-npm-cache`.

## Build and check

```sh
npm run build
npm run preview -- --port 4173 --strictPort
```

The production site is generated in `dist/`. All fonts, scripts, the 3D engine, and the downloadable PDF are served locally. No API keys, database, paid services, or runtime external requests are required.

Browser tests cover desktop and mobile, real WebGL rendering, scene rotation, motion preferences, WebGL fallback, education tabs, project dialogs, contact links, the PDF download, printing, and automated accessibility checks.

```sh
# Only if Chromium is not already available:
npx playwright install chromium

npm run build
npm test
npm run format:check
```

Tests use `/usr/bin/chromium` when available, or Playwright’s managed browser otherwise. To use another installed Chromium, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. Tests start and stop a production preview server on port 4173. One desktop test is intentionally skipped because it covers the mobile-only navigation button.

## Edit the resume

- `src/content.js`: career history, achievements, education, skills, and contact links. Metrics are attributed to their source employer.
- `src/main.js`: page structure and the Understand → Connect → Grow narrative.
- `src/style.css` and `src/story.css`: responsive design and print styles.
- `src/scenes.js`: Three.js orbital models; local geometry with no external assets.
- `src/story.js`: scroll-linked chapters, keyboard controls, and motion preferences.
- `public/Roli-Matsabe-CV.pdf`: original downloadable CV. Replace this file when the resume changes.

The email and telephone buttons open the visitor’s email or phone application. LinkedIn opens the supplied profile. There is no contact-form backend. The website includes the contact details from the CV; update `src/content.js` and the PDF together when those details change.

## Accessibility and performance

The page supports keyboard navigation, labelled controls, focus restoration after dialogs, a skip link, and a print layout. Both experience and education appear when printed, regardless of which tab is open. “Pause motion” stops automatic 3D animation; the system’s reduced-motion preference is respected by default. A static orbital illustration preserves the design when WebGL is unavailable.

The 3D engine loads in a separate chunk after the resume renders. Its animation pauses when the scene or document is out of view, and device pixel ratio is capped to limit GPU work. An automated accessibility audit is included; it is not a substitute for every assistive-technology check.

## Hosting

The **Deploy resume website** GitHub Actions workflow builds and publishes the site to GitHub Pages. Enable it once:

1. Open the repository’s **Settings → Pages**. Under **Build and deployment**, set **Source** to **GitHub Actions**.
2. Open **Actions → Deploy resume website → Run workflow**, choose `main`, and click **Run workflow**.
3. After the workflow succeeds, open the website URL shown in its deployment summary. With the default project settings, the address is `https://roli-matsabe.github.io/Resume-digital/`.

Subsequent pushes to `main` automatically update the site. The first deployment requires GitHub Pages to be enabled in repository settings; committing the workflow alone does not enable hosting. The site and downloadable CV include the contact details supplied in the resume.

The relative Vite base supports hosting below a repository path. Other static hosts can also serve `dist/`; use `npm run build` as the build command and `dist` as the output directory. Publishing the cloud development environment is separate from publishing this website.

## Cloud workspace

Work in `/workspace/Resume-digital`. Each cloud task is already isolated; use this checkout and do not create another Git worktree unless requested. Run `npm ci --cache /tmp/resume-digital-npm-cache` when dependencies need refreshing, then `npm run dev -- --port 5173 --strictPort`. Servers must be restarted in a new task; installed dependencies and files can be retained in the environment snapshot.
