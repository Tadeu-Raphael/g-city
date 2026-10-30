// Town generator based on "Spectacular Settlements" (Chapter Four: Towns).
// Tables are [maxRoll, name, description, modifiers]; a roll <= 0 counts as the first entry
// and a roll above the maximum counts as the last one.

const mods = {};
const state = {
    priority: 0,
    specialty: 0,
    sizeIndex: 2,
    environment: "",
    waterside: false,
    freeNonCommercial: [],
    freeShops: [],
    freeServices: [],
    innQuality: null,
    commercialBonus: 0
};

const SIZE_NAMES = ["Very Small", "Small", "Medium", "Large", "Very Large"];
const NON_COMMERCIAL_COUNT = [1, 2, 3, 4, 5];
const COMMERCIAL_COUNT = [4, 6, 8, 10, 12];
const FARM_ROLLS = [1, 2, 2, 3, 3];

function modValue(name) {
    return mods[name] || 0;
}

function addMods(effects) {
    for (const name in effects) {
        mods[name] = modValue(name) + logMod(name, effects[name]);
    }
}

function lookup(table, roll) {
    return table.find(entry => roll <= entry[0]) || table[table.length - 1];
}

function show(id, html) {
    document.getElementById(id).innerHTML = html;
}

function describe(entry) {
    return `<b>${entry[1]}.</b> ${entry[2]}`;
}

function effectNote(effects) {
    const parts = Object.entries(effects || {}).map(([name, amount]) => `${formatSigned(amount)} ${modifierLabel(name)}`);
    return parts.length ? ` (${parts.join(", ")})` : "";
}

// Rolls on a table, applies and shows the modifiers it grants, and returns the entry and roll.
function rollTable(id, sides, table, modName = "") {
    setGenContext(id);
    const roll = rollDie(sides, modName ? modValue(modName) : 0, modName);
    const entry = lookup(table, roll);

    if (entry[3]) {
        addMods(entry[3]);
    }
    show(id, describe(entry) + effectNote(entry[3]));

    return { entry, roll };
}

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

// Tables
const ORIGIN = [
    [1, "Accidental", "The town was never meant to be anything more than a camp or minor settlement. Outsiders found the place, some stayed, some left and told others, and over time the place grew."],
    [2, "Decree", "Some authority decided a town was needed here, set aside funds and materials, and established it."],
    [3, "Exodus or Exile", "A group of settlers left (or were forced to leave) their home, found this place and decided to build."],
    [4, "Key Crossroads", "The town was established on a crossroads frequented by travelers from all over."],
    [5, "Military Camp", "A deployment lasted longer than anticipated, so the camp built more solid fortifications and became permanent. Either the original members still reside here, or others occupied it after they left."],
    [6, "Port", "The town established itself on the water where none had done so previously, sprouting piers and roads taken by merchants and travelers alike."],
    [7, "Rapid", "Fueled by ambition, strong will and access to excellent products or resources, a group of people created this town in an important location. It almost seemed to spring up overnight."],
    [8, "Steady", "Built piece by piece over time, this town was a labor of commitment and devotion, taking years or even decades."]
];

const PRIORITY = [
    [1, "Military", "The town prioritizes defenses and law enforcement.", { fortificationMod: 1, lawEnforcementMod: 1 }],
    [2, "Government", "The town prioritizes structure, order and law. Reroll any leadership result from 91-100. Free location: Non-Commercial - Place of Government.", { lawEnforcementMod: 1 }],
    [3, "Production", "The town prioritizes generation and movement of resources. Roll a d4 instead of a d8 on the specialty table."],
    [4, "Economic", "The town prioritizes its market, with a large area, wide streets, more shops and lodging. Consider the town 1 size category larger on the commercial locations table.", { marketSquareMod: 2 }],
    [5, "Religious", "The town contains substantial temples in prominent locations. Free location: Non-Commercial - Place of Worship, with +5 to its size roll."],
    [6, "Magic", "The town is focused on some form of magical pursuit. Free location: Shop - Magic Shop."]
];

