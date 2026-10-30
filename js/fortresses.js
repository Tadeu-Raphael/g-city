// Fortress generator based on "Spectacular Settlements" (Chapter Seven: Fortresses).
// One script serves the keep, castle and stronghold pages: each level builds on the previous one.
// Tables are [maxRoll, name, description, modifiers]; a roll <= 0 counts as the first entry
// and a roll above the maximum counts as the last one.

const LEVEL = { keep: 1, castle: 2, stronghold: 3 }[document.body.dataset.fortress] || 1;
const mods = {};
const container = document.getElementById("fortress-content");
const state = {
    environment: 0,
    expense: 0,
    woodWalls: false,
    garrisonBunks: false,
    ruined: false,
    keep: {},
    castle: {}
};

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

function seq(items) {
    return items.map((item, index) => [index + 1, ...item]);
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

function feet(value) {
    return `${value} ft.`;
}

function addSection(title) {
    const heading = document.createElement("h2");

    heading.className = `h4 fw-semibold text-center border-bottom pb-2 mb-4 ${container.children.length ? "mt-5" : "mt-0"}`;
    heading.textContent = title;
    container.appendChild(heading);
}

function addField(id, title) {
    const heading = document.createElement("h3");
    const paragraph = document.createElement("p");

    heading.textContent = title;
    paragraph.id = id;
    container.append(heading, paragraph);
}

// General tables
const AGE = [
    [1, "New", "The fortress was completed within the past 20 years.", { conditionMod: 4, residentsMod: -5 }],
    [3, "Recent", "The fortress was completed between 20 and 100 years ago.", { conditionMod: 2, residentsMod: -5 }],
    [8, "Old", "The fortress was completed between 100 and 200 years ago."],
    [17, "Very Old", "The fortress was completed between 200 and 500 years ago.", { conditionMod: -2 }],
    [20, "Ancient", "The fortress was completed more than 500 years ago.", { conditionMod: -4 }]
];

const LOCATION = [
    [3, "Remote", "The fortress is a significant distance away from the nearest settlement."],
    [7, "Outskirts", "The fortress is on the fringes of the settlement's occupied land, perhaps in farming country."],
    [14, "Edge of Settlement", "The fortress is on the outer border of the settlement proper, perhaps connected to its border wall."],
    [19, "Central", "The fortress is in the middle of an established settlement."],
    [20, "Prominent", "The fortress is in a central location and highly visible, as if showcased. The settlement was probably built around it."]
];

const ENVIRONMENT = seq([
    ["Coastal", "The fortress is near a large body of water, such as a lake or ocean."],
    ["Forest", "The fortress is nestled among the trees."],
    ["Mountains", "The fortress is found on stony passes or soaring peaks."],
    ["Plains", "The fortress is in the wide open fields."],
    ["River", "The fortress is near a steadily flowing stream or other watercourse."],
    ["Swamp", "The fortress is in, or near, a vast area of stagnant water."],
    ["Underground", "The fortress is within a large network of caves."],
    ["Valley", "The fortress is within, or on the edge of, an area of recessed elevation."],
    ["Tundra", "The fortress is in a very cold environment."],
    ["Desert", "The fortress is in a dry and arid environment, likely covered with vast sand dunes."]
]);

const CONDITION = [
    [2, "Ruin or Bare Bones", "Most of the structure is exposed to the elements and a rebuild is the only option. If under construction, it is a long way from completion.", { roomsMod: -2, furnishingsMod: -5 }],
    [6, "Poor or Incomplete", "The fortress is in disrepair, with loose stones or timbers, gaps, holes and rot. If under construction, it is up to a few years from being finished.", { roomsMod: -1, furnishingsMod: -2 }],
    [14, "Average", "The fortress is usable, sound and habitable, though minor issues may be present. Further work should take no more than a year."],
    [19, "Strong", "The fortress is well-maintained and presents no obvious vulnerabilities. If under construction, it will be complete within the month.", { roomsMod: 1 }],
    [20, "Impeccable", "The fortress could not be in better shape, presenting an imposing and immaculate image. Any remaining work could be completed within a week.", { roomsMod: 2 }]
];

const EXPENSE = [
    [2, "Paltry", "The fortress was built on a shoestring budget, possibly cutting corners by necessity.", { furnishingsMod: -5 }],
    [8, "Modest", "The fortress was constructed with a small budget, enough to build something simple but functional.", { furnishingsMod: -2 }],
    [15, "Moderate", "The fortress was built with a medium budget, perhaps allowing for a small comfort or two."],
    [19, "Significant", "The fortress was built with a large budget, allowing for high-quality materials and some luxury.", { furnishingsMod: 2 }],
    [20, "Extravagant", "Little or no expense was spared. Materials are top-quality and the fortress feels grand and splendid.", { furnishingsMod: 5 }]
];

const MATERIAL = [
    [4, "Brick", "Man-made blocks of mud, clay or sand, mixed with a binding material and baked hard."],
    [8, "Timber", "Hewn logs and planks, milled to fit together tightly."],
    [18, "Stone", "Rough-cut or smoothed and shaped, typically built on a timber frame and mortared together."],
    [19, "Salvage", "Found materials, such as repurposed stone from ruins or timbers from wrecked ships."],
    [20, "Unique Materials", "The fortress is built from an unusual, rare material."]
];

const UNIQUE_MATERIAL = seq([
    ["Bone", "Plentiful dead or a natural graveyard make bone an abundant resource."],
    ["Coral", "Coral replaces stone, especially in tropical or underwater settings."],
    ["Crystal", "Deep mining or alien planes yield crystal in enough abundance to build with."],
    ["Living Plant", "The fortress is built among, or inside, living plants such as great trees, shaped by natural or magical means."],
    ["Ice", "Huge blocks of ice are cut and shaped. Less tough than stone, but repairs are far simpler."],
    ["Magic", "Magic generated the materials, assembled the fortress or keeps it held together."]
]);

const REASON = seq([
    ["Anticipation", "Aggression from somewhere was expected."],
    ["Mortal Command", "It was the dying wish of someone important to the builder."],
    ["Immortal Command", "A god, or powerful otherworldly being, commanded it be built."],
    ["Vanity", "The fortress was commissioned as a demonstration of power, wealth or self-importance."],
    ["Protection", "It was built to keep a particular thing, or place, safe or hidden."],
    ["Panic", "The construction was motivated by fear of what would happen otherwise."],
    ["Prophecy", "It was foretold that a fortress would be needed on this site."],
    ["Decree", "A ruler, or governing group, ordered that it be built."],
    ["Life's Work", "It was built as a labor of love by a dedicated craftsperson and their team."],
    ["Conversion", "The building was formerly used for another purpose, but constant additions made it what it is today."]
]);

const DESIGN = seq([
    ["Power", "Strength and fortitude."],
    ["Glory", "Prestige and triumph."],
    ["Refuge", "Welcome and safety."],
    ["Fear", "Dread and insignificance."],
    ["Grace", "Beauty and elegance."],
    ["Wealth", "Luxury and opulence."],
    ["Piety", "Righteousness and ascendence."],
    ["Practicality", "Utility and function."]
]);

const RESOURCE_ORIGIN = [
    [7, "Locally Made/Harvested [Preserved Surroundings]", "Materials came from the site and nearby areas, sustainably, without depleting any harvesting location."],
    [10, "Locally Made/Harvested [Stripped Surroundings]", "Materials came from the site and nearby areas, entirely depleting the harvesting locations."],
    [12, "Partially Local, Partially Imported", "Materials that could not be obtained locally were purchased and brought in."],
    [14, "Imported", "Materials were purchased and brought in from an outside source in their entirety."],
    [15, "Partially Salvaged", "Some new materials were obtained locally, but a significant portion was salvaged from ruins."],
    [16, "Entirely Salvaged", "Materials were all salvaged from various demolished structures."],
    [17, "Partially Stolen", "Materials were gathered illicitly over time, perhaps by hijacking cargo or commandeering a quarry."],
    [18, "Completely Stolen", "Materials were looted from one or more rightful owners, openly or covertly."],
    [19, "Partial Magic", "Standard materials were partially augmented by magic, or mundane materials were acquired by magic."],
    [20, "Completely Magic", "Magic was used to acquire an entire slew of mundane materials, or to create fantastical ones."]
];

const LOCAL_IMPACT = seq([
    ["Hostile", "The fortress was built in direct opposition to the wishes of those in the area, and relations immediately turned sour."],
    ["Disruptive", "The fortress disturbed the area in which it was built, intentionally or not."],
    ["Irritating", "The fortress' construction, or presence, caused some annoyance or small issue locally."],
    ["Innocuous", "The fortress had little impact on its surroundings, causing no trouble and no great benefit."],
    ["Beneficial", "The fortress proved a boon to the local area, perhaps a compromise to a pre-existing issue."],
    ["Advantageous", "The fortress immediately benefited the local area in a big way, perhaps resolving a serious issue."]
]);

const IMPACT_CHANGE = [
    [2, "Negative", "Things have gotten worse."],
    [4, "Stable", "Things have stayed roughly the same."],
    [6, "Positive", "Things have gotten better."]
];

const ALTERNATE_ENTRY = [
    [10, "None", "There are no alternate entries into the fortress."],
    [11, "Back Door, Blocked", "A small rear-access door was built into the exterior wall. It has been blocked from the inside."],
    [12, "Back Door, Exposed", "A small rear-access door in the exterior wall, possibly in regular use and guarded, with no attempt to conceal it."],
    [13, "Back Door, Hidden", "A small rear-access door in the exterior wall, used infrequently, intentionally obscured and possibly guarded."],
    [14, "Secret Door in Exterior Wall", "A hidden door allows covert comings and goings. It is probably monitored, but discreetly."],
    [15, "Secret Door in Exterior Wall, Forgotten", "A hidden door was built for covert comings and goings, but those who knew about it are no longer around."],
    [16, "Drain, with Grating", "A drain pipe emerges somewhere in the landscape outside, its opening covered by metal grating."],
    [17, "Drain, Blocked", "A drain pipe emerges outside the fortress; its final yards are filled with large stones that let water, but not intruders, pass."],
    [18, "Drain, Blocked, with Grating", "A drain pipe filled with large stones in its final yards, and its mouth is also covered with metal grating."],
    [19, "Old, Forgotten Tunnel", "A tunnel was dug out of the fortress long ago and fell into disrepair. Perhaps no one knows about it. It might collapse."],
    [20, "Maintained Tunnel", "A well-maintained tunnel leads out of the fortress, showing signs of recent (but not heavy) use."]
];

const RESIDENT_RELATIONS = seq([
    ["Irritated", "A ranking resident (or the owner) is fed up with the antics of a member of the staff."],
    ["Outside Ties", "An important individual in the fortress is in a relationship with someone living outside it."],
    ["Struggle", "Two staff members are at odds with one another."],
    ["Clandestine", "Someone in the fortress is engaged in secret dealings with an external entity."],
    ["Expecting", "The ranking, or most important, resident is expecting a child soon. If unwed, consider what this means."],
    ["New Blood", "Someone new has been brought on, and there is more to them than it initially seemed."],
    ["Family Squabbling", "There has been arguing among the resident family of late, regarding a recurring issue."],
    ["Secret Love", "A staff member has been receiving secret notes, messages or gestures of a romantic nature."],
    ["Diplomatic Tensions", "Relations between the ranking resident and their liege (or someone close to them) have been strained."],
    ["Diplomatic Harmony", "Relations between the ranking resident and their liege (or someone close to them) have been going exceedingly well."],
    ["Problem Guard", "A member of the guard is at odds with the resident(s)."],
    ["Favored Guard", "A member of the guard is being shown preferential treatment by the resident(s)."]
]);

const RESIDENTS = [
    [8, "Original", "The original residents, their descendants or successors are in residence."],
    [14, "New (Peaceful)", "Non-original residents obtained the fortress peacefully: purchase, inheritance, gift, stewardship, or by finding it abandoned."],
    [20, "New (Forceful)", "Non-original residents obtained the fortress by conquest or illegitimate means, or after some kind of conflict."]
];

const RESIDENT_ATTITUDE = seq([
    ["Angry", "The residents hate being here and actively think about leaving, but have stayed for some reason."],
    ["Irritated", "The residents are perturbed by this place. Something about it, or their situation, grates on them daily."],
    ["Ambivalent", "The residents could take or leave this place and do not devote much thought to it."],
    ["Content", "The residents like the fortress well enough. Things aren't so bad."],
    ["Happy", "The residents like the fortress, or are pleased with their situation. Spirits are up."],
    ["Enthused", "The residents are thrilled to be here. Convincing them to leave would be extremely difficult."]
]);

// Fifth item: whether the keep gets Guard Bunks as a starting room
const GARRISON_SIZE = [
    [4, "Minimum", "The garrison is the smallest necessary to do the job, so it is likely overworked. It requires few commanding officers."],
    [12, "Modest", "The garrison is large enough to defend the fortress and allow for reasonable guard shifts."],
    [19, "Large", "The garrison is substantial and keeps the fortress well-defended at all times. Guards stay well-rested.", null, true],
    [20, "Maximum", "The garrison is the largest the fortress can sustain.", null, true]
];

const HOBBIES = [
    "Hunting", "Cooking", "Strategy Games", "Gambling (cards or dice)", "Art (any discipline)", "History (domestic or foreign)",
    "Knitting/Sewing", "Carving", "Botany/Study of Nature", "Outdoor Games - Throwing or Shooting", "Outdoor Games - Martial",
    "Outdoor Games - Ball-Based", "Feasting", "Music (listening or playing)", "Craft (decorative items)", "Hawking",
    "Martial Training", "Brewing", "Reading/Storytelling", "Poetry"
];

const CURRENT_ISSUE = [
    [6, "Peaceful", "Everything seems alright at the moment."],
    [7, "Entryway Malfunction", "A door, gate, portcullis or drawbridge is experiencing an issue."],
    [8, "Hurt on the Job", "A guard or staff member was recently injured while performing their duties."],
    [9, "Poachers", "Evidence of poaching was discovered on the lands surrounding the fortress."],
    [10, "Family Illness", "A member of the ranking resident's immediate family has gotten sick (or a close friend or associate, if they are not in residence)."],
    [11, "Worker Illness", "A member of the household staff or guard has gotten sick."],
    [12, "Spoiled Food", "Some (or all) of the fresh food items have gone bad."],
    [13, "Stolen Goods", "Some of the food and/or supplies have been swiped."],
    [14, "Structural Damage [Weather]", "An area of the fortress has been damaged by the elements."],
    [15, "Structural Damage [Neglect]", "An area of the fortress has been overlooked for too long, and has now collapsed."],
    [16, "Structural Damage [Someone's Mistake]", "An area of the fortress has been compromised and someone is at fault."],
    [17, "Infestation", "Pests have encroached on the fortress and become a nuisance."],
    [18, "Magical Anomaly", "An area of magical disturbance is causing problems. Residents may not know what caused it."],
    [19, "Creature", "A strange beast or monster has been roaming inside, or near to, the fortress' boundary."],
    [20, "Unwanted Attention", "Unfriendly outsiders have recently become interested in the fortress (or those inside it)."]
];

const ISSUE_SEVERITY = seq([
    ["Trivial", "The issue does not pose much, if any, real concern."],
    ["Manageable", "The issue requires attention, but is no cause for great alarm."],
    ["Tough", "The issue is causing notable hardship or inconvenience."],
    ["Serious", "The issue is a cause of real concern and requires attention soon, lest it worsen."],
    ["Critical", "The issue is pressing and dangerous, posing a very real threat to all involved."],
    ["Dire", "The issue needs addressing immediately. Failure will likely result in irreversible consequences, or loss of life."]
]);

const GARRISON_EQUIPMENT = [
    [2, "Poor", "Guards are equipped with substandard kit and lack a dedicated training area."],
    [8, "Standard", "Guards have standard kit and a dedicated training area with basic practice equipment."],
    [13, "Decent", "Guards have standard kit, a training area and equipment, and demonstrate refined practice techniques such as specific drills."],
    [18, "Good", "Guards have above-standard kit, a training area and equipment, and utilize highly refined practice techniques."],
    [20, "Exemplary", "Guards have the best kit available and a training area with the best equipment and practices."]
];

const SECRETS = seq([
    ["Ancient Resting Place", "A body was buried here before the fortress was built."],
    ["Hidden Gravesite", "A body was buried here after the fortress was built."],
    ["Ancient Treasure", "A treasure was buried here before the fortress was built."],
    ["Secret Hoard", "A treasure was buried here after the fortress was built."],
    ["Unknown Power", "Someone in the fortress has an item they believe is mundane. It is actually special and/or important."],
    ["Prized Tome", "A book of great value is within the fortress."],
    ["Secret Rites", "An ancient ritual was performed here before the fortress was built."],
    ["Tryst", "Two people within the fortress got married in secret, and have been keeping it quiet ever since."],
    ["Enchantment", "An unnoticed spell, or spell-like effect, lingers over a portion of the fortress."],
    ["Moonlighting", "Someone within the fortress is secretly doing a job, or activity, in their off-hours."],
    ["Back Door", "Someone has been sneaking out of the fortress in a way that would not be approved of."],
    ["Interloper", "Someone living within the fortress does not actually belong, but has remained unnoticed."]
]);

const HISTORY = seq([
    ["Previous Residents", "Someone of note lived here before the fortress was built."],
    ["Notable Family Tree", "A resident within the fortress has (or had) very interesting lineage."],
    ["Accursed", "The site was cursed, either during construction or since. The curse effects may vary greatly."],
    ["In Their Footsteps", "A very powerful being once walked where the fortress now stands."],
    ["Convergence", "A pivotal meeting happened here."],
    ["Dig Site", "An intriguing discovery was made here."],
    ["Protests", "Prior to construction, there were strong objections to building the fortress."],
    ["Ensured Silence", "The architect of this fortress was imprisoned (before or after it was built)."],
    ["Traditional Home", "A family of creatures, or beings, has lived within the fortress since it was built. They may be mascots, or serve some deeper purpose."],
    ["Hallowed Ground", "A central area of the site featured markings someone viewed as being of great importance, so the fortress was built around and preserved."]
]);

const ODDITIES = seq([
    ["Haunted", "A local spirit occupies the fortress, perhaps an ex-resident or someone linked to the grounds."],
    ["Mystery Door", "A door is, and always has been, stuck shut. Plans of the fortress show no room there."],
    ["Breeze", "Even in closed rooms with no external doors, there is always a tiny breeze that makes cloaks swirl lightly."],
    ["Phantom Sounds", "In specific areas, indistinct snippets of conversation and activity can be heard from nearby rooms, but nothing is ever there."],
    ["Rumbles", "On rare occasions, soft reverberations can be felt from deep underground beneath the fortress."],
    ["Moody Room", "A particular chamber puts those inside it into a particular mood, regardless of how they felt before entering."],
    ["Dead End", "A hallway leads to a dead end with no discernible purpose."],
    ["Strange Visitors", "On occasion, the fortress is visited by unusual beings or creatures. No one knows where they come from."],
    ["Creaky Step", "A single solid stone step on a certain stairwell creaks regardless of maintenance."],
    ["Watchful Beast", "A small local creature sits on windowsills and in doorways, staring unblinking at anyone in the room, and vanishes when approached."],
    ["Missing Things", "Small, miscellaneous items seem to go missing without notice."],
    ["Inexplicable Furnishings", "One substantial item has been there since the fortress was built and no one knows where it came from. People feel uneasy near it, but can never get rid of it."]
]);

const SPECIAL_FEATURE = seq([
    ["Resident - Great Person", "A person of significance, or renown, lives here."],
    ["Resident - Creature or Monster", "A beast, monster or uncivilised entity resides here, by choice or as a captive."],
    ["Magical Properties", "The structure and/or its surroundings have magical properties."],
    ["Unknown Origin", "No one knows where this structure came from, or how it was built."],
    ["Intriguing Purpose", "The structure was built to do something unusual."],
    ["Catastrophic Event", "The structure was the site of a terrible or tragic incident."],
    ["Miraculous Event", "The structure was the site of something miraculous or amazing."],
    ["Bizarre Location", "The structure is built in an atypical kind of location."]
]);

// Feature specifics, in the same order as the special feature table (null when there is no sub-table)
const FEATURE_SPECIFICS = [
    [8, seq([
        ["Hero", "Known for good deeds, performed selflessly for the benefit of others."],
        ["Villain", "Known for committing dreadful atrocities."],
        ["Thinker", "Known for wisdom and enlightenment (philosopher, naturalist, scientist, etc)."],
        ["Artist", "Known for creating works of exceptional beauty."],
        ["Writer", "Known for exquisite written prowess, riveting tales or accounts of pivotal events."],
        ["Warrior", "Known for martial prowess, or valor, in battle."],
        ["Arcanist", "Known for magical ability or expertise."],
        ["Priest", "Known for having a special connection to the divine."]
    ])],
    [10, seq([
        ["Beast", "A noteworthy, but non-sentient, beast."],
        ["Beast (Sentient)", "An animal that can think and speak."],
        ["Elemental", "A being of a single, pure elemental energy."],
        ["Fey", "A resident of the fey realm."],
        ["Savage Humanoid", "A gnoll, orc or other brutal marauder."],
        ["Goblinoid", "A goblin, hobgoblin or bugbear."],
        ["Giant", "An ogre, giant or troll."],
        ["Kobold", "A bipedal reptile with distant draconic ancestry."],
        ["Monstrosity", "A terrifying, unnatural creature."],
        ["Undead", "A zombie, vampire, spirit or other creature linked with undeath."]
    ])],
    [10, seq([
        ["Flying", "The fortress can be, or is always, airborne, sustained by a ritual, enchanted object or individual."],
        ["Dreamer", "The fortress is mentally tethered to a mortal mind. While they dream, the fortress appears nearby."],
        ["Spells of Binding", "Magic augmented the building process, strengthening the overall structure exponentially."],
        ["Speech", "The fortress is sentient and communicates telepathically with those it chooses."],
        ["Exuding Presence", "The fortress exudes an unseen aura that influences the emotional state of visitors, friend or foe."],
        ["Desecrated Ground", "The bodies of the fallen tend to rise and turn against their living comrades."],
        ["Deceptive", "The fortress appears differently to onlookers outside its walls than to those inside."],
        ["Nexus", "Magic here is more potent, but the veil between worlds is thin and otherworldly entities may be drawn in."],
        ["Teleportation", "The fortress can magically change location instantly."],
        ["Phasing", "The fortress can shift from one plane of existence to another, but remains in the same physical location."]
    ])],
    [4, seq([
        ["Extraplanar", "The fortress popped into existence instantaneously."],
        ["Unseen Hands", "The fortress was built without anyone seeing a builder. It seemed to grow, unobserved, each day."],
        ["Stranger", "Someone integral to the inception of the fortress was unknown to anyone else involved."],
        ["No Records", "The builders are no longer around, and no records give clues as to who they were."]
    ])],
    [6, seq([
        ["Protection", "The fortress was built to keep something safe. It is no secret that it resides here."],
        ["Hiding", "The fortress was built to keep something from being found."],
        ["Hint", "The fortress was built to act as a clue to some greater mystery."],
        ["Instruction", "The fortress was built with a lesson in mind, to teach those who look upon it."],
        ["Imprisonment", "The fortress was built to keep something out of others' hands, or from being unleashed on the world."],
        ["Connection", "The fortress was built to accommodate a magical or extraplanar portal."]
    ])],
    [6, seq([
        ["Natural Disaster", "A major storm, earthquake or other calamity struck this place."],
        ["Battle", "This was the site of a brutal, devastating conflict."],
        ["Genocide", "An attempt was made to wipe a people, or creature, from existence here."],
        ["Betrayal", "A significant trust was broken here."],
        ["Curse", "The fortress, or the area in general, was placed under a vindictive spell."],
        ["Summoning", "A terrible creature, or otherworldly being, was summoned from within the fortress, and may remain nearby."]
    ])],
    [8, seq([
        ["Found Anew", "Something (or someone) of incredible significance was rediscovered here."],
        ["Salvation", "Someone in dire peril was saved here."],
        ["Odds Defied", "Victory was snatched from the jaws of defeat here, when all hope seemed lost."],
        ["Divine Intervention", "A god made their will known directly here."],
        ["Sacrifice", "Someone gave up something very dear to them here, in service to a higher cause."],
        ["Prophecy Fulfilled", "Events previously foretold saw their culmination here."],
        ["Death Refused", "Someone who should have died managed to retain their grasp on life here."],
        ["Quest Accomplished", "A great mission was concluded here."]
    ])],
    [8, seq([
        ["Abyss or Chasm", "The fortress is built on a platform suspended directly over a deep hole or crevasse."],
        ["Sky", "The fortress floats or hovers in mid-air, on a cloud or a platform suspended by magic or technology."],
        ["Active Volcano", "The fortress is built on, or inside, an active volcano."],
        ["Beneath the Surface", "The fortress is under an environment where one might not expect it, such as underwater, sand or mud."],
        ["Mobile", "The fortress is built to move: on wheels, organic legs, a massive beast, a platform or a magical landmass."],
        ["Nested Environment", "The fortress is built within a separate environment that exists within the primary one, with discernible borders."],
        ["Beast Colony", "The fortress is built in the midst of a colony of uncivilized creatures or animals."],
        ["Unnatural Object", "The fortress is built upon, or around, a strange, foreign item fallen from the heavens or another plane."]
    ])]
];

// Keep tables
const WALL_THICKNESS = [
    [1, "1 ft.", "Single line, 0 squares."],
    [3, "2.5 ft.", "Half a square."],
    [7, "5 ft.", "1 square."],
    [9, "10 ft.", "2 squares."],
    [10, "15 ft.", "3 squares."]
];
const WALL_FEET = [1, 2.5, 5, 10, 15];

const SHAPE = [
    [3, "Box", "A square or rectangular keep maximizes internal space and is easier to construct and furnish."],
    [6, "Round", "A circular keep deflects weather and weak or glancing blows, but its interior can be limited."]
];

// Fifth item: side of a box keep, in squares; sixth: diameter of a round keep
const KEEP_SIZE = [
    [6, "Small", "Base size modifier 1.", null, 5, 7],
    [14, "Medium", "Base size modifier 2.", null, 7, 9],
    [19, "Large", "Base size modifier 3.", null, 9, 11],
    [20, "Very Large", "Base size modifier 4.", null, 11, 13]
];

const FLOORS = [
    [2, "One", "One above-ground floor, no cellar."],
    [6, "Two", "One above-ground floor and a cellar."],
    [13, "Three", "Two above-ground floors and a cellar."],
    [17, "Four", "Three above-ground floors and a cellar."],
    [19, "Five", "Four above-ground floors and a cellar."],
    [20, "Six", "Five above-ground floors and a cellar."]
];

const RAISED_ENTRANCE = [
    [8, "Ground level", "The entrance is on ground level."],
    [20, "Raised", "Stairs lead to an upper-floor entry, wrapping around the structure if necessary."]
];

const ENTRY_DEFENSES = [
    [1, "Simple heavy door", "A simple heavy door guards the entry."],
    [10, "Reinforced heavy door", "A reinforced heavy door guards the entry."],
    [14, "Portcullis", "A heavy grate of metal can be raised and lowered across the entry."],
    [18, "Drawbridge", "A bridge can be raised and lowered. At a raised entrance a gap is left between the stairs and the entry; at ground level a pit is dug in front of it."],
    [20, "Portcullis and drawbridge", "Both a portcullis and a drawbridge defend the entry."]
];

const FURNISHINGS = [
    [2, "Poor", "The contents are very simplistic, of inferior quality, or in disrepair."],
    [6, "Basic", "Most contents are very basic, of poor quality or in poor condition, though some may be decent."],
    [14, "Decent", "The contents are of serviceable quality, or in good condition."],
    [19, "Good", "Most contents are of decent quality or in good condition, and some may be excellent."],
    [20, "Fine", "The contents are all of superlative quality, or in excellent condition."]
];

const ROOMS = [
    [3, "Bedroom", "Area designated for resting, containing a bed or beds."],
    [5, "Dining and Receiving", "General area with tables, as well as benches and/or chairs."],
    [7, "Kitchen", "Area for cooking and food preparation."],
    [8, "Chapel", "Area designated for worship, meditation or spiritual instruction."],
    [9, "Guard Bunks", "Quarters for guards and their equipment."],
    [10, "Cell", "Holding area for prisoner(s)."],
    [11, "Closet", "Storage for clothing."],
    [12, "Equipment Storage", "Storage for household and defensive equipment."],
    [13, "General Storage", "Storage for non-food, non-equipment supplies."],
    [14, "Guest Quarters", "Area set aside for guest occupation."],
    [15, "Larder", "Food storage, typically placed in the cellar where it stays cool."],
    [16, "Library", "Area for records, books and/or study."],
    [17, "Privy", "Indoor alternative to a separate outhouse."],
    [18, "Solar", "Living/recreational room for the main resident(s)."],
    [19, "Stables", "Houses mounts for residents and visitors, attached to the outer wall of the keep."],
    [20, "Servant Quarters", "Area for a servant (or servants) to sleep and store their possessions."]
];

// Castle tables
const ADVANTAGES = {
    "None": "There were no natural advantages that could be exploited.",
    "Hill": "The fortress is built on a naturally occurring hill.",
    "Carved": "The fortress has been at least partially carved into its surrounding environment.",
    "Cliff": "The castle has been built at the top of a tall cliff.",
    "Surrounded by natural water": "Water in the environment partially, or completely, surrounds the site.",
    "Congested approach(es)": "Natural obstacles are spaced close together, making quick and direct movement difficult.",
    "Narrow approach(es)": "The castle takes advantage of formations such as tight canyons and ravines.",
    "Treacherous approach(es)": "The ground may be difficult, painful or even deadly to pass through, such as a murky bog, burning sands or loose rocks."
};
const ENVIRONMENT_ADVANTAGES = [
    ["None", "Hill", "Cliff", "Surrounded by natural water"],
    ["None", "Hill", "Cliff", "Congested approach(es)"],
    ["Narrow approach(es)", "Treacherous approach(es)", "Cliff", "Carved"],
    ["None", "None", "Hill", "Narrow approach(es)"],
    ["Congested approach(es)", "Narrow approach(es)", "Treacherous approach(es)", "Surrounded by natural water"],
    ["None", "None", "Treacherous approach(es)", "Congested approach(es)"],
    ["None", "Narrow approach(es)", "Congested approach(es)", "Carved"],
    ["None", "None", "Narrow approach(es)", "Cliff"],
    ["Treacherous approach(es)", "Narrow approach(es)", "Cliff", "Carved"],
    ["Narrow approach(es)", "Treacherous approach(es)", "Hill", "Cliff"]
];

const STYLE = [
    [3, "Motte-and-Bailey", "The keep is built on an earthen mound or hill, surrounded by a high fence or wall extending down the hill to form a large circular yard (the bailey) with the other buildings."],
    [6, "Shell Keep", "The keep is surrounded by a circular wall, with lightweight buildings built against the inside of the wall."],
    [16, "Fortified Keep", "The keep is positioned within (or connected to) a surrounding wall. Towers are typically placed along the wall."],
    [20, "Concentric", "Like a fortified keep, but with a second wall surrounding everything. Outbuildings of lesser strategic value may sit in the additional space."]
];

const CASTLE_SIZE = [
    [6, "Small", "Base size modifier 1."],
    [14, "Medium", "Base size modifier 2."],
    [19, "Large", "Base size modifier 3."],
    [20, "Very Large", "Base size modifier 4."]
];

const TOWER_SHAPE = [[3, "Box"], [6, "Round (Cylinder)"]];
// Fifth item: height over the wall in feet; sixth: box side; seventh: round diameter
const TOWER_SIZE = [
    [4, "Small", "", null, 0, 5, 7],
    [12, "Medium", "", null, 10, 5, 7],
    [18, "Large", "", null, 20, 7, 9],
    [20, "Very Large", "", null, 30, 7, 9]
];
const TOWER_ROOF = [[2, "Uncovered"], [4, "Flat Roof"], [7, "Shallow Slope Roof"], [8, "Steep Slope Roof"]];

// Fifth item: [stone, wood] in feet
const CURTAIN_THICKNESS = [
    [6, "10 ft. / 5 ft.", "Stone / Wood.", null, [10, 5]],
    [14, "15 ft. / 10 ft.", "Stone / Wood.", null, [15, 10]],
    [19, "20 ft. / 15 ft.", "Stone / Wood.", null, [20, 15]],
    [20, "25 ft. / 20 ft.", "Stone / Wood.", null, [25, 20]]
];
const CURTAIN_HEIGHT = [
    [6, "10 ft. / 10 ft.", "Stone / Wood.", null, [10, 10]],
    [14, "20 ft. / 15 ft.", "Stone / Wood.", null, [20, 15]],
    [19, "30 ft. / 20 ft.", "Stone / Wood.", null, [30, 20]],
    [20, "40 ft. / 25 ft.", "Stone / Wood.", null, [40, 25]]
];

const BARBICAN = [
    [5, "None", "The castle has no barbican."],
    [11, "Walled Approach", "The gatehouse leads to a walled approach."],
    [17, "Walled Approach with Drawbridge", "The gatehouse leads to a walled approach, ending in a drawbridge.", { moatMod: 2 }],
    [20, "Double Drawbridge", "The gatehouse, preceded by a drawbridge, leads to a walled approach ending in an additional drawbridge.", { moatMod: 2 }]
];

const WALL_DEFENSES = seq([
    ["Batters", "The bottom of the wall slopes outward and is much thicker, hindering siege towers, undermining and ladders, and removing the blindspot beneath defenders."],
    ["Bossing", "Stones protrude from the wall's surface, reducing impacts like catapult shots. Rounded protrusions avoid making the wall easier to climb."],
    ["Hoardings", "Temporary wooden shelters protrude from the top of the walls, letting defenders fire directly down on attackers. They need fireproofing but can be stored in peacetime."],
    ["Machicolations", "Permanent hoarding-like structures that let defenders fire directly down on attackers. Hoardings, if present, provide overhead cover."],
    ["Brattice", "A single projecting space placed over a vulnerable area such as a passage, allowing attacks directly below and flanking fire along the wall."],
    ["Magical Defenses", "The castle is protected by something magical. Roll on the magical defenses table."]
]);

const MAGICAL_DEFENSES = seq([
    ["Blocking Wards", "Wards prevent creatures or objects from passing a certain point. They can fail if damaged too much in a short span of time."],
    ["Aggressive Wards", "Wards unleash offensive attacks, such as bolts of fire or force, on unfortunate victims."],
    ["Unliving Sentinels", "The castle is guarded by spirits, shades, wraiths or other undead."],
    ["Alarm Wards", "Zones of magic create a warning sound if someone outside a predefined group enters."],
    ["Relocation Wards", "Wards teleport anyone in the area somewhere else, benign but far away, or harmful."],
    ["Unnatural Elemental Presence", "An element that does not naturally occur locally is present, such as a lava moat in a non-volcanic region."]
]);

const MOAT = [
    [2, "None", "The castle has no moat."],
    [5, "Dry Moat", "A deep pit encircles the fortification, purposefully or because of drought."],
    [7, "Dry Moat [Trapped]", "The moat is dry, but filled with extra defensive measures such as spikes or vicious animals."],
    [9, "Filled Moat", "A standard moat, filled with water."],
    [10, "Filled Moat [Trapped]", "The moat is filled with water and trapped, perhaps by a current or vicious aquatic animals."]
];
const MOAT_WIDTH = [[10, "15 ft."], [14, "20 ft."], [17, "25 ft."], [19, "30 ft."], [20, "35 ft."]];
const MOAT_DEPTH = [[10, "20 ft."], [14, "25 ft."], [17, "30 ft."], [19, "35 ft."], [20, "40 ft."]];

const GATEHOUSE = [
    [6, "Standard Gatehouse", "The same height as the wall and slightly thicker. Entry is covered by heavy doors."],
    [16, "Strong Gatehouse", "One and a half times the height and thickness of its wall. Entry is covered by heavy doors and a portcullis."],
    [20, "Grand Gatehouse", "Twice the height and thickness of its wall. Entry is covered by heavy doors and a portcullis."]
];
const GATEHOUSE_FEATURES = [
    "Second portcullis (Strong or Grand only)", "Murder holes", "Spouts", "Other traps"
];

const BARRACKS = [
    [1, "Simple Room(s)", "Members of the garrison sleep wherever there is space in the castle."],
    [5, "Multiple, Separate Structures", "Multiple smaller buildings arranged near one another house the garrison, separated by rank or practicality."],
    [12, "Single, Separate Structure", "A single large building in the bailey houses the garrison, with separate quarters or common areas."],
    [16, "Built-On [Keep]", "The barracks are attached to the keep and house the garrison."],
    [20, "Built-In [Walls]", "The barracks are attached to (or in, if thick enough) the fortress walls."]
];

const OUTBUILDING_SIZE = [
    [6, "Small", "6x6 / 36 squares"],
    [14, "Medium", "8x8 / 64 squares"],
    [19, "Large", "10x10 / 100 squares"],
    [20, "Very Large", "12x12 / 144 squares"]
];
const OUTBUILDING_PURPOSES = [
    "Servant's Quarters", "Kitchens", "Bake House", "Chapel/Priest's Home", "Stables", "Storage", "Forge"
];

// Stronghold tables. The fourth item holds the effects applied to the upgrade summary.
const STYLE_AMPLIFICATION = [
    [1, "Additional Curtain Wall", "The entire fortification is surrounded by an additional wall, with thickness and height equal to (or less than) your other curtain walls.", { note: "An additional curtain wall surrounds the fortification." }],
    [2, "Low Hulk", "The fortress favors reinforcement over height, creating a low-slung, brutish construction. Keep: -1 floor (min. 1 above-ground floor and a cellar), +2 floor area, +5 ft. exterior wall thickness. Castle: -10 ft. wall and tower height (min. 10 ft.), +5 ft. wall thickness, Batters added.",
        { keepFloors: -1, keepArea: 2, keepWall: 5, wallHeight: -10, wallThickness: 5, defenses: ["Batters"] }],
    [3, "Great Drums", "Keep, towers and curtain walls are built with curving surfaces to deflect weaponry and weather. Box-shaped keeps and towers become round, exterior wall and curtain wall thickness +5 ft.",
        { roundKeep: true, roundTowers: true, keepWall: 5, wallThickness: 5 }],
    [4, "Tiered", "A heavy wall surrounds the perimeter at ground level and the fortress rises in stepped elevation to a high peak. Keep: +1 floor. Castle: outermost wall thickness +5 ft., wall and tower height +5 ft.",
        { keepFloors: 1, wallThickness: 5, wallHeight: 5 }],
    [5, "Massive Curtain Walls", "The curtain walls and keep exterior walls are huge. Curtain wall thickness +10 ft., wall and tower height +10 ft.",
        { wallThickness: 10, wallHeight: 10 }],
    [6, "Bristling Defenses", "There are more defenses than there otherwise might be. Roll 1 additional time on the curtain wall defenses table.", { extraDefense: 1 }],
    [7, "Fortified Entries", "Special focus has been placed on the entrances. Keep: reinforced heavy door with portcullis and drawbridge. Castle: maximum barbican (drawbridge, gatehouse, walled approach, drawbridge) and Grand gatehouses.",
        { fortifiedEntries: true }],
    [8, "Great Moat", "The perimeter is surrounded by a massive moat of any type (dry, dry [trapped], filled or filled [trapped]), 35 ft. across and 40 ft. deep.", { greatMoat: true }],
    [9, "Mighty Keep", "The keep is especially robust. +2 floor area, +5 ft. exterior wall thickness, +1 floor.",
        { keepArea: 2, keepWall: 5, keepFloors: 1 }],
    [10, "Watchful", "Vigilance is of paramount importance. +2 towers, +2 floor area for all towers, +10 ft. tower height.",
        { towers: 2, towerArea: 2, towerHeight: 10 }],
    [11, "Under Cover", "The wall-walks are covered with permanent fortifications. Curtain wall thickness +5 ft., Machicolations added.",
        { wallThickness: 5, defenses: ["Machicolations"] }],
    [12, "Magical Forms", "Magical runes, symbols or patterns were worked into the construction. Roll once on the magical defenses table.", { magic: 1 }]
];

const ADDITIONAL_THICKNESS = [[6, 5], [14, 10], [19, 15], [20, 20]];
const ADDITIONAL_HEIGHT = [[6, 20], [14, 25], [19, 30], [20, 35]];

const BRUTAL_DEFENSES = [
    [8, "Stalwart Defenders", "A portion of the defenders are extremely well-trained in warfare and siegecraft, and particularly loyal."],
    [9, "Shards", "Fragments of metal, glass and broken pottery are built into the walls, making any climbing an eviscerating nightmare."],
    [10, "Scythe", "A massive blade sheers across the face of the wall, shaving any enemies or equipment from its surface."],
    [11, "Quake", "A subterranean device of magic or technology sends shivering impacts through the area around the outer wall."],
    [12, "Rolling Pin", "Massive timbers or stone cylinders on axles roll down the wall and across the ground, crushing all in their path. Chains raise them back."],
    [13, "Oiled Surface", "The wall is oiled, making it slick and very difficult to climb. It can also be set ablaze."],
    [14, "Gas Spouts", "Pipes in the wall expel noxious fumes from deep in the earth that cascade over the ranks of the enemy."],
    [15, "Wall of Darts", "The walls are set with dart traps that can be triggered when the walls are being swarmed."],
    [16, "Vertigo", "Forced perspective makes walls appear much higher than they are, triggering dizziness and disorientation in attackers."],
    [17, "Mighty Adhesive", "The defenses are covered in a gelatinous adhesive that reduces impacts and holds onto projectiles and attackers, turning them into obstacles."],
    [18, "Tar Fields", "The open areas leading to the stronghold are saturated with tar, and can be lit on fire."],
    [19, "Melded Guardians", "Creatures, such as animated constructs or encouraged beasts, dwell within the defenses or the surrounding area and emerge when attackers reach them."],
    [20, "Thunder Horn", "A massive horn bolsters the resolve of defenders and batters attackers with gale-force winds when sounded."]
];

// Reference figures: schematic SVGs redrawn from the book's diagrams (not exported to TXT).
let figureId = 0;

function figure(svg, caption) {
    return `<div class="fortress-figure text-center my-3">${svg}<div class="small text-secondary mt-1">${caption}</div></div>`;
}

function gridLines(x, y, w, h, cell) {
    let lines = "";
    for (let i = 0; i <= Math.round(w / cell); i++) {
        lines += `<line x1="${x + i * cell}" y1="${y}" x2="${x + i * cell}" y2="${y + h}"/>`;
    }
    for (let i = 0; i <= Math.round(h / cell); i++) {
        lines += `<line x1="${x}" y1="${y + i * cell}" x2="${x + w}" y2="${y + i * cell}"/>`;
    }
    return `<g stroke="#9aa5b1" stroke-width="0.6">${lines}</g>`;
}

function keepSvg(round, squares, wallFeet) {
    const cell = squares > 11 ? 10 : 13;
    const wall = Math.max(1.5, (wallFeet / 5) * cell);
    const size = squares * cell;
    const total = size + wall * 2 + 4;
    const origin = 2 + wall;
    const id = `keepclip${figureId++}`;
    const label = `<text x="${total / 2}" y="${total / 2 + 3}" text-anchor="middle" font-size="9" fill="#475569">${squares}${round ? " (diameter)" : `x${squares}`}</text>`;

    if (round) {
        const center = total / 2;
        return `<svg width="${total}" height="${total}" viewBox="0 0 ${total} ${total}" role="img" aria-label="Keep floor plan">
            <defs><clipPath id="${id}"><circle cx="${center}" cy="${center}" r="${size / 2}"/></clipPath></defs>
            <circle cx="${center}" cy="${center}" r="${size / 2 + wall}" fill="#111"/>
            <circle cx="${center}" cy="${center}" r="${size / 2}" fill="#fff"/>
            <g clip-path="url(#${id})">${gridLines(origin, origin, size, size, cell)}</g>${label}</svg>`;
    }

    return `<svg width="${total}" height="${total}" viewBox="0 0 ${total} ${total}" role="img" aria-label="Keep floor plan">
        <rect x="2" y="2" width="${size + wall * 2}" height="${size + wall * 2}" fill="#111"/>
        <rect x="${origin}" y="${origin}" width="${size}" height="${size}" fill="#fff"/>
        ${gridLines(origin, origin, size, size, cell)}${label}</svg>`;
}

function gridShape(cells, cell) {
    const rects = cells.map(([cx, cy]) => `<rect x="${2 + cx * cell}" y="${2 + cy * cell}" width="${cell}" height="${cell}"/>`).join("");
    return `<g fill="#fff" stroke="#111" stroke-width="1.2">${rects}</g>`;
}

function mapSizeFigure() {
    const cell = 12;
    const full = (w, h, skip = []) => {
        const cells = [];
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                if (!skip.some(([sx, sy]) => sx === x && sy === y)) {
                    cells.push([x, y]);
                }
            }
        }
        return cells;
    };
    const draw = (cells, w, h, caption) => `<div class="d-inline-block mx-2 align-top"><svg width="${w * cell + 4}" height="${h * cell + 4}">${gridShape(cells, cell)}</svg><div class="small text-secondary">${caption}</div></div>`;

    return `<div class="fortress-figure text-center my-3">${draw(full(5, 5), 5, 5, "25 squares")}${draw(full(6, 4), 6, 4, "24 squares")}${draw(full(5, 5, [[4, 0]]), 5, 5, "24 squares")}<div class="small text-secondary mt-1">Reference: map size can be altered (e.g. a 5x5 keep as a 6x4 rectangle, or with a notch) while keeping a similar area.</div></div>`;
}

