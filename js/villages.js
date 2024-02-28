var sizeMod = 0;
var conditionMod = 0;
var dispotionMod = 0;
var popDenMod = 0;
var popWeaMod = 0;
var hardLikeMod = 0;
var amountHardship = 0;
var crimeMod = 0;
var otherLocationsTypeAux = 0;
var flagVillageDangerLevel = 0;

//Basic Information
ageValue();
hardshipLikelihoodValue();
hardshipTypeValue();
var sizeFinal = sizeValue();
conditionValue();
environmentValue();
specialtyValue();
resourceValue();
recentHistoryValue();

//Community
populationDensityValue();
demographicsValue();
dispositionValue();
lawEnforcementValue();
leadershipValue();
populationWealthValue();
crimeValue();

//Points of Interest
worshipValue(sizeFinal);
placeGatheringValue(sizeFinal);
otherLocationsValue(sizeFinal);

//Extra Intrigue
villageEventsValue();
villagePoliticalRumorsValue();
villageRandomSuperstitionValue();
villageGoingOnValue();
villageOpportunitiesValue();
villageHarshWeatherValue();
villageDangerLevelValue();
villageDangerTypeValue();


function isInRange(x, min, max) {
    return min <= x && x <= max;
}

function ageValue() {
    let age = document.getElementById("age");
    let roll = (Math.floor(Math.random() * 20) + 1);
    switch (true) {
        case isInRange(roll, 1, 5):
            age.innerHTML += "<b>Recent.</b> The village was established within the past year. Those within the village are newly settled.";
            popDenMod += (-5);
            hardLikeMod += (-4);
            break;
        case isInRange(roll, 6, 10):
            age.innerHTML += "<b>Established.</b> The village has been settled for a few years. They have been able to successfully sustain themselves, and the families have started to grow.";
            popDenMod += (-2);
            hardLikeMod += (-2);
            break;
        case isInRange(roll, 11, 14):
            age.innerHTML += "<b>Mature.</b> The village has been around close to a decade or so. Production has been honed, and practices are optimized. Children born in the settlement may be old enough to start to lend a hand.";
            break;
        case isInRange(roll, 15, 18):
            age.innerHTML += "<b>Old.</b> The village was founded decades ago. Production has reached peak performance, with the elder members of the community being old hands at the work. There are many adults in the village who were born there.";
            hardLikeMod += (2);
            break;
        case isInRange(roll, 19, 20):
            age.innerHTML += "<b>Ancient.</b> The village was established near to, or more than, a century ago.";
            hardLikeMod += (4);
            break;
    }
}

function hardshipLikelihoodValue() {
    let hardship = document.getElementById("hardshipLikelihood");
    let roll = ((Math.floor(Math.random() * 20) + 1) + hardLikeMod);
    switch (true) {
        case isInRange(roll, -20, 2):
            hardship.innerHTML += "<b>No Hardship.</b> The village has been lucky, and nothing has troubled it so far.";
            amountHardship = 0;
            break;
        case isInRange(roll, 3, 6):
            hardship.innerHTML += "<b>One Hardship.</b> The village has experienced one notable time of difficulty.";
            amountHardship = 1;
            break;
        case isInRange(roll, 7, 14):
            hardship.innerHTML += "<b>Two Hardships.</b> The village has gone through a couple of hardships.";
            amountHardship = 2;
            break;
        case isInRange(roll, 15, 18):
            hardship.innerHTML += "<b>Three Hardships.</b> The village has experienced three difficult situations.";
            amountHardship = 3;
            break;
        case isInRange(roll, 19, 40):
            hardship.innerHTML += "<b>Four Hardships.</b> The village has been beset by four trying times.";
            amountHardship = 4;
            break;
    }
}

function hardshipTypeValue() {
    let hardshipType = document.getElementById("hardshipType");
    for (cont = 0; cont < amountHardship; cont++) {
        let roll = (Math.floor(Math.random() * 8) + 1);
        switch (roll) {
            case 1:
                hardshipType.innerHTML += "<b>Plague.</b> The community fell victim to disease.";
                hardshipOutcome = hardshipOutcomeValue();
                hardshipType.innerHTML += " - " + hardshipOutcome[0];
                popDenMod += hardshipOutcome[1];
                break;
            case 2:
                hardshipType.innerHTML += "<b>Bandits on the Road.</b> On the way to or from market, the villages caravan was set upon by bandits.";
                hardshipOutcome = hardshipOutcomeValue();
                hardshipType.innerHTML += " - " + hardshipOutcome[0];
                popWeaMod += hardshipOutcome[1];
                break;
            case 3:
                hardshipType.innerHTML += "<b>Raid.</b> The village was raided by marauders.";
                hardshipOutcome = hardshipOutcomeValue();
                hardshipType.innerHTML += " - " + hardshipOutcome[0];
                sizeMod += hardshipOutcome[1];
                popDenMod += hardshipOutcome[1];
                popWeaMod += hardshipOutcome[1];
                break;
            case 4:
                hardshipType.innerHTML += "<b>Famine / Food Shortage.</b> If the village normally produces some kind of food, it did not produce. If they typically get their food from the market, they had difficulties doing so for a time.";
                hardshipOutcome = hardshipOutcomeValue();
                hardshipType.innerHTML += " - " + hardshipOutcome[0];
                popDenMod += hardshipOutcome[1];
                break;
            case 5:
                hardshipType.innerHTML += "<b>Harsh Weather.</b> The region was beset by natures wrath.";
                hardshipOutcome = hardshipOutcomeValue();
                hardshipType.innerHTML += " - " + hardshipOutcome[0];
                conditionMod += hardshipOutcome[1];
                sizeMod += hardshipOutcome[1];
                break;
            case 6:
                hardshipType.innerHTML += "<b>Inter-Community Conflict/Violence.</b> A conflict between members of the community broke out and split the village, with dire consequences.";
                hardshipOutcome = hardshipOutcomeValue();
                hardshipType.innerHTML += " - " + hardshipOutcome[0];
                popDenMod += hardshipOutcome[1];
                dispotionMod += hardshipOutcome[1];
                break;
            case 7:
                hardshipType.innerHTML += "<b>Loss of Community Leader.</b> A key member of the community died or went missing.";
                hardshipOutcome = hardshipOutcomeValue();
                hardshipType.innerHTML += " - " + hardshipOutcome[0];
                dispotionMod += hardshipOutcome[1];
                break;
            case 8:
                hardshipType.innerHTML += "<b>Victim of War.</b> The village was struck by the ravages of war (passing or foraging armies, collateral battle damage, disease from war-related issues such as camp hygiene or illness from dead bodies).";
                hardshipOutcome = hardshipOutcomeValue();
                hardshipType.innerHTML += " - " + hardshipOutcome[0];
                conditionMod += hardshipOutcome[1];
                sizeMod += hardshipOutcome[1];
                popDenMod += hardshipOutcome[1];
                break;
        }
        if (cont != (amountHardship - 1)) {
            hardshipType.innerHTML += "<br><br>";
        }
    }
    if (amountHardship == 0) {
        hardshipType.innerHTML += "None.";
    }
}