const SPECIALTY = [
    [1, "Craft", "The town is known for the quality of its craftspeople."],
    [2, "Farming/Resource Gathering", "The town is known for its farms or resources. +1 to the farms and resources roll, rerolling results of 1-8."],
    [3, "Industry", "The town is known for its industrial output. Free shop: Mill, Textile Production or Foundry/Smelting."],
    [4, "Unique Shipping Methods", "The town is known for unusual ways of moving goods."],
    [5, "Connections", "The town is known for the people and contacts it has."],
    [6, "Drink", "The town is known for its drinks."],
    [7, "Education", "The town is known for its learning. Free location: Non-Commercial - Place of Education."],
    [8, "Hospitality", "The town is known for its hospitality. The default inn quality is d6: 1-3 good, 4-6 fine."]
];

const AGE = [
    [2, "Recent", "The town was founded recently.", { populationDensityMod: -2 }],
    [4, "Established", "The town has been settled for a good while.", { populationDensityMod: -1 }],
    [6, "Mature", "The town has settled into its ways."],
    [8, "Old", "The town has stood for generations.", { populationDensityMod: 1 }],
    [10, "Ancient", "The town has existed for centuries.", { populationDensityMod: 2 }]
];

const SIZE = [
    [2, "Very Small", "About 1000 people.", { populationOverflowMod: 2 }],
    [6, "Small", "About 2000 people.", { populationOverflowMod: 1 }],
    [14, "Medium", "About 4000 people."],
    [18, "Large", "About 6000 people.", { populationOverflowMod: -1 }],
    [20, "Very Large", "About 8000 people.", { populationOverflowMod: -2 }]
];

const CONDITION = [
    [1, "Derelict", "The town is in ruinous shape.", { populationWealthMod: -6 }],
    [4, "Lousy", "The town is in poor shape.", { populationWealthMod: -3 }],
    [12, "Moderate", "The town is in ordinary shape."],
    [19, "Robust", "The town is in good shape.", { populationWealthMod: 3 }],
    [20, "Superb", "The town is in excellent shape.", { populationWealthMod: 6 }]
];

const ENVIRONMENT = [
    [1, "Coastal", "The town sits on the coast."],
    [2, "Forest", "The town sits in or near a forest."],
    [3, "Mountains", "The town sits in the mountains."],
    [4, "Plains", "The town sits on open plains."],
    [5, "River", "The town sits along a river."],
    [6, "Swamp", "The town sits in a swamp."],
    [7, "Underground", "The town lies underground."],
    [8, "Valley", "The town sits in a valley."],
    [9, "Tundra", "The town sits in the tundra."],
    [10, "Desert", "The town sits in a desert."]
];

const PROSPERITY = [
    [1, "Abysmal Failure", "The town has done terribly.", { visitorTrafficMod: -8, populationWealthMod: -13 }],
    [4, "Failure", "The town has done poorly.", { visitorTrafficMod: -6, populationWealthMod: -6 }],
    [10, "Mildly Successful", "The town has done modestly.", { visitorTrafficMod: -1, populationWealthMod: -3 }],
    [16, "Successful", "The town has done well."],
    [19, "Very Successful", "The town has done very well.", { visitorTrafficMod: 2, populationWealthMod: 3 }],
    [20, "Incredibly Successful", "The town has thrived beyond measure.", { visitorTrafficMod: 6, populationWealthMod: 6 }]
];

const MARKET_SQUARE = [
    [2, "Tight", "The market square is cramped."],
    [4, "Ample", "The market square has plenty of room."],
    [6, "Spacious", "The market square is large and open."]
];

const VENDOR_STALL = [
    [1, "First Come, No Fee", "Vendors take a spot on a first come basis, free of charge."],
    [2, "First Come, Fee", "Vendors take a spot on a first come basis, for a fee."],
    [3, "Lease", "Vendors lease their stall spots."],
    [4, "Bid", "Vendors bid for their stall spots."]
];

