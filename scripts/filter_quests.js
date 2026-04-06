import { readFileSync, writeFileSync } from 'fs';

const quests = JSON.parse(readFileSync('QUESTS.json'));

console.log(quests.objects[0].objdata.Quests.length);

const categories = new Set();
const types = new Set();
const themes = new Set();
const questRequirements = new Set();
quests.objects[0].objdata.Quests = quests.objects[0].objdata.Quests.filter((quest) => {
    types.add(...Object.keys(quest));
    quest = Object.values(quest)[0];

    const filteredCategories = ['Unused', 'DailyPinataHunt', 'PremiumPlant', 'DailyActivities', 'Scheduled', 'Event'];
    const filteredThemes = ['Rift', 'Arena', 'Ads', 'LevelUp', 'PremiumSeeds', 'PremiumPlant', 'LevelOfTheDay'];

    categories.add(quest.QuestCategory);
    themes.add(quest.OverrideQuestTheme);

    if (quest.Prerequisites) {
        questRequirements.add(...Object.keys(quest.Prerequisites));
    }
    if (filteredCategories.includes(quest.QuestCategory)) return false;
    if (filteredThemes.includes(quest.OverrideQuestTheme)) return false;
    if (quest.SKUs != undefined) return false;
    if (quest.Disabled) return false;
    if (quest.Slot == 'Unused') return false;

    return true;
});

console.log(types);
console.log(questRequirements);
// console.log(categories, themes);
console.log(quests.objects[0].objdata.Quests.length);
writeFileSync('QUESTS.new.json', JSON.stringify(quests, null, 4));
