(function () {
    const BOOK = window.EXTRAS_BOOK;
    const body = document.body;
    const extrasLog = [];
    window.extrasLog = extrasLog;

    let encounterUpdateHint = null;
    let pageType = body.classList.contains("villages-page") ? "village"
        : body.classList.contains("towns-page") ? "town"
        : body.classList.contains("cities-page") ? "city"
        : body.classList.contains("capitals-page") ? "capital"
        : body.classList.contains("fortresses-page") ? "fortress"
        : body.classList.contains("extras-page") ? "trading"
        : "trading";
    const isFortress = pageType === "fortress";

    /* ---------- Appendix D data ---------- */

    const REPUTATION = ["Hidden/Secret", "Abhorred", "Disreputable", "Of No Consequence", "Respectable", "Well-Regarded"];
    const NAME_FIRST = ["Red", "Yellow", "Green", "Blue", "Violet", "Disreputable", "Mischievous", "Hungry", "Thirsty", "Tuckered", "Frantic", "Bloated", "Rank", "Fussy", "Exuberant", "Irate", "Jolly", "Laughing", "Crying", "Screaming"];
    const NAME_SECOND = ["Vagabond", "Tyrant", "Giant", "Halfling", "Mare/Stallion", "Bear", "Pig/Boar", "Elk", "Moose", "Unicorn", "Mouse", "Cat", "Dog", "Hen/Rooster", "Sword", "Shield", "Spear", "Banner", "Cartwheel", "Dragon"];

    const FOOD = {
        humble: { label: "Humble", die: 8, items: ["Acorn Paste", "Pottage", "Rye Bread", "Blood Pudding", "Pickled Fish", "Mashed Turnips", "Porridge", { to: "standard", skip: 1 }] },
        standard: { label: "Standard", die: 8, items: [{ to: "humble", skip: 8 }, "Roast Lamb", "Brown Bread", "Roast Goose", "Suckling Pig", "Meat Pie", "Roast Beef", { to: "rich", skip: 1 }] },
        rich: { label: "Rich", die: 10, items: [{ to: "standard", skip: 1 }, "Stewed Pheasant", "White Bread", "Chicken in Spiced Breadcrumbs", "Roast Venison", "Roast Larks", "Fruit in Syrup", "Lamprey Pie", "Roast Pike", { to: "extravagant", skip: 8 }] },
        extravagant: { label: "Extravagant", die: 8, items: [{ to: "rich", skip: 10 }, "Live songbirds in a pie crust", "Roast peacock in its feathers", "Roast sturgeon in syrup", "Capon in pastry armor with gold leaf on a suckling pig", "Whole boar cooked many ways", "Castle-shaped pie with a whole roast deer", "Roast ox breathing fire"] }
    };
    const DRINKS_SOFT = ["Water", "Citrus Water", "Flower Water", "Spiced Water", "Clarea", "Sekanjabin", "Tea", "Apple Juice", "Small Beer", "Cow Milk", "Goat Milk", "Grenadine"];
    const DRINKS_ALC = ["Ale", "Beer", "Mead", "Cider", "White Wine", "Red Wine", "Whiskey", "Rum", "Vodka", "Gin", "Schnapps", "Hippocras"];

    const CROPS = ["Wheat", "Barley", "Oats", "Corn", "Rye", "Potatoes", "Rice", "Sugarcane", "Peas", "Beans", "Carrots", "Cabbages", "Onions", "Garlic", "Turnips", "Herbs", "Apples", "Lemons", "Grapes", "Berries"];
    const MINERALS = ["Iron", "Tin", "Lead", "Clay", "Lime", "Coal", "Salt", "Copper", "Silver", "Gold"];
    const BURDEN = ["Destrier", "Palfrey", "Courser", "Draught Horse", "Donkey", "Llama", "Camel", "Ox", "Yak", "Elephant"];
    const MEAT = ["Cow", "Sheep", "Chicken", "Turkey", "Pig", "Rabbit", "Duck", "Goose"];
    const WOOL = ["Sheep", "Goat", "Yak", "Llama", "Rabbit", "Muskox"];
    const GAME = ["Large and Swift", "Large and Tough", "Small and Swift", "Small and Tough", "Fowl", "Large Predator", "Small Predator", "Fish"];
    const ARTS = ["Painting", "Sketching", "Etching", "Carving", "Whittling", "Tapestry", "Mosaic", "Stained Glass", "Tattooing", "Embroidery"];
    const WRITING = ["History", "Local Records", "Myths and Legends", "Romance", "Natural History", "The Magical Arts"];
    const SMELLS = ["Soil", "Sweat", "Garbage", "Waste", "Flowers", "Something baking", "Wood smoke", "Pipe smoke", "Alcohol", "Animal", "Wood", "Iron", "Leather", "Ammonia", "Decay", "Compost", "Blood", "Perfume", "Ozone", "Fear"];
    const TOUCH = ["Rough", "Sharp", "Thorny", "Smooth", "Wet", "Dry", "Soft", "Spongey", "Hot", "Cold"];
    const DEBRIS = ["Broken toy", "Sticks or leaves", "Pottery shards", "Torn cloth", "Lone shoe", "Feather", "Single coin", "Half-eaten food", "Waste", "Broken shingle"];
    const TIME_OF_DAY = ["Dawn", "Morning", "Noon", "Afternoon", "Dusk", "Evening", "Midnight", "Very early morning"];

    const HOOK = {
        "Who": ["Baby", "Little boy", "Little girl", "Young man", "Young woman", "Old man", "Old woman", "Mother", "Father", "Grandmother", "Grandfather", "Third party"],
        "Problem": ["Lost something", "Can't reach something", "Can't find someone", "Owe someone something", "Unfairly in trouble", "Justly in trouble", "Trying to get away", "Trying to get in", "Need to convince someone", "Need to get rid of something", "Need advice", "Heartbroken"],
        "Appearance": ["Filthy", "Shabby", "Homely", "Rugged", "Simple", "Refined", "Handsome", "Gorgeous", "Resplendent", "Otherworldly"],
        "Emotion": ["Disgusted", "Happy", "Angry", "Aloof", "Irritable", "Distraught", "Confused", "Distracted", "Sad", "Scared", "Embarrassed", "Worried", "Surprised", "Impatient", "Tired", "Excited", "Curious", "Proud", "Uncomfortable", "Relaxed"],
        "Action": ["Eating", "Walking", "Running", "Talking", "Yelling", "Whispering", "Grabbing", "Crying", "Fighting", "Laughing", "Screaming", "Bargaining", "Thinking", "Sleeping", "Drinking", "Cleaning", "Checking", "Looking", "Working", "Playing"],
        "Item of value": ["Money", "Pet", "Document", "Reminder", "Item from deceased loved one", "Gift for loved one", "Key", "Item to be delivered", "Important ingredient", "Medicine", "Equipment", "Something magical"],
        "Clothing": ["Shirt", "Trousers", "Vest", "Dress", "Coat/Jacket", "Boots", "Shoes", "Socks", "Gloves", "Scarf", "Cap", "Hat", "Belt", "Glasses", "Ring", "Pendant", "Bracelet", "Earring", "Skirt", "Toga"],
        "Pet": ["Cat", "Dog", "Bird", "Fish", "Frog", "Rodent", "Lizard", "Bug", "Safe monster/mythical creature", "Unsafe monster/mythical creature"]
    };

    /* ---------- Location categories (Appendix A) ---------- */

    const CATEGORIES = {
        "Crafted Items": ["Cooper", "Carpenter", "Smithy", "Tailor", "Thatcher", "Wainwright", "Weaver", "Apothecary", "Artist", "Cobbler", "Shipwright", "Luxury Furnishings"],
        "Intellectual": ["Artist", "Doctor", "Club", "Archives/Library", "Academy/University", "Forum", "Schoolhouse", "Amphitheater", "Courthouse", "Chancery", "Scribes & Clerks"],
        "Industrial / Heavy Production": ["Foundry/Smelting", "Mill", "Textile Production"],
        "Religion": ["Archives/Library", "Forum", "Schoolhouse", "Altar", "Oratory", "Sanctuary", "Temple", "Great Temple", "Priestly Guidance", "Hands of the Gods"],
        "Health & Hygiene": ["Barber", "Bathhouse", "Doctor", "Inn"],
        "Nature": ["Apothecary", "Rare Botanicals", "Herbalist", "Outdoor Recreational Area"],
        "Social": ["House of Leisure", "Inn", "Club", "Tavern", "Forum", "Gathering Hall", "Outdoor Recreational Area", "Dance Hall", "Amphitheater"],
        "Rest & Relaxation": ["House of Leisure", "Tavern", "Inn", "Club", "Outdoor Recreational Area", "Dance Hall"],
        "Transport": ["Wainwright", "Shipwright", "Stable", "Caravan & Mount"],
        "Food & Drink": ["Baker", "Butcher", "General Store", "Mill", "Rare Libations and Fare", "Tavern"],
        "Materials & Components": ["General Store", "Apothecary", "Rare Botanicals", "Rare Trade Goods", "Magic Shop", "Guides & Trackers"],
        "Government & Business": ["Bank & Exchange", "Archives/Library", "Forum", "Amphitheater", "Town Hall", "Courthouse", "Treasury", "Chancery"],
        "Magic": ["Apothecary", "Rare Botanicals", "Magic Shop", "Soothsayer", "Arcane Academics", "Magic Mercenaries", "Archives/Library", "Academy/University"]
    };

    const HIRED_HELP = {
        "Brutes & Brawlers": "Martial melee fighters.",
        "Cloak & Dagger": "Stealth and subterfuge.",
        "Bows & Slings": "Martial ranged fighters.",
        "Scribes & Clerks": "Educators.",
        "Guides & Trackers": "Urban and wilderness experts.",
        "Caravan & Mount": "Transportation and locomotion.",
        "Arcane Academics": "Magical education or counsel.",
        "Magic Mercenaries": "Martial arcane fighters.",
        "Priestly Guidance": "Divine education or counsel.",
        "Hands of the Gods": "Martial divine fighters."
    };

    const VARIANTS = {
        Barber: ["Dirt-Knife", "Coiffeur"], Bathhouse: ["Tubs", "Private Baths"], Doctor: ["Sawbones", "Physician"],
        "House of Leisure": ["Den of Leisure", "Hall of Leisure"], Inn: ["Tents or Hostel", "Lodge"], Club: ["Stage", "Theater"],
        Soothsayer: ["Fortune Teller", "Diviner"], Stable: ["Stalls", "Livery"], Tavern: ["Pub", "Taphouse"]
    };

    const GLOSSARY = Object.assign({}, BOOK.loc);
    GLOSSARY["Doctor/Apothecary"] = `${GLOSSARY.Doctor} / ${GLOSSARY.Apothecary}`;
    GLOSSARY["Millers"] = GLOSSARY.Mill;
    GLOSSARY["Miller"] = GLOSSARY.Mill;
    Object.entries(HIRED_HELP).forEach(([name, text]) => { GLOSSARY[name] = `${text} (Hired Help)`; });

    const ALIASES = {};
    Object.entries(VARIANTS).forEach(([base, names]) => names.forEach((alias, index) => {
        ALIASES[alias] = base;
        GLOSSARY[alias] = `${GLOSSARY[base]} (${index === 0 ? "poor" : "fine"} version of ${base})`;
    }));
    Object.assign(ALIASES, { Taxidermist: "Tanner/Taxidermist", Tanner: "Tanner/Taxidermist", Smelting: "Foundry/Smelting", Foundry: "Foundry/Smelting", Library: "Archives/Library", Academy: "Academy/University", University: "Academy/University" });

    /* ---------- Utilities ---------- */

    const roll = sides => Math.floor(Math.random() * sides) + 1;
    const pick = list => list[roll(list.length) - 1];
    const pickSlash = list => pick(list).split("/").length > 1 ? pick(pick(list).split("/")) : pick(list);
    const escapeHtml = text => String(text).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const signed = n => (n >= 0 ? `+${n}` : String(n));

    function element(tag, className, html) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (html !== undefined) node.innerHTML = html;
        return node;
    }

    function log(title, lines) {
        extrasLog.push({ title, lines });
    }

    function categoriesFor(name) {
        const base = ALIASES[name] || name;
        return Object.entries(CATEGORIES).filter(([, list]) => list.includes(base)).map(([category]) => category);
    }

    /* ---------- Modal ---------- */

    let modalNode;
    function openModal(title, contentNode) {
        if (!modalNode) {
            modalNode = element("div", "modal fade extra-modal");
            modalNode.tabIndex = -1;
            modalNode.innerHTML = `<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable"><div class="modal-content">
                <div class="modal-header"><h5 class="modal-title"><span class="extra-badge">${t("✦ Extra")}</span> <span data-role="title"></span></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="${t("Close")}"></button></div>
                <div class="modal-body" data-role="body"></div></div></div>`;
            document.body.appendChild(modalNode);
        }
        modalNode.querySelector("[data-role=title]").textContent = title;
        modalNode.querySelector("[data-role=body]").replaceChildren(contentNode);
        bootstrap.Modal.getOrCreateInstance(modalNode).show();
    }

    function locationModal(name) {
        const base = ALIASES[name] || name;
        const node = element("div");
        const description = GLOSSARY[name] || GLOSSARY[base] || BOOK.fort[name];
        node.appendChild(element("p", "", escapeHtml(description || t("No additional description."))));

        const variants = VARIANTS[base];
        if (variants) {
            node.appendChild(element("p", "", `<b>${t("Versions")}:</b> ${variants[0]} (${t("poor")}) / ${variants[1]} (${t("fine")})`));
        }
        const cats = categoriesFor(name);
        if (cats.length) {
            const row = element("div", "extra-chips mb-2");
            cats.forEach(c => row.appendChild(element("span", "extra-chip", c)));
            node.appendChild(row);
        }
        if (base === "Tavern") {
            const holder = element("div", "extra-result mt-3");
            const button = element("button", "btn btn-sm extra-button", t("🍺 Generate tavern (Tavern Builder)"));
            button.type = "button";
            button.addEventListener("click", () => {
                holder.replaceChildren(buildTavern(false));
                window.I18N.translateGeneratedContent(holder);
            });
            node.append(button, holder);
        }
        if (base === "Hired Help") {
            const list = element("ul", "mb-0 mt-2");
            Object.entries(HIRED_HELP).forEach(([n, t]) => list.appendChild(element("li", "", `<b>${n}</b> - ${t}`)));
            node.appendChild(list);
        }
        openModal(name, node);
    }

    /* ---------- Term annotation in page text ---------- */

    function annotateTerms() {
        const content = document.querySelector(".generation-content");
        if (!content) return;

        const terms = isFortress
            ? Object.keys(BOOK.fort)
            : Object.keys(GLOSSARY).concat(Object.keys(ALIASES), ["Miller"]).filter(n => n !== "Doctor/Apothecary");
        const unique = [...new Set(terms)].sort((a, b) => b.length - a.length);
        const pattern = new RegExp(`(?<![\\w/-])(${unique.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?![\\w-])`, isFortress ? "gi" : "g");
        const headingFilter = /location|shop|service|worship|interest|district|commercial|hired|temple|religio|building|place/i;

        const targets = [];
        content.querySelectorAll("p").forEach(p => {
            if (p.closest(".fortress-figure, svg")) return;
            const heading = p.previousElementSibling;
            if (isFortress || (heading?.tagName === "H3" && headingFilter.test(heading.textContent)) || p.querySelector(".extra-term")) {
                targets.push(p);
            }
        });

        targets.forEach(p => {
            const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
            const nodes = [];
            while (walker.nextNode()) nodes.push(walker.currentNode);
            nodes.forEach(node => {
                if (node.parentElement.closest(".extra-term") || !pattern.test(node.nodeValue)) { pattern.lastIndex = 0; return; }
                pattern.lastIndex = 0;
                const fragment = document.createDocumentFragment();
                let last = 0;
                node.nodeValue.replace(pattern, (match, _g, offset) => {
                    fragment.appendChild(document.createTextNode(node.nodeValue.slice(last, offset)));
                    const term = element("span", "extra-term");
                    term.textContent = match;
                    term.dataset.term = isFortress ? Object.keys(BOOK.fort).find(k => k.toLowerCase() === match.toLowerCase()) : match;
                    term.tabIndex = 0;
                    term.setAttribute("role", "button");
                    term.title = t("Extra: click to see the description");
                    fragment.appendChild(term);
                    last = offset + match.length;
                    return match;
                });
                fragment.appendChild(document.createTextNode(node.nodeValue.slice(last)));
                node.replaceWith(fragment);
            });
        });

        content.addEventListener("click", event => {
            const term = event.target.closest(".extra-term");
            if (term) locationModal(term.dataset.term);
        });
        content.addEventListener("keydown", event => {
            const term = event.target.closest?.(".extra-term");
            if (term && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                locationModal(term.dataset.term);
            }
        });
    }

    /* ---------- Geradores ---------- */

    function encounterModifier() {
        const mods = window.generationLog?.modifiers || [];
        const sum = name => mods.filter(m => m.name === name).reduce((total, m) => total + m.amount, 0);
        const urban = mods.some(m => m.name === "urbanEncounterMod");
        return { value: urban ? sum("urbanEncounterMod") : sum("crimeMod"), source: urban ? "Urban Encounters" : "Crime" };
    }

    const THRESHOLD = { village: 17, trading: 17, town: 17, city: 15, capital: 15 };

    function pickByMax(list, value) {
        return list.find(item => value <= item.max);
    }

    function buildEncounter(force, mod) {
        const threshold = THRESHOLD[pageType];
        const die = roll(20);
        const total = die + mod;
        const box = element("div", "extra-result");
        const lines = [`Encounter check: d20 = ${die} ${signed(mod)} = ${total} (needs ${threshold}+)`];
        box.appendChild(element("p", "mb-1", `<b>${window.I18N.source("Check")}:</b> d20 = ${die} ${signed(mod)} = <b>${total}</b> (${window.I18N.source("needs")} ${threshold}+)`));

        if (total < threshold && !force) {
            box.appendChild(element("p", "mb-0", window.I18N.source("No urban encounter this time.")));
            lines.push("No urban encounter.");
        } else {
            const index = roll(20);
            const enc = BOOK.enc[index - 1];
            box.appendChild(element("p", "mb-1", `<b>${window.I18N.source("Encounter")} (d20 = ${index}):</b> ${escapeHtml(enc.name)}`));
            box.appendChild(element("p", "mb-0", escapeHtml(enc.text)));
            lines.push(`Encounter (d20 = ${index}): ${enc.name} - ${enc.text}`);
        }
        log(t("Urban encounter"), lines);
        return box;
    }

    function buildPersonnel() {
        const die = roll(20);
        const issue = BOOK.pers.find(p => { const [a, b] = p.range.split("-").map(Number); return die >= a && die <= (b || a); });
        const box = element("div", "extra-result");
        box.appendChild(element("p", "mb-0", `<b>${window.I18N.source("Personnel issue")} (d20 = ${die}):</b> ${escapeHtml(issue.name)}. ${escapeHtml(issue.text)}`));
        log(t("NPC personnel issue"), [`d20 = ${die}: ${issue.name}. ${issue.text}`]);
        return box;
    }

    function rumorPool() {
        return BOOK.rum.filter(r => {
            switch (r.scope) {
                case "village": return pageType === "village";
                case "notvillage": return pageType !== "village";
                case "citycap": return pageType === "city" || pageType === "capital";
                case "capital": return pageType === "capital";
                default: return true;
            }
        });
    }

    function buildRumor() {
        const pool = rumorPool();
        const die = roll(100);
        let rumor = pickByMax(BOOK.rum, die);
        let rerolled = false;
        if (!pool.includes(rumor)) { rumor = pick(pool); rerolled = true; }
        const box = element("div", "extra-result");
        box.appendChild(element("p", "mb-0", `<b>${window.I18N.source("Rumor")} (d100 = ${die}${rerolled ? ", " + window.I18N.source("rerolled: does not apply to this settlement type") : ""}):</b> ${escapeHtml(rumor.text)}`));
        log(t("Rumor"), [`d100 = ${die}${rerolled ? " (rerolled)" : ""}: ${rumor.text}`]);
        return box;
    }

    function rollFood(tier, excluded) {
        const def = FOOD[tier];
        let index;
        do { index = roll(def.die); } while (index === excluded);
        const entry = def.items[index - 1];
        return typeof entry === "string" ? { tier: def.label, name: entry } : rollFood(entry.to, entry.skip);
    }

    function buildTavern(logIt = true) {
        const reputationDie = roll(6);
        const reputation = REPUTATION[reputationDie - 1];
        const name = `The ${pick(NAME_FIRST)} ${pickSlash(NAME_SECOND)}`;
        const patronDie = roll(8);
        const patrons = patronDie <= 2 ? `${window.I18N.source("Few-to-None")} (${Math.max(roll(4) - 1, 0)} ${window.I18N.source("patrons")})` : patronDie <= 6 ? window.I18N.source("Usual Crowd (up to about half capacity)") : window.I18N.source("Crowded");
        const staffDie = roll(8);
        const staff = staffDie <= 2 ? window.I18N.source("Short-Staffed") : staffDie <= 6 ? window.I18N.source("Appropriate") : window.I18N.source("Overstaffed");
        const food = [rollFood("standard"), rollFood("standard")];
        const drinks = [pick(DRINKS_SOFT), pick(DRINKS_ALC), pick(DRINKS_ALC)];

        const box = element("div", "extra-result");
        const rows = [
            ["Name", name],
            ["Reputation", `${reputation} (d6 = ${reputationDie})`],
            ["Patrons", `${patrons} (d8 = ${patronDie})`],
            ["Staff", `${staff} (d8 = ${staffDie})`],
            ["Food", food.map(f => `${f.name} <small class="text-muted">(${f.tier})</small>`).join(", ")],
            ["Drinks", drinks.join(", ")]
        ];
        box.innerHTML = `<dl class="extra-dl mb-0">${rows.map(([k, v]) => `<dt>${window.I18N.source(k)}</dt><dd>${v}</dd>`).join("")}</dl>`;
        if (logIt) {
            log(t("Tavern (Tavern Builder)"), rows.map(([k, v]) => `${k}: ${v.replace(/<[^>]+>/g, "")}`));
        }
        return box;
    }

    function buildScene() {
        const lines = [
            ["Time of day", pick(TIME_OF_DAY)],
            ["Smell", pick(SMELLS)],
            ["Touch", pick(TOUCH)],
            ["Street debris", pick(DEBRIS)],
            ["Local art", pick(ARTS)],
            ["Local writing", pick(WRITING)]
        ];
        const box = element("div", "extra-result");
        box.innerHTML = `<dl class="extra-dl mb-0">${lines.map(([k, v]) => `<dt>${window.I18N.source(k)}</dt><dd>${v}</dd>`).join("")}</dl>`;
        log(t("Scene details"), lines.map(([k, v]) => `${k}: ${v}`));
        return box;
    }

    function buildHook() {
        const lines = Object.entries(HOOK).map(([k, list]) => [k, pick(list)]);
        const box = element("div", "extra-result");
        box.innerHTML = `<dl class="extra-dl mb-0">${lines.map(([k, v]) => `<dt>${window.I18N.source(k)}</dt><dd>${v}</dd>`).join("")}</dl>`;
        log(t("Adventure hook"), lines.map(([k, v]) => `${k}: ${v}`));
        return box;
    }

    function buildProduction() {
        const lines = [
            ["Crop", pick(CROPS)],
            ["Mineral", pick(MINERALS)],
            ["Beast of burden", pick(BURDEN)],
            ["Farm animal (meat)", pick(MEAT)],
            ["Farm animal (wool)", pick(WOOL)],
            ["Game", pick(GAME)]
        ];
        const box = element("div", "extra-result");
        box.innerHTML = `<dl class="extra-dl mb-0">${lines.map(([k, v]) => `<dt>${window.I18N.source(k)}</dt><dd>${v}</dd>`).join("")}</dl>`;
        log(t("Local production"), lines.map(([k, v]) => `${k}: ${v}`));
        return box;
    }

    /* ---------- Extras card ---------- */

    function section(title, hint, buttons) {
        const wrap = element("section", "extra-section");
        wrap.appendChild(element("h3", "", `${t(title)} <small class="text-muted fw-normal">${t(hint)}</small>`));
        const actions = element("div", "d-flex justify-content-center flex-wrap gap-2 mb-2");
        const output = element("div", "extra-output");
        buttons.forEach(([label, builder, append]) => {
            const button = element("button", "btn btn-sm extra-button", t(label));
            button.type = "button";
            button.addEventListener("click", () => {
                const result = builder();
                if (append) output.prepend(result); else output.replaceChildren(result);
                window.I18N.translateGeneratedContent(output);
            });
            actions.appendChild(button);
        });
        wrap.append(actions, output);
        return wrap;
    }

    const SETTLEMENT_TYPES = [
        ["trading", "Trading Post"], ["village", "Village"], ["town", "Town"], ["city", "City"], ["capital", "Capital"]
    ];

    function renderExtrasCard() {
        const info = document.getElementById("generation-info");
        const root = document.getElementById("extras-root");
        if (!info && !root) return;

        const card = element("section", "extras-card generation-info container card shadow-sm border-0 my-4 p-4 p-md-5");
        card.setAttribute("aria-label", t("Extras"));
        card.appendChild(element("h2", "h4 fw-semibold text-center border-bottom pb-2 mb-4 mt-0", `<span class="extra-badge">✦ Extra</span> ${t("Extras")}`));
        card.appendChild(element("p", "text-center text-muted mb-0", t("Optional content from Appendices A-D. Terms marked with a purple ✦ are extras and open a description when clicked.")));

        if (!isFortress) {
            const encounter = element("section", "extra-section");
            encounter.appendChild(element("h3", "", t("Urban encounters")));
            const hint = element("p", "text-muted small mb-2");
            const controls = element("div", "extra-controls d-flex justify-content-center align-items-center flex-wrap gap-2 mb-2");
            const label = element("label", "form-label mb-0", t("Encounter modifier"));
            const input = element("input", "form-control form-control-sm w-auto");
            const initial = encounterModifier();
            label.htmlFor = "extra-encounter-mod";
            input.id = "extra-encounter-mod";
            input.type = "number";
            input.step = "1";
            input.value = String(initial.value);
            input.style.width = "5rem";
            const updateHint = () => {
                const village = pageType === "village" ? " " + t("Villages have no table of their own, so the Trading Post/Town rule is used (optional).") : "";
                hint.textContent = `${t("d20 + modifier must reach")} ${THRESHOLD[pageType]}+ ${t("for an encounter.")}${village}`;
            };
            updateHint();
            const getMod = () => Number.parseInt(input.value, 10) || 0;
            const output = element("div", "extra-output");
            const actions = element("div", "d-flex justify-content-center flex-wrap gap-2 mb-2");
            [["⚔ Generate encounter", false], ["🎯 Force encounter (no check)", true]].forEach(([text, force]) => {
                const button = element("button", "btn btn-sm extra-button", t(text));
                button.type = "button";
                button.addEventListener("click", () => {
                    output.prepend(buildEncounter(force, getMod()));
                    window.I18N.translateGeneratedContent(output);
                });
                actions.appendChild(button);
            });
            controls.append(label, input);
            encounter.append(hint, controls, actions, output);
            card.appendChild(encounter);
            encounterUpdateHint = updateHint;

            card.appendChild(section("Rumors", "d100 table, filtered by settlement type.", [["🗣 Generate rumor", buildRumor, true]]));
            card.appendChild(section("Tavern", "Tavern Builder (Appendix D).", [["🍺 Generate tavern", () => buildTavern(true), true]]));
            card.appendChild(section("Local production", "Crops, minerals and animals.", [["🌾 Generate production", buildProduction, false]]));
            card.appendChild(section("Scene details", "Smells, textures, time of day and art.", [["👃 Generate details", buildScene, false]]));
            card.appendChild(section("Adventure hook", "Hook/Situation Builder.", [["🎣 Generate hook", buildHook, true]]));
            card.appendChild(section("Personnel issues", "For any NPC the party interacts with.", [["🧑 Generate issue", buildPersonnel, true]]));
            if (root) {
                const places = element("section", "extra-section");
                places.appendChild(element("h3", "", `${t("Location glossary")} <small class="text-muted fw-normal">${t("Appendix A")}</small>`));
                const chips = element("div", "extra-chips justify-content-center");
                Object.keys(BOOK.loc).forEach(name => {
                    const chip = element("button", "extra-chip extra-chip-button", name);
                    chip.type = "button";
                    chip.addEventListener("click", () => locationModal(name));
                    chips.appendChild(chip);
                });
                places.appendChild(chips);
                card.appendChild(places);
            }
        } else {
            card.appendChild(section("Personnel issues", "Appendix B table for garrison and staff.", [["🧑 Generate issue", buildPersonnel, true]]));
            card.appendChild(section("Adventure hook", "Hook/Situation Builder.", [["🎣 Generate hook", buildHook, true]]));
            const glossary = element("section", "extra-section");
            glossary.appendChild(element("h3", "", `${t("Fortress glossary")} <small class="text-muted fw-normal">${t("Appendix A terms")}</small>`));
            const chips = element("div", "extra-chips justify-content-center");
            Object.keys(BOOK.fort).forEach(name => {
                const chip = element("button", "extra-chip extra-chip-button", name);
                chip.type = "button";
                chip.addEventListener("click", () => locationModal(name));
                chips.appendChild(chip);
            });
            glossary.appendChild(chips);
            card.appendChild(glossary);
        }

        if (root) {
            root.appendChild(card);
        } else {
            info.before(card);
        }
    }

    function renderTypeSelector() {
        const holder = document.getElementById("extras-settings");
        if (!holder) return;
        const select = element("select", "form-select w-auto d-inline-block");
        select.id = "extras-settlement-type";
        SETTLEMENT_TYPES.forEach(([value, text]) => select.appendChild(new Option(t(text), value)));
        select.value = pageType;
        select.addEventListener("change", () => {
            pageType = select.value;
            if (encounterUpdateHint) encounterUpdateHint();
        });
        const label = element("label", "form-label me-2", t("Settlement type"));
        label.htmlFor = select.id;
        holder.append(label, select);
    }

    window.formatExtrasText = function () {
        if (!extrasLog.length) return [];
        const lines = ["", t("Extras (generated on this page)")];
        extrasLog.forEach(entry => {
            lines.push("", `${entry.title}:`);
            entry.lines.forEach(line => lines.push(line));
        });
        return lines;
    };

    document.addEventListener("DOMContentLoaded", () => {
        annotateTerms();
        renderTypeSelector();
        renderExtrasCard();
    });

    document.addEventListener("i18n:change", () => {
        const generatedResults = [...document.querySelectorAll(".extras-card .extra-output")]
            .map(output => [...output.childNodes]);
        document.querySelectorAll(".extras-card").forEach(card => card.remove());
        document.getElementById("extras-settings")?.replaceChildren();
        if (modalNode) {
            bootstrap.Modal.getInstance(modalNode)?.dispose();
            modalNode.remove();
            modalNode = null;
        }
        document.querySelectorAll(".extra-term").forEach(term => { term.title = t("Extra: click to see the description"); });
        renderTypeSelector();
        renderExtrasCard();
        document.querySelectorAll(".extras-card .extra-output").forEach((output, index) => {
            output.replaceChildren(...(generatedResults[index] || []));
        });
        window.I18N.translateGeneratedContent(document);
    });
})();
