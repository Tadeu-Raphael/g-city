// City generator based on "Spectacular Settlements" (Chapter Five: Cities).
// Tables are [maxRoll, name, description, modifiers]; a roll <= 0 counts as the first entry
// and a roll above the maximum counts as the last one.

const mods = {};
const state = {
    priority: 0,
    sizeIndex: 2,
    capacity: 24000,
    environment: "",
    waterside: false,
    conditionLevel: 2,
    crimeLevel: 2,
    forcedDistricts: [],
    guilds: {}
};

const SIZE_NAMES = ["Very Small", "Small", "Medium", "Large", "Very Large"];
const OUTSIDE_ROLLS = [5, 4, 3, 2, 1];
const ADDITIONAL_ROLLS = [1, 2, 3, 4, 5];
const CONDITION_LEVELS = ["Squalid", "Dilapidated", "Decent", "Impressive", "Magnificent"];
const CONDITION_CRIME_MOD = [-2, -1, 0, -1, -2];
const CRIME_LEVELS = ["Dangerous", "Frequent", "Common", "Uncommon", "Infrequent"];
const QUALITY_LEVELS = ["Poor", "Good", "Fine"];

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

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// Tables
const ORIGIN = [
    [1, "Invading Occupation", "An invading force took the place and settled, building the city over what was there before."],
    [2, "Tribal Home", "The city grew from the permanent home of a tribe or clan of people."],
    [3, "Natural Progression - Trading Post", "A trading post prospered over time until it became a city."],
    [4, "Repurposed History", "The city was built on or around the remains of something older, such as ruins or a former stronghold."],
    [5, "Natural Progression - Village", "A village grew steadily until it became a city."],
    [6, "Haven", "The city was founded as a refuge for people seeking safety."],
    [7, "Advantageous Position", "The city was founded because of an excellent location or access to valuable resources."],
    [8, "Prison", "The city began as a prison or penal colony and grew around it."],
    [9, "Agriculture", "The city grew around fertile lands and the farming that fed it."],
    [10, "Magical", "The city was founded around, or by, some magical phenomenon or power."]
];

const PRIORITY = [
    [1, "Control", "The city prioritizes order and authority.", { lawEnforcementMod: 3 }],
    [2, "Trade", "The city prioritizes commerce.", { populationWealthMod: 1 }],
    [3, "Enlightenment", "The city prioritizes learning. A Scholar District is forced."],
    [4, "Entertainment", "The city prioritizes leisure. Each district gets one entertainment venue among its additional locations."],
    [5, "Production", "The city prioritizes output. The first Outside the City roll rerolls results of 1-4."],
    [6, "Faith", "The city prioritizes religion. A Temple District is forced."]
];

const AGE = [
    [2, "Recent", "The city was founded recently.", { populationDensityMod: -2 }],
    [4, "Established", "The city has been settled for a good while.", { populationDensityMod: -1 }],
    [6, "Mature", "The city has settled into its ways."],
    [8, "Old", "The city has stood for generations.", { populationDensityMod: 1 }],
    [10, "Ancient", "The city has existed for centuries.", { populationDensityMod: 2 }]
];

const SIZE = [
    [2, "Very Small", "Capacity of about 8,000 people.", { districtCountMod: -4 }],
    [6, "Small", "Capacity of about 16,000 people.", { districtCountMod: -1 }],
    [14, "Medium", "Capacity of about 24,000 people."],
    [18, "Large", "Capacity of about 32,000 people.", { districtCountMod: 2 }],
    [20, "Very Large", "Capacity of 40,000 or more people.", { districtCountMod: 6 }]
];
const CAPACITIES = [8000, 16000, 24000, 32000, 40000];

const POPULATION_CAPACITY = [
    [1, "Half", "The city holds half of its capacity.", 0.5],
    [3, "Half-Again", "The city holds one and a half times its capacity.", 1.5],
    [10, "Double", "The city holds twice its capacity.", 2],
    [14, "Triple", "The city holds three times its capacity.", 3],
    [17, "Quintuple", "The city holds five times its capacity.", 5],
    [19, "Ten-Fold", "The city holds ten times its capacity.", 10],
    [20, "20-Fold", "The city holds twenty times its capacity.", 20]
];

const OUTSIDE = [
    [4, "None", "Nothing of note lies outside the city."],
    [6, "Farming [Agriculture]", "Crop fields surround the city."],
    [8, "Farming [Livestock]", "Livestock is raised around the city."],
    [10, "Resource Harvesting", "The city harvests a local resource."],
    [12, "Barrows", "Burial mounds lie outside the city."],
    [13, "Caravan Community", "A community of caravans camps outside the city."],
    [14, "Event Grounds", "Grounds for events and gatherings lie outside the city."],
    [15, "Family Estate", "A family estate sits outside the city."],
    [16, "Hermit's Cottage", "A hermit lives in a cottage outside the city."],
    [18, "Makeshift Settlement", "A makeshift settlement has sprung up outside the city."],
    [19, "Medical Camp", "A medical camp operates outside the city."],
    [20, "Prison", "A prison stands outside the city."]
];