function wallReferenceFigure(wallFeet) {
    const cell = 14;
    const widths = [[1, 1.5, "1 ft. (single line)"], [2.5, cell / 2, "2.5 ft. (half square)"], [5, cell, "5 ft. (full square)"]];
    const items = widths.map(([feetValue, width, caption]) => {
        const marked = feetValue === wallFeet;
        return `<div class="d-inline-block mx-2 align-top"><svg width="${cell * 3 + 12}" height="${cell * 3 + 8}">
            ${gridLines(8, 4, cell * 3, cell * 3, cell)}
            <rect x="${8 - width}" y="4" width="${width}" height="${cell * 3}" fill="${marked ? "#dc2626" : "#111"}"/></svg>
            <div class="small ${marked ? "fw-bold text-danger" : "text-secondary"}">${caption}</div></div>`;
    }).join("");

    return `<div class="fortress-figure text-center my-3">${items}<div class="small text-secondary mt-1">Reference: walls of 5 ft. or less are mapped as a line, half a square or a full square; thicker walls take 2-3 squares. The wall sits outside the room's dimensions.</div></div>`;
}

function styleSvg(name) {
    const stroke = 'stroke="#111" stroke-width="2" fill="#fff"';
    const keepBox = (x, y, s) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" ${stroke}/><rect x="${x + 4}" y="${y + 4}" width="${s - 8}" height="${s - 8}" ${stroke}/><text x="${x + s / 2}" y="${y + s / 2 + 5}" text-anchor="middle" font-size="14" font-weight="bold">K</text>`;
    const tower = (x, y, s) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" ${stroke}/>`;
    const round = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" ${stroke}/><circle cx="${x}" cy="${y}" r="${r - 4}" fill="none" stroke="#111" stroke-width="1"/>`;
    const building = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#e5e7eb" stroke="#111" stroke-width="1.2"/>`;
    let body;

    if (name === "Motte-and-Bailey") {
        body = `<path d="M10 140 L10 100 Q50 100 70 70 L90 60 Q120 90 150 105 Q185 112 210 112 L210 140 Z" fill="#e5e7eb" stroke="#111" stroke-width="2"/>
            <rect x="52" y="44" width="40" height="22" ${stroke}/><text x="72" y="60" text-anchor="middle" font-size="14" font-weight="bold">K</text>
            ${building(150, 98, 18, 10)}${building(172, 98, 22, 10)}${building(160, 88, 16, 10)}`;
    } else if (name === "Shell Keep") {
        body = `<circle cx="110" cy="80" r="62" fill="#fff" stroke="#111" stroke-width="10"/>
            ${keepBox(86, 56, 48)}${building(60, 50, 12, 18)}${building(148, 46, 12, 18)}${building(66, 96, 14, 14)}${building(144, 100, 14, 14)}${building(100, 122, 22, 8)}`;
    } else if (name === "Fortified Keep") {
        body = `<polyline points="40,30 190,30 190,130 60,130" fill="none" stroke="#111" stroke-width="6"/>
            <line x1="40" y1="30" x2="40" y2="100" stroke="#111" stroke-width="6"/>
            ${tower(28, 18, 24)}${tower(178, 18, 24)}${tower(178, 118, 24)}${tower(40, 108, 24)}
            ${keepBox(100, 40, 70)}${building(70, 50, 22, 18)}`;
    } else {
        body = `<rect x="22" y="14" width="176" height="140" fill="none" stroke="#111" stroke-width="5"/>
            <rect x="52" y="40" width="116" height="90" fill="none" stroke="#111" stroke-width="3"/>
            ${round(22, 14, 12)}${round(198, 14, 12)}${round(22, 154, 12)}${round(198, 154, 12)}
            ${tower(44, 32, 16)}${tower(160, 32, 16)}${tower(44, 122, 16)}${tower(160, 122, 16)}
            ${keepBox(80, 52, 44)}${building(132, 56, 24, 12)}${building(86, 104, 40, 14)}${building(86, 142, 48, 8)}`;
    }

    return `<svg width="220" height="170" viewBox="0 0 220 170" role="img" aria-label="${name} layout">${body}</svg>`;
}

