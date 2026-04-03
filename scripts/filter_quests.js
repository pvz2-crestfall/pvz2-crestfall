import { readFileSync, writeFileSync } from 'fs';

const quests = JSON.parse(readFileSync('QUESTS.json'));

console.log(quests.objects[0].objdata.Quests.length);

const categories = new Set();
const themes = new Set();
quests.objects[0].objdata.Quests = quests.objects[0].objdata.Quests.filter((quest) => {
    quest = Object.values(quest)[0];

    const filteredCategories = ['Unused', 'DailyPinataHunt', 'PremiumPlant', 'DailyActivities', 'Scheduled', 'Event'];
    const filteredThemes = ['Rift', 'Arena', 'Ads', 'LevelUp', 'PremiumSeeds', 'PremiumPlant', 'LevelOfTheDay'];

    categories.add(quest.QuestCategory);
    themes.add(quest.OverrideQuestTheme);

    if (filteredCategories.includes(quest.QuestCategory)) return false;
    if (filteredThemes.includes(quest.OverrideQuestTheme)) return false;
    if (quest.SKUs != undefined) return false;
    if (quest.Disabled) return false;
    if (quest.Slot == 'Unused') return false;

    return true;
});

console.log(quests.objects[0].objdata.Quests.length);
console.log(categories, themes);
writeFileSync('QUESTS.new.json', JSON.stringify(quests, null, 4));
