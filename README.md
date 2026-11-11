# projects — landing pages

This repo hosts the marketing / landing pages for my projects. Each project is a **self-contained [Astro](https://astro.build) site** in its own directory under `src/`, with its own toolchain and its own deploy workflow, published as a subpath of `https://mintware-de.github.io`.

## Layout

```
├── .github/workflows/<project>.yml   # one Pages workflow per project
└── src/
    └── <project>/                    # a standalone Astro site
        ├── README.md                 # project-specific docs (commands, structure, config)
        ├── astro.config.mjs
        └── ...
```

| Project | Source | Live at |
| --- | --- | --- |
| [catalyst_builder](src/catalyst_builder/) | `src/catalyst_builder/` | [mintware-de.github.io/catalyst_builder/](https://mintware-de.github.io/catalyst_builder/) |

Each project directory is fully self-contained — `package.json`, lockfile, config, sources. Everything about a specific site (commands, file layout, i18n, deployment details) lives in its own README.

## Conventions

Every site follows the same shape so they stay interchangeable:

- **Static output** — `output: 'static'`, built to `dist/` inside the project (git-ignored).
- **Subpath hosting** — the repo is a user site (`*.github.io`), so each project sets `base: /<project>` in `astro.config.mjs` and its workflow stages the artifact nested at that path. The URL prefix appears in exactly three places per project: `astro.config.mjs` (`site`/`base`), `public/robots.txt` (`Sitemap:` line), and the workflow's staging path.
- **One workflow per project** — `.github/workflows/<project>.yml` builds from `src/<project>/` and uploads the Pages artifact; repo **Pages → Source** is **GitHub Actions**.
- **Multi-locale sites** roll their own `[lang]` routing via `getStaticPaths` with English as fallback (both page-level `i18n.fallback` and key-level merge), and keep an i18n parity check wired into `npm run check`.

## Adding a new project

1. Create `src/<project>/` as a fresh Astro site (copying an existing project is the fastest start) and set `base: /<project>`.
2. Add `public/robots.txt` with the matching `Sitemap:` line.
3. Add `.github/workflows/<project>.yml` — copy an existing one and swap the project name in the paths.
4. Write a `README.md` inside the project (that's the canonical doc for it) and add a row to the table above.

## Working on a project

All commands run inside the project directory:

```sh
cd src/<project>
npm install
npm run dev      # dev server with hot reload
npm run check    # type check (+ any project-specific checks)
npm run build    # static build to dist/
```