function hardshipOutcomeValue() {
    let roll = (Math.floor(Math.random() * 10) + 1);
    let returnValue = [];
    switch (true) {
        case isInRange(roll, 1, 2):
            returnValue[0] = "<b>Catastrophic Losses.</b> The villages losses were brutal, and excruciatingly difficult, or even impossible, to recover from.";
            returnValue[1] = -5;
            break;
        case isInRange(roll, 3, 4):
            returnValue[0] = "<b>Terrible Losses.</b> The villages losses were crushing, and incredibly difficult to recover from.";
            returnValue[1] = -4;
            break;
        case isInRange(roll, 5, 6):
            returnValue[0] = "<b>Heavy Losses.</b> The villages losses were awful, and recovery is proving difficult.";
            returnValue[1] = -3;
            break;
        case isInRange(roll, 7, 8):
            returnValue[0] = "<b>Moderate Losses.</b> The villages losses were rough but recovery is likely, though may be tough.";
            returnValue[1] = -2;
            break;
        case isInRange(roll, 9, 10):
            returnValue[0] = "<b>Minimal Losses.</b> The villages losses were as little as could have been hoped for, and recovery should be very possible, or even inevitable.";
            returnValue[1] = -1;
            break;
    }
    return returnValue;
}

function sizeValue() {
    let size = document.getElementById("size");
    let roll = ((Math.floor(Math.random() * 20) + 1) + sizeMod);
    switch (true) {
        case isInRange(roll, -20, 2):
            size.innerHTML += "Very Small. Up to a dozen standing structures.";
            return 1;
            break;
        case isInRange(roll, 3, 6):
            size.innerHTML += "Small. Up to 30 standing structures.";
            return 2;
            break;
        case isInRange(roll, 7, 14):
            size.innerHTML += "Medium. Up to 60 standing structures.";
            return 3;
            break;
        case isInRange(roll, 15, 18):
            size.innerHTML += "Large. Up to 90 standing structures.";
            return 4;
            break;
        case isInRange(roll, 19, 40):
            size.innerHTML += "Very Large. Up to 120 standing structures.";
            return 5;
            break;
    }
}

function conditionValue() {
    let condition = document.getElementById("condition");
    let roll = ((Math.floor(Math.random() * 20) + 1) + conditionMod);
    switch (true) {
        case isInRange(roll, -20, 2):
            condition.innerHTML += "Ruined. The village is little but rubble and debris with, perhaps, a few exceptions. This could have been the result of a war, raid, earthquake, or storm.";
            popWeaMod += -6;
            break;
        case isInRange(roll, 3, 6):
            condition.innerHTML += "Dilapidated. The village is in a state of disrepair. Some buildings may be coming down, or may have been built in a shoddy fashion. Cleanliness is not a priority.";
            popWeaMod += -3;
            break;
        case isInRange(roll, 7, 14):
            condition.innerHTML += "Simple. Most buildings are organized and seem sturdy enough, though there is nothing remarkable. The streets are clear enough to move through, but may be uneven and rutted.";
            break;
        case isInRange(roll, 15, 18):
            condition.innerHTML += "Hearty. Everything here appears to be well-built and robust. The village seems mindful of cleanliness and the settlements upkeep. Roads and paths are well-groomed and flattened.";
            popWeaMod += 3;
            break;
        case isInRange(roll, 19, 20):
            condition.innerHTML += "Immaculate. The village is very well organized, and there is clearly a concerted effort to keep the village in the best shape possible. Cleanliness is a priority, as is maintenance. Roads and paths are plainly surfaced and clean.";
            popWeaMod += 6;
            break;
    }
}

function environmentValue() {
    let environment = document.getElementById("environment");
    let roll = (Math.floor(Math.random() * 10) + 1);
    switch (roll) {
        case 1:
            environment.innerHTML += "Coastal. The village is near a large body of water, such as a lake or ocean.";
            break;
        case 2:
            environment.innerHTML += "Forest. The village is nestled among the trees.";
            break;
        case 3:
            environment.innerHTML += "Mountains. The village is found on stony passes or soaring peaks.";
            break;
        case 4:
            environment.innerHTML += "Plains. The village is in the wide open fields.";
            break;
        case 5:
            environment.innerHTML += "River. The village is near a steadily flowing stream, or other watercourse.";
            break;
        case 6:
            environment.innerHTML += "Swamp. The village is in, or near, a vast area of stagnant water.";
            break;
        case 7:
            environment.innerHTML += "Underground. The village is within a large network of caves.";
            break;
        case 8:
            environment.innerHTML += "Valley. The village is found within, or on the edge of, an area of recessed elevation in relation to the landscape around it.";
            break;
        case 9:
            environment.innerHTML += "Tundra. The village is in a very cold environment.";
            break;
        case 10:
            environment.innerHTML += "Desert. The village is in a dry and arid environment, likely covered with vast sand dunes.";
            break;
    }
}

function specialtyValue() {
    let specialty = document.getElementById("specialty");
    let roll = (Math.floor(Math.random() * 6) + 1);
    switch (roll) {
        case 1:
            specialty.innerHTML += "None. The village is unremarkable, or not widely known for any particular thing.";
            break;
        case 2:
            specialty.innerHTML += "Food or Drink. Someone in the village makes a particular food or drink (such as bread, stew, produce, ale, wine, etc.) that has gained some notoriety. They may own an establishment, but could easily just sell it out of their home.";
            break;
        case 3:
            specialty.innerHTML += "Location Proximity. The village itself may not be very special, but it is near somewhere that is, such as a stunning vista, or a site of historical significance.";
            break;
        case 4:
            specialty.innerHTML += "Livestock. The village is known for breeding strong and healthy (perhaps, even pedigree) animals, such as horses, cattle, sheep, etc.";
            break;
        case 5:
            specialty.innerHTML += "Crop. The village is known for a particularly notable crop. This could mean rare, high-quality, plentiful, or a mix of the three.";
            break;
        case 6:
            specialty.innerHTML += "Crafted Goods. The village is known for the craft of a certain item, or type of goods, widely liked and highly valued, such as hand-crafted furniture, a category of clothing item, etc.";
            break;
    }
}