function levelRolls() {
    addSection("General");
    addField("age", "Age");
    addField("location", "Location in Relation to Settlement");
    addField("environment", "Environment");
    addField("condition", "Condition");
    addField("expense", "Expense");
    addField("material", "Primary Building Material");
    addField("reason", "Reason for Construction");
    addField("design", "Design Theme");
    addField("resourceOrigin", "Resource Origin");
    addField("localImpact", "Local Impact");
    addField("alternateEntries", "Alternate Entries");
    addField("residentRelations", "Resident Relations");
    addField("residents", "Residents");
    addField("residentAttitude", "Resident Attitude");
    addField("garrisonSize", "Garrison Size");
    addField("garrisonEquipment", "Garrison Equipment");
    addField("residentHobbies", "Resident Hobbies");
    addField("currentIssue", "Current Issue");
    addField("secrets", "Secrets");
    addField("history", "History");
    addField("oddities", "Oddities");
    addField("specialFeature", "Special Feature");

    generalValues();

    if (LEVEL >= 1) {
        addSection("Keep");
        addField("wallThickness", "Exterior Wall Thickness");
        addField("shape", "Shape");
        addField("size", "Size");
        addField("floors", "Number of Floors");
        addField("raisedEntrance", "Raised Entrance");
        addField("entryDefenses", "Entry Defenses");
        addField("furnishings", "Furnishings");
        addField("rooms", "Rooms");
        keepValues();
    }

    if (LEVEL >= 2) {
        addSection("Castle");
        addField("geographicAdvantage", "Geographic Advantages");
        addField("style", "Style");
        addField("castleSize", "Size");
        addField("towers", "Curtain Wall Towers");
        addField("wallThickness2", "Curtain Wall Thickness");
        addField("wallHeight", "Curtain Wall Height");
        addField("barbican", "Barbican");
        addField("wallDefenses", "Curtain Wall Defenses");
        addField("moat", "Moat");
        addField("gatehouses", "Gatehouses");
        addField("barracks", "Barracks Location");
        addField("outbuildings", "Bailey Outbuildings");
        castleValues();
    }

    if (LEVEL >= 3) {
        addSection("Stronghold");
        addField("extraTowers", "Additional Curtain Wall Towers");
        addField("styleAmplification", "Style Amplification");
        addField("extraThickness", "Additional Curtain Wall Thickness");
        addField("extraHeight", "Additional Curtain Wall Height");
        addField("brutalDefenses", "Brutal Defenses");
        addField("upgradeSummary", "Upgraded Fortress");
        strongholdValues();
    }
}

