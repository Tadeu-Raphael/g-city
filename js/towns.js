var fortificationMod = 0;
var lawEnforcementMod = 0;
var marketSquareMod = 0;
var placesWorshipMod = 0;
var farmsAndResourcesMod = 0;
var populationDensityMod = 0;
var populationOverflowMod = 0;
var populationWealthMod = 0;
var visitorTrafficMod = 0;
var dispositionMod = 0;
var nightActivityMod = 0;
var crimeMod = 0;
var qualityMod = 0;
var urbanEncounterMod = 0;


//Basic Information
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

//Community
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

//Points of Interest
nonCommercialLocationsValue();
commercialLocationsValue();
shopsValue();
servicesValue();

//Extra Intrigue
recentHistoryValue();
noteworthyOfficialValue();
marketDayValue();

function isInRange(x, min, max) {
    return min <= x && x <= max;
}

function rollDice(diceSize){
    return (Math.floor(Math.random() * diceSize) + 1);
}

function displayMessage(element, message) {
    const messageDiv = document.createElement("div");
    messageDiv.innerHTML = message;

    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    element.appendChild(messageDiv);
}

function originValue(){
    let origin = document.getElementById("origin");
    let roll = rollDice(8);

    const messages = [
        {
          range: [1, 1],
          message: "<b>Accidental:</b> The town was never meant to be anything more than a camp or minor settlement, at most. Fate saw to it that things happened differently. Outsiders found the place, some stayed, some left and told others and, over time, more and more came, more and more stayed, and the place grew."
        },
        {
          range: [2, 2],
          message: "<b>Decree:</b> It was decided by some authority that a town was needed here, funds and materials were set aside for its founding, and it was established."
        },
        {
          range: [3, 3],
          message: "<b>Exodus or Exile:</b> A group of settlers left (or were forced to leave) their home. They found this place and decided to build."
        },
        {
          range: [4, 4],
          message: "<b>Key Crossroads:</b> The town was established on a crossroads frequented by travelers from all over."
        },
        {
          range: [5, 5],
          message: "<b>Military Camp:</b> A deployment wound up lasting longer than anticipated, so the camp began building more solid fortifications in an increasingly permanent fashion. Either the original members of the encampment still reside here, or it was otherwise occupied after they departed."
        },
        {
          range: [6, 6],
          message: "<b>Port:</b> The town established itself on the water where none had done so previously, sprouting worn piers and roads taken by merchants and travelers alike. (The environment your port is in is [d6] 1-3: coastal 4-6: river.)"
        },
        {
          range: [7, 7],
          message: "<b>Rapid:</b> Fueled by ambition, strong will, and, perhaps, access to certain excellent products or resources, a group of people set their minds to creating this town in an important location. Witnesses express how it almost seemed to spring up overnight."
        },
        {
          range: [8, 8],
          message: "<b>Steady:</b> Built piece by piece over time, this town was a labor of commitment and devotion. It may have taken years, or even decades, until it reached fruition, but now it stands, such as it is."
        }
      ];

    let foundMessage;
    for (const item of messages) {
        if (isInRange(roll, item.range[0], item.range[1])) {
            foundMessage = item.message;
            if(roll == 6){
                let rollPort = rollDice(6);
                if(isInRange(rollPort, 1, 3)){
                    foundMessage += "(Coastal)";
                } else {
                    foundMessage += "(River)";
                }
            }

            break;
        }
    }

    if (foundMessage) {
        displayMessage(origin, foundMessage);
    } else {
        displayMessage(origin, "Invalid roll value.");
    }
}

function priorityValue(){
    let priority = document.getElementById("priority");
    let roll = rollDice(6);

    const messages = [
        {
          range: [1, 1],
          message: "<b>Military:</b> The town prioritizes defenses and law enforcement. (+1 to fortification roll) (+1 to law enforcement roll)."
        },
        {
          range: [2, 2],
          message: "<b>Government:</b> The town prioritizes structure, order, and law. (+1 to law enforcement roll). When rolling on the leadership table, reroll any results from 91-100. (Free location: Non-Commercial - Place of Government)."
        },
        {
          range: [3, 3],
          message: "<b>Production:</b> The town prioritizes generation and movement of resources. (Roll a d4 instead of a d8 on the specialty table)."
        },
        {
          range: [4, 4],
          message: "<b>Economic:</b> The town prioritizes their market, ensuring a large area, wide streets, more shops, and lodging. (+2 to market square roll). When checking the commercial locations table, consider your town 1 size category larger."
        },
        {
          range: [5, 5],
          message: "<b>Religious:</b> The town contains substantial temples in prominent locations. (Free location: Non-Commercial - Place of Worship) and +5 to its place of worship size roll."
        },
        {
          range: [6, 6],
          message: "<b>Magic:</b> The town is focused on some form of magical pursuit. (Free location: Shop - Magic Shop [d6]: 1: Armor, 2: Books, 3: Clothing, 4: Jewelry, 5: Weapons, 6: Misc. & Curiosities)."
        }
    ];
      

    let foundMessage;
    for (const item of messages) {
        if (isInRange(roll, item.range[0], item.range[1])) {
            foundMessage = item.message;
            switch(roll){
                case 1:
                    fortificationMod++;
                    lawEnforcementMod++;
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    break;
                case 4:
                    break;
                case 5:
                    break;
            }

            break;
        }
    }

    if (foundMessage) {
        displayMessage(priority, foundMessage);
    } else {
        displayMessage(priority, "Invalid roll value.");
    }
}