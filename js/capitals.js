// Capital generator based on "Spectacular Settlements" (Chapter Six: Capitals).
// Tables are [maxRoll, name, description, modifiers]; a roll <= 0 counts as the first entry
// and a roll above the maximum counts as the last one.

const mods = {};
const state = {
    sizeIndex: 2,
    capacity: 50000,
    waterside: false,
    conditionLevel: 2,
    crimeLevel: 2,
    cloakAndDagger: false,
    organizedCrime: false,
    organizedCrimeForced: false,
    nobleCount: 0,
    forcedDistricts: [],
    districts: [],
    guilds: {}
};

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

function format(entry) {
    return describe(entry) + effectNote(entry[3]);
}

// Rolls on a table and applies the modifiers it grants; the caller decides how to display it.
function pick(sides, table, modName = "") {
    const roll = rollDie(sides, modName ? modValue(modName) : 0, modName);
    const entry = lookup(table, roll);

    if (entry[3]) {
        addMods(entry[3]);
    }

    return { entry, roll };
}

function rollTable(id, sides, table, modName = "") {
    setGenContext(id);
    const result = pick(sides, table, modName);
    show(id, format(result.entry));

    return result;
}

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function plural(count, word) {
    return `${count} ${word}${count === 1 ? "" : "s"}`;
}

// Basic Information tables
const ORIGIN = [
    [1, "First Settlement", "The capital is the first settlement of the region, and everything else grew around it."],
    [2, "Holy City", "The capital was founded around a sacred site or a religious calling."],
    [3, "Military Camp", "The capital began as a military camp that became permanent."],
    [4, "Invading Occupation", "An invading force took the place and settled, building the capital over what was there before."],
    [5, "Natural Progression - Trading Post", "A trading post prospered over time until it became a capital."],
    [6, "Resurrected Ruins", "The capital was raised again from the ruins of an older settlement."],
    [7, "Homegrown Inspiration", "The capital grew from the vision of a local figure or group."],
    [8, "Haven", "The capital was founded as a refuge for people seeking safety."],
    [9, "Advantageous Position", "The capital was founded because of an excellent location or access to valuable resources."],
    [10, "Prison", "The capital began as a prison or penal colony and grew around it."],
    [11, "Agriculture", "The capital grew around fertile lands and the farming that fed it."],
    [12, "Magical", "The capital was founded around, or by, some magical phenomenon or power."]
];

const AGE = [
    [2, "Recent", "The capital was founded recently.", { populationDensityMod: -2 }],
    [4, "Established", "The capital has been settled for a good while.", { populationDensityMod: -1 }],
    [6, "Mature", "The capital has settled into its ways."],
    [8, "Old", "The capital has stood for generations.", { populationDensityMod: 1 }],
    [10, "Ancient", "The capital has existed for centuries.", { populationDensityMod: 2 }]
];

const SIZE = [
    [2, "Very Small", "Capacity of about 20,000 people.", { districtCountMod: -4 }],
    [6, "Small", "Capacity of about 35,000 people.", { districtCountMod: -1 }],
    [14, "Medium", "Capacity of about 50,000 people."],
    [18, "Large", "Capacity of about 100,000 people.", { districtCountMod: 2 }],
    [20, "Very Large", "Capacity of 150,000 or more people.", { districtCountMod: 6 }]
];
const CAPACITIES = [20000, 35000, 50000, 100000, 150000];

const POPULATION_CAPACITY = [
    [1, "Half", "The capital holds half of its capacity.", 0.5],
    [3, "Half-Again", "The capital holds one and a half times its capacity.", 1.5],
    [10, "Double", "The capital holds twice its capacity.", 2],
    [14, "Triple", "The capital holds three times its capacity.", 3],
    [17, "Quintuple", "The capital holds five times its capacity.", 5],
    [19, "Ten-Fold", "The capital holds ten times its capacity.", 10],
    [20, "20-Fold", "The capital holds twenty times its capacity.", 20]
];

const OUTSIDE = [
    [20, "None", "Nothing of note lies outside the capital."],
    [30, "Farming [Agriculture]", "Crop fields surround the capital."],
    [40, "Farming [Livestock]", "Livestock is raised around the capital."],
    [50, "Resource Harvesting", "The capital harvests a local resource."],
    [55, "Barrows", "Burial mounds lie outside the capital."],
    [59, "Caravan Community", "A community of caravans camps outside the capital."],
    [64, "Event Grounds", "Grounds for events and gatherings lie outside the capital."],
    [68, "Exploration", "An exploration site lies outside the capital.", null, ["active", "abandoned or concluded"]],
    [73, "Family Estate", "A family estate sits outside the capital."],
    [78, "Makeshift Settlement", "A makeshift settlement has sprung up outside the capital."],
    [82, "Medical Camp", "A medical camp operates outside the capital."],
    [87, "Prison", "A prison stands outside the capital."],
    [91, "Subterranean Warrens", "Warrens lie beneath the land outside the capital.", null, ["known", "unknown"]],
    [95, "Tended Nature", "Carefully tended nature surrounds the capital."],
    [99, "Training Grounds", "Training grounds lie outside the capital."],
    [100, "Unusable", "The land outside the capital cannot be used."]
];

const STEWARDSHIP = [
    [1, "Neglected", "The capital is poorly cared for.", { conditionMod: -7, populationWealthMod: -13, lawEnforcementMod: -9 }],
    [4, "Minimal", "The capital receives minimal care.", { conditionMod: -4, populationWealthMod: -6, lawEnforcementMod: -5 }],
    [10, "Passing", "The capital is cared for in a passable way.", { conditionMod: -1, populationWealthMod: -3, lawEnforcementMod: -2 }],
    [16, "Adequate", "The capital is adequately cared for."],
    [19, "Managed", "The capital is well managed.", { conditionMod: 1, populationWealthMod: 3, lawEnforcementMod: 4 }],
    [20, "Disciplined", "The capital is run with discipline.", { conditionMod: 5, populationWealthMod: 6, lawEnforcementMod: 8 }]
];