function resourceValue() {
    let resource = document.getElementById("resource");
    let defaultPoints = document.getElementById("defaultPoints");
    let roll = (Math.floor(Math.random() * 10) + 1);
    switch (roll) {
        case 1:
            resource.innerHTML += "Crops. The village is surrounded by fields or orchards that produce wheat, barley, grapes, vegetables, fruit, etc. These are harvested in their raw forms, and the excess is sold or traded.";
            defaultPoints.innerHTML += "1. Farm(s) <br>2. Mill(s) and/or storage locations (silos or barns)";
            break;
        case 2:
            resource.innerHTML += "Dairy. Pastures contain cows, goats, or sheep for milk, or chickens (or similar) for eggs. Additional animals may also be bred for sale. Due to milks tendency to spoil quickly, it might only be sold at nearby towns or markets. If the produce needs to travel longer distances, perhaps the village makes butter, cream, or cheese instead.";
            defaultPoints.innerHTML += "1. Cellar<br>2. Creamery<br>3. Field/Barn/Coop";
            break;
        case 3:
            resource.innerHTML += "Herbs. Herbs grown in the village are used for alchemy, medicine or, simply, cooking, and are typically tended by an individual, due to their more specialized, and potentially dangerous, nature. The individual may have had some degree of medical, or arcane, training. Note: Unless the village is extremely small, it is unlikely that herbs are a villages sole focus.";
            defaultPoints.innerHTML += "1. Herbalist’s Hut<br>2. Gardens";
            break;
        case 4:
            resource.innerHTML += "Fishing. The villagers utilize the bounty of the nearest stream, river, lake, or ocean. The villages proximity to neighboring settlements dictates how the fish can be sold. If remote, the fish might be dried and salted; if nearby, they could be sold fresh.";
            defaultPoints.innerHTML += "1. Fisherman’s Stand<br>2. Wharf/Pier";
            break;
        case 5:
            resource.innerHTML += "Livestock (Labor). Animals are bred here to perform a particular job. These include plough and war horses, donkeys, cattle, and oxen. The breeding and raising of these animals can be a long process, so trade is likely seasonal, and the animals expensive. Location(s): stable or barn";
            defaultPoints.innerHTML += "1. Stable or Barn";
            break;
        case 6:
            resource.innerHTML += "Livestock (Meat and Hides). Animals are raised to be slaughtered for meat, including cattle, pigs, and sheep. Some may be kept to feed the village, but excess animals (live or butchered) would be sold or traded. Location(s): barn or pens, small butchers shop";
            defaultPoints.innerHTML += "1. Barn or Pens<br>2. Small Butcher’s Shop";
            break;
        case 7:
            resource.innerHTML += "Livestock (Shearing): Llamas, sheep, goats, and/or yaks are shorn in the village, the wool bundled and taken to market. The village may also produce its own woolen goods for sale.";
            defaultPoints.innerHTML += "1. Shearing Shed<br>2. Storage<br>3. Fields/Barn<br>4. Small Stall/Shop";
            break;
        case 8:
            resource.innerHTML += "Logging and Lumber. Trees are planted and harvested, sustainably. Harvested trees are hand- trimmed of branches, and logs are used, traded, and sold. Villagers may also process wood to craft wooden goods.";
            defaultPoints.innerHTML += "1. Logging Camp<br>2. Carpenters Workshop";
            break;
        case 9:
            resource.innerHTML += "Mining. Raw metal ores are excavated from the ground, cleaned and sorted, and then used, traded, or sold. It is possible the mine is owned by a noble or kingdom, who sends transport to pick up excavated materials. Ores may be processed in the village and turned into metal goods.";
            defaultPoints.innerHTML += "1. Foreman’s Station<br>2. Mine<br>3. Smithy";
            break;
        case 10:
            resource.innerHTML += "Quarrying and Masonry. Stone is removed from the landscape in either raw, unrefined pieces, or cut into blocks for various purposes. It is possible the quarry is owned by a noble or kingdom, who sends transport to pick up excavated materials. A local mason may build using the excavated stone.";
            defaultPoints.innerHTML += "1. Mason or Foreman’s Station";
            break;
    }
}

function recentHistoryValue() {
    let recentHistory = document.getElementById("recentHistory");
    let roll = (Math.floor(Math.random() * 12) + 1);
    switch (roll) {
        case 1:
            recentHistory.innerHTML += "Animal Issues. Livestock, or pets, may have been ravaged by local wildlife, or monsters, or animals may have been struck by sickness or pestilence.";
            break;
        case 2:
            recentHistory.innerHTML += "Attacks. Members of the community have been attacked, either by briggands or, perhaps, monsters.";
            break;
        case 3:
            recentHistory.innerHTML += "Bumper Production. A staple resource of the village has yielded very well, recently.";
            break;
        case 4:
            recentHistory.innerHTML += "Out of Favor. The village has been subject to the ire of a nearby ruler, or entity.";
            break;
        case 5:
            recentHistory.innerHTML += "Entertainment. A certain form of entertainment is proving popular, whether a game or pastime, the arrival of a storyteller or musician, or something else.";
            break;
        case 6:
            recentHistory.innerHTML += "Fear. Something unnerving, or frightening, has happened recently.";
            break;
        case 7:
            recentHistory.innerHTML += "Good Fortune. The village has received favorable notice from a nearby ruler, or entity of note.";
            break;
        case 8:
            recentHistory.innerHTML += "Infestation. Some form of vermin, or pest, has recently beset the village, and has become an ongoing issue.";
            break;
        case 9:
            recentHistory.innerHTML += "Poor Production. A staple resource of the village has yielded poorly of late.";
            break;
        case 10:
            recentHistory.innerHTML += "Power Vacuum. The death, or absence, of a local leadership figure, or figures, has led to internal strife within the community.";
            break;
        case 11:
            recentHistory.innerHTML += "Safe Haven. The village has become a sanctuary for refugees, or those in need.";
            break;
        case 12:
            recentHistory.innerHTML += "Wartorn. The village was occupied by military forces, and suffered damages, during wartime in the recent past.";
            break;
    }
}

function populationDensityValue() {
    let populationDensity = document.getElementById("populationDensity");
    let roll = ((Math.floor(Math.random() * 20) + 1) + popDenMod);
    switch (true) {
        case isInRange(roll, -20, 2):
            populationDensity.innerHTML += "Skeleton. There are only enough people here for the village to function at its most basic level.";
            crimeMod += 2;
            break;
        case isInRange(roll, 3, 6):
            populationDensity.innerHTML += "Sparse. People are living here, but not many. They are able to handle all tasks that need doing but, perhaps, with some difficulty.";
            crimeMod += 1;
            break;
        case isInRange(roll, 7, 14):
            populationDensity.innerHTML += "Populous. There are enough people here for the village to manage all tasks without difficulty.";
            break;
        case isInRange(roll, 15, 18):
            populationDensity.innerHTML += "Dense. The village seems to have a large amount of people for its size. There are many hands available to help with any work that needs doing.";
            crimeMod += -1;
            break;
        case isInRange(roll, 19, 20):
            populationDensity.innerHTML += "Congested. The village has as many people in it as it can hold, and camps may be cropping up on the outskirts. There are plenty of hands available to help with work but, unless the work is very large-scale (such as quarrying), there may be at least some idle people.";
            crimeMod += -2;
            break;
    }
}