function rollIssue() {
    const { entry } = pick(20, CURRENT_ISSUE);
    if (entry[1] === "Peaceful") {
        return entry[1] + ". " + entry[2];
    }
    return `<b>${entry[1]}.</b> ${entry[2]} Severity: ${describe(pick(6, ISSUE_SEVERITY).entry)}`;
}

function generalValues() {
    rollTable("age", 20, AGE);
    rollTable("location", 20, LOCATION);
    state.environment = rollTable("environment", 10, ENVIRONMENT).entry[0] - 1;

    const condition = rollTable("condition", 20, CONDITION, "conditionMod");
    state.ruined = condition.entry[1] === "Ruin or Bare Bones";

    state.expense = EXPENSE.indexOf(rollTable("expense", 20, EXPENSE).entry);

    setGenContext("material");
    const material = pick(20, MATERIAL).entry;
    let text = describe(material);
    if (material[1] === "Unique Materials") {
        text += `<br><b>Unique material:</b> ${describe(pick(6, UNIQUE_MATERIAL).entry)}`;
    }
    state.woodWalls = material[1] === "Timber";
    show("material", text);

    rollTable("reason", 10, REASON);
    rollTable("design", 8, DESIGN);
    rollTable("resourceOrigin", 20, RESOURCE_ORIGIN);

    setGenContext("localImpact");
    show("localImpact", `${describe(pick(6, LOCAL_IMPACT).entry)}<br><b>Change over time (optional):</b> ${describe(pick(6, IMPACT_CHANGE).entry)}`);

    rollTable("alternateEntries", 20, ALTERNATE_ENTRY);
    rollTable("residentRelations", 12, RESIDENT_RELATIONS);
    rollTable("residents", 20, RESIDENTS, "residentsMod");
    rollTable("residentAttitude", 6, RESIDENT_ATTITUDE);

    const garrison = rollTable("garrisonSize", 20, GARRISON_SIZE);
    state.garrisonBunks = Boolean(garrison.entry[4]);
    rollTable("garrisonEquipment", 20, GARRISON_EQUIPMENT);

    setGenContext("residentHobbies");
    show("residentHobbies", `<b>${HOBBIES[rollDie(20) - 1]}.</b> Roll again for each major individual or group if desired.`);

    setGenContext("currentIssue");
    const issues = [];
    if (state.ruined) {
        issues.push(`<b>Structural Damage [${rollDie(6) <= 3 ? "Weather" : "Neglect"}].</b> The ruined condition guarantees damage. Severity: ${describe(pick(6, ISSUE_SEVERITY).entry)}`);
    }
    issues.push(rollIssue());
    show("currentIssue", issues.join("<br>"));

    rollTable("secrets", 12, SECRETS);
    rollTable("history", 10, HISTORY);
    rollTable("oddities", 12, ODDITIES);

    setGenContext("specialFeature");
    const feature = pick(8, SPECIAL_FEATURE);
    const [sides, table] = FEATURE_SPECIFICS[feature.entry[0] - 1];
    show("specialFeature", `${describe(feature.entry)}<br><b>Specifics:</b> ${describe(pick(sides, table).entry)}`);
}