const GENERAL_CONDITION = [
    [1, "Squalid", "The capital is in squalid shape.", { districtConditionMod: -2 }],
    [4, "Dilapidated", "The capital is run down.", { districtConditionMod: -1 }],
    [12, "Decent", "The capital is in decent shape."],
    [19, "Impressive", "The capital is in impressive shape.", { districtConditionMod: 1 }],
    [20, "Magnificent", "The capital is magnificent.", { districtConditionMod: 2 }]
];

const ENVIRONMENT = [
    [1, "Coastal", "The capital sits on the coast."],
    [2, "Forest", "The capital sits in or near a forest."],
    [3, "Mountains", "The capital sits in the mountains."],
    [4, "Plains", "The capital sits on open plains."],
    [5, "River", "The capital sits along a river."],
    [6, "Swamp", "The capital sits in a swamp."],
    [7, "Underground", "The capital lies underground."],
    [8, "Valley", "The capital sits in a valley."],
    [9, "Tundra", "The capital sits in the tundra."],
    [10, "Desert", "The capital sits in a desert."]
];

const FORTIFICATION = [
    [1, "Unfortified", "The capital has no defenses.", { dispositionMod: -5 }],
    [8, "Lightly Fortified", "The capital has light defenses.", { dispositionMod: 1 }],
    [15, "Fortified", "The capital is fortified.", { dispositionMod: 3 }],
    [19, "Heavily Fortified", "The capital is heavily fortified.", { dispositionMod: 5 }],
    [20, "Extremely Fortified", "The capital is extremely fortified.", { dispositionMod: 7 }]
];

const VENDOR_STALL = [
    [1, "First Come, First Served - No Fee", "Vendors take a spot on a first come basis, free of charge."],
    [2, "First Come, First Served - Fee", "Vendors take a spot on a first come basis, for a fee."],
    [3, "Lease", "Vendors lease their stall spots."],
    [4, "Bid", "Vendors bid for their stall spots."],
    [5, "Sponsored Referral Only - No Fee", "Vendors need a sponsor to get a spot, free of charge."],
    [6, "Sponsored Referral Only - Fee", "Vendors need a sponsor to get a spot, for a fee."]
];

const MERCHANT_OVERFLOW = [
    [1, "Banned", "Merchants may not sell outside the market.", { lawEnforcementMod: 1 }],
    [2, "Unpatrolled", "Merchants selling outside the market are left alone."],
    [3, "Monitored", "Merchants selling outside the market are watched."],
    [4, "Encouraged", "Merchants are encouraged to sell all around the capital."]
];

const MARKET_SQUARE = [
    [2, "Tight", "The market square is cramped."],
    [4, "Ample", "The market square has plenty of room."],
    [6, "Spacious", "The market square is large and open."]
];

const UNDERGROUND = [
    [4, "None", "There are no underground passages."],
    [14, "Sewers", "Sewers run beneath the capital."],
    [17, "Natural Caves", "Natural caves lie beneath the capital."],
    [19, "Tunnels", "Tunnels run beneath the capital."],
    [20, "Forgotten Crypts", "Forgotten crypts lie beneath the capital."]
];

// Government & High Society tables
const LEADERSHIP = [
    [15, "Elected Council", "A council elected by the people governs the capital."],
    [30, "Governor", "A governor rules the capital."],
    [45, "Hereditary", "A hereditary ruler governs the capital."],
    [60, "Merchant Monarch", "A wealthy merchant rules the capital. A Merchant District is forced.", null, "monarch"],
    [75, "Military Officer", "A military officer runs the capital.", { lawEnforcementMod: 1 }],
    [90, "Oligarchy", "A small group rules the capital.", null, "oligarchy"],
    [99, "Underworld/Criminal Enterprise", "Criminals pull the strings in the capital. Organized crime is always rolled.", { crimeMod: -2 }, "underworld"],
    [100, "Anarcho-Syndicalist Commune", "The capital is run as a commune."]
];

const OLIGARCHY_GROUPS = [
    ["Merchants (plutocracy)", "Merchant"],
    ["Mages (magocracy)", "Arcane"],
    ["Priests (theocracy)", "Temple"],
    ["Other", null]
];

const LEADERSHIP_UNITY = [
    [1, "Rank Animosity", "The leaders openly despise one another."],
    [3, "Thinly-Veiled Discord", "The leaders barely hide their discord."],
    [6, "Strained", "The leaders work together with strain."],
    [9, "Uneasy", "The leaders are uneasy allies."],
    [14, "Calm", "The leaders get along calmly."],
    [17, "Close-Knit", "The leaders are close-knit."],
    [19, "Accord", "The leaders are in accord."],
    [20, "United", "The leaders are fully united."]
];

const GOVERNING_PRIORITY = [
    [1, "Humanitarian", "The leadership truly wants to do right by its people."],
    [2, "Control", "Absolute control is of utmost importance.", { militaryForceMod: 1, lawEnforcementMod: 3 }],
    [3, "Isolationist", "The capital has no desire to get involved with other sovereign entities."],
    [4, "Expansionist", "The capital wishes to expand its reach, bringing more regions into itself.", { militaryForceMod: 1 }],
    [5, "Cloak & Dagger", "The government favors secrecy and intrigue. Spy network size 1-16 counts as Modest.", null, "cloak"],
    [6, "Economic", "The leadership is concerned with economic prosperity. A Market District is forced.", null, "Market"],
    [7, "Enlightenment", "The leadership prides itself on intelligence and wisdom. A Scholar District is forced.", null, "Scholar"],
    [8, "Industry & Innovation", "The leadership pursues modernization and new practical ideas. An Industrial District is forced.", null, "Industrial"],
    [9, "Release", "Those at the top do not actually want to be in power and want out."],
    [10, "Religious", "The leadership is dedicated to a deity (or deities). A Temple District is forced.", null, "Temple"]
];