function demographicsValue() {
    let demographics = document.getElementById("demographics");
    let roll = (Math.floor(Math.random() * 20) + 1);
    switch (true) {
        case isInRange(roll, 1, 8):
            demographics.innerHTML += "Only One. 100% primary race.";
            break;
        case isInRange(roll, 9, 12):
            demographics.innerHTML += "Only Two. 60% primary race, 40% secondary race.";
            break;
        case isInRange(roll, 13, 15):
            demographics.innerHTML += "Normal Distribution. 50% primary race, 25% secondary race, 15% tertiary race, 10% other.";
            break;
        case isInRange(roll, 16, 17):
            demographics.innerHTML += "Wide Distribution. 20% primary race. All others reasonably well represented.";
            break;
        case isInRange(roll, 18, 19):
            demographics.innerHTML += "High and Low. 80% primary race in high social standing, 20% secondary race, in lower social standing.";
            break;
        case isInRange(roll, 20, 20):
            demographics.innerHTML += "In Flux. No discernible distribution. Racial diversity seems random, with no sense of organization or numerical dominance.";
            break;
    }
}

function dispositionValue() {
    let disposition = document.getElementById("disposition");
    let roll = ((Math.floor(Math.random() * 20) + 1) + dispotionMod);
    switch (true) {
        case isInRange(roll, -20, 2):
            disposition.innerHTML += "Hostile. Locals seem very unfriendly toward visitors, and would likely make out-of-towners feel unwelcome. This could manifest as coldness, passive-aggressiveness, or even violence.";
            break;
        case isInRange(roll, 3, 6):
            disposition.innerHTML += "Unfriendly. Locals dont care much for visitors, looking upon them with contempt, fear, or suspicion.";
            break;
        case isInRange(roll, 7, 14):
            disposition.innerHTML += "Neutral. Locals are standoffish, or perhaps hard on the outside, but can be friendly if you get to know them.";
            break;
        case isInRange(roll, 15, 18):
            disposition.innerHTML += "Friendly. Locals are generally friendly, welcoming, and slow to take offense.";
            break;
        case isInRange(roll, 19, 20):
            disposition.innerHTML += "Open. The locals actively enjoy visitors, and their culture incorporates this. Just about anyone is welcome.";
            break;
    }
}

function lawEnforcementValue() {
    let lawEnforcement = document.getElementById("lawEnforcement");
    let roll = (Math.floor(Math.random() * 20) + 1);
    switch (true) {
        case isInRange(roll, 1, 3):
            lawEnforcement.innerHTML += "None. This could be good or bad, depending on ones point of view. Good if the folk are honest enough that policing is unnecessary, but bad when you need to call for help.";
            crimeMod += -2;
            break;
        case isInRange(roll, 4, 10):
            lawEnforcement.innerHTML += "Disorganized Rabble. The quintessential village mob, with little to no organization. This is usually formed on the spur-of-the-moment to address a particular issue.";
            crimeMod += -1;
            break;
        case isInRange(roll, 11, 14):
            lawEnforcement.innerHTML += "Organized Rabble. Perhaps better than the alternative, this group has guidance and leadership in the form of an individual, or small group. They may or may not be competent.";
            break;
        case isInRange(roll, 15, 18):
            lawEnforcement.innerHTML += "Sheriff. A single, officially sanctioned sheriff looks to maintaining order within the village. If they require additional help, they request it from the villagers, who may assist in a temporary capacity.";
            crimeMod += 1;
            break;
        case isInRange(roll, 19, 20):
            lawEnforcement.innerHTML += "Sheriff and Deputies. A sheriff and a handful of deputies, who are officially sanctioned authorities, maintain a firm hold on the village. They maintain civility in an official capacity.";
            crimeMod += 2;
            break;
    }
}

function leadershipValue() {
    let leadership = document.getElementById("leadership");
    let roll = (Math.floor(Math.random() * 6) + 1);
    switch (roll) {
        case 1:
            leadership.innerHTML += "No Leader. The village operates with no leadership, which could lead to unresolved disputes.";
            break;
        case 2:
            leadership.innerHTML += "Natural Village Elder. The village recognizes a wise individual, and informally acknowledges them as an authority figure.";
            break;
        case 3:
            leadership.innerHTML += "External Ruler. The village owes fealty to a ruler who is located outside the village itself.";
            break;
        case 4:
            leadership.innerHTML += "Local Council. Prominent members of the community were chosen to lead the village collectively.";
            break;
        case 5:
            leadership.innerHTML += "Single, Elected Leader. The locals democratically voted for their current leader.";
            break;
        case 6:
            leadership.innerHTML += "Anarcho-Syndicalist Commune. The members of the village take turns as a sort of executive officer for the week.";
            break;
    }
}

function populationWealthValue() {
    let populationWealth = document.getElementById("populationWealth");
    let roll = ((Math.floor(Math.random() * 20) + 1) + popWeaMod);
    switch (true) {
        case isInRange(roll, -20, 2):
            populationWealth.innerHTML += "Destitute. Most of the population consistently lacks the barest essentials of what they need to survive.";
            crimeMod += -2;
            break;
        case isInRange(roll, 3, 6):
            populationWealth.innerHTML += "Impoverished. Around half of the population struggles to carve out even a meager existence.";
            crimeMod += -1;
            break;
        case isInRange(roll, 7, 14):
            populationWealth.innerHTML += "Average. Most of the population have enough to live a modest life.";
            break;
        case isInRange(roll, 15, 17):
            populationWealth.innerHTML += "Prosperous. Most of the population has enough to live a good life and, of them, a fair amount can even live comfortably.";
            crimeMod += -1;
            break;
        case isInRange(roll, 18, 19):
            populationWealth.innerHTML += "Wealthy. The villagers are well off, perhaps even able to indulge once in a while.";
            crimeMod += -2;
            break;
        case isInRange(roll, 20, 40):
            populationWealth.innerHTML += "Affluent. The villagers have plenty of disposable income and want for absolutely nothing.";
            crimeMod += -3;
            break;
    }
}

function crimeValue() {
    let crime = document.getElementById("crime");
    let roll = ((Math.floor(Math.random() * 20) + 1) + crimeMod);
    switch (true) {
        case isInRange(roll, -20, 2):
            crime.innerHTML += "Average. Theft or violence can happen from time to time. Best to keep an eye out. (+3 Urban Encounter Rolls)";
            break;
        case isInRange(roll, 3, 5):
            crime.innerHTML += "Uncommon. Crime does not occur often but, when it does, it is a noteworthy occurrence. (+2 Urban Encounter Rolls)";
            break;
        case isInRange(roll, 6, 10):
            crime.innerHTML += "Rare. Most villagers have had no personal experience with crime, and few know people that have. (+1 Urban Encounter Rolls)";
            break;
        case isInRange(roll, 11, 40):
            crime.innerHTML += "Little-to-None. Most, or all, of the villagers believe the village is totally safe, and certainly haven’t experienced any crime personally.";
            break;
    }
}

