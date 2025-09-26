import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

let inputFile = process.argv[2];
let outputFile = path.join(path.dirname(inputFile), 'PLANTLEVELS.patch.json');

console.log(`Reading file: ${inputFile}`);
const originalStats = JSON.parse(readFileSync(inputFile, 'utf-8'));

originalStats.objects.forEach((obj, index) => {
    let plantName = obj.aliases[0];
    console.log(`Processing plant: ${plantName}`);

    obj.objdata.UsesLeveling = false;
    obj.objdata.LevelCap = 1;
    obj.objdata.LevelCoins = [];
    obj.objdata.LevelXP = [];
    obj.objdata.PlantTier = [1];

    if (obj.objdata.FloatStats != undefined) {
        obj.objdata.FloatStats = obj.objdata.FloatStats.map((stat, statIndex) => {
            stat['Values'].length = 1;
            return stat;
        });
    }

    if (obj.objdata.StringStats != undefined) {
        obj.objdata.StringStats = obj.objdata.StringStats.map((stat, statIndex) => {
            stat['Values'].length = 1;
            return stat;
        });
    }
});

console.log(`All done! Writing to ${outputFile}`);
writeFileSync(outputFile, JSON.stringify(originalStats, null, 4), 'utf-8');