const PRIORITY_APPROACH = [
    [1, "Peaceable - Strong", "The priority is pursued peacefully and forcefully."],
    [4, "Peaceable - Moderate", "The priority is pursued peacefully and moderately."],
    [7, "Aggressive - Moderate", "The priority is pursued aggressively and moderately."],
    [8, "Aggressive - Strong", "The priority is pursued aggressively and forcefully."]
];

const PRIORITY_SUCCESS = [
    [1, "Failing", "The leadership is failing at its priority."],
    [4, "Mediocre", "The leadership is mediocre at its priority."],
    [14, "Successful", "The leadership is successful at its priority."],
    [19, "Very Successful", "The leadership is very successful at its priority."],
    [20, "Incredibly Successful", "The leadership is incredibly successful at its priority."]
];

const LIFESTYLE = [
    [2, "Humble", "The leader requires only what is necessary to live.", { residenceMod: -6 }],
    [10, "Respectable", "The leader's lifestyle is unassuming, but comfortable."],
    [15, "Distinguished", "The leader aspires to quality and high functionality."],
    [17, "Exquisite", "The leader quietly enjoys the luxuries of their position.", { residenceMod: 1 }],
    [19, "Luxurious", "The leader takes unrestrained advantage of their comforts.", { residenceMod: 2 }],
    [20, "Ostentatious", "The leader flaunts wealth and status openly.", { residenceMod: 3 }]
];

const INTENT = [
    [8, "Genuine", "The leader's intentions are genuine."],
    [13, "Positive Deception", "The leader hides good intentions behind a deception."],
    [18, "Negative Deception", "The leader hides bad intentions behind a deception."],
    [20, "Unknown Alternative", "The leader's true intentions are unknown."]
];

const RESIDENCE = [
    "Modest House", "Large House", "Small Mansion", "Large Mansion", "Small Estate (Inside)",
    "Small Estate (Outside)", "Large Estate (Inside)", "Large Estate (Outside)", "Palace (Inside)", "Palace (Outside)"
];

const SPY_NETWORK = [
    [10, "None", "The capital has no spy network."],
    [16, "Modest", "The capital has a modest spy network."],
    [19, "Adequate", "The capital has an adequate spy network."],
    [20, "Ample", "The capital has an ample spy network."]
];

const CONNECTION_RELATION = [
    [1, "Enemy - Hated"], [2, "Enemy - Friendly"], [3, "Ally - With Reservations"], [4, "Ally - Trusted"]
];

const COUNTERINTELLIGENCE = [
    [10, "None", "The capital has no counterintelligence."],
    [16, "Modest", "The capital has modest counterintelligence."],
    [19, "Adequate", "The capital has adequate counterintelligence."],
    [20, "Ample", "The capital has ample counterintelligence."]
];

const WATCHFULNESS = [
    [10, "Passing", "Counterintelligence only watches in passing."],
    [15, "Wary", "Counterintelligence is wary."],
    [19, "Vigilant", "Counterintelligence is vigilant."],
    [20, "Paranoid", "Counterintelligence is paranoid."]
];

// Fourth item: goals; fifth: repercussions for the spy and for the capital
const INFILTRATION = [
    [10, "General", "Gathering general intelligence: key places, figures, routines and infrastructure.",
        "Individual - revelation of identity. National - diplomatic tension, divulging information about the discovered spy's efforts."],
    [15, "Deep", "Ingratiating with individual targets, monitoring relationships and actively guarded information.",
        "Individual - revelation of identity, imprisonment/ransom or attempts to turn the operative. National - diplomatic tension, divulged information, difficult negotiations."],
    [19, "Immersed", "Establishing and building deeper connections with key figures.",
        "Individual - mortal peril or attempts to turn the operative. National - ultimatums, deals highly in favor of the target."],
    [20, "Embroiled", "Deep cover in the heart of the target's operations, gaining the highest trust and positions of power.",
        "Individual - mortal peril. National - war."]
];

const VISITOR_ROLES = [
    "Escaped Prisoner", "Ambassador", "Banker", "Ruler's Child", "Ruler's Spouse", "Ruler", "Explorer", "Assassin",
    "Famed Craftsperson", "Priest or Priestess", "Adventurer", "Scribe", "Bard/Storyteller", "Military Commander",
    "Soldier", "Messenger", "Spy", "Sentient Small Monster", "Sentient Large Monster", "Otherworldly Being"
];

const VISIT_REASONS = [
    "Escape", "Diplomacy", "Looking for Fun", "An Important Meeting", "Grudge", "Tricked", "Visiting an Old Friend",
    "In Need of Help", "Lost", "Took Wrong Transportation", "Angry", "Interesting Place", "Seeking Advice",
    "Following Prophecy", "Had a Vision", "Lost a Bet", "Doing a Favor", "Collecting a Debt",
    "Looking for a Change", "On the Hunt"
];

const MILITARY_STATE = [[3, "Disbanded"], [6, "Standing"]];
const MILITARY_RECRUITMENT = ["Mercenary", "Mandatory", "Volunteer", "Hand-Picked", "Criminals", "Conscripted"];
const MILITARY_SIZE = [[4, "Insignificant"], [10, "Modest"], [16, "Strong"], [19, "Grand"], [20, "Vast"]];
const MILITARY_FACILITIES = [
    "Temporary Shelters Outside", "Simple Structures Outside", "Moderate Structures Outside",
    "Simple Structures Inside", "Moderate Structures Inside", "Robust Structures Inside"
];
const MILITARY_SPECIALIZATION = [
    [9, "None"], [10, "Mounted"], [11, "Engineering"], [12, "Berserker"], [13, "Covert"], [14, "Theatrics"],
    [15, "Magical"], [16, "Biological"], [17, "Calculation"], [18, "Unconventional"], [19, "Transport-Based"],
    [20, "Defensive"]
];