const MERCHANT_OVERFLOW = [
    [1, "Banned", "Merchants may not sell outside the market square.", { lawEnforcementMod: 1 }],
    [2, "Unpatrolled", "Merchants selling outside the market square are left alone."],
    [3, "Monitored", "Merchants selling outside the market square are watched."],
    [4, "Encouraged", "Merchants are encouraged to sell all around town."]
];

const FORTIFICATION = [
    [1, "Unfortified", "The town has no defenses.", { dispositionMod: -5 }],
    [8, "Lightly Fortified", "The town has light defenses.", { dispositionMod: 1 }],
    [15, "Fortified", "The town is fortified.", { dispositionMod: 3 }],
    [19, "Heavily Fortified", "The town is heavily fortified.", { dispositionMod: 5 }],
    [20, "Extremely Fortified", "The town is extremely fortified. Consider adding a fortress (Chapter 7).", { dispositionMod: 7 }]
];

const POPULATION_DENSITY = [
    [2, "Skeleton", "The town is nearly empty.", { populationOverflowMod: -2, nightActivityMod: -2 }],
    [6, "Sparse", "The town is thinly populated.", { populationOverflowMod: -1, nightActivityMod: -1 }],
    [14, "Populous", "The town is comfortably populated."],
    [18, "Dense", "The town is densely populated.", { populationOverflowMod: 1, nightActivityMod: 1 }],
    [20, "Crowded", "The town is crowded.", { populationOverflowMod: 2, nightActivityMod: 2 }]
];

const POPULATION_OVERFLOW = [
    [1, "Less than 10%", "Fewer than 10% of the population lives outside the walls."],
    [4, "10%", "10% of the population lives outside the town proper."],
    [12, "20%", "20% of the population lives outside the town proper."],
    [17, "30%", "30% of the population lives outside the town proper."],
    [19, "40%", "40% of the population lives outside the town proper."],
    [20, "50%", "50% of the population lives outside the town proper."]
];

const FARMS = [
    [4, "None", "No farms or resources here."],
    [11, "Farming [Agriculture]", "Crop fields surround the town."],
    [16, "Farming [Livestock]", "Livestock is raised around the town."],
    [20, "Resource Harvesting", "The town harvests a local resource."]
];

const VISITOR_TRAFFIC = [
    [3, "Mostly Locals", "Almost everyone seen in town is local.", { nightActivityMod: 0 }],
    [9, "Groups", "Small groups of visitors come and go.", { nightActivityMod: 1 }],
    [14, "Crowds", "Crowds of visitors are common.", { nightActivityMod: 2 }],
    [17, "Droves", "Visitors arrive in droves.", { nightActivityMod: 3 }],
    [19, "Masses", "Masses of visitors fill the town.", { nightActivityMod: 4 }],
    [20, "Multitudes", "Multitudes of visitors constantly arrive.", { nightActivityMod: 5 }]
];

const NIGHT_ACTIVITY = [
    [2, "Dark", "The town is dark and shut at night."],
    [6, "Quiet", "The town is quiet at night."],
    [14, "Slow", "Some places stay open at night."],
    [18, "Active", "The town is active at night."],
    [20, "Lively", "The town is lively all night."]
];

const DEMOGRAPHICS = [
    [4, "Only One", "The population is 100% of one primary race."],
    [8, "Only Two", "The population is split 60%/40% between two races."],
    [14, "Normal Distribution", "The population is 50% primary, then 25%, 15% and 10% other races."],
    [17, "Wide Distribution", "20% of the population is the primary race, and others are reasonably well represented."],
    [19, "High and Low", "The population is split 80%/20%."],
    [20, "Ever-Changing", "The population shifts constantly."]
];

const DISPOSITION = [
    [2, "Hostile", "The townsfolk are hostile to outsiders."],
    [6, "Unfriendly", "The townsfolk are unfriendly to outsiders."],
    [14, "Neutral", "The townsfolk are neutral to outsiders."],
    [18, "Friendly", "The townsfolk are friendly to outsiders."],
    [20, "Open", "The townsfolk are open and welcoming."]
];