const STEWARDSHIP = [
    [1, "Neglected", "The city is poorly cared for.", { conditionMod: -7, populationWealthMod: -13, lawEnforcementMod: -9 }],
    [4, "Minimal", "The city receives minimal care.", { conditionMod: -4, populationWealthMod: -6, lawEnforcementMod: -5 }],
    [10, "Passing", "The city is cared for in a passable way.", { conditionMod: -1, populationWealthMod: -3, lawEnforcementMod: -2 }],
    [16, "Adequate", "The city is adequately cared for."],
    [19, "Managed", "The city is well managed.", { conditionMod: 1, populationWealthMod: 3, lawEnforcementMod: 4 }],
    [20, "Disciplined", "The city is run with discipline.", { conditionMod: 5, populationWealthMod: 6, lawEnforcementMod: 8 }]
];

const GENERAL_CONDITION = [
    [1, "Squalid", "The city is in squalid shape.", { districtConditionMod: -2 }],
    [4, "Dilapidated", "The city is run down.", { districtConditionMod: -1 }],
    [12, "Decent", "The city is in decent shape."],
    [19, "Impressive", "The city is in impressive shape.", { districtConditionMod: 1 }],
    [20, "Magnificent", "The city is magnificent.", { districtConditionMod: 2 }]
];

const ENVIRONMENT = [
    [1, "Coastal", "The city sits on the coast."],
    [2, "Forest", "The city sits in or near a forest."],
    [3, "Mountains", "The city sits in the mountains."],
    [4, "Plains", "The city sits on open plains."],
    [5, "River", "The city sits along a river."],
    [6, "Swamp", "The city sits in a swamp."],
    [7, "Underground", "The city lies underground."],
    [8, "Valley", "The city sits in a valley."],
    [9, "Tundra", "The city sits in the tundra."],
    [10, "Desert", "The city sits in a desert."]
];

const FORTIFICATION = [
    [1, "Unfortified", "The city has no defenses.", { dispositionMod: -5 }],
    [8, "Lightly Fortified", "The city has light defenses.", { dispositionMod: 1 }],
    [15, "Fortified", "The city is fortified.", { dispositionMod: 3 }],
    [19, "Heavily Fortified", "The city is heavily fortified.", { dispositionMod: 5 }],
    [20, "Extremely Fortified", "The city is extremely fortified.", { dispositionMod: 7 }]
];

const VENDOR_STALL = [
    [1, "First Come, First Served - No Fee", "Vendors take a spot on a first come basis, free of charge."],
    [2, "First Come, First Served - Fee", "Vendors take a spot on a first come basis, for a fee."],
    [3, "Lease", "Vendors lease their stall spots."],
    [4, "Bid", "Vendors bid for their stall spots."]
];

const MERCHANT_OVERFLOW = [
    [1, "Banned", "Merchants may not sell outside the market.", { lawEnforcementMod: 1 }],
    [2, "Unpatrolled", "Merchants selling outside the market are left alone."],
    [3, "Monitored", "Merchants selling outside the market are watched."],
    [4, "Encouraged", "Merchants are encouraged to sell all around the city."]
];

const MARKET_SQUARE = [
    [2, "Tight", "The market square is cramped."],
    [4, "Ample", "The market square has plenty of room."],
    [6, "Spacious", "The market square is large and open."]
];

const UNDERGROUND = [
    [8, "None", "There are no underground passages."],
    [14, "Sewers", "Sewers run beneath the city."],
    [17, "Natural Caves", "Natural caves lie beneath the city."],
    [19, "Tunnels", "Tunnels run beneath the city."],
    [20, "Forgotten Crypts", "Forgotten crypts lie beneath the city."]
];

const POPULATION_DENSITY = [
    [2, "Skeleton", "The city is nearly empty.", { nightActivityMod: -2 }],
    [6, "Sparse", "The city is thinly populated.", { nightActivityMod: -1 }],
    [14, "Populous", "The city is comfortably populated."],
    [18, "Dense", "The city is densely populated.", { nightActivityMod: 1 }],
    [20, "Crowded", "The city is crowded.", { nightActivityMod: 2 }]
];

const DEMOGRAPHICS = [
    [2, "Only One", "The population is 100% of one primary race."],
    [6, "Only Two", "The population is split 60%/40% between two races."],
    [14, "Normal", "The population is 50% primary, then 25%, 15% and 10% other races."],
    [17, "Wide", "20% of the population is the primary race, and others are well represented."],
    [19, "High and Low", "The population is split 80%/20%."],
    [20, "Ever-Changing", "The population shifts constantly."]
];

