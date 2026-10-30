(function () {
    const STORAGE_KEY = "gcity-lang";
    const SUPPORTED = ["en", "pt"];

    // English text is the key; only Portuguese needs entries.
    const PT = {
        // Layout
        "Main navigation": "Navegação principal",
        "Home": "Início",
        "Capitals": "Capitais",
        "Cities": "Cidades Grandes",
        "Towns": "Cidades",
        "Villages": "Aldeias",
        "Fortresses": "Fortalezas",
        "Trading Posts": "Postos de Comércio",
        "Extras": "Extras",
        "G-City · Settlement generator for RPG adventures": "G-City · Gerador de assentamentos para aventuras de RPG",
        "Made by": "Feito por",
        "Language": "Idioma",
        "Switch to English": "Mudar para inglês",
        "Switch to Portuguese": "Mudar para português",

        // Modifier labels
        "Size": "Tamanho",
        "Condition": "Condição",
        "Disposition": "Disposição",
        "Population Density": "Densidade populacional",
        "Population Wealth": "Riqueza da população",
        "Hardship Likelihood": "Probabilidade de adversidade",
        "Crime": "Crime",
        "Visitor Traffic": "Tráfego de visitantes",
        "Shop Quality": "Qualidade das lojas",
        "Urban Encounters": "Encontros urbanos",
        "Fortification": "Fortificação",
        "Law Enforcement": "Aplicação da lei",
        "Market Square": "Praça do mercado",
        "Places of Worship": "Locais de culto",
        "Farms and Resources": "Fazendas e recursos",
        "Population Overflow": "Excesso de população",
        "Night Activity": "Atividade noturna",
        "Number of Districts": "Número de distritos",
        "District Condition": "Condição dos distritos",
        "Military Force": "Força militar",
        "Residence": "Residência",
        "Other Locations Type": "Tipo de outros locais",
        "Residents": "Residentes",
        "Number of Rooms": "Número de cômodos",
        "Furnishings": "Mobiliário",
        "Moat": "Fosso",

        // Generated section headings and field labels
        "Basic Information": "Informações básicas",
        "Community": "Comunidade",
        "Points of Interest": "Pontos de interesse",
        "Extra Intrigue": "Intriga extra",
        "Origin": "Origem",
        "Priority": "Prioridade",
        "Specialty": "Especialidade",
        "Age": "Idade",
        "Environment": "Ambiente",
        "Prosperity": "Prosperidade",
        "Vendor Stall Acquisition": "Aquisição de barracas",
        "Merchant Overflow": "Excesso de comerciantes",
        "Demographics": "Demografia",
        "Leadership": "Liderança",
        "Non-Commercial Locations": "Locais não comerciais",
        "Commercial Locations": "Locais comerciais",
        "Shops": "Lojas",
        "Services": "Serviços",
        "Recent History": "História recente",
        "Noteworthy Official": "Autoridade notável",
        "Market Day": "Dia de mercado",
        "Resident Population": "População residente",
        "Speciality": "Especialidade",
        "Politics": "Política",
        "Events": "Eventos",
        "Opportunities": "Oportunidades",
        "Weather": "Clima",
        "Danger Level": "Nível de perigo",
        "Danger Type": "Tipo de perigo",
        "Hardship Type": "Tipo de adversidade",
        "Resource": "Recurso",
        "Default": "Padrão",
        "Worship": "Culto",
        "Places of Gathering": "Locais de encontro",
        "Other Locations": "Outros locais",
        "Political Rumors": "Rumores políticos",
        "Random Superstition": "Superstição aleatória",
        "Going On": "O que está acontecendo",
        "Population Capacity": "Capacidade populacional",
        "Outside the City": "Arredores da cidade",
        "Outside the Capital": "Arredores da capital",
        "Stewardship": "Administração",
        "General Condition": "Condição geral",
        "Underground Passages": "Passagens subterrâneas",
        "General Crime": "Criminalidade geral",
        "Organized Crime": "Crime organizado",
        "Beneath the Surface": "Sob a superfície",
        "Leadership Unity": "Unidade da liderança",
        "Governing Priority": "Prioridade de governo",
        "Priority Approach": "Abordagem prioritária",
        "Priority Success": "Êxito da prioridade",
        "Leaders": "Líderes",
        "Spy Network": "Rede de espionagem",
        "Counterintelligence": "Contraespionagem",
        "Notable Visitors": "Visitantes notáveis",
        "Military": "Forças militares",
        "Nobility": "Nobreza",
        "Culture": "Cultura",
        "Government & High Society": "Governo e alta sociedade",
        "Districts": "Distritos",
        "Noble Residences": "Residências nobres",
        "District": "Distrito",
        "Administration": "Administração",
        "Arcane": "Arcano",
        "Botanical": "Botânico",
        "Craft": "Artesanato",
        "Docks": "Docas",
        "Industrial": "Industrial",
        "Market": "Mercado",
        "Merchant": "Comerciantes",
        "Scholar": "Acadêmico",
        "Slums": "Favelas",
        "Upper Class": "Classe alta",
        "Squalid": "Sórdido",
        "Dilapidated": "Degradado",
        "Decent": "Razoável",
        "Impressive": "Impressionante",
        "Magnificent": "Magnífico",
        "Dangerous": "Perigoso",
        "Frequent": "Frequente",
        "Infrequent": "Infrequente",
        "Fine": "Refinado",
        "General": "Geral",
        "Location in Relation to Settlement": "Localização em relação ao assentamento",
        "Expense": "Despesa",
        "Primary Building Material": "Material principal de construção",
        "Reason for Construction": "Motivo da construção",
        "Design Theme": "Tema do projeto",
        "Resource Origin": "Origem dos recursos",
        "Local Impact": "Impacto local",
        "Alternate Entries": "Entradas alternativas",
        "Resident Relations": "Relações com os residentes",
        "Resident Attitude": "Atitude dos residentes",
        "Garrison Size": "Tamanho da guarnição",
        "Garrison Equipment": "Equipamento da guarnição",
        "Resident Hobbies": "Passatempos dos residentes",
        "Current Issue": "Problema atual",
        "Secrets": "Segredos",
        "History": "História",
        "Oddities": "Particularidades",
        "Special Feature": "Característica especial",
        "Exterior Wall Thickness": "Espessura das muralhas externas",
        "Shape": "Formato",
        "Number of Floors": "Número de andares",
        "Raised Entrance": "Entrada elevada",
        "Entry Defenses": "Defesas da entrada",
        "Rooms": "Cômodos",
        "Geographic Advantages": "Vantagens geográficas",
        "Style": "Estilo",
        "Curtain Wall Towers": "Torres da muralha",
        "Curtain Wall Thickness": "Espessura da muralha externa",
        "Curtain Wall Height": "Altura da muralha externa",
        "Barbican": "Barbacã",
        "Curtain Wall Defenses": "Defesas da muralha externa",
        "Gatehouses": "Portarias",
        "Barracks Location": "Localização dos alojamentos",
        "Bailey Outbuildings": "Edificações do pátio externo",
        "Additional Curtain Wall Towers": "Torres adicionais da muralha",
        "Style Amplification": "Ampliação do estilo",
        "Additional Curtain Wall Thickness": "Espessura adicional da muralha",
        "Additional Curtain Wall Height": "Altura adicional da muralha",
        "Brutal Defenses": "Defesas brutais",
        "Upgraded Fortress": "Fortaleza aprimorada",
        "Entry": "Entrada",
        "Housing": "Moradia",
        "Notable locations": "Locais notáveis",
        "Keep": "Keep",
        "Castle": "Castelo",
        "Stronghold": "Fortaleza",
        "General Values": "Valores gerais",
        "Keep Details": "Detalhes da keep",
        "Castle Details": "Detalhes do castelo",
        "Stronghold Details": "Detalhes da fortaleza",
        "Fortress Style": "Estilo da fortaleza",
        "Walls": "Muralhas",
        "Towers": "Torres",
        "Defenses": "Defesas",
        "Reference": "Referência",
        "Very Small": "Muito pequeno",
        "Small": "Pequeno",
        "Medium": "Médio",
        "Large": "Grande",
        "Very Large": "Muito grande",
        "Excellent": "Excelente",
        "Good": "Boa",
        "Fair": "Regular",
        "Very Poor": "Muito ruim",
        "Immaculate": "Impecável",
        "Pristine": "Impecável",
        "Unknown": "Desconhecido",
        "Unknown.": "Desconhecido.",
        "None": "Nenhum",
        "None.": "Nenhum.",
        "Yes": "Sim",
        "Yes.": "Sim.",
        "No": "Não",
        "No.": "Não.",
        "None known.": "Nenhum conhecido.",
        "Uncommon": "Incomum",
        "Common": "Comum",
        "Rare": "Raro",
        "Very common": "Muito comum",
        "Very rare": "Muito raro",
        "High": "Alto",
        "Low": "Baixo",
        "Moderate": "Moderado",
        "Very high": "Muito alto",
        "Very low": "Muito baixo",
        "Skeleton": "Esquelética",
        "Destitute": "Desamparada",
        "Wealthy": "Rica",
        "Affluent": "Abastada",
        "Poor": "Pobre",
        "Harsh Weather": "Clima severo",
        "Recent": "Recente",
        "Ancient": "Antigo",
        "Friendly": "Amigável",
        "Open": "Receptivo",
        "Neutral": "Neutro",
        "Unfriendly": "Hostil",
        "Hostile": "Hostil",

        // Page titles
        "G-City - RPG Settlement Generator": "G-City - Gerador de Assentamentos de RPG",
        "G-City - Town Generator": "G-City - Gerador de Cidades",
        "G-City - Village Generator": "G-City - Gerador de Aldeias",
        "G-City - City Generator": "G-City - Gerador de Cidades Grandes",
        "G-City - Capital Generator": "G-City - Gerador de Capitais",
        "G-City - Trading Post Generator": "G-City - Gerador de Postos de Comércio",
        "G-City - Keep Generator": "G-City - Gerador de Keeps",
        "G-City - Castle Generator": "G-City - Gerador de Castelos",
        "G-City - Stronghold Generator": "G-City - Gerador de Strongholds",
        "G-City - Extras Generator": "G-City - Gerador de Extras",

        // Index
        "🏰 G-City - RPG Settlement Generator": "🏰 G-City - Gerador de Assentamentos de RPG",
        "Choose a settlement type to generate:": "Escolha um tipo de assentamento para gerar:",
        "Choose the fortress type to generate:": "Escolha o tipo de fortaleza para gerar:",
        "👑 Capitals": "👑 Capitais",
        "The largest settlements, with government, nobility, espionage, armies and many districts": "Os maiores assentamentos, com governo, nobreza, espionagem, exército e muitos distritos",
        "🏰 Cities": "🏰 Cidades Grandes",
        "Large metropolises split into districts, with politics, crime and intrigue": "Grandes metrópoles divididas em distritos, com política, crime e intrigas",
        "🏙️ Towns": "🏙️ Cidades",
        "Established towns with markets, defenses and full infrastructure": "Cidades estabelecidas com mercados, defesas e infraestrutura completa",
        "🌲 Villages": "🌲 Aldeias",
        "Smaller, simpler communities focused on basic resources": "Comunidades menores, mais simples e focadas em recursos básicos",
        "🛒 Trading Posts": "🛒 Postos de Comércio",
        "Strategic commercial hubs, markets and trade routes": "Pontos comerciais estratégicos, mercados e rotas de negociação",
        "🛡️ Fortresses": "🛡️ Fortalezas",
        "Keeps, castles and strongholds: cumulative defensive structures": "Keeps, castles e strongholds: estruturas defensivas cumulativas",
        "Just the main tower of the fortress": "Apenas a torre principal da fortaleza",
        "A keep plus walls, towers, moat and the rest of the castle": "Keep mais muralhas, torres, fosso e demais elementos do castelo",
        "A reinforced keep and castle, with brutal defenses and stylistic additions": "Keep e castelo reforçados, com defesas brutais e ampliações de estilo",
        "✦ Extras": "✦ Extras",
        "Encounters, rumors, taverns, hooks and other extra details only": "Apenas encontros, rumores, tavernas, ganchos e outros detalhes extras",
        "← Back": "← Voltar",

        // Generation pages
        "Generation actions": "Ações da geração",
        "🎲 Roll again": "🎲 Gerar novamente",
        "⬇ Export TXT": "⬇ Exportar TXT",
        "← Main menu": "← Menu principal",
        "Generation information": "Informações da geração",

        // Information card
        "Information": "Informações",
        "Applied modifiers": "Modificadores aplicados",
        "Modifier": "Modificador",
        "Total": "Total",
        "Source": "Origem",
        "No modifiers were generated in this roll.": "Nenhum modificador foi gerado nesta rolagem.",
        "Dice rolls": "Rolagens de dados",
        "Field": "Campo",
        "Die": "Dado",
        "Die result": "Resultado do dado",
        "No rolls were recorded.": "Nenhuma rolagem foi registrada.",

        // Extras card
        "Optional content from Appendices A-D. Terms marked with a purple ✦ are extras and open a description when clicked.": "Conteúdo opcional dos Apêndices A-D. Termos marcados com um ✦ roxo são extras e abrem uma descrição ao clicar.",
        "Urban encounters": "Encontros urbanos",
        "Encounter modifier": "Modificador de encontro",
        "⚔ Generate encounter": "⚔ Gerar encontro",
        "🎯 Force encounter (no check)": "🎯 Forçar encontro (sem teste)",
        "Rumors": "Rumores",
        "d100 table, filtered by settlement type.": "Tabela d100, filtrada pelo tipo de assentamento.",
        "🗣 Generate rumor": "🗣 Gerar rumor",
        "Tavern": "Taverna",
        "Tavern Builder (Appendix D).": "Tavern Builder (Apêndice D).",
        "🍺 Generate tavern": "🍺 Gerar taverna",
        "🍺 Generate tavern (Tavern Builder)": "🍺 Gerar taverna (Tavern Builder)",
        "Local production": "Produção local",
        "Crops, minerals and animals.": "Cultivos, minerais e animais.",
        "🌾 Generate production": "🌾 Gerar produção",
        "Scene details": "Detalhes da cena",
        "Smells, textures, time of day and art.": "Cheiros, texturas, hora do dia e arte.",
        "👃 Generate details": "👃 Gerar detalhes",
        "Adventure hook": "Gancho de aventura",
        "Hook/Situation Builder.": "Hook/Situation Builder.",
        "🎣 Generate hook": "🎣 Gerar gancho",
        "Personnel issues": "Problemas de pessoal",
        "For any NPC the party interacts with.": "Para qualquer NPC com quem o grupo interaja.",
        "Appendix B table for garrison and staff.": "Tabela do Apêndice B para guarnição e funcionários.",
        "🧑 Generate issue": "🧑 Gerar problema",
        "Location glossary": "Glossário de locais",
        "Fortress glossary": "Glossário de fortaleza",
        "Appendix A": "Apêndice A",
        "Appendix A terms": "termos do Apêndice A",
        "Settlement type": "Tipo de assentamento",
        "Trading Post": "Posto de Comércio",
        "Village": "Aldeia",
        "Town": "Cidade",
        "City": "Cidade Grande",
        "Capital": "Capital",
        "Villages have no table of their own, so the Trading Post/Town rule is used (optional).": "Aldeias não têm tabela própria, então é usada a regra de Posto de Comércio/Cidade (opcional).",
        "Extra: click to see the description": "Extra: clique para ver a descrição",
        "d20 + modifier must reach": "d20 + modificador deve atingir",
        "for an encounter.": "para um encontro.",
        "Close": "Fechar",
        "No additional description.": "Sem descrição adicional.",
        "Versions": "Versões",
        "poor": "simples",
        "fine": "refinada",
        "(poor) /": "(simples) /",
        "version of": "versão de",

        // Extras results
        "Check": "Teste",
        "needs": "necessário",
        "No urban encounter this time.": "Nenhum encontro urbano desta vez.",
        "Encounter": "Encontro",
        "Rumor": "Rumor",
        "rerolled: does not apply to this settlement type": "re-rolado: não se aplica a este tipo de assentamento",
        "Personnel issue": "Problema de pessoal",
        "Name": "Nome",
        "Reputation": "Reputação",
        "Patrons": "Clientela",
        "Staff": "Equipe",
        "Food": "Comida",
        "Drinks": "Bebidas",
        "patrons": "clientes",
        "Usual Crowd (up to about half capacity)": "Clientela habitual (até cerca de metade da capacidade)",
        "Few-to-None": "Poucos ou nenhum",
        "Crowded": "Lotada",
        "Short-Staffed": "Equipe reduzida",
        "Appropriate": "Adequada",
        "Overstaffed": "Equipe sobrando",
        "Time of day": "Hora do dia",
        "Smell": "Cheiro",
        "Touch": "Textura",
        "Street debris": "Detrito na rua",
        "Local art": "Arte local",
        "Local writing": "Escrita local",
        "Crop": "Cultivo",
        "Mineral": "Mineral",
        "Beast of burden": "Animal de carga",
        "Farm animal (meat)": "Animal de fazenda (carne)",
        "Farm animal (wool)": "Animal de fazenda (lã)",
        "Game": "Caça",
        "Urban encounter": "Encontro urbano",
        "NPC personnel issue": "Problema de pessoal de NPC",
        "Tavern (Tavern Builder)": "Taverna (Tavern Builder)",
        "Extras (generated on this page)": "Extras (gerados nesta página)",
        "Who": "Quem",
        "Problem": "Problema",
        "Appearance": "Aparência",
        "Emotion": "Emoção",
        "Action": "Ação",
        "Item of value": "Item de valor",
        "Clothing": "Vestimenta",
        "Pet": "Animal de estimação",
        "Baker": "Padeiro",
        "Butcher": "Açougueiro",
        "Cooper": "Tanoeiro",
        "Carpenter": "Carpinteiro",
        "General Store": "Armazém",
        "Herbalist": "Herbalista",
        "Smithy": "Forja",
        "Tailor": "Alfaiate",
        "Tanner/Taxidermist": "Curtidor/Taxidermista",
        "Thatcher": "Telhador",
        "Wainwright": "Carroceiro",
        "Weaver": "Tecelão",
        "Apothecary": "Botica",
        "Artist": "Artista",
        "Bank & Exchange": "Banco e câmbio",
        "Cobbler": "Sapateiro",
        "Foundry/Smelting": "Fundição",
        "Mill": "Moinho",
        "Textile Production": "Produção têxtil",
        "Shipwright": "Construtor naval",
        "Rare Botanicals": "Botânicos raros",
        "Luxury Furnishings": "Mobiliário de luxo",
        "Rare Libations and Fare": "Bebidas e iguarias raras",
        "Rare Trade Goods": "Mercadorias raras",
        "Magic Shop": "Loja de magia",
        "Barber": "Barbeiro",
        "Bathhouse": "Casa de banho",
        "Doctor": "Médico",
        "House of Leisure": "Casa de lazer",
        "Inn": "Estalagem",
        "Club": "Clube",
        "Soothsayer": "Adivinho",
        "Stable": "Estábulo",
        "Hired Help": "Ajudantes contratados",
        "Academy/University": "Academia/Universidade",
        "Archives/Library": "Arquivo/Biblioteca",
        "Schoolhouse": "Escola",
        "Amphitheater": "Anfiteatro",
        "Dance Hall": "Salão de dança",
        "Gathering Hall": "Salão de reuniões",
        "Outdoor Recreational Area": "Área de lazer ao ar livre",
        "Chancery": "Chancelaria",
        "Courthouse": "Tribunal",
        "Town Hall": "Prefeitura",
        "Treasury": "Tesouro",
        "Altar": "Altar",
        "Oratory": "Oratório",
        "Sanctuary": "Santuário",
        "Temple": "Templo",
        "Great Temple": "Grande templo",
        "Plains": "Planícies",
        "Forest": "Floresta",
        "Desert": "Deserto",
        "Mountains": "Montanhas",
        "Hills": "Colinas",
        "Swamp": "Pântano",
        "Coastal": "Costeiro",
        "Underground": "Subterrâneo",
        "Decree": "Decreto",
        "Resources": "Recursos",
        "Trade": "Comércio",
        "Strategic": "Estratégico",
        "Religious": "Religioso",
        "Political": "Político",
        "Natural": "Natural",
        "Magic": "Magia"
    };

    const DICTIONARIES = { en: {}, pt: PT };

    function detect() {
        let stored = null;
        try { stored = localStorage.getItem(STORAGE_KEY); } catch (error) { /* storage unavailable */ }
        if (SUPPORTED.includes(stored)) return stored;
        const browser = (navigator.languages && navigator.languages[0]) || navigator.language || "";
        return browser.toLowerCase().startsWith("pt") ? "pt" : "en";
    }

    let current = detect();

    function t(key) {
        const exact = DICTIONARIES[current][key];
        if (exact !== undefined) return exact;
        if (current !== "pt") return key;
        const needs = /^(\()?(needs \d+\+)(\))?$/.exec(key);
        if (needs) return `${needs[1] || ""}necessário ${needs[2].slice(6)}${needs[3] || ""}`;
        const district = /^District (\d+): (.+)$/.exec(key);
        if (district) return `${t("District")} ${district[1]}: ${t(district[2])}`;
        const districtPlural = /^(\d+) districts\.?$/.exec(key);
        if (districtPlural) return `${districtPlural[1]} distritos.`;
        return key;
    }

    const generatedTextKeys = new WeakMap();

    function translateGeneratedContent(root = document) {
        root.querySelectorAll(".generation-content h2, .generation-content h3").forEach(node => {
            node.dataset.i18nKey = node.dataset.i18nKey || node.textContent.trim();
            node.textContent = t(node.dataset.i18nKey);
        });

        const roots = [
            root.matches?.(".generation-content") ? root : root.querySelector(".generation-content"),
            ...root.querySelectorAll(".extras-card, .extra-modal")
        ].filter(Boolean);
        if (root.nodeType === Node.ELEMENT_NODE && root.closest(".generation-content, .extras-card, .extra-modal")) {
            roots.push(root);
        }

        for (const content of roots) {
            const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
            while (walker.nextNode()) {
                const node = walker.currentNode;
                const original = generatedTextKeys.get(node) ?? node.nodeValue;
                if (!generatedTextKeys.has(node)) generatedTextKeys.set(node, original);
                const trimmed = original.trim();
                if (!trimmed) continue;
                const punctuated = /^(.+?)([.,:;!?]+)$/.exec(trimmed);
                const translated = punctuated && t(punctuated[1]) !== punctuated[1]
                    ? `${t(punctuated[1])}${punctuated[2]}`
                    : t(trimmed);
                if (translated !== trimmed) {
                    const start = original.indexOf(trimmed);
                    node.nodeValue = original.slice(0, start) + translated + original.slice(start + trimmed.length);
                } else if (current === "en") {
                    node.nodeValue = original;
                }
            }
        }
    }

    function apply(root = document) {
        root.querySelectorAll("[data-i18n]").forEach(node => {
            node.dataset.i18nKey = node.dataset.i18nKey || node.textContent.trim();
            node.textContent = t(node.dataset.i18nKey);
        });
        root.querySelectorAll("[data-i18n-aria]").forEach(node => {
            node.dataset.i18nAriaKey = node.dataset.i18nAriaKey || node.getAttribute("aria-label");
            node.setAttribute("aria-label", t(node.dataset.i18nAriaKey));
        });
        root.querySelectorAll("[data-i18n-title]").forEach(node => {
            node.dataset.i18nTitleKey = node.dataset.i18nTitleKey || node.getAttribute("title");
            node.setAttribute("title", t(node.dataset.i18nTitleKey));
        });
        root.querySelectorAll("[data-lang-switch]").forEach(node => {
            node.setAttribute("aria-pressed", String(node.dataset.langSwitch === current));
        });
        translateGeneratedContent(root);
        if (root === document) {
            window.I18N.titleKey = window.I18N.titleKey || document.title;
            document.title = t(window.I18N.titleKey);
            document.documentElement.lang = current;
        }
    }

    function set(lang) {
        if (!SUPPORTED.includes(lang) || lang === current) return;
        current = lang;
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (error) { /* storage unavailable */ }
        apply(document);
        document.dispatchEvent(new CustomEvent("i18n:change", { detail: { lang } }));
    }

    window.I18N = { t, source: key => key, apply, set, get: () => current, titleKey: null, translateGeneratedContent };
    window.t = t;

    document.addEventListener("click", event => {
        const button = event.target.closest("[data-lang-switch]");
        if (button) set(button.dataset.langSwitch);
    });
    document.addEventListener("DOMContentLoaded", () => apply(document));
})();