const LEADERSHIP = [
    [15, "Town Council", "A council governs the town. Free location: Non-Commercial - Town Hall.", {}, "townHall"],
    [30, "Mayor", "A mayor governs the town."],
    [45, "Hereditary", "A hereditary ruler governs the town."],
    [60, "Merchant Monarch", "A wealthy merchant rules the town. +2 to the commercial locations number.", {}, "monarch"],
    [75, "Military Rule", "The military runs the town.", { lawEnforcementMod: 1 }],
    [90, "Oligarchy", "A small group rules the town.", {}, "oligarchy"],
    [99, "Underworld/Criminal Enterprise", "Criminals pull the strings in the town.", { crimeMod: -1 }],
    [100, "Anarcho-Syndicalist Commune", "The town is run as a commune."]
];

const OLIGARCHY_GROUPS = ["Merchants (plutocracy)", "Mages (magocracy)", "Priests (theocracy)", "Other"];

const LAW_ENFORCEMENT = [
    [1, "None", "There is no law enforcement.", { crimeMod: -8 }],
    [4, "Sheriff", "A sheriff keeps the peace.", { crimeMod: -4 }],
    [9, "Small Town Watch", "A small watch keeps the peace.", { crimeMod: -2 }],
    [16, "Town Watch", "A town watch keeps the peace."],
    [19, "Strong Town Watch", "A strong watch keeps the peace.", { crimeMod: 4 }],
    [20, "Extensive Town Watch", "An extensive watch keeps the peace.", { crimeMod: 8 }]
];

const POPULATION_WEALTH = [
    [2, "Destitute", "The population is destitute.", { crimeMod: -4, qualityMod: -2 }],
    [6, "Impoverished", "The population is poor.", { crimeMod: -2, qualityMod: -1 }],
    [14, "Average", "The population is of average means."],
    [17, "Prosperous", "The population is prosperous.", { crimeMod: -1, qualityMod: 1 }],
    [19, "Wealthy", "The population is wealthy.", { crimeMod: -2, qualityMod: 2 }],
    [20, "Affluent", "The population is affluent.", { crimeMod: -3, qualityMod: 3 }]
];

const CRIME = [
    [2, "Regular", "Crime is a regular occurrence.", { urbanEncounterMod: 4 }],
    [6, "Common", "Crime is common.", { urbanEncounterMod: 3 }],
    [14, "Average", "Crime is average.", { urbanEncounterMod: 2 }],
    [18, "Uncommon", "Crime is uncommon.", { urbanEncounterMod: 1 }],
    [20, "Rare", "Crime is rare.", { urbanEncounterMod: 0 }]
];

const NON_COMMERCIAL_TYPES = ["Education", "Gathering", "Government", "Worship"];
const EDUCATION = ["Academy/University", "Archives/Library", "Forum", "Schoolhouse"];
const GATHERING = ["Amphitheater", "Dance Hall", "Gathering Hall", "Outdoor Recreational Area"];
const GOVERNMENT = ["Chancery", "Courthouse", "Town Hall", "Treasury"];
const NON_COMMERCIAL_SUBTYPES = { Education: EDUCATION, Gathering: GATHERING, Government: GOVERNMENT };

const WORSHIP_SIZE = [
    [1, "Secret"], [5, "Altar"], [10, "Oratory"], [16, "Sanctuary"], [19, "Temple"], [20, "Great Temple"]
];
const WORSHIP_FERVENCY = [
    [1, "Unseen"], [5, "Quiet"], [10, "Subtle"], [16, "Moderate"], [19, "Fervent"], [20, "Zealous"]
];
const WORSHIP_ALIGNMENT = [[1, "Evil"], [5, "Neutral"], [10, "Good"]];

const MAGIC_SHOPS = ["Armor", "Books", "Clothing", "Jewelry", "Weapons", "Misc & Curiosities"];