function keepValues() {
    const keep = state.keep;

    const wall = rollTable("wallThickness", 10, WALL_THICKNESS);
    keep.wall = WALL_FEET[WALL_THICKNESS.indexOf(wall.entry)];
    document.getElementById("wallThickness").innerHTML += wallReferenceFigure(keep.wall);

    keep.round = rollTable("shape", 6, SHAPE).entry[1] === "Round";

    const size = rollTable("size", 20, KEEP_SIZE).entry;
    const bsm = KEEP_SIZE.indexOf(size) + 1;
    keep.area = keep.round ? size[5] : size[4];
    show("size", `${describe(size)} Floor space: ${keep.round ? `${size[5]} squares across` : `${size[4]}x${size[4]} squares`} (1 square = 5 ft.).${figure(keepSvg(keep.round, keep.area, keep.wall), "Reference: keep floor plan to scale, walls in black (1 square = 5 ft.).")}${mapSizeFigure()}`);

    const floors = rollTable("floors", 20, FLOORS).entry;
    const totalFloors = FLOORS.indexOf(floors) + 1;
    keep.above = Math.max(1, totalFloors - 1);
    keep.cellar = totalFloors > 1;

    if (keep.above < 2) {
        show("raisedEntrance", "<b>Skipped.</b> Only one above-ground floor.");
    } else {
        rollTable("raisedEntrance", 20, RAISED_ENTRANCE);
    }

    keep.entry = rollTable("entryDefenses", 20, ENTRY_DEFENSES).entry[1];
    rollTable("furnishings", 20, FURNISHINGS, "furnishingsMod");

    setGenContext("rooms");
    const starting = ["Bedroom", "Kitchen", "Dining and Receiving"];
    if (state.garrisonBunks) {
        starting.push("Guard Bunks");
    }

    const count = Math.max(1, bsm * totalFloors + modValue("roomsMod"));
    const rooms = [...starting];
    for (let i = starting.length; i < count; i++) {
        rooms.push(lookup(ROOMS, rollDie(20))[1]);
    }

    const tally = {};
    rooms.forEach(room => { tally[room] = (tally[room] || 0) + 1; });
    const list = Object.entries(tally).map(([room, amount]) => (amount > 1 ? `${room} x${amount}` : room));

    show("rooms", `<b>${plural(count, "room")}</b> (base size modifier ${bsm} x ${totalFloors} floors${modValue("roomsMod") ? `, ${formatSigned(modValue("roomsMod"))} condition` : ""}). Starting rooms${state.garrisonBunks ? " (with Guard Bunks from the garrison)" : ""} count toward the total.<br>${list.join(", ")}.<br>A privy is a free room in every keep.`);
}