const POPULATION_WEALTH = [
    [2, "Destitute", "The population is destitute.", { crimeMod: -2 }],
    [6, "Impoverished", "The population is poor.", { crimeMod: -1 }],
    [14, "Average", "The population is of average means."],
    [17, "Prosperous", "The population is prosperous.", { crimeMod: -1 }],
    [19, "Wealthy", "The population is wealthy.", { crimeMod: -2 }],
    [20, "Affluent", "The population is affluent.", { crimeMod: -3 }]
];

const VISITOR_TRAFFIC = [
    [2, "Mostly Locals", "Almost everyone seen in the city is local.", { nightActivityMod: 0 }],
    [6, "Groups", "Small groups of visitors come and go.", { nightActivityMod: 1 }],
    [12, "Crowds", "Crowds of visitors are common.", { nightActivityMod: 2 }],
    [17, "Droves", "Visitors arrive in droves.", { nightActivityMod: 3 }],
    [19, "Masses", "Masses of visitors fill the city.", { nightActivityMod: 4 }],
    [20, "Multitudes", "Multitudes of visitors constantly arrive.", { nightActivityMod: 5 }]
];

const DISPOSITION = [
    [2, "Hostile", "The citizens are hostile to outsiders."],
    [6, "Unfriendly", "The citizens are unfriendly to outsiders."],
    [14, "Neutral", "The citizens are neutral to outsiders."],
    [18, "Friendly", "The citizens are friendly to outsiders."],
    [20, "Open", "The citizens are open and welcoming."]
];

const NIGHT_ACTIVITY = [
    [1, "Dark", "The city is dark and shut at night."],
    [3, "Quiet", "The city is quiet at night."],
    [12, "Slow", "Some places stay open at night."],
    [17, "Active", "The city is active at night."],
    [19, "Lively", "The city is lively at night."],
    [20, "Raucous", "The city is raucous all night."]
];

const LEADERSHIP = [
    [15, "Elected Council", "A council elected by the people governs the city."],
    [30, "Mayor", "A mayor governs the city."],
    [45, "Hereditary", "A hereditary ruler governs the city."],
    [60, "Merchant Monarch", "A wealthy merchant rules the city. A Market District is forced.", {}, "monarch"],
    [75, "Military Officer", "A military officer runs the city.", { lawEnforcementMod: 1 }],
    [90, "Oligarchy", "A small group rules the city.", {}, "oligarchy"],
    [99, "Underworld/Criminal Enterprise", "Criminals pull the strings in the city. Organized crime is always rolled.", { crimeMod: -2 }, "underworld"],
    [100, "Anarcho-Syndicalist Commune", "The city is run as a commune."]
];

const OLIGARCHY_GROUPS = [
    ["Merchants (plutocracy)", "Merchant"],
    ["Mages (magocracy)", "Arcane"],
    ["Priests (theocracy)", "Temple"],
    ["Other", null]
];

const LAW_ENFORCEMENT = [
    [1, "None", "There is no law enforcement.", { crimeMod: -5 }],
    [4, "Skeleton City Watch", "A skeleton watch keeps the peace.", { crimeMod: -3 }],
    [11, "City Watch", "A city watch keeps the peace.", { crimeMod: -1 }],
    [17, "Robust City Watch", "A robust watch keeps the peace."],
    [20, "Extensive City Watch", "An extensive watch keeps the peace.", { crimeMod: 2 }]
];

// Fifth item: urban encounter modifier; sixth: whether organized crime is rolled
const GENERAL_CRIME = [
    [2, "Dangerous", "Crime is dangerous.", { urbanEncounterMod: 5 }],
    [6, "Frequent", "Crime is frequent.", { urbanEncounterMod: 4 }],
    [14, "Common", "Crime is common.", { urbanEncounterMod: 3 }],
    [18, "Uncommon", "Crime is uncommon.", { urbanEncounterMod: 2 }],
    [20, "Infrequent", "Crime is infrequent.", { urbanEncounterMod: 1 }]
];

const ORGANIZED_CRIME = [
    [2, "Completely Secret", "Organized crime is completely secret."],
    [6, "Whispers", "There are only whispers of organized crime."],
    [14, "Talk", "People talk about organized crime."],
    [18, "Barely Hidden", "Organized crime is barely hidden."],
    [20, "Open", "Organized crime operates openly."]
];

const DISTRICT_COUNT = [[2, 2], [10, 3], [15, 4], [19, 5], [20, 6]];

const DISTRICT_TYPES = [
    "Administration", "Arcane", "Botanical", "Craft", "Docks", "Industrial",
    "Market", "Merchant", "Scholar", "Slums", "Temple", "Upper Class"
];

// [maxRoll, steps from the general level]
const RELATIVE_STEPS = [[3, -2], [7, -1], [13, 0], [17, 1], [20, 2]];