// Third item: B = Basic, S = Specialty, E = Exotic
const SHOPS = [
    [4, "Baker", "B"], [8, "Butcher", "B"], [12, "Cooper", "B"], [16, "Carpenter", "B"],
    [24, "General Store", "B"], [28, "Herbalist", "B"], [36, "Smithy", "B"], [40, "Tailor", "B"],
    [44, "Tanner/Taxidermist", "B"], [48, "Thatcher", "B"], [52, "Wainwright", "B"], [56, "Weaver", "B"],
    [59, "Alchemist", "S"], [62, "Artist", "S"], [65, "Bank & Exchange", "S"], [68, "Cobbler", "S"],
    [71, "Foundry/Smelting", "S"], [74, "Mill", "S"], [77, "Textile Production", "S"], [80, "Shipwright", "S"],
    [82, "Rare Botanicals", "E"], [84, "Luxury Furnishings", "E"], [86, "Rare Libations & Fare", "E"],
    [88, "Rare Trade Goods", "E"], [90, "Magic Shop - Armor", "E"], [92, "Magic Shop - Books", "E"],
    [94, "Magic Shop - Clothing", "E"], [96, "Magic Shop - Jewelry", "E"], [98, "Magic Shop - Weapons", "E"],
    [100, "Magic Shop - Misc & Curiosities", "E"]
];
const SHOP_CLASS = { B: "Basic", S: "Specialty", E: "Exotic" };

const SERVICES = [
    [8, "Barber"], [16, "Bathhouse"], [24, "Doctor/Apothecary"], [32, "House of Leisure"], [44, "Inn"],
    [52, "Club"], [60, "Soothsayer"], [68, "Stable"], [80, "Tavern"],
    [82, "Hired Help - Brutes and Brawlers"], [84, "Hired Help - Cloak and Dagger"],
    [86, "Hired Help - Bows and Slings"], [88, "Hired Help - Scribes and Clerks"],
    [90, "Hired Help - Guides and Trackers"], [92, "Hired Help - Caravan and Mount"],
    [94, "Hired Help - Arcane Academics"], [96, "Hired Help - Magic Mercenaries"],
    [98, "Hired Help - Priestly Guidance"], [100, "Hired Help - Hands of the Divine"]
];

const POOR_FINE_NAMES = {
    "Barber": ["Dirt Knife", "Coiffeur"],
    "Bathhouse": ["Tubs", "Private Baths"],
    "Doctor/Apothecary": ["Sawbones", "Physician"],
    "House of Leisure": ["Den of Leisure", "Hall of Leisure"],
    "Inn": ["Tents or Hostel", "Lodge"],
    "Club": ["Stage", "Theater"],
    "Soothsayer": ["Fortune Teller", "Diviner"],
    "Stable": ["Stalls", "Livery"],
    "Tavern": ["Pub", "Taphouse"]
};

const HIRED_HELP_SIZE = [[6, "Individual"], [10, "Team"], [12, "Guild"]];

const RECENT_HISTORY = [
    "Defended: the town recently defended itself against a threat.",
    "Pickpockets: a wave of pickpockets has been troubling the town.",
    "No Adventurers: adventurers are unwelcome or unusually absent.",
    "Asleep: the town is oddly sleepy, as if something has drained its energy.",
    "Spiders: spiders have been appearing everywhere.",
    "Tunnel: a mysterious tunnel was recently discovered.",
    "Obstruction: something is blocking a main road or gate.",
    "Event Night: a special night event is planned in town."
];

const NOTEWORTHY_OFFICIAL = [
    "Catchpole", "Clerk", "Exchequer", "Jailer", "Judge", "Liner", "Master of Revels", "Master of Stores"
];

const OFFICIAL_COMPETENCE = [
    [1, "Corrupt"], [3, "Incompetent"], [5, "Committed"], [6, "Overqualified"]
];

const MARKET_DAY = [
    "A monkey merchant is selling trinkets.",
    "Heavy rain turns the market to mud.",
    "Produce is selling at half price.",
    "Cattle have gotten loose in the market.",
    "A stall catches fire.",
    "A puppet show parodies local figures.",
    "Bandits are posing as merchants.",
    "A child is caught stealing an apple.",
    "A wedding reception spills into the market.",
    "A tavern special draws a long line.",
    "An injured guard faints.",
    "An infested wagon arrives."
];