function worshipValue(sizeFinal) {
    let worship = document.getElementById("worship");
    switch (true) {
        case isInRange(sizeFinal, 1, 1):
            worshipAmount = 1;
            break;
        case isInRange(sizeFinal, 2, 3):
            worshipAmount = (Math.floor(Math.random() * 2) + 1);
            break;
        case isInRange(sizeFinal, 4, 5):
            worshipAmount = ((Math.floor(Math.random() * 2) + 1) + 1)
            break;
    }
    for (cont = 0; cont < worshipAmount; cont++) {
        let worshipSize = worshipSizeValue();
        let worshipFervency = worshipFervencyValue();
        let worshipAlignment = worshipAlignmentValue();
        worship.innerHTML += cont + 1 + ". " + worshipSize + " | " + worshipFervency + " | " + worshipAlignment;
        if (cont != (worshipAmount - 1)) {
            worship.innerHTML += "<br>";
        }
    }
    if (worshipAmount == 0) {
        worship.innerHTML += "None.";
    }
}

function worshipSizeValue() {
    let roll = (Math.floor(Math.random() * 20) + 1);
    switch (true) {
        case isInRange(roll, 1, 1):
            return worshipSize = "Secret. The place of worships size is unclear, as the location is not publicly known.";
            break;
        case isInRange(roll, 2, 7):
            return worshipSize = "Altar. A small shrine or, perhaps, a tiny shack, usually evincing some various items or images relating to that which the faith venerates.";
            break;
        case isInRange(roll, 8, 14):
            return worshipSize = "Oratory. A modest building with seating for attendees, appointed with various items or images relating to that which the faith venerates.";
            break;
        case isInRange(roll, 15, 17):
            return worshipSize = "Sanctuary. A large, well-appointed structure, able to comfortably accommodate up to a few hundred people.";
            break;
        case isInRange(roll, 18, 19):
            return worshipSize = "Temple. A grand building, replete with elements like high ceilings, plush furnishings, and other impressive ornamental and/or architectural features. It can hold nearly a thousand attendees.";
            break;
        case isInRange(roll, 20, 20):
            return worshipSize = "Great Temple. An awe-inspiring structure, devoted to that which it venerates. No expense was spared in its construction. It might display such elements as stunning frescos, elaborate stained-glass scenes, and towering, gilded statues. Walking into a great temple is a rare and striking experience for those who do not live near one.";
            break;
    }
}

function worshipFervencyValue() {
    let roll = (Math.floor(Math.random() * 20) + 1);
    switch (true) {
        case isInRange(roll, 1, 3):
            return worshipFervency = "Unseen. To those outside the following, it is not clear that the group exists.";
            break;
        case isInRange(roll, 4, 7):
            return worshipFervency = "Quiet. Adherents to the faith are inconspicuous, unless one knows what to look for (perhaps particular gestures, items of clothing, or phrases).";
            break;
        case isInRange(roll, 8, 12):
            return worshipFervency = "Subtle. Followers of the faith may be identifiable, but remain very reserved.";
            break;
        case isInRange(roll, 13, 16):
            return worshipFervency = "Moderate. The pious are confident and unafraid to display their faith openly, but do not encroach upon the wider populus uncalled for.";
            break;
        case isInRange(roll, 17, 19):
            return worshipFervency = "Fervent. Followers are outspoken, with little or no fear of reproach. They may sing or speak to the masses.";
            break;
        case isInRange(roll, 20, 20):
            return worshipFervency = "Zealous. Adherents are utterly and unthinkingly devout, forcing their doctrine upon their surroundings and peers, or taking actions that further their cause regardless of personal cost. Though typically seen as negative, this could also be a positive, such as a church of light rising up in an evil kingdom, helping those in need, even if it puts themselves in peril.";
            break;
    }
}

function worshipAlignmentValue() {
    let roll = (Math.floor(Math.random() * 10) + 1);
    switch (true) {
        case isInRange(roll, 1, 1):
            return worshipAlignment = "Evil";
            break;
        case isInRange(roll, 2, 5):
            return worshipAlignment = "Neutral";
            break;
        case isInRange(roll, 6, 10):
            return worshipAlignment = "Good";
            break;
    }
}

function placeGatheringValue(sizeFinal) {
    let placeGathering = document.getElementById("placeGathering");
    switch (sizeFinal) {
        case 1:
            placeGatheringAmount = ((Math.floor(Math.random() * 2) + 1) - 1);
            break;
        case 2:
            placeGatheringAmount = 1;
            break;
        case 3:
            placeGatheringAmount = (Math.floor(Math.random() * 2) + 1);
            break;
        case 4:
            placeGatheringAmount = (Math.floor(Math.random() * 2) + 1);
            break;
        case 5:
            placeGatheringAmount = ((Math.floor(Math.random() * 2) + 1) + 1);
            break;
    }
    for (cont = 0; cont < placeGatheringAmount; cont++) {
        let placeGatheringType = placeGatheringTypeValue();
        placeGathering.innerHTML += cont + 1 + ". " + placeGatheringType;
        if (cont != (placeGatheringAmount - 1)) {
            placeGathering.innerHTML += "<br>";
        }
    }
    if (placeGatheringAmount == 0) {
        placeGathering.innerHTML += "None.";
    }
}

function placeGatheringTypeValue() {
    let roll = (Math.floor(Math.random() * 4) + 1);
    switch (roll) {
        case 1:
            return "Amphitheater. Outdoor space with a stage and tiered seating.";
            break;
        case 2:
            return "Dance Hall. Location for dances and festive events.";
            break;
        case 3:
            return "Gathering Hall. General building used for community-organised activities.";
            break;
        case 4:
            return "Outdoor Recreational Area. A tended space where locals might eat, take leisure time, or duel to the death...";
            break;
    }
}

function otherLocationsValue(sizeFinal) {
    let otherLocations = document.getElementById("otherLocations");
    switch (sizeFinal) {
        case 1:
            otherLocationsAmount = ((Math.floor(Math.random() * 2) + 1) - 1);
            break;
        case 2:
            otherLocationsAmount = (Math.floor(Math.random() * 2) + 1);
            break;
        case 3:
            otherLocationsAmount = ((Math.floor(Math.random() * 2) + 1) + 1);
            break;
        case 4:
            otherLocationsAmount = (Math.floor(Math.random() * 2) + 1) + (Math.floor(Math.random() * 2) + 1);
            break;
        case 5:
            otherLocationsAmount = ((Math.floor(Math.random() * 2) + 1) + (Math.floor(Math.random() * 2) + 1) + 1);
            break;
    }
    for (cont = 0; cont < otherLocationsAmount; cont++) {
        let otherLocationsType = otherLocationsTypeValue(otherLocationsTypeAux);
        otherLocations.innerHTML += cont + 1 + ". " + otherLocationsType;
        if (cont != (otherLocationsAmount - 1)) {
            otherLocations.innerHTML += "<br>";
        }
    }
    if (otherLocationsAmount == 0) {
        otherLocations.innerHTML += "None.";
    }
}