const DISTRICT_ENTRY = [
    [4, "Open", 0],
    [7, "Lightly Guarded", 1],
    [10, "Guarded", 2],
    [12, "Gated & Guarded", 3]
];

const HOUSING = [[5, "None"], [9, "Limited"], [11, "Moderate"], [12, "Extensive"]];
const NOTABLE_COUNT = [[1, 0], [5, 1], [9, 2], [10, 3]];

// Location tokens: "HH" hired help (d10), "HH:<type>" fixed hired help, "HH6" priestly hired help (d6),
// "MS" magic shop (d6), "MS:<type>" fixed magic shop, "TEMPLE" temple (d6).
const DISTRICTS = {
    "Administration": {
        included: ["Courthouse", "Chancery", "Town Hall", "Treasury", "HH:Scribes & Clerks"],
        additional: ["Baker", "Tailor", "Alchemist", "Cobbler", "Luxury Furnishings", "Rare Libations & Fare", "Barber", "Bathhouse", "Doctor/Apothecary", "House of Leisure", "Inn", "Club", "Tavern", "HH", "Archives/Library", "Academy/University", "Schoolhouse", "Amphitheater"]
    },
    "Arcane": {
        included: ["Archives/Library", "Academy/University", "MS", "MS", "HH:Arcane Academics or Magic Mercenaries"],
        additional: ["General Store", "Tailor", "Weaver", "Alchemist", "Artist", "Rare Botanicals", "MS", "MS", "Barber", "Soothsayer", "House of Leisure", "Club", "Tavern", "HH:Arcane Academics", "HH:Magic Mercenaries", "Forum", "Schoolhouse", "Lodge"]
    },
    "Botanical": {
        included: ["Outdoor Recreational Area", "Inn", "Stable"],
        additional: ["Baker", "Tailor", "Weaver", "Alchemist", "Artist", "Cobbler", "Rare Botanicals", "Rare Libations & Fare", "MS", "Doctor/Apothecary", "House of Leisure", "Inn", "Soothsayer", "Tavern", "HH:Guides & Trackers", "Outdoor Recreational Area", "Dance Hall", "Altar"]
    },
    "Craft": {
        included: ["Smithy", "Carpenter", "General Store", "Tailor", "MS"],
        additional: ["Cooper", "Carpenter", "Thatcher", "Wainwright", "Armorsmith", "Artist", "Bank & Exchange", "Cobbler", "Foundry/Smelting", "Miller", "Textile Production", "Shipwright", "MS", "Luxury Furnishings", "Rare Trade Goods", "Weaponsmith", "Tavern", "HH"]
    },
    "Docks": {
        included: ["Shipwright", "Weaver", "House of Leisure", "Inn", "Tavern"],
        additional: ["Cooper", "Carpenter", "Smithy", "Bank & Exchange", "Shipwright", "Rare Botanicals", "Rare Libations & Fare", "Rare Trade Goods", "MS", "Barber", "Bathhouse", "Doctor/Apothecary", "House of Leisure", "Inn", "Club", "Tavern", "HH", "Altar"]
    },
    "Industrial": {
        included: ["Smithy", "INDUSTRY"],
        additional: ["Cooper", "Carpenter", "General Store", "Smithy", "Tailor", "Thatcher", "Wainwright", "Weaver", "Foundry/Smelting", "Miller", "Textile Production", "Shipwright", "House of Leisure", "Club", "Tavern", "HH", "Gathering Hall", "Treasury"]
    },
    "Market": {
        included: ["Baker", "Butcher", "General Store", "Smithy", "Tailor"],
        additional: ["Wainwright", "Weaver", "Alchemist", "Artist", "Bank & Exchange", "Cobbler", "Rare Botanicals", "Luxury Furnishings", "Rare Libations & Fare", "Rare Trade Goods", "MS", "Barber", "Inn", "Club", "Soothsayer", "Stable", "Tavern", "HH"]
    },
    "Merchant": {
        included: ["Bank & Exchange", "Tailor", "Artist", "Cobbler", "MS:Misc & Curiosities"],
        additional: ["General Store", "Wainwright", "Alchemist", "Artist", "Bank & Exchange", "Cobbler", "Luxury Furnishings", "Rare Libations & Fare", "Rare Trade Goods", "MS", "MS", "Barber", "Bathhouse", "House of Leisure", "Inn", "Club", "Tavern", "HH"]
    },
    "Scholar": {
        included: ["Archives/Library", "Academy/University", "Forum", "Schoolhouse", "HH:Scribes & Clerks"],
        additional: ["General Store", "Tailor", "Thatcher", "Weaver", "Alchemist", "Bank & Exchange", "Rare Botanicals", "Luxury Furnishings", "Rare Libations & Fare", "Rare Trade Goods", "MS:Books", "Doctor/Apothecary", "HH:Scholars & Clerics", "Archives/Library", "Academy/University", "Forum", "Schoolhouse", "Gathering Hall"]
    },
    "Slums": {
        included: ["Butcher", "House of Leisure", "Inn", "Tavern"],
        additional: ["Baker", "Butcher", "General Store", "Smithy", "Thatcher", "Weaver", "Alchemist", "Foundry/Smelting", "Miller", "Textile Production", "Barber", "Bathhouse", "Doctor/Apothecary", "House of Leisure", "Inn", "Club", "Soothsayer", "Tavern"]
    },
    "Temple": {
        included: ["TEMPLE", "Archives/Library", "HH:Scribes", "HH:Priestly Guidance", "HH:Hands of the Divine"],
        additional: ["Cooper", "Carpenter", "Tailor", "Alchemist", "Artist", "Bank & Exchange", "Rare Botanicals", "Luxury Furnishings", "Rare Libations & Fare", "MS", "Barber", "Bathhouse", "Doctor/Apothecary", "Inn", "Soothsayer", "HH6", "Schoolhouse", "Amphitheater"]
    },
    "Upper Class": {
        included: ["Bank & Exchange", "Baker", "Tailor", "Luxury Furnishings", "Doctor/Apothecary"],
        additional: ["Butcher", "Tailor", "Weaver", "Alchemist", "Artist", "Cobbler", "Rare Botanicals", "Luxury Furnishings", "Rare Libations & Fare", "MS", "Barber", "Bathhouse", "House of Leisure", "Inn", "Club", "Soothsayer", "Stable", "Tavern"]
    }
};