// Basic Information
originValue();
priorityValue();
specialtyValue();
ageValue();
sizeValue();
conditionValue();
environmentValue();
prosperityValue();
marketSquareValue();
vendorStallAcquisitonValue();
merchantOverflowValue();
fortificationValue();

// Community
populationDensityValue();
populationOverflowValue();
farmsAndResourcesValue();
visitorTrafficValue();
nightActivityValue();
demographicsValue();
dispositionValue();
leadershipValue();
lawEnforcementValue();
populationWealthValue();
crimeValue();

// Points of Interest
nonCommercialLocationsValue();
commercialLocationsValue();
shopsValue();
servicesValue();

// Extra Intrigue
recentHistoryValue();
noteworthyOfficialValue();
marketDayValue();

function originValue() {
    const { entry, roll } = rollTable("origin", 8, ORIGIN);

    if (roll === 6) {
        const water = rollDie(6) <= 3 ? "Coastal" : "River";
        state.environment = water;
        state.waterside = true;
        show("origin", describe(entry) + ` (Environment: ${water})`);
    }
}

function priorityValue() {
    const { roll } = rollTable("priority", 6, PRIORITY);
    state.priority = roll;

    if (roll === 2) {
        state.freeNonCommercial.push({ type: "Government", name: "Place of Government" });
    } else if (roll === 5) {
        state.freeNonCommercial.push({ type: "Worship", name: "Place of Worship", sizeBonus: 5 });
    } else if (roll === 6) {
        setGenContext("priority");
        state.freeShops.push("Magic Shop - " + MAGIC_SHOPS[rollDie(6) - 1]);
    }
}

function specialtyValue() {
    const sides = state.priority === 3 ? 4 : 8;
    const { roll } = rollTable("specialty", sides, SPECIALTY);
    state.specialty = roll;

    if (roll === 3) {
        state.freeShops.push(["Mill", "Mill", "Textile Production", "Textile Production", "Foundry/Smelting", "Foundry/Smelting"][rollDie(6) - 1]);
    } else if (roll === 7) {
        state.freeNonCommercial.push({ type: "Education", name: "Place of Education" });
    } else if (roll === 8) {
        state.innQuality = rollDie(6) <= 3 ? "Good" : "Fine";
    }
}

function ageValue() {
    rollTable("age", 10, AGE);
}

function sizeValue() {
    const { entry } = rollTable("size", 20, SIZE);
    state.sizeIndex = SIZE.indexOf(entry);
}

function conditionValue() {
    rollTable("condition", 20, CONDITION);
}

function environmentValue() {
    if (state.environment) {
        show("environment", `<b>${state.environment}.</b> Set by the Port origin; this roll is skipped.`);
        return;
    }

    const { entry } = rollTable("environment", 10, ENVIRONMENT);
    state.environment = entry[1];
    state.waterside = ["Coastal", "River"].includes(entry[1]);
}

function prosperityValue() {
    rollTable("prosperity", 20, PROSPERITY);
}

function marketSquareValue() {
    rollTable("marketSquare", 6, MARKET_SQUARE, "marketSquareMod");
}

function vendorStallAcquisitonValue() {
    rollTable("vendorStallAcquisiton", 4, VENDOR_STALL);
}

function merchantOverflowValue() {
    rollTable("merchantOverflow", 4, MERCHANT_OVERFLOW);
}

function fortificationValue() {
    rollTable("fortification", 20, FORTIFICATION, "fortificationMod");
}

function populationDensityValue() {
    rollTable("populationDensity", 20, POPULATION_DENSITY, "populationDensityMod");
}

function populationOverflowValue() {
    rollTable("populationOverflow", 20, POPULATION_OVERFLOW, "populationOverflowMod");
}

