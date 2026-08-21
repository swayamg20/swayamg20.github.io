# Swayam Gupta

Personal portfolio for [swayamg20.github.io](https://swayamg20.github.io), built with React, Vite, and React Router.

## Local development

```bash
npm ci
npm run dev
```

The development server starts on the URL printed by Vite.

## Verification

```bash
npm run lint
npm run build
npm run preview -- --host 127.0.0.1 --port 3002
REACT_RESOLUTION_BASE_URL=http://127.0.0.1:3002 npm run qa:resolution:react
```

The browser QA covers the public page matrix at desktop, mobile, and narrow viewports, along with internal navigation, theme persistence, and the once-per-session intro.

## Deployment

Pushes to `main` run [the GitHub Pages workflow](.github/workflows/deploy.yml). It installs from the lockfile, builds the Vite application, creates direct-load fallbacks for the legacy and article URLs, and deploys `dist/` to GitHub Pages.