function otherLocationsTypeValue(otherLocationsTypeAux) {
    let roll = ((Math.floor(Math.random() * 100) + 1) + otherLocationsTypeAux);
    if (roll == 0) {
        roll++;
    }
    switch (true) {
        case isInRange(roll, 1, 4):
            return "Baker (B). Bakes and sells fresh bread and, possibly, pastries.";
            break;
        case isInRange(roll, 5, 7):
            return "Butcher (B). Processes and sells fresh and/or dried meat.";
            break;
        case isInRange(roll, 8, 11):
            return "Cooper (B). Crafts wooden vessels held together with metal hoops, including barrels, buckets, etc.";
            break;
        case isInRange(roll, 12, 15):
            return "Carpenter (B). Builds with or carves wood, as well as carrying out repairs.";
            break;
        case isInRange(roll, 16, 19):
            return "General Store (B). Sells basic supplies, groceries, and various odds and ends.";
            break;
        case isInRange(roll, 20, 23):
            return "Herbalist (B). Sells common herbs and natural, non- magical remedies.";
            break;
        case isInRange(roll, 24, 27):
            return "Smithy (B). Sells and crafts metal tools and equipment, including very basic weapons and armor.";
            break;
        case isInRange(roll, 28, 31):
            return "Tailor (B). Makes and sells of clothing, including hats and cloaks. Also sells general items made from cloth, such as blankets, and carries out repairs and alterations of cloth goods.";
            break;
        case isInRange(roll, 32, 35):
            return "Tanner/Taxidermist (B). Processes animal hides for practical or ornamental purposes.";
            break;
        case isInRange(roll, 36, 39):
            return "Thatcher (B). Builds roofs using layers of dried straw, reeds, rushes, etc.";
            break;
        case isInRange(roll, 40, 43):
            return "Wainwright (B). Builds carts and wagons.";
            break;
        case isInRange(roll, 44, 47):
            return "Weaver (B). Weaves raw fabric and baskets.";
            break;
        case isInRange(roll, 48, 50):
            return "Alchemist (S). Brews and sells potions, as well as mundane herbs and alchemical ingredients.";
            break;
        case isInRange(roll, 51, 52):
            return "Artist (S). Encompasses painter, sculptor or other visual art as appropriate.";
            break;
        case isInRange(roll, 53, 55):
            return "Cobbler (S). Makes and mends boots and shoes.";
            break;
        case isInRange(roll, 56, 58):
            return "Mill (S). Facilities for milling grain.";
            break;
        case isInRange(roll, 59, 61):
            return "Shipwright (S). Builds and launches boats and/ or ships. [Reroll if settlement is not bordering a significant source of water]";
            break;
        case isInRange(roll, 62, 62):
            return "Rare Botanicals (E). Cultivates and sells herbs rare to the region";
            break;
        case isInRange(roll, 63, 63):
            return "Luxury Furnishings (E). Procures and sells all manner of home items for fine living, including furniture, art, and other high-quality goods.";
            break;
        case isInRange(roll, 64, 64):
            return "Rare Libations & Fare (E). Sells (and, perhaps, makes or brews) drinks and/or food of surpassing quality or rarity to the region.";
            break;
        case isInRange(roll, 65, 65):
            return "Rare Trade Goods (E). Procures and sells items and materials, such as ores or textiles, that are rare to the region.";
            break;
        case isInRange(roll, 66, 66):
            return "Magic Shop - Armor (E). Sells magical items with a focus on armor and protective equipment.";
            break;
        case isInRange(roll, 67, 67):
            return "Magic Shop - Books (E). Sells magical items with a focus on literature, arcane tomes and lore. They may also carry books and documents (such as maps and records) of a rare and significant nature, though non-magical.";
            break;
        case isInRange(roll, 68, 68):
            return "Magic Shop - Clothing (E). Sells magical items with a focus on clothing of all types which bear magical properties.";
            break;
        case isInRange(roll, 69, 69):
            return "Magic Shop - Jewelry (E). Sells magical items with a focus on enchanted, or otherwise magically imbued, jewelry.";
            break;
        case isInRange(roll, 70, 70):
            return "Magic Shop - Weapons (E). Sells magical items with a focus on weapons with mystic properties and, perhaps, shields.";
            break;
        case isInRange(roll, 71, 71):
            return "Magic Shop - Miscellaneous & Curiosities (E). Procures and sells magical items with a focus on strange and rare artifacts of a wondrous or intriguing nature.";
            break;
        case isInRange(roll, 72, 73):
            return "Barber. Provides grooming services, such as haircuts or shaves.";
            break;
        case isInRange(roll, 74, 75):
            return "Bathhouse. Provides spaces for bathing.";
            break;
        case isInRange(roll, 76, 77):
            return "Doctor/Apothecary. Provides medical care.";
            break;
        case isInRange(roll, 78, 79):
            return "House of Leisure. Provides entertainment and/or relaxation (GM may decide what kind).";
            break;
        case isInRange(roll, 80, 84):
            return "Inn. Provides accommodation, as well as a place to have a bath and a decent meal.";
            break;
        case isInRange(roll, 85, 89):
            return "Soothsayer. Provides magical prediction and prophecy - sayers of sooth!";
            break;
        case isInRange(roll, 90, 94):
            return "Stable. Provides boarding accommodation for mounts, as well as selling carts, animals, and their tack.";
            break;
        case isInRange(roll, 95, 99):
            return "Tavern. Provides food and drink.";
            break;
        case isInRange(roll, 100, 100):
            let aux = otherLocationsTypeValue(-1);
            return "Burned down or abandoned business. This used to be a place of business, but isnt anymore. Roll once more on this table to see what it was." + " | " + aux;
            break;
    }
}