const NON_COMMERCIAL = new Set([
    "Courthouse", "Chancery", "Town Hall", "Treasury", "Archives/Library", "Academy/University", "Schoolhouse",
    "Amphitheater", "Forum", "Lodge", "Outdoor Recreational Area", "Dance Hall", "Altar", "Gathering Hall"
]);
const SERVICES = new Set([
    "Barber", "Bathhouse", "Doctor/Apothecary", "House of Leisure", "Inn", "Club", "Soothsayer", "Stable", "Tavern"
]);
const ENTERTAINMENT = ["Club", "Tavern", "House of Leisure", "Amphitheater", "Dance Hall"];

const HIRED_HELP = [
    "Brutes & Brawlers", "Cloak & Dagger", "Bows & Slings", "Scribes & Clerks", "Guides & Trackers",
    "Caravan & Mount", "Arcane Academics", "Magic Mercenaries", "Priestly Guidance", "Hands of the Divine"
];
const HIRED_HELP_SIZE = [[6, "Individual"], [10, "Team"], [12, "Guild"]];
const MAGIC_SHOPS = ["Armor", "Books", "Clothing", "Jewelry", "Weapons", "Misc & Curiosities"];
const INDUSTRIAL = ["Foundry/Smelting", "Foundry/Smelting", "Textile Production", "Textile Production", "Miller", "Miller"];

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

const NOTABILITY = [
    "Generous Spirit", "Top-Notch Marketing", "Excellent Offerings", "Vested Interests", "Unique Offering",
    "More-Than-Meets-the-Eye", "Meeting Place", "Entertaining Service", "Coercion", "Favoritism",
    "Superstition", "History", "Rumors", "Expansion", "Important Person", "Nearby Curiosity",
    "Local Loyalty", "Exciting", "Organization Affiliation", "Magic"
];

const RECENT_HISTORY = [
    "City-Sponsored Construction: a city-sponsored construction project collapsed.",
    "Market Hooligans: a hooligan gang has been causing trouble at the market.",
    "Tavern Fire: an adventurers' bar brawl burned down a tavern.",
    "Inventor's Contraption: an inventor's contraption has caused a stir.",
    "Heavy Weather: heavy storms or blizzards battered the city.",
    "New Craze: a visitor started a new craze or fashion.",
    "Foreign Representative: a neighboring kingdom's representative is arriving.",
    "Mysterious Illness: a mysterious illness is spreading.",
    "Broken Gate: the main gate is broken.",
    "Calls for Change: there are calls for new leadership.",
    "Inedible Cuisine: the local cuisine has been rendered inedible.",
    "Mysterious Contest: a mysterious contest is under way.",
    "Fantastic Resource: an important resource has a fantastic yield.",
    "Inflation: adventurers are causing inflation.",
    "Sudden Fame: someone gained incredible fame.",
    "Illegal Goods: illegal substances or goods are circulating.",
    "Taxes Raised: taxes were raised.",
    "Taxes Abolished: taxes were abolished.",
    "Neighbor Attacked: a neighboring kingdom was attacked.",
    "Deity Appeared: a deity appeared."
];