const NOBILITY_TYPE = [
    [1, "Egalitarian", "Nobility is not tied to rank; the capital is largely egalitarian."],
    [2, "Blood", "Nobility is tied to bloodlines."],
    [3, "Deeds", "Nobility is earned through deeds."],
    [4, "Wealth/Possessions", "Nobility is tied to wealth and possessions.", { populationWealthMod: 2 }]
];

const PRIMARY_NOBLES = [[1, 2], [3, 3], [6, 4], [10, 5], [14, 6], [17, 7], [19, 8], [20, 9]];

const NOBLE_LEADERSHIP = [
    [1, "Rancorous", "The nobles are rancorous toward the leadership."],
    [3, "Opposed", "The nobles oppose the leadership."],
    [6, "Disliked", "The nobles dislike the leadership."],
    [9, "Tolerated", "The nobles tolerate the leadership."],
    [14, "Liked", "The nobles like the leadership."],
    [17, "Supported", "The nobles support the leadership."],
    [19, "Defended", "The nobles defend the leadership."],
    [20, "Loved", "The nobles love the leadership."]
];

// Fourth item: whether the relationship root is positive
const NOBLE_PEOPLE = [
    [1, "Awful", "Hatred is almost universally shared.", false],
    [3, "Very Bad", "Tension is high, and bad feelings run deep.", false],
    [8, "Bad", "Dislike is pervasive.", false],
    [13, "Tepid", "Both classes feel ambivalent towards one another.", true],
    [17, "Good", "Relations are generally friendly.", true],
    [19, "Very Good", "The two classes greet each other warmly and deal with each other frequently.", true],
    [20, "Incredible", "The two classes see each other as parts of a single whole.", true]
];

const NOBLE_ROOT = [
    [2, "Hardship", "The nobility are sharing in the hardship, or actively easing the burden on the common folk.",
        "The nobility are not enduring the same hardship as the common folk, and look after their own interests first."],
    [4, "Resources", "The nobles take an appropriate share of resources and give charitably when able.",
        "The nobles do not distribute resources fairly, prioritizing plenty for themselves."],
    [6, "Manipulation", "An individual or group orchestrated the sentiment, looking out for the capital's interests.",
        "An individual or group orchestrated the sentiment, looking out for their own interests."],
    [8, "Opinion of Leadership", "Both sides agree in their opinion of the leadership.",
        "The two sides disagree in their opinion of the leadership."],
    [10, "Leadership Treatment", "The leadership treats the people and the nobility equally.",
        "The leadership treats the people and the nobility differently."]
];

// Community tables
const CULTURE = [
    [2, "Non-Specific", "The capital has no particular cultural focus."],
    [3, "Art & Beauty", "The culture values art and beauty."],
    [4, "Music", "The culture values music."],
    [5, "Cuisine", "The culture values cuisine."],
    [6, "Self-Improvement", "The culture values self-improvement."],
    [7, "Enjoyment", "The culture values enjoyment."],
    [8, "Challenge", "The culture values challenge."]
];

const CULTURE_PURSUIT = [
    [10, "Moderate", "Culture is viewed as passingly important."],
    [16, "Keen Interest", "Interest is deep and far-reaching, but not overwhelming."],
    [19, "Obsession", "Interest is pervasive and dominates many aspects of daily life."],
    [20, "Rabid Fanaticism", "The pursuit of culture has become fanaticism."]
];

const POPULATION_DENSITY = [
    [2, "Skeleton", "The capital is nearly empty.", { nightActivityMod: -2 }],
    [6, "Sparse", "The capital is thinly populated.", { nightActivityMod: -1 }],
    [14, "Populous", "The capital is comfortably populated."],
    [18, "Dense", "The capital is densely populated.", { nightActivityMod: 1 }],
    [20, "Crowded", "The capital is crowded.", { nightActivityMod: 2 }]
];

const DEMOGRAPHICS = [
    [1, "Only One", "The population is 100% of one primary race."],
    [4, "Only Two", "The population is split 60%/40% between two races."],
    [12, "Normal", "The population is 50% primary, then 25%, 15% and 10% other races."],
    [17, "Wide", "20% of the population is the primary race, and others are well represented."],
    [19, "High and Low", "The population is split 80%/20%."],
    [20, "Ever-Changing", "The population shifts constantly."]
];

const VISITOR_TRAFFIC = [
    [1, "Mostly Locals", "Almost everyone seen in the capital is local.", { nightActivityMod: 0 }],
    [3, "Groups", "Small groups of visitors come and go.", { nightActivityMod: 1 }],
    [10, "Crowds", "Crowds of visitors are common.", { nightActivityMod: 2 }],
    [17, "Droves", "Visitors arrive in droves.", { nightActivityMod: 3 }],
    [19, "Masses", "Masses of visitors fill the capital.", { nightActivityMod: 4 }],
    [20, "Multitudes", "Multitudes of visitors constantly arrive.", { nightActivityMod: 5 }]
];

const POPULATION_WEALTH = [
    [2, "Destitute", "The population is destitute.", { crimeMod: -2 }],
    [6, "Impoverished", "The population is poor.", { crimeMod: -1 }],
    [14, "Average", "The population is of average means."],
    [17, "Prosperous", "The population is prosperous.", { crimeMod: -1 }],
    [19, "Wealthy", "The population is wealthy.", { crimeMod: -2 }],
    [20, "Affluent", "The population is affluent.", { crimeMod: -3 }]
];

