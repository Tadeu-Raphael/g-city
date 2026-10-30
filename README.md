# G-City

G-City is a catalog of tools for building tabletop RPG worlds. Generator projects are kept in Git submodules so their source is not duplicated here.

## Available generators

- [Spectacular Settlements Generator](./generators/spectacular-settlements/index.html) — settlements, from trading posts and villages to cities and fortresses.

## Shared layout

The catalog header and footer live in `components/header/header.html` and `components/footer/footer.html`. `js/layout.js` loads these fragments into the landing page.

## Getting started

Clone the repository with its submodules, or initialize them after cloning:

```bash
git submodule update --init --recursive
python -m http.server
```

Open <http://localhost:8000> to browse the catalog.