function villageEventsValue() {
    let villageEvents = document.getElementById("villageEvents");
    let roll = (Math.floor(Math.random() * 10) + 1);
    switch (roll) {
        case 1:
            villageEvents.innerHTML += "Birth or Birthday. Blessings are sought for individuals on the day of their birth.";
            break;
        case 2:
            villageEvents.innerHTML += "Party. These are fun events that bring the community together for fellowship and camaraderie, and could be happening for a number of reasons.";
            break;
        case 3:
            villageEvents.innerHTML += "Funeral. A gathering to remember those from the community who passed away, either in mourning or in celebration of their life, with a party reflecting the things that meant most to the deceased.";
            break;
        case 4:
            villageEvents.innerHTML += "Harvest and Productivity. Villagers seek blessings for upcoming work, such as a harvest, or thanks are given for bountiful yields.";
            break;
        case 5:
            villageEvents.innerHTML += "Love. Festivities to encourage pairing, celebrating couples and family.";
            break;
        case 6:
            villageEvents.innerHTML += "Political. A celebration honoring events of national significance, such as remembering a great victory, or gaining independence.";
            break;
        case 7:
            villageEvents.innerHTML += "Religious. Events relating to and honoring a venerated deity are often regular and steeped in tradition.";
            break;
        case 8:
            villageEvents.innerHTML += "Wedding. Celebrating the formal joining of two families.";
            break;
        case 9:
            villageEvents.innerHTML += "Local. Celebration revolving around a major local event or the deeds of a local hero.";
            break;
        case 10:
            villageEvents.innerHTML += "Travel & Welcome. Festivities welcome someone new to the community, or someone well on a journey.";
            break;
    }
}

function villagePoliticalRumorsValue() {
    let villagePoliticalRumors = document.getElementById("villagePoliticalRumors");
    let roll = (Math.floor(Math.random() * 6) + 1);
    switch (roll) {
        case 1:
            villagePoliticalRumors.innerHTML += "Mighty Misfortune. Misfortune has fallen upon a prominent figure residing near to, but outside the bounds of, the settlement (stripped of title, robbed, murdered, lost at cards, etc).";
            break;
        case 2:
            villagePoliticalRumors.innerHTML += "Fealty. A new power is claiming rights of fealty over the village, at the culmination of a long conflict.";
            break;
        case 3:
            villagePoliticalRumors.innerHTML += "Drums of War. Neighboring cities are preparing to go to war with one another.";
            break;
        case 4:
            villagePoliticalRumors.innerHTML += "Noble Wedding. A local noble has just married the son or daughter of a well-loved (or greatly-loathed) family.";
            break;
        case 5:
            villagePoliticalRumors.innerHTML += "More Taxes. An increase in taxes is about to implemented, to pay for an expensive and ambitious project.";
            break;
        case 6:
            villagePoliticalRumors.innerHTML += "Missing Taxman. Taxes have not been collected in quite some time, and no one has seen the collector for weeks.";
            break;
    }
}

function villageRandomSuperstitionValue() {
    let villageRandomSuperstition = document.getElementById("villageRandomSuperstition");
    let roll = (Math.floor(Math.random() * 20) + 1);
    switch (roll) {
        case 1:
            villageRandomSuperstition.innerHTML += "Burying a dead cat under the doorstep is essential for a buildings prosperity.";
            break;
        case 2:
            villageRandomSuperstition.innerHTML += "Half a chicken will cure any number of ailments (from plague, to pimples) when tied to the afflicted area.";
            break;
        case 3:
            villageRandomSuperstition.innerHTML += "Placing mirrors, or large reflective objects, opposite one another in a room can open an invisible doorway for devils.";
            break;
        case 4:
            villageRandomSuperstition.innerHTML += "Hanging mistletoe above the lintel is a sacred oath that the host will harm none who enter.";
            break;
        case 5:
            villageRandomSuperstition.innerHTML += "Never stick a knife point-down into wood, or a cutting block, as it invites acts of violence among those nearby.";
            break;
        case 6:
            villageRandomSuperstition.innerHTML += "Evil spirits can lurk within the leaves of cabbages and sprouts; you must carve a holy sign into the bottom before cooking them.";
            break;
        case 7:
            villageRandomSuperstition.innerHTML += "After visiting a grave or cemetery, one must take a winding path home, making stops along the way, in order to lose any tag-along spirits.";
            break;
        case 8:
            villageRandomSuperstition.innerHTML += "Giving a knife as a gift will sever a friendship, so they must always be symbolically paid for.";
            break;
        case 9:
            villageRandomSuperstition.innerHTML += "Never use dull scissors as, if you do, you risk accidentally cutting the thread tethering your soul to your body.";
            break;
        case 10:
            villageRandomSuperstition.innerHTML += "Knowing your full name allows those who wish you ill to put a curse on you, so keep your middle names secret.";
            break;
        case 11:
            villageRandomSuperstition.innerHTML += "A carrion bird landing in front of you means you, or someone close to you, will die soon.";
            break;
        case 12:
            villageRandomSuperstition.innerHTML += "A single magpie is bad luck, but saluting the lone magpie (Good morning Mr. Magpie, hows your wife?) will turn bad luck into good.";
            break;
        case 13:
            villageRandomSuperstition.innerHTML += "In games, never grab the dice. The owner of the dice must give them to the first person who must roll, who must pass them on and so on. Doing otherwise will curse the dice for a fortnight.";
            break;
        case 14:
            villageRandomSuperstition.innerHTML += "A pregnant woman must not go out in the evenings, lest the overwhelming darkness taint the child. If she must go out, she must carry a second lamp directly in front of her stomach, to protect the baby.";
            break;
        case 15:
            villageRandomSuperstition.innerHTML += "When making a wish at a well, the value of coin you throw in should be commensurate with that of your wish.";
            break;
        case 16:
            villageRandomSuperstition.innerHTML += "When speaking with adult men or women, it is bad luck to not address them as sir or madam, at least once, during the exchange.";
            break;
        case 17:
            villageRandomSuperstition.innerHTML += "When mining or cutting stone, the chips from the first strike of the day must be pocketed by the one who struck, lest earth spirits feel taken for granted.";
            break;
        case 18:
            villageRandomSuperstition.innerHTML += "Proclaiming new love at dawn or dusk is bad luck.";
            break;
        case 19:
            villageRandomSuperstition.innerHTML += "Kissing the door frame of your house upon entry or exit asks the gods protection upon it.";
            break;
        case 20:
            villageRandomSuperstition.innerHTML += "Never leave an empty spirits glass or cup right- side-up, lest an actual spirit attempt to fill the void, inhabiting the body of the next drinker.";
            break;
    }
}

function villageGoingOnValue() {
    let villageGoingOn = document.getElementById("villageGoingOn");
    let roll = (Math.floor(Math.random() * 6) + 1);
    switch (roll) {
        case 1:
            villageGoingOn.innerHTML += "Workers Compensation. A worker has been injured on the job, and folks are rushing to help them.";
            break;
        case 2:
            villageGoingOn.innerHTML += "Road Merchant. A travelling merchant just arrived in town, and has all kinds of unique things to show and sell.";
            break;
        case 3:
            villageGoingOn.innerHTML += "Children Missing. Some of the younger villagers have gone missing. How long have they been gone? What were they last seen doing?";
            break;
        case 4:
            villageGoingOn.innerHTML += "Fallen Rider. A severely injured man in armor has ridden into the village, late at night, and fallen, unconscious, from his horse. He is wearing a tabard displaying an unfamiliar coat of arms.";
            break;
        case 5:
            villageGoingOn.innerHTML += "They are Mine. Two villagers are competing for the hand of a local heartthrob.";
            break;
        case 6:
            villageGoingOn.innerHTML += "Echoes in the Deep. A villager swears they can hear sounds like voices coming from underground.";
            break;
    }
}