const NIGHT_ACTIVITY = [
    [1, "Dark", "The capital is dark and shut at night."],
    [3, "Quiet", "The capital is quiet at night."],
    [9, "Slow", "Some places stay open at night."],
    [14, "Active", "The capital is active at night."],
    [18, "Lively", "The capital is lively at night."],
    [20, "Raucous", "The capital is raucous all night."]
];

const DISPOSITION = [
    [2, "Hostile", "The citizens are hostile to outsiders."],
    [6, "Unfriendly", "The citizens are unfriendly to outsiders."],
    [14, "Neutral", "The citizens are neutral to outsiders."],
    [18, "Friendly", "The citizens are friendly to outsiders."],
    [20, "Open", "The citizens are open and welcoming."]
];

const LAW_ENFORCEMENT = [
    [1, "None", "There is no law enforcement.", { crimeMod: -5 }],
    [8, "City Watch", "A single captain runs a watch that covers key points.", { crimeMod: -3 }],
    [13, "Robust City Watch", "A captain and two sergeants run the watch.", { crimeMod: -1 }],
    [20, "Extensive City Watch", "A captain and several sergeants thoroughly guard the capital."]
];

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

// District tables
const DISTRICT_COUNT = [[2, 2], [10, 3], [15, 4], [19, 5], [20, 6]];

const DISTRICT_TYPES = [
    "Administration", "Arcane", "Botanical", "Craft", "Docks", "Industrial",
    "Market", "Merchant", "Scholar", "Slums", "Temple", "Upper Class"
];

// [maxRoll, steps from the general level]
const RELATIVE_STEPS = [[3, -2], [7, -1], [13, 0], [17, 1], [20, 2]];

const DISTRICT_ENTRY = [
    [3, "Open", 0],
    [6, "Lightly Guarded", 1],
    [9, "Guarded", 2],
    [11, "Gated & Guarded", 3],
    [12, "Gated & Guarded with Toll", 4]
];

const HOUSING = [[5, "None"], [9, "Limited"], [11, "Moderate"], [12, "Extensive"]];
const NOTABLE_COUNT = [[1, 0], [5, 1], [9, 2], [10, 3]];

