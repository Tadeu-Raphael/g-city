(function () {
    const LANGUAGE_KEY = "gcity-landing-language";
    const languageFromUrl = new URLSearchParams(location.search).get("lang");
    const translations = {
        pt: {
            pageTitle: "G-City — Ferramentas para RPG",
            metaDescription: "G-City reúne ferramentas para criar mundos e assentamentos de RPG.",
            brandAria: "G-City, início",
            mainNavigation: "Navegação principal",
            generatorsNav: "Geradores",
            aboutNav: "Sobre",
            library: "BIBLIOTECA DE GERADORES",
            heroTitle: "Escolha sua ferramenta",
            heroDescription: "Explore ferramentas para dar vida ao seu cenário.",
            cityCategory: "GERADOR DE CIDADES",
            spectacularName: "Spectacular Settlements Generator",
            spectacularDescription: "Crie postos comerciais, vilas, cidades, capitais e fortalezas para suas aventuras.",
            adventuresCategory: "GERADOR DE AVENTURAS",
            forbiddenName: "Forbidden Lands Generator",
            forbiddenDescription: "Crie aldeias, masmorras e castelos para suas aventuras em Forbidden Lands.",
            openGenerator: "Abrir gerador",
            footerCaption: "G-City · Ferramentas para aventuras de RPG",
            footerCredit: "Feito por",
            languageSelector: "Idioma",
            switchToPortuguese: "Mudar para português",
            switchToEnglish: "Mudar para inglês",
            flagBrazil: "Brasil",
            flagEnglish: "Reino Unido / EUA"
        },
        en: {
            pageTitle: "G-City — RPG Tools",
            metaDescription: "G-City brings together tools for creating RPG worlds and settlements.",
            brandAria: "G-City, home",
            mainNavigation: "Main navigation",
            generatorsNav: "Generators",
            aboutNav: "About",
            library: "GENERATOR LIBRARY",
            heroTitle: "Choose your tool",
            heroDescription: "Explore tools to bring your setting to life.",
            cityCategory: "CITY GENERATOR",
            spectacularName: "Spectacular Settlements Generator",
            spectacularDescription: "Create trading posts, villages, towns, cities, capitals, and fortresses for your adventures.",
            adventuresCategory: "ADVENTURE GENERATOR",
            forbiddenName: "Forbidden Lands Generator",
            forbiddenDescription: "Create villages, dungeons, and castles for your Forbidden Lands adventures.",
            openGenerator: "Open generator",
            footerCaption: "G-City · Tools for RPG adventures",
            footerCredit: "Made by",
            languageSelector: "Language",
            switchToPortuguese: "Switch to Portuguese",
            switchToEnglish: "Switch to English",
            flagBrazil: "Brazil",
            flagEnglish: "UK / USA"
        }
    };

    function isSupportedLanguage(language) {
        return language === "pt" || language === "en";
    }

    function getInitialLanguage() {
        if (isSupportedLanguage(languageFromUrl)) {
            return languageFromUrl;
        }

        try {
            const storedLanguage = localStorage.getItem(LANGUAGE_KEY);
            if (isSupportedLanguage(storedLanguage)) {
                return storedLanguage;
            }
        } catch (error) {
            console.error("Could not read the saved G-City language.", error);
        }

        return "pt";
    }

    function applyLanguage(language) {
        const dictionary = translations[language];
        document.documentElement.lang = language === "pt" ? "pt-BR" : "en";

        document.querySelectorAll("[data-i18n]").forEach((element) => {
            const key = element.dataset.i18n;
            if (!Object.prototype.hasOwnProperty.call(dictionary, key)) {
                throw new Error(`Missing G-City translation: ${key}`);
            }
            element.textContent = dictionary[key];
        });

        document.querySelectorAll("[data-i18n-content]").forEach((element) => {
            const key = element.dataset.i18nContent;
            if (!Object.prototype.hasOwnProperty.call(dictionary, key)) {
                throw new Error(`Missing G-City translation: ${key}`);
            }
            element.setAttribute("content", dictionary[key]);
        });

        document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
            const key = element.dataset.i18nAriaLabel;
            if (!Object.prototype.hasOwnProperty.call(dictionary, key)) {
                throw new Error(`Missing G-City translation: ${key}`);
            }
            element.setAttribute("aria-label", dictionary[key]);
        });

        document.querySelectorAll("[data-i18n-title]").forEach((element) => {
            const key = element.dataset.i18nTitle;
            if (!Object.prototype.hasOwnProperty.call(dictionary, key)) {
                throw new Error(`Missing G-City translation: ${key}`);
            }
            element.setAttribute("title", dictionary[key]);
        });

        document.querySelectorAll("[data-lang-switch]").forEach((button) => {
            button.setAttribute("aria-pressed", String(button.dataset.langSwitch === language));
        });

        document.querySelectorAll("[data-generator-link]").forEach((link) => {
            const target = new URL(link.getAttribute("href"), document.baseURI);
            target.searchParams.set("lang", language);
            link.href = target.href;
        });
    }

    function saveLanguage(language) {
        try {
            localStorage.setItem(LANGUAGE_KEY, language);
            localStorage.setItem("spectacular-settlements-lang", language);
            localStorage.setItem("forbidden-lands-language", language);
        } catch (error) {
            console.error("Could not save the selected G-City language.", error);
        }

        try {
            const currentUrl = new URL(location.href);
            currentUrl.searchParams.set("lang", language);
            history.replaceState(null, "", currentUrl.href);
        } catch (error) {
            console.error("Could not persist the selected G-City language in the URL.", error);
        }
    }

    let language = getInitialLanguage();
    applyLanguage(language);
    if (isSupportedLanguage(languageFromUrl)) {
        saveLanguage(language);
    }

    document.addEventListener("click", (event) => {
        if (!(event.target instanceof Element)) {
            return;
        }

        const button = event.target.closest("[data-lang-switch]");
        if (!button || !isSupportedLanguage(button.dataset.langSwitch)) {
            return;
        }

        language = button.dataset.langSwitch;
        applyLanguage(language);
        saveLanguage(language);
    });
})();