function towerLine(tower, index, round) {
    const area = round ? `${tower.size[6]} squares across` : `${tower.size[5]}x${tower.size[5]} squares`;
    return `<b>Tower ${index + 1}.</b> ${round ? "Round (Cylinder)" : "Box"}, ${tower.size[1]} (wall +${tower.size[4]} ft., ${area}), ${tower.roof}`;
}

function rollTower() {
    return { size: lookup(TOWER_SIZE, rollDie(20)), roof: lookup(TOWER_ROOF, rollDie(8))[1], round: rollDie(6) > 3 };
}

function castleValues() {
    const castle = state.castle;
    const wood = state.woodWalls ? 1 : 0;

    const advantages = ENVIRONMENT_ADVANTAGES[state.environment];
    setGenContext("geographicAdvantage");
    const advantage = advantages[rollDie(4) - 1];
    show("geographicAdvantage", `<b>${advantage}.</b> ${ADVANTAGES[advantage]}`);

    const style = rollTable("style", 20, STYLE).entry[1];
    castle.concentric = style === "Concentric";
    document.getElementById("style").innerHTML += figure(styleSvg(style), `Reference: ${style} layout (K = keep).`);

    const size = rollTable("castleSize", 20, CASTLE_SIZE).entry;
    castle.bsm = CASTLE_SIZE.indexOf(size) + 1;

    setGenContext("towers");
    const count = castle.bsm + rollDie(4);
    castle.towers = Array.from({ length: count }, rollTower);

    const thickness = rollTable("wallThickness2", 20, CURTAIN_THICKNESS).entry;
    const height = rollTable("wallHeight", 20, CURTAIN_HEIGHT).entry;
    castle.thickness = thickness[4][wood];
    castle.height = height[4][wood];
    show("wallThickness2", `<b>${feet(castle.thickness)}</b> (${state.woodWalls ? "wood" : "stone"} walls; table: ${thickness[1]}).${castle.concentric ? " Concentric: the inner wall should be at least as high as the outer wall." : ""}`);
    show("wallHeight", `<b>${feet(castle.height)}</b> (${state.woodWalls ? "wood" : "stone"} walls; table: ${height[1]}).`);

    show("towers", `<b>${plural(count, "tower")}</b> (base size modifier ${castle.bsm} + 1d4). Tower height is the wall height plus the listed bonus.<br>${castle.towers.map((tower, i) => towerLine(tower, i, tower.round)).join("<br>")}`);

    castle.barbican = rollTable("barbican", 20, BARBICAN).entry[1];

    castle.defenses = [];
    castle.magic = [];
    rollDefenses(state.expense);
    show("wallDefenses", defensesText(state.expense));

    setGenContext("moat");
    const moat = pick(10, MOAT, "moatMod").entry;
    castle.moat = moat[1];
    let moatText = format(moat);
    if (moat[1] !== "None") {
        moatText += ` Width: ${lookup(MOAT_WIDTH, rollDie(20))[1]}. Depth: ${lookup(MOAT_DEPTH, rollDie(20))[1]}.`;
    }
    show("moat", moatText);

    setGenContext("gatehouses");
    const gates = 1 + (castle.barbican !== "None" ? 1 : 0) + (castle.concentric ? 1 : 0);
    const lines = [];
    for (let i = 0; i < gates; i++) {
        const label = i === 0 ? "Main wall" : (i === 1 && castle.barbican !== "None" ? "Barbican" : "Outer wall");
        lines.push(`<b>${label}:</b> ${describe(lookup(GATEHOUSE, rollDie(20)))}`);
    }
    show("gatehouses", `${lines.join("<br>")}<br><b>Optional features:</b> ${GATEHOUSE_FEATURES.join("; ")}.`);

    rollTable("barracks", 20, BARRACKS);

    setGenContext("outbuildings");
    const outbuildings = Array.from({ length: castle.bsm + 1 }, () => lookup(OUTBUILDING_SIZE, rollDie(20)));
    show("outbuildings", `<b>${plural(outbuildings.length, "outbuilding")}</b> (base size modifier ${castle.bsm} + 1).<br>${outbuildings.map((item, i) => `<b>Outbuilding ${i + 1}.</b> ${item[1]} - ${item[2]}`).join("<br>")}<br><b>Possible purposes:</b> ${OUTBUILDING_PURPOSES.join(", ")}. Servant's Quarters are required here if the keep has none.`);
}