function farmsAndResourcesValue() {
    setGenContext("farmsAndResources");
    const farming = state.specialty === 2;
    const results = [];

    for (let i = 0; i < FARM_ROLLS[state.sizeIndex]; i++) {
        let roll = rollDie(20, farming ? 1 : 0, farming ? "farmsAndResourcesMod" : "");
        if (farming && roll <= 8) {
            roll = rollDie(20, 1, "farmsAndResourcesMod");
        }
        results.push(describe(lookup(FARMS, roll)));
    }

    if (farming) {
        logMod("farmsAndResourcesMod", 1);
    }
    show("farmsAndResources", results.join("<br>"));
}

function visitorTrafficValue() {
    rollTable("visitorTraffic", 20, VISITOR_TRAFFIC, "visitorTrafficMod");
}

function nightActivityValue() {
    rollTable("nightActivity", 20, NIGHT_ACTIVITY, "nightActivityMod");
}

function demographicsValue() {
    rollTable("demographics", 20, DEMOGRAPHICS);
}

function dispositionValue() {
    rollTable("disposition", 20, DISPOSITION, "dispositionMod");
}

function leadershipValue() {
    setGenContext("leadership");
    let roll = rollDie(100);
    while (state.priority === 2 && roll > 90) {
        roll = rollDie(100);
    }

    const entry = lookup(LEADERSHIP, roll);
    let text = describe(entry);
    addMods(entry[3] || {});

    if (entry[4] === "townHall") {
        state.freeNonCommercial.push({ type: "Government", name: "Town Hall", fixed: true });
    } else if (entry[4] === "monarch") {
        state.commercialBonus = 2;
        logMod("commercialLocationsMod", 2);
    } else if (entry[4] === "oligarchy") {
        const group = OLIGARCHY_GROUPS[rollDie(4) - 1];
        const type = NON_COMMERCIAL_TYPES[rollDie(4) - 1];
        state.freeNonCommercial.push({ type, name: `Place of ${type}` });
        text += ` Ruling group: ${group}. Free location: Non-Commercial - ${type}.`;
    }

    show("leadership", text + effectNote(entry[3]));
}

function lawEnforcementValue() {
    rollTable("lawEnforcement", 20, LAW_ENFORCEMENT, "lawEnforcementMod");
}

function populationWealthValue() {
    rollTable("populationWealth", 20, POPULATION_WEALTH, "populationWealthMod");
}

function crimeValue() {
    rollTable("crime", 20, CRIME, "crimeMod");
}

function describeNonCommercial(location) {
    if (location.type === "Worship") {
        setGenContext("nonCommercialLocations");
        const size = lookup(WORSHIP_SIZE, rollDie(20, location.sizeBonus || 0, location.sizeBonus ? "placesWorshipMod" : ""))[1];
        const fervency = lookup(WORSHIP_FERVENCY, rollDie(20))[1];
        const alignment = lookup(WORSHIP_ALIGNMENT, rollDie(10))[1];
        return `<b>Place of Worship</b> - ${size}, ${fervency} following, ${alignment}`;
    }

    return `<b>${location.name}</b>`;
}

function nonCommercialLocationsValue() {
    setGenContext("nonCommercialLocations");
    const locations = [...state.freeNonCommercial];
    const total = NON_COMMERCIAL_COUNT[state.sizeIndex] + locations.length;
    const used = new Set();

    for (const location of locations) {
        if (NON_COMMERCIAL_SUBTYPES[location.type] && !location.fixed) {
            location.name = rollSubtype(location.type, used);
        } else if (NON_COMMERCIAL_SUBTYPES[location.type]) {
            used.add(location.name);
        }
    }

    while (locations.length < total) {
        const type = NON_COMMERCIAL_TYPES[rollDie(4) - 1];
        const location = { type, name: `Place of ${type}` };

        if (NON_COMMERCIAL_SUBTYPES[type]) {
            location.name = rollSubtype(type, used);
        }
        locations.push(location);
    }

    show("nonCommercialLocations", locations.map(describeNonCommercial).join("<br>"));
}

// Duplicates are treated as another location: reroll until an unused subtype shows up.
function rollSubtype(type, used) {
    const options = NON_COMMERCIAL_SUBTYPES[type];
    let name = options[rollDie(4) - 1];

    for (let i = 0; i < 20 && used.has(name); i++) {
        name = options[rollDie(4) - 1];
    }
    used.add(name);

    return name;
}