function villageOpportunitiesValue() {
    let villageOpportunities = document.getElementById("villageOpportunities");
    let roll = (Math.floor(Math.random() * 6) + 1);
    switch (roll) {
        case 1:
            villageOpportunities.innerHTML += "Thief. Someone has been absconding with large amounts of the villages major crop, or resource.";
            break;
        case 2:
            villageOpportunities.innerHTML += "Wildlife. Local wildlife has been harassing the villagers, or animals.";
            break;
        case 3:
            villageOpportunities.innerHTML += "Monster(s). Something worse than simple wildlife is terrorizing the village.";
            break;
        case 4:
            villageOpportunities.innerHTML += "Haunting. A spirit haunts some place within the village. Something was done to this person while they were alive that has tied the spirit to this place.";
            break;
        case 5:
            villageOpportunities.innerHTML += "Party Time. A festival is coming up soon, and a shipment carrying something important for the event has not arrived.";
            break;
        case 6:
            villageOpportunities.innerHTML += "Shady Doings. Strange symbols are discovered written on the walls of certain homes, or other buildings. Bits of bones, or piles of stones, placed just-so have been found. Something, or someone, is trying to send a message, or accomplish a less-than- savory task. What is it and why is it happening?";
            break;
    }
}

function villageHarshWeatherValue() {
    let villageHarshWeather = document.getElementById("villageHarshWeather");
    let roll = (Math.floor(Math.random() * 6) + 1);
    switch (roll) {
        case 1:
            villageHarshWeather.innerHTML += "Ideal. Recent conditions have been as good as possible. Work has been able to progress better than usual, and any grown resource may be having a richer yield than normal.";
            break;
        case 2:
            villageHarshWeather.innerHTML += "Heavy Precipitation. Rain or snow have been significantly heavier than usual. There has either been sufficient flooding, or snow has been deep enough, to cause damage, perhaps even trapping folk inside their homes.";
            break;
        case 3:
            villageHarshWeather.innerHTML += "Drought. It has been warm, maybe even pleasantly so, but it also has not rained in some time. Things are getting dry and brittle. Unless water storage solutions are in place, and water distribution (such as irrigation) is available, this doesnt bode well.";
            break;
        case 4:
            villageHarshWeather.innerHTML += "Thunderstorms or Blizzards (non-arid region). The precipitation hasnt been the problem so much as the severity of the storms. It is impossible to work, or travel, in these conditions, so village residents are holed up inside, waiting out the storms, which have been occurring much more frequently.";
            break;
        case 5:
            villageHarshWeather.innerHTML += "Wildfires. There have been fires, either nearby or some ways off. Either way, theyre too close for comfort. Ash can be seen on the ground, smoke can be smelled in the air, and forests nearby are in danger, if not ablaze already.";
            break;
        case 6:
            villageHarshWeather.innerHTML += "Hail. Storms dropping chunks of ice at great speeds have been devastating the village, possibly damaging crops, structures, or even people and animals caught outdoors.";
            break;
        case 7:
            villageHarshWeather.innerHTML += "Dust Storms (arid region). Dust storms have been passing through in a choking haze, making it difficult to travel, or do extended work outside. Air quality is awful, and some folk are getting sick.";
            break;
        case 8:
            villageHarshWeather.innerHTML += "Hurricane (coastal region). A hurricane is approaching, or has arrived. Forceful wind, pounding rain, flooding, and hail have all been seen. Some folks may be fleeing.";
            break;
        case 9:
            villageHarshWeather.innerHTML += "Tornado. A whirling cyclone is approaching, or has careened through or near, the village, uprooting crops, destroying buildings, or worse.";
            break;
        case 10:
            villageHarshWeather.innerHTML += "Earthquake. Shifting earth beneath the village is causing, or has caused, structural collapse and, possibly, even sinkholes and cave-ins.";
            break;
    }
}

function villageDangerLevelValue() {
    let villageDangerLevel = document.getElementById("villageDangerLevel");
    let roll = (Math.floor(Math.random() * 20) + 1);
    switch (true) {
        case isInRange(roll, 1, 2):
            villageDangerLevel.innerHTML += "No Danger or Hazards. The village is a perfectly safe place to be (skip danger type table).";
            flagVillageDangerLevel = 1;
            break;
        case isInRange(roll, 3, 6):
            villageDangerLevel.innerHTML += "Low. Danger or hazards are a rarity.";
            break;
        case isInRange(roll, 7, 14):
            villageDangerLevel.innerHTML += "Medium. Danger or hazards are not unheard of, but not everyone has experienced them.";
            break;
        case isInRange(roll, 15, 18):
            villageDangerLevel.innerHTML += "High. Danger or hazards are common.";
            break;
        case isInRange(roll, 19, 20):
            villageDangerLevel.innerHTML += "Extreme. Danger or hazards abound. It is never safe to go anywhere alone.";
            break;
    }
}

function villageDangerTypeValue() {
    let villageDangerType = document.getElementById("villageDangerType");
    let roll = (Math.floor(Math.random() * 6) + 1);
    if (flagVillageDangerLevel != 1) {
        switch (roll) {
            case 1:
                villageDangerType.innerHTML += "Wildlife Attack. Wildlife lives in close proximity to the village, which may be open, or have little in the way of defenses. Wildlife may be free to roam the village, especially in low-traffic hours.";
                break;
            case 2:
                villageDangerType.innerHTML += "Misunderstanding. For new arrivals in the village, especially those not from the region, communication can be hard. Miscommunication can lead to dangerous situations.";
                break;
            case 3:
                villageDangerType.innerHTML += "Workplace Accidents. Depending on the kind of work being done, there may be some omnipresent danger, from mishaps with animals, to issues with equipment, especially if it is in poor condition.";
                break;
            case 4:
                villageDangerType.innerHTML += "Disease. Villages can lack rigorous standards of cleanliness or, due to their rural placement, can sometimes be prone to issues with disease-carrying vermin.";
                break;
            case 5:
                villageDangerType.innerHTML += "Unwanted Attention. Being a tight-knit community has the benefit of everyone being very familiar with everyone else. This makes visitors stick out like a sore thumb. This could draw attention from the villagers, or anyone who might be watching.";
                break;
            case 6:
                villageDangerType.innerHTML += "Monster Prey. Large monsters, who might view a town or city as too threatening a target, may view a village as a much easier source of food.";
                break;
        }
    } else {
        villageDangerType.innerHTML += "None.";
    }

}