// Rolls curtain wall defenses; every Magical Defenses result adds a magical defense roll.
function rollDefenses(rolls) {
    const castle = state.castle;

    for (let i = 0; i < rolls; i++) {
        const defense = lookup(WALL_DEFENSES, rollDie(6));
        if (defense[1] === "Magical Defenses") {
            castle.magic.push(lookup(MAGICAL_DEFENSES, rollDie(6)));
        } else if (!castle.defenses.includes(defense[1])) {
            castle.defenses.push(defense[1]);
        }
    }
}

function defensesText(rolls) {
    const castle = state.castle;
    const lines = [`<b>${plural(rolls, "roll")}</b> (set by expense). All walls have crenelations or basic cover.`];

    if (castle.defenses.length === 0 && castle.magic.length === 0) {
        lines.push("No additional defenses.");
    }
    castle.defenses.forEach(name => lines.push(describe(WALL_DEFENSES.find(entry => entry[1] === name))));
    castle.magic.forEach(entry => lines.push(`<b>Magical Defenses - ${entry[1]}.</b> ${entry[2]}`));

    return lines.join("<br>");
}

function strongholdValues() {
    const castle = state.castle;
    const keep = state.keep;

    setGenContext("extraTowers");
    const extraTowers = rollDie(8);
    for (let i = 0; i < extraTowers; i++) {
        castle.towers.push(rollTower());
    }
    show("extraTowers", `<b>+${plural(extraTowers, "tower")}</b> (1d8) added to the castle's curtain wall towers.`);

    setGenContext("styleAmplification");
    const amplification = lookup(STYLE_AMPLIFICATION, rollDie(12));
    show("styleAmplification", describe(amplification));
    const effects = amplification[3] || {};

    const thickness = lookup(ADDITIONAL_THICKNESS, rollDie(20))[1];
    show("extraThickness", `<b>+${feet(thickness)}</b> (${thickness / 5} squares) to the castle's curtain wall thickness.`);
    setGenContext("extraHeight");
    const heightRoll = lookup(ADDITIONAL_HEIGHT, rollDie(20))[1];
    show("extraHeight", `<b>+${feet(heightRoll)}</b> (${heightRoll / 5} squares) to the castle's curtain wall height.`);

    setGenContext("brutalDefenses");
    show("brutalDefenses", describe(lookup(BRUTAL_DEFENSES, rollDie(20))));

    setGenContext("styleAmplification");
    for (let i = 0; i < (effects.extraDefense || 0); i++) {
        rollDefenses(1);
    }
    for (let i = 0; i < (effects.magic || 0); i++) {
        castle.magic.push(lookup(MAGICAL_DEFENSES, rollDie(6)));
    }
    (effects.defenses || []).forEach(name => {
        if (!castle.defenses.includes(name)) {
            castle.defenses.push(name);
        }
    });

    const above = clamp(keep.above + (effects.keepFloors || 0), 1, 99);
    const floorsText = `${above} above-ground ${above === 1 ? "floor" : "floors"}${keep.cellar || effects.keepFloors < 0 ? " and a cellar" : ""}`;
    const keepRound = keep.round || effects.roundKeep;
    const keepSide = (keepRound
        ? (keep.round ? keep.area : KEEP_SIZE.find(entry => entry[4] === keep.area)[5])
        : keep.area) + (effects.keepArea || 0);
    const keepArea = keepRound ? `${keepSide} squares across` : `${keepSide}x${keepSide} squares`;
    const wallStep = effects.wallThickness || 0;
    const wallThickness = castle.thickness + thickness + wallStep;
    const wallHeight = Math.max(10, castle.height + heightRoll + (effects.wallHeight || 0));
    const towerBonus = castle.towers.length ? effects.towerHeight || 0 : 0;
    const towerCount = castle.towers.length + (effects.towers || 0);
    const entry = effects.fortifiedEntries ? "Reinforced heavy door with a portcullis and drawbridge" : keep.entry;
    const moat = effects.greatMoat
        ? `${pickRandom(MOAT.slice(1))[1]}, 35 ft. wide and 40 ft. deep`
        : castle.moat;
    const barbican = effects.fortifiedEntries ? "Drawbridge, gatehouse, walled approach and a second drawbridge (Grand gatehouses)" : castle.barbican;

    for (let i = 0; i < (effects.towers || 0); i++) {
        castle.towers.push(rollTower());
    }

    const lines = [
        "<b>Keep</b>",
        `Floors: ${floorsText}`,
        `Shape and floor area: ${keepRound ? "Round" : "Box"}, ${keepArea}`,
        `Exterior wall thickness: ${feet(keep.wall + (effects.keepWall || 0))}`,
        `Entry: ${entry}`,
        "<b>Castle</b>",
        `Curtain wall thickness: ${feet(wallThickness)} (castle ${feet(castle.thickness)} + stronghold ${feet(thickness)}${wallStep ? ` + amplification ${feet(wallStep)}` : ""})`,
        `Curtain wall height: ${feet(wallHeight)} (castle ${feet(castle.height)} + stronghold ${feet(heightRoll)}${effects.wallHeight ? ` ${formatSigned(effects.wallHeight)} ft. amplification` : ""})`,
        `Towers: ${towerCount} in total${effects.roundTowers ? ", all round" : ""}${effects.towerArea ? `, floor area +${effects.towerArea} squares` : ""}${towerBonus ? `, +${towerBonus} ft. height` : ""}`,
        `Barbican: ${barbican}`,
        `Moat: ${moat}`,
        `Curtain wall defenses: ${[...castle.defenses, ...castle.magic.map(item => `Magical Defenses (${item[1]})`)].join(", ") || "None"}`
    ];

    if (effects.note) {
        lines.push(effects.note);
    }

    show("upgradeSummary", lines.join("<br>") + figure(keepSvg(keepRound, keepSide, keep.wall + (effects.keepWall || 0)), "Reference: upgraded keep floor plan to scale (1 square = 5 ft.)."));
}

levelRolls();