function commercialLocationsValue() {
    const index = Math.min(state.sizeIndex + (state.priority === 4 ? 1 : 0), SIZE_NAMES.length - 1);
    const total = COMMERCIAL_COUNT[index] + state.commercialBonus;
    state.commercialTotal = total;
    show("commercialLocations", `<b>${total} commercial locations</b> (${SIZE_NAMES[index]} town${state.commercialBonus ? ", +2 Merchant Monarch" : ""}). General Store, Smithy, Inn and Tavern are free and not counted.`);
}

function qualityOf(forcedQuality) {
    if (forcedQuality) {
        return forcedQuality;
    }

    const roll = rollDie(12, modValue("qualityMod"), "qualityMod");
    return roll <= 4 ? "Poor" : roll <= 10 ? "Good" : "Fine";
}

function describeShop(name, classification) {
    const kind = classification ? ` (${SHOP_CLASS[classification]})` : "";
    return `<b>${name}</b>${kind} - ${qualityOf()}`;
}

function describeService(name, forcedQuality) {
    const quality = qualityOf(forcedQuality);
    const names = POOR_FINE_NAMES[name];
    let label = name;
    let extra = "";

    if (names && quality !== "Good") {
        label = names[quality === "Poor" ? 0 : 1];
    }
    if (name.startsWith("Hired Help")) {
        extra = ` - ${lookup(HIRED_HELP_SIZE, rollDie(12))[1]}`;
    }

    return `<b>${label}</b>${extra} - ${quality}`;
}

function shopsValue() {
    setGenContext("shops");
    const lines = [describeShop("General Store", "B"), describeShop("Smithy", "B")];

    state.freeShops.forEach(name => {
        const entry = SHOPS.find(shop => shop[1] === name);
        lines.push(describeShop(name, entry ? entry[2] : "E"));
    });

    state.shopCount = 0;
    state.serviceCount = 0;
    const rolls = [];

    for (let i = 0; i < state.commercialTotal; i++) {
        setGenContext("commercialLocations");
        rolls.push(rollDie(6) <= 3 ? "shop" : "service");
    }

    setGenContext("shops");
    rolls.filter(kind => kind === "shop").forEach(() => {
        let entry = lookup(SHOPS, rollDie(100));
        while (entry[1] === "Shipwright" && !state.waterside) {
            entry = lookup(SHOPS, rollDie(100));
        }

        let name = entry[1];
        if (name === "Smithy") {
            const smith = rollDie(10);
            name = smith <= 6 ? "Smithy" : smith <= 8 ? "Smithy - Armorer" : "Smithy - Weaponsmith";
        }
        lines.push(describeShop(name, entry[2]));
    });

    state.serviceCount = rolls.filter(kind => kind === "service").length;
    show("shops", lines.join("<br>"));
}

function servicesValue() {
    setGenContext("services");
    const lines = [describeService("Inn", state.innQuality), describeService("Tavern")];

    for (let i = 0; i < state.serviceCount; i++) {
        lines.push(describeService(lookup(SERVICES, rollDie(100))[1]));
    }

    show("services", lines.join("<br>"));
}

function recentHistoryValue() {
    setGenContext("recentHistory");
    const text = RECENT_HISTORY[rollDie(8) - 1];
    const [title, description] = text.split(": ");
    show("recentHistory", `<b>${title}.</b> ${description}`);
}

function noteworthyOfficialValue() {
    setGenContext("noteworthyOfficial");
    const official = NOTEWORTHY_OFFICIAL[rollDie(8) - 1];
    const competence = lookup(OFFICIAL_COMPETENCE, rollDie(6))[1];
    show("noteworthyOfficial", `<b>${official}.</b> Competence: ${competence}.`);
}

function marketDayValue() {
    setGenContext("marketDay");
    const text = MARKET_DAY[rollDie(12) - 1];
    show("marketDay", text);
}