// Location tokens: "HH" hired help (d10), "HH:<type>" fixed hired help, "HH6" priestly hired help (d6),
// "MS" magic shop (d6), "MS:<type>" fixed magic shop, "TEMPLE" temple (d6), "INDUSTRY" industrial location (d6).
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
        additional: ["General Store", "Tailor", "Thatcher", "Weaver", "Alchemist", "Bank & Exchange", "Rare Botanicals", "Luxury Furnishings", "Rare Libations & Fare", "Rare Trade Goods", "MS:Books", "Doctor/Apothecary", "HH:Scribes & Clerks", "Archives/Library", "Academy/University", "Forum", "Schoolhouse", "Gathering Hall"]
    },
    "Slums": {
        included: ["Butcher", "House of Leisure", "Inn", "Tavern"],
        additional: ["Baker", "Butcher", "General Store", "Smithy", "Thatcher", "Weaver", "Alchemist", "Foundry/Smelting", "Miller", "Textile Production", "Barber", "Bathhouse", "Doctor/Apothecary", "House of Leisure", "Inn", "Club", "Soothsayer", "Tavern"]
    },
    "Temple": {
        included: ["TEMPLE", "Archives/Library", "HH:Scribes & Clerks", "HH:Priestly Guidance", "HH:Hands of the Divine"],
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

const HIRED_HELP = [
    "Brutes & Brawlers", "Cloak & Dagger", "Bows & Slings", "Scribes & Clerks", "Guides & Trackers",
    "Caravan & Mount", "Arcane Academics", "Magic Mercenaries", "Priestly Guidance", "Hands of the Divine"
];
const HIRED_HELP_SIZE = [[6, "Individual"], [10, "Team"], [12, "Guild"]];
const MAGIC_SHOPS = ["Armor", "Books", "Clothing", "Jewelry", "Weapons", "Misc & Curiosities"];
const INDUSTRIAL = ["Foundry/Smelting", "Foundry/Smelting", "Textile Production", "Textile Production", "Miller", "Miller"];
const FERVENCY = [[1, "Unseen"], [5, "Quiet"], [10, "Subtle"], [16, "Moderate"], [19, "Fervent"], [20, "Zealous"]];
const ALIGNMENT = [[1, "Evil"], [5, "Neutral"], [10, "Good"]];

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

// Extra Intrigue tables. {LOW}, {HOUSING}, {BANK} and {TAVERN} are replaced with generated districts.
const RECENT_HISTORY = [
    ["Public Display", "A known thief was found dead and on display in the market square. The murderer has not been found."],
    ["Silenced Protests", "Passionate protests against a leadership decision took place recently, but fell silent extremely quickly. Why?"],
    ["Odd Fashion", "A particularly odd fashion trend has been adopted by the wealthiest citizens of the capital."],
    ["Deserting Soldiers", "A contingent of soldiers from a known enemy (or an unknown country, if there are none) deserted their commanders and came to the capital seeking citizenship. How have they been received?"],
    ["Questioned Legitimacy", "Questions have been asked about the legitimacy and fitness of the leadership. The detractors are gaining momentum, though no one has proved the truth or determined whether there are ulterior motives."],
    ["Refugees", "Refugees have traveled a great distance to seek sanctuary in the capital. Are the nobility and common folk divided or united in their opinion?"],
    ["Underground Competition", "Graffiti advertising some kind of underground competition has been appearing across the capital. It is a legal gray area, but the promise of glory is enticing even to upstanding citizens."],
    ["Noble Feud", "A feud between two of the capital's nobles or major figures came to blows very publicly, leaving each party dissatisfied and possibly looking for revenge."],
    ["Stripped of Title", "A well-known, well-liked nobleman was unexpectedly stripped of his rank and title. Were the leadership's grievances justified, or is there more going on?"],
    ["Tainted Produce", "A shipment of fresh produce arrived at the market from a neighboring city. It seemed fine, but as more people fall ill it is clear the crates carried a terrible disease."],
    ["Block Fire", "A block of buildings caught fire in {LOW}, devastating multiple businesses and/or residences."],
    ["Mysterious Tunnel", "The owner of a bank & exchange (a shop, if none is present) in {BANK} discovered a tunnel entrance in their cellar that they swear wasn't there before. Where did it come from?"],
    ["Bar Brawl", "The highest quality tavern in the capital ({TAVERN}) experienced a particularly nasty bar brawl, and everyone is talking about it. What happened? How did it end?"],
    ["Private Security", "{HOUSING}, the district with the most housing, recently assembled its own private security force acting independently from the watch. Why did they deem it necessary? How have law enforcement and leadership responded?"],
    ["Collapsed Building", "A public building in a key location has collapsed, and an investigation is underway to determine the cause."],
    ["Smashy Hour", "A local tavernkeep started 'Smashy Hour', a controlled and sanctioned weekly bar brawl, in partnership with a furniture maker who supplies old stock as makeshift weapons. Guards stay out as long as the chaos stays contained."],
    ["Chicken Plague", "Someone in the capital has been breeding chickens, and numbers are out of control. The streets are filled with poultry and no one knows who started it."],
    ["Missing Delegates", "Leadership delegates were invited to an important-sounding summit hosted by a foreign power. Months have passed and the delegates have not been heard from since."],
    ["Urban Farming", "Someone in the capital developed new urban farming practices, which have been slowly catching on."],
    ["Deity Appeared", "A deity has made a physical appearance in the city."]
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
ageValue();
sizeValue();
populationCapacityValue();
outsideCapitalValue();
environmentValue();
stewardshipValue();
generalConditionValue();
fortificationValue();
merchantOverflowValue();
undergroundPassagesValue();
marketSquareValue();
vendorStallAcquisitonValue();

// Government & High Society
leadershipValue();
leadershipUnityValue();
governingPriorityValue();
priorityApproachValue();
prioritySuccessValue();
leadersValue();
spyNetworkValue();
counterintelligenceValue();
notableVisitorsValue();
militaryValue();
nobilityValue();

// Community
cultureValue();
populationDensityValue();
demographicsValue();
visitorTrafficValue();
populationWealthValue();
nightActivityValue();
dispositionValue();
lawEnforcementValue();
generalCrimeValue();
organizedCrimeValue();

// Districts
districtsValue();
nobleResidencesValue();

// Extra Intrigue
recentHistoryValue();
noteworthyOfficialValue();
beneathSurfaceValue();

function originValue() {
    rollTable("origin", 12, ORIGIN);
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

function outsideCapitalValue() {
    setGenContext("outsideCapital");
    const results = [];

    for (let i = 0; i < OUTSIDE_ROLLS[state.sizeIndex]; i++) {
        const entry = lookup(OUTSIDE, rollDie(100));
        const detail = entry[4] ? ` Status: ${entry[4][rollDie(6) <= 3 ? 0 : 1]}.` : "";
        results.push(describe(entry) + detail);
    }

    show("outsideCapital", results.join("<br>"));
}

function environmentValue() {
    const { entry } = rollTable("environment", 10, ENVIRONMENT);
    state.waterside = ["Coastal", "River"].includes(entry[1]);
}

function stewardshipValue() {
    rollTable("stewardship", 20, STEWARDSHIP);
}

function generalConditionValue() {
    const { entry } = rollTable("generalCondition", 20, GENERAL_CONDITION, "conditionMod");
    state.conditionLevel = GENERAL_CONDITION.indexOf(entry);
}

function fortificationValue() {
    rollTable("fortification", 20, FORTIFICATION);
}

function merchantOverflowValue() {
    rollTable("merchantOverflow", 4, MERCHANT_OVERFLOW);
}

function undergroundPassagesValue() {
    rollTable("undergroundPassages", 20, UNDERGROUND);
}

function marketSquareValue() {
    rollTable("marketSquare", 6, MARKET_SQUARE);
}

function vendorStallAcquisitonValue() {
    rollTable("vendorStallAcquisiton", 6, VENDOR_STALL);
}

function leadershipValue() {
    setGenContext("leadership");
    const { entry } = pick(100, LEADERSHIP);
    let text = format(entry);

    if (entry[4] === "monarch") {
        state.forcedDistricts.push("Merchant");
    } else if (entry[4] === "underworld") {
        state.organizedCrimeForced = true;
    } else if (entry[4] === "oligarchy") {
        const [group, district] = OLIGARCHY_GROUPS[rollDie(4) - 1];
        const forced = district || pickRandom(DISTRICT_TYPES.filter(type => type !== "Docks" || state.waterside));
        state.forcedDistricts.push(forced);
        text += ` Ruling group: ${group}. Forced district: ${forced}.`;
    }

    show("leadership", text);
}

function leadershipUnityValue() {
    rollTable("leadershipUnity", 20, LEADERSHIP_UNITY);
}

function governingPriorityValue() {
    setGenContext("governingPriority");
    const { entry } = pick(10, GOVERNING_PRIORITY);

    if (entry[4] === "cloak") {
        state.cloakAndDagger = true;
    } else if (entry[4]) {
        state.forcedDistricts.push(entry[4]);
    }

    show("governingPriority", format(entry));
}

function priorityApproachValue() {
    rollTable("priorityApproach", 8, PRIORITY_APPROACH);
}

function prioritySuccessValue() {
    rollTable("prioritySuccess", 20, PRIORITY_SUCCESS);
}

function leadersValue() {
    setGenContext("leaders");
    const count = rollDie(6);
    const leaders = [];

    for (let i = 1; i <= count; i++) {
        const lifestyle = pick(20, LIFESTYLE).entry;
        const intent = lookup(INTENT, rollDie(20));
        const residenceMod = lifestyle[3] ? lifestyle[3].residenceMod : 0;
        const residence = RESIDENCE[clamp(rollDie(10, residenceMod, "residenceMod"), 1, 10) - 1];

        leaders.push(`<b>Leader ${i}.</b> Lifestyle: ${lifestyle[1]}${effectNote(lifestyle[3])}. Intent: ${intent[1]}. Residence: ${residence}.`);
    }

    show("leaders", `${plural(count, "leader")}.<br>${leaders.join("<br>")}`);
}

function spyNetworkValue() {
    setGenContext("spyNetwork");
    let roll = rollDie(20);

    if (state.cloakAndDagger && roll <= 16) {
        roll = 11;
    }

    const network = lookup(SPY_NETWORK, roll);
    const lines = [describe(network)];

    if (network[1] !== "None") {
        const connections = rollDie(4);
        const relations = Array.from({ length: connections }, () => lookup(CONNECTION_RELATION, rollDie(4))[1]);
        const depth = lookup(INFILTRATION, rollDie(20));

        lines.push(`<b>Connections.</b> ${plural(connections, "connection")}: ${relations.join("; ")}.`);
        lines.push(`<b>Infiltration Depth: ${depth[1]}.</b> Goals: ${depth[2]} Repercussions: ${depth[3]}`);
    }

    show("spyNetwork", lines.join("<br>"));
}

function counterintelligenceValue() {
    setGenContext("counterintelligence");
    let entry = lookup(COUNTERINTELLIGENCE, rollDie(20));

    for (let attempt = 0; state.cloakAndDagger && entry[1] === "None" && attempt < 50; attempt++) {
        entry = lookup(COUNTERINTELLIGENCE, rollDie(20));
    }

    const lines = [describe(entry)];

    if (entry[1] !== "None") {
        lines.push(`<b>Watchfulness.</b> ${describe(lookup(WATCHFULNESS, rollDie(20)))}`);
    }

    show("counterintelligence", lines.join("<br>"));
}

function notableVisitorsValue() {
    setGenContext("notableVisitors");
    const count = rollDie(4);
    const visitors = [];

    for (let i = 1; i <= count; i++) {
        const role = VISITOR_ROLES[rollDie(20) - 1];
        const reason = VISIT_REASONS[rollDie(20) - 1];
        visitors.push(`<b>${role}.</b> Reason for visit: ${reason}.`);
    }

    show("notableVisitors", `${plural(count, "notable visitor")}.<br>${visitors.join("<br>")}`);
}

function militaryValue() {
    setGenContext("military");
    const roll = rollDie(6, modValue("militaryForceMod"), "militaryForceMod");

    if (roll <= 2) {
        show("military", "<b>No.</b> The capital has no military force.");
        return;
    }

    const standing = lookup(MILITARY_STATE, rollDie(6))[1];
    const recruitment = MILITARY_RECRUITMENT[rollDie(6) - 1];
    const size = lookup(MILITARY_SIZE, rollDie(20))[1];
    const facilities = MILITARY_FACILITIES[rollDie(6) - 1];
    const specialization = lookup(MILITARY_SPECIALIZATION, rollDie(20))[1];
    const inside = facilities.endsWith("Inside") ? " Facilities inside the capital may form their own district." : "";

    show("military", [
        "<b>Yes.</b> The capital has a military force.",
        `<b>State:</b> ${standing}`,
        `<b>Recruitment:</b> ${recruitment}`,
        `<b>Size of force:</b> ${size}`,
        `<b>Facilities:</b> ${facilities}.${inside}`,
        `<b>Specialization:</b> ${specialization}`
    ].join("<br>"));
}

function nobilityValue() {
    setGenContext("nobility");
    const type = pick(4, NOBILITY_TYPE).entry;
    const primary = lookup(PRIMARY_NOBLES, rollDie(20))[1];
    const lesser = lookup(PRIMARY_NOBLES, rollDie(20))[1];
    const toLeadership = lookup(NOBLE_LEADERSHIP, rollDie(20));
    const toPeople = lookup(NOBLE_PEOPLE, rollDie(20));
    const root = lookup(NOBLE_ROOT, rollDie(10));
    const positive = toPeople[3];

    state.nobleCount = primary;

    if (root[1] === "Resources") {
        addMods({ populationWealthMod: positive ? 2 : -2 });
    }

    show("nobility", [
        `<b>Type of nobility: ${type[1]}.</b> ${type[2]}${effectNote(type[3])}`,
        `<b>Primary nobles:</b> ${primary} (optional lesser nobles: ${lesser})`,
        `<b>Relationship to leadership: ${toLeadership[1]}.</b> ${toLeadership[2]}`,
        `<b>Relationship with the people: ${toPeople[1]}.</b> ${toPeople[2]}`,
        `<b>Root of relationship: ${root[1]} (${positive ? "positive" : "negative"}).</b> ${root[positive ? 2 : 3]}${root[1] === "Resources" ? effectNote({ populationWealthMod: positive ? 2 : -2 }) : ""}`
    ].join("<br>"));
}

function cultureValue() {
    setGenContext("culture");
    const culture = lookup(CULTURE, rollDie(8));
    const lines = [describe(culture)];

    if (culture[1] !== "Non-Specific") {
        lines.push(`<b>Pursuit of culture.</b> ${describe(lookup(CULTURE_PURSUIT, rollDie(20)))}`);
    }

    show("culture", lines.join("<br>"));
}

function populationDensityValue() {
    rollTable("populationDensity", 20, POPULATION_DENSITY, "populationDensityMod");
}

function demographicsValue() {
    rollTable("demographics", 20, DEMOGRAPHICS);
}

function visitorTrafficValue() {
    rollTable("visitorTraffic", 20, VISITOR_TRAFFIC);
}

function populationWealthValue() {
    rollTable("populationWealth", 20, POPULATION_WEALTH, "populationWealthMod");
}

function nightActivityValue() {
    rollTable("nightActivity", 20, NIGHT_ACTIVITY, "nightActivityMod");
}

function dispositionValue() {
    rollTable("disposition", 20, DISPOSITION, "dispositionMod");
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
    let extra = "";

    if (token === "TEMPLE") {
        const kind = rollDie(6) <= 4 ? "Temple" : "Great Temple";
        const fervency = lookup(FERVENCY, rollDie(20))[1];
        const alignment = lookup(ALIGNMENT, rollDie(10))[1];
        return { name: kind, text: `<b>${kind}</b> - ${fervency} following, ${alignment}` };
    }
    if (token === "INDUSTRY") {
        name = INDUSTRIAL[rollDie(6) - 1];
    } else if (token === "MS" || token.startsWith("MS:")) {
        name = "Magic Shop - " + (token === "MS" ? MAGIC_SHOPS[rollDie(6) - 1] : token.slice(3));
    } else if (token === "HH" || token === "HH6" || token.startsWith("HH:")) {
        let hiredType = token === "HH" ? HIRED_HELP[rollDie(10) - 1]
            : token === "HH6" ? (rollDie(6) <= 3 ? "Priestly Guidance" : "Hands of the Divine")
                : token.slice(3);
        if (hiredType.includes(" or ")) {
            hiredType = pickRandom(hiredType.split(" or "));
        }
        name = "Hired Help - " + hiredType;
        extra = ` - ${lookup(HIRED_HELP_SIZE, rollDie(12))[1]}`;
    } else if (NON_COMMERCIAL.has(token)) {
        return { name, text: `<b>${name}</b>` };
    }

    const quality = qualityIndex(qualityMod, shift);
    const names = POOR_FINE_NAMES[name];
    let label = name;

    if (names && quality !== 1) {
        label = names[quality === 0 ? 0 : 1];
    }

    return { name, quality, text: `<b>${label}</b>${extra} - ${QUALITY_LEVELS[quality]}${guildNote(name)}` };
}

function rollAdditionalToken(table) {
    let roll = rollDie(20);
    let shift = 0;

    for (let attempt = 0; attempt < 50; attempt++) {
        if (roll === 1 || roll === 20) {
            shift += roll === 1 ? -1 : 1;
        } else if (table[roll - 2] !== "Shipwright" || state.waterside) {
            break;
        }
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
        if (allowed) {
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
        show(id, buildDistrict(id, type, index + 1));
    });
}

function buildDistrict(id, type, number) {
    setGenContext(id);
    const slums = type === "Slums";
    const upper = type === "Upper Class";
    const data = DISTRICTS[type];

    const conditionRoll = rollDie(slums ? 4 : 20, modValue("districtConditionMod") + (upper ? 3 : 0), "districtConditionMod");
    const step = lookup(RELATIVE_STEPS, conditionRoll)[1];
    const level = clamp(state.conditionLevel + step, 0, 4);
    let entry = lookup(DISTRICT_ENTRY, rollDie(12));
    for (let attempt = 0; entry[2] === 4 && (slums || upper) && attempt < 50; attempt++) {
        entry = lookup(DISTRICT_ENTRY, rollDie(12));
    }
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

    const notable = [...locations.keys()].slice(data.included.length, data.included.length + notableCount);
    for (const index of notable) {
        locations[index].text += ` - <i>Notable: ${NOTABILITY[rollDie(20) - 1]}</i>`;
    }

    state.districts.push({
        number,
        type,
        level,
        housing: HOUSING.findIndex(item => item[1] === housing),
        locations
    });

    const summary = [
        `<b>Condition:</b> ${CONDITION_LEVELS[level]}`,
        `<b>Entry:</b> ${entry[1]}`,
        `<b>Crime:</b> ${CRIME_LEVELS[crimeLevel]}`,
        `<b>Housing:</b> ${housing}`,
        `<b>Notable locations:</b> ${notableCount}`
    ].join(" | ");

    return `${summary}<br><br>${locations.map(location => location.text).join("<br>")}`;
}

function nobleResidencesValue() {
    setGenContext("nobleResidences");
    const lines = [];

    for (let i = 1; i <= state.nobleCount; i++) {
        let roll = rollDie(6);
        for (let attempt = 0; roll > state.districts.length && attempt < 50; attempt++) {
            roll = rollDie(6);
        }
        const district = state.districts[Math.min(roll, state.districts.length) - 1];
        lines.push(`<b>Noble ${i}.</b> District ${district.number}: ${district.type}.`);
    }

    show("nobleResidences", lines.join("<br>"));
}

function districtLabel(district) {
    return district ? `District ${district.number} (${district.type})` : "a district of the capital";
}

function historyReferences() {
    const districts = state.districts;
    const lowest = districts.reduce((best, item) => item.level < best.level ? item : best, districts[0]);
    const housing = districts.reduce((best, item) => item.housing > best.housing ? item : best, districts[0]);
    const bank = districts.find(item => item.locations.some(location => location.name === "Bank & Exchange"));
    let tavern = null;
    let tavernQuality = -1;

    for (const district of districts) {
        for (const location of district.locations) {
            if (location.name === "Tavern" && location.quality > tavernQuality) {
                tavern = district;
                tavernQuality = location.quality;
            }
        }
    }

    return { LOW: districtLabel(lowest), HOUSING: districtLabel(housing), BANK: districtLabel(bank), TAVERN: districtLabel(tavern) };
}

function recentHistoryValue() {
    setGenContext("recentHistory");
    const [title, text] = RECENT_HISTORY[rollDie(20) - 1];
    const references = historyReferences();
    show("recentHistory", `<b>${title}.</b> ${text.replace(/\{(\w+)\}/g, (_, key) => references[key])}`);
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