const NOTEWORTHY_OFFICIAL = [
    "Adviser", "Ambassador", "Catchpole", "Champion", "Clerk", "Exchequer", "Guildmaster", "Herald",
    "High Priest/Druid", "High Mage", "Jailer", "Judge", "Liner", "Master of Intelligence", "Master of Revels",
    "Master of Stores", "Master of Trade", "Master of the Treasury", "Master of the Wild", "Roadwarden/Dockwarden"
];
const OFFICIAL_COMPETENCE = [[1, "Corrupt"], [3, "Incompetent"], [5, "Committed"], [6, "Overqualified"]];

const BENEATH_SURFACE = [
    "Pack", "Monster", "Markings", "Fight Club", "Secret", "Outside Contact",
    "Tampering", "Unsafe", "Parties", "Black Market", "Races", "Haunted"
];
const AWARENESS = [
    "Utterly Oblivious", "Single, Subtle Occurrence", "Disparate, Subtle Occurrences", "Many Subtle Occurrences",
    "Single Occurrence", "Disparate Occurrences", "Many Occurrences", "Single, Direct Occurrence",
    "Disparate, Direct Occurrences", "Many Direct Occurrences", "Willfully Ignorant", "Actively Aware"
];

// Basic Information
originValue();
priorityValue();
ageValue();
sizeValue();
populationCapacityValue();
outsideCityValue();
stewardshipValue();
generalConditionValue();
environmentValue();
fortificationValue();
vendorStallAcquisitonValue();
merchantOverflowValue();
marketSquareValue();
undergroundPassagesValue();

// Community
populationDensityValue();
demographicsValue();
populationWealthValue();
visitorTrafficValue();
dispositionValue();
nightActivityValue();
leadershipValue();
lawEnforcementValue();
generalCrimeValue();
organizedCrimeValue();

// Districts
districtsValue();

// Extra Intrigue
recentHistoryValue();
noteworthyOfficialValue();
beneathSurfaceValue();

function originValue() {
    rollTable("origin", 10, ORIGIN);
}

function priorityValue() {
    const { roll } = rollTable("priority", 6, PRIORITY);
    state.priority = roll;

    if (roll === 3) {
        state.forcedDistricts.push("Scholar");
    } else if (roll === 6) {
        state.forcedDistricts.push("Temple");
    }
}

function ageValue() {
    rollTable("age", 10, AGE);
}

function sizeValue() {
    const { entry } = rollTable("size", 20, SIZE);
    state.sizeIndex = SIZE.indexOf(entry);
    state.capacity = CAPACITIES[state.sizeIndex];
}

function populationCapacityValue() {
    setGenContext("populationCapacity");
    const entry = lookup(POPULATION_CAPACITY, rollDie(20));
    const total = Math.round(state.capacity * entry[3]).toLocaleString("en-US");
    show("populationCapacity", `${describe(entry)} Population of about ${total} (base capacity ${state.capacity.toLocaleString("en-US")} x ${entry[3]}).`);
}

function outsideCityValue() {
    setGenContext("outsideCity");
    const results = [];

    for (let i = 0; i < OUTSIDE_ROLLS[state.sizeIndex]; i++) {
        let roll = rollDie(20);
        for (let attempt = 0; i === 0 && state.priority === 5 && roll <= 4 && attempt < 50; attempt++) {
            roll = rollDie(20);
        }
        results.push(describe(lookup(OUTSIDE, roll)));
    }

    show("outsideCity", results.join("<br>"));
}

function stewardshipValue() {
    rollTable("stewardship", 20, STEWARDSHIP);
}

function generalConditionValue() {
    const { entry } = rollTable("generalCondition", 20, GENERAL_CONDITION, "conditionMod");
    state.conditionLevel = GENERAL_CONDITION.indexOf(entry);
}

function environmentValue() {
    const { entry } = rollTable("environment", 10, ENVIRONMENT);
    state.environment = entry[1];
    state.waterside = ["Coastal", "River"].includes(entry[1]);
}

function fortificationValue() {
    rollTable("fortification", 20, FORTIFICATION);
}

function vendorStallAcquisitonValue() {
    rollTable("vendorStallAcquisiton", 4, VENDOR_STALL);
}

function merchantOverflowValue() {
    rollTable("merchantOverflow", 4, MERCHANT_OVERFLOW);
}

function marketSquareValue() {
    rollTable("marketSquare", 6, MARKET_SQUARE);
}

function undergroundPassagesValue() {
    rollTable("undergroundPassages", 20, UNDERGROUND);
}

function populationDensityValue() {
    rollTable("populationDensity", 20, POPULATION_DENSITY, "populationDensityMod");
}

function demographicsValue() {
    rollTable("demographics", 20, DEMOGRAPHICS);
}

function populationWealthValue() {
    rollTable("populationWealth", 20, POPULATION_WEALTH, "populationWealthMod");
}

function visitorTrafficValue() {
    rollTable("visitorTraffic", 20, VISITOR_TRAFFIC);
}

