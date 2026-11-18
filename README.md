# G-City

G-City is a catalog of static tools for creating tabletop RPG settings and adventures. The home page offers a Portuguese/English language toggle and passes the selected language to the generators. Each tool is maintained in its own repository, included here as a Git submodule.

## Available generators

| Generator | What it creates |
| --- | --- |
| [Spectacular Settlements Generator](./generators/spectacular-settlements/index.html) | Trading posts, villages, cities, capitals, and fortresses, as well as encounters, rumors, taverns, and other extras. It has an English and Portuguese interface, a roll and modifier log, and TXT and PDF export. |
| [Forbidden Lands Generator](./generators/forbidden-lands/index.html) | Villages, dungeons, and castles. It offers language switching, TXT export, a roll log, and field rerolls. |

## Run locally

Clone the repository and initialize its submodules:

```bash
git clone --recurse-submodules https://github.com/Tadeu-Raphael/gcity.github.io.git
cd gcity.github.io
```

If you have already cloned the repository without submodules, initialize them with:

```bash
git submodule update --init --recursive
```

Open `index.html` directly in your browser. To serve the project over local HTTP, you can also start a server from the root directory:

```bash
python -m http.server
```

Then open <http://localhost:8000>.

## Project structure

```text
├── index.html                 # Catalog and home page
├── assets/icons/lucide/       # Local subset of Lucide SVG icons
├── css/
│   ├── landing.css            # Home page styles
│   └── paper-ui.css           # Shared paper-inspired visual theme
├── js/
│   └── ui-icons.js            # Replaces interface emojis with Lucide icons
└── generators/
    ├── spectacular-settlements/  # Settlements generator submodule
    └── forbidden-lands/          # Forbidden Lands generators submodule
```

The generators are independent projects and include local copies of the visual theme and icons, along with their respective license notices. None of them load layouts, CSS, scripts, or images from the root repository, so each submodule can run on its own or within G-City's GitHub Pages site. See each project's README for details about its pages and features. To update the catalog and submodules:

```bash
git pull --recurse-submodules
git submodule update --init --recursive
```

## Appearance

The catalog and generators use the local `css/paper-ui.css` theme, adapted from the paper-inspired visual style of [Ephemera](https://github.com/kerrshift/ephemera). The icons use a local subset of Lucide SVGs, which works on GitHub Pages and with local files without a CDN. The integration keeps the HTML, CSS, and JavaScript static: it requires no React, Tailwind, external services, or build steps. License notices are available in [`licenses/EPHEMERA-MIT.txt`](./licenses/EPHEMERA-MIT.txt) and [`licenses/LUCIDE-ISC.txt`](./licenses/LUCIDE-ISC.txt).
