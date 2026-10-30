# Gcity - The RPG City Generator

This is an RPG city and urban generator developed during [Backdrop Build](https://backdropbuild.com/).

## Shared page layout

The reusable site header and footer are maintained in `components/header/header.html` and `components/footer/footer.html`. Each page reserves `#site-header` and `#site-footer` placeholders, and `js/layout.js` loads the matching fragments.

Because the fragments are loaded with `fetch`, run the site through an HTTP server rather than opening HTML files directly. For local testing, run `python -m http.server` from the project directory and open `http://localhost:8000`.