function dispositionValue() {
    rollTable("disposition", 20, DISPOSITION, "dispositionMod");
}

function nightActivityValue() {
    rollTable("nightActivity", 20, NIGHT_ACTIVITY, "nightActivityMod");
}

function leadershipValue() {
    setGenContext("leadership");
    const entry = lookup(LEADERSHIP, rollDie(100));
    let text = describe(entry);
    addMods(entry[3] || {});

    if (entry[4] === "monarch") {
        state.forcedDistricts.push("Market");
    } else if (entry[4] === "underworld") {
        state.organizedCrimeForced = true;
    } else if (entry[4] === "oligarchy") {
        const [group, district] = OLIGARCHY_GROUPS[rollDie(4) - 1];
        const forced = district || pickRandom(DISTRICT_TYPES.filter(type => type !== "Docks" || state.waterside));
        state.forcedDistricts.push(forced);
        text += ` Ruling group: ${group}. Forced district: ${forced}.`;
    }

    show("leadership", text + effectNote(entry[3]));
}

function lawEnforcementValue() {
    rollTable("lawEnforcement", 20, LAW_ENFORCEMENT, "lawEnforcementMod");
}

function generalCrimeValue() {
    const { entry } = rollTable("generalCrime", 20, GENERAL_CRIME, "crimeMod");
    state.crimeLevel = GENERAL_CRIME.indexOf(entry);
    state.organizedCrime = state.organizedCrimeForced || state.crimeLevel <= 2;
}

function organizedCrimeValue() {
    if (!state.organizedCrime) {
        show("organizedCrime", "<b>None.</b> Organized crime is not rolled at this crime level.");
        return;
    }
    rollTable("organizedCrime", 20, ORGANIZED_CRIME);
}

function qualityIndex(modifier, shift = 0) {
    const roll = rollDie(12, modifier, "qualityMod");
    const base = roll <= 4 ? 0 : roll <= 10 ? 1 : 2;
    return clamp(base + shift, 0, 2);
}

function guildNote(name) {
    const existing = state.guilds[name] || 0;
    const range = 5 - Math.min(existing, 3);
    const roll = rollDie(6);
    state.guilds[name] = existing + 1;
    return roll > 1 && roll >= range ? " - Guild member" : "";
}

// Turns a location token into a descriptive line; qualityMod and shift come from the district.
function buildLocation(token, qualityMod, shift) {
    let name = token;
    let hiredType = "";
    let commercial = true;
    let extra = "";

    if (token === "TEMPLE") {
        const kind = rollDie(6) <= 4 ? "Temple" : "Great Temple";
        const fervency = lookup([[1, "Unseen"], [5, "Quiet"], [10, "Subtle"], [16, "Moderate"], [19, "Fervent"], [20, "Zealous"]], rollDie(20))[1];
        const alignment = lookup([[1, "Evil"], [5, "Neutral"], [10, "Good"]], rollDie(10))[1];
        return { name: kind, text: `<b>${kind}</b> - ${fervency} following, ${alignment}` };
    }
    if (token === "INDUSTRY") {
        name = INDUSTRIAL[rollDie(6) - 1];
    } else if (token === "MS" || token.startsWith("MS:")) {
        name = "Magic Shop - " + (token === "MS" ? MAGIC_SHOPS[rollDie(6) - 1] : token.slice(3));
    } else if (token === "HH" || token === "HH6" || token.startsWith("HH:")) {
        hiredType = token === "HH" ? HIRED_HELP[rollDie(10) - 1]
            : token === "HH6" ? (rollDie(6) <= 3 ? "Priestly Guidance" : "Hands of the Divine")
                : token.slice(3);
        if (hiredType.includes(" or ")) {
            hiredType = pickRandom(hiredType.split(" or "));
        }
        name = "Hired Help - " + hiredType;
        extra = ` - ${lookup(HIRED_HELP_SIZE, rollDie(12))[1]}`;
    } else if (NON_COMMERCIAL.has(token)) {
        commercial = false;
    }

    if (!commercial) {
        return { name, text: `<b>${name}</b>` };
    }

    const quality = QUALITY_LEVELS[qualityIndex(qualityMod, shift)];
    const names = POOR_FINE_NAMES[name];
    let label = name;

    if (names && quality !== "Good") {
        label = names[quality === "Poor" ? 0 : 1];
    }

    return { name, text: `<b>${label}</b>${extra} - ${quality}${guildNote(name)}`, commercial: true };
}

function rollAdditionalToken(table) {
    let roll = rollDie(20);
    let shift = 0;

    for (let attempt = 0; (roll === 1 || roll === 20) && attempt < 50; attempt++) {
        shift += roll === 1 ? -1 : 1;
        roll = rollDie(20);
    }

    return { token: table[clamp(roll, 2, 19) - 2], shift: clamp(shift, -1, 1) };
}

