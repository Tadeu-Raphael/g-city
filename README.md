# Gcity - The RPG City Generator

This is an RPG city and urban generator developed during [Backdrop Build](https://backdropbuild.com/).

Bootstrap 5.2.3 is included locally in `vendor/bootstrap/`: `css/bootstrap.min.css` provides the styles, and `js/bootstrap.bundle.min.js` provides JavaScript components (including Popper). Every page loads these local files, so the framework does not need a CDN connection at runtime.

## Shared page layout

The reusable site header and footer are maintained in `components/header/header.html` and `components/footer/footer.html`. Each page reserves `#site-header` and `#site-footer` placeholders, and `js/layout.js` loads the matching fragments.

Because the fragments are loaded with `fetch`, run the site through an HTTP server rather than opening HTML files directly. For local testing, run `python -m http.server` from the project directory and open `http://localhost:8000`.

The town, village, and trading post generators each include an **Exportar TXT** button that downloads the current results shown on that page, including the **Informações** summary.

Each generator page also ends with an **Informações** card. `js/generation-info.js` must load before the generator script: the generators call its `rollDie` and `logMod` helpers so the card can list every dice roll (with its modifier and total) and the modifiers that were applied.