function rollDistrictTypes() {
    setGenContext("numberOfDistricts");
    const countRoll = rollDie(20, modValue("districtCountMod"), "districtCountMod");
    let count = lookup(DISTRICT_COUNT, countRoll)[1];
    const types = [...state.forcedDistricts];
    count = Math.max(count, types.length);

    while (types.length < count) {
        const type = DISTRICT_TYPES[rollDie(12) - 1];
        const allowed = type !== "Docks" || state.waterside;
        if (allowed && !types.includes(type)) {
            types.push(type);
        }
    }

    show("numberOfDistricts", `<b>${count} districts.</b> ${state.forcedDistricts.length ? `Forced districts: ${state.forcedDistricts.join(", ")}.` : "No forced districts."}${modValue("districtCountMod") ? effectNote({ districtCountMod: modValue("districtCountMod") }) : ""}`);
    return types;
}

function districtsValue() {
    const types = rollDistrictTypes();
    let anchor = document.getElementById("numberOfDistricts");

    types.forEach((type, index) => {
        const id = `district${index + 1}`;
        const heading = document.createElement("h3");
        const paragraph = document.createElement("p");

        heading.textContent = `District ${index + 1}: ${type}`;
        paragraph.id = id;
        anchor.after(heading, paragraph);
        anchor = paragraph;
        show(id, buildDistrict(id, type));
    });
}

function buildDistrict(id, type) {
    setGenContext(id);
    const slums = type === "Slums";
    const upper = type === "Upper Class";
    const data = DISTRICTS[type];

    const conditionRoll = rollDie(slums ? 4 : 20, modValue("districtConditionMod") + (upper ? 3 : 0), "districtConditionMod");
    const step = lookup(RELATIVE_STEPS, conditionRoll)[1];
    const level = clamp(state.conditionLevel + step, 0, 4);
    const entry = lookup(DISTRICT_ENTRY, rollDie(12));
    const crimeRoll = rollDie(20, entry[2] + CONDITION_CRIME_MOD[level], "crimeMod");
    const crimeLevel = clamp(state.crimeLevel + lookup(RELATIVE_STEPS, crimeRoll)[1], 0, 4);

    let housing = lookup(HOUSING, rollDie(12))[1];
    for (let attempt = 0; housing === "None" && (slums || upper) && attempt < 50; attempt++) {
        housing = lookup(HOUSING, rollDie(12))[1];
    }

    const notableCount = lookup(NOTABLE_COUNT, rollDie(10))[1];
    const qualityMod = step + (slums ? -1 : 0) + (upper ? 3 : 0);
    const locations = data.included.map(token => buildLocation(token, qualityMod, 0));

    for (let i = 0; i < ADDITIONAL_ROLLS[state.sizeIndex]; i++) {
        const { token, shift } = rollAdditionalToken(data.additional);
        locations.push(buildLocation(token, qualityMod, shift));
    }

    if (state.priority === 4) {
        const venue = pickRandom(data.additional.filter(token => ENTERTAINMENT.includes(token)).concat(["Club", "Tavern"]));
        const location = buildLocation(venue, qualityMod, 0);
        location.text += " (Entertainment priority)";
        locations.push(location);
    }

    const notable = [...locations.keys()].sort(() => Math.random() - 0.5).slice(0, Math.min(notableCount, locations.length));
    for (const index of notable) {
        locations[index].text += ` - <i>Notable: ${NOTABILITY[rollDie(20) - 1]}</i>`;
    }

    const summary = [
        `<b>Condition:</b> ${CONDITION_LEVELS[level]}`,
        `<b>Entry:</b> ${entry[1]}`,
        `<b>Crime:</b> ${CRIME_LEVELS[crimeLevel]}`,
        `<b>Housing:</b> ${housing}`,
        `<b>Notable locations:</b> ${notableCount}`
    ].join(" | ");

    return `${summary}<br><br>${locations.map(location => location.text).join("<br>")}`;
}

function recentHistoryValue() {
    setGenContext("recentHistory");
    const [title, description] = RECENT_HISTORY[rollDie(20) - 1].split(": ");
    show("recentHistory", `<b>${title}.</b> ${description.charAt(0).toUpperCase()}${description.slice(1)}`);
}

function noteworthyOfficialValue() {
    setGenContext("noteworthyOfficial");
    const official = NOTEWORTHY_OFFICIAL[rollDie(20) - 1];
    const competence = lookup(OFFICIAL_COMPETENCE, rollDie(6))[1];
    show("noteworthyOfficial", `<b>${official}.</b> Competence: ${competence}.`);
}

function beneathSurfaceValue() {
    setGenContext("beneathSurface");
    const secret = BENEATH_SURFACE[rollDie(12) - 1];
    const awareness = AWARENESS[rollDie(12) - 1];
    show("beneathSurface", `<b>${secret}.</b> Awareness: ${awareness}.`);
}
