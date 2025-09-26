import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import './util/ansii.js';

let inputFile = process.argv[2];
let outputFile = path.join(path.dirname(inputFile), 'PRODUCTS.patch.json');
console.log(`Reading file: ${inputFile}`);

const originalStats = JSON.parse(readFileSync(inputFile, 'utf-8'));

let stats = {
    adsRemoved: 0,
    bundlesRemoved: 0,
    pinatasRemoved: 0,
    misc: 0,

    startingOffers: originalStats.objects.length,
    endingOffers: 0,
    plants: {
        converted: 0,
        total: 0,
    },
    costumes: {
        converted: 0,
        total: 0,
    },
    tutorial: 0,
};

originalStats.objects.forEach((obj, index) => {
    let data = obj.objdata;
    let productType = data['ObjectType'];
    let costsDollahs = data['Price'] > 0;

    // retian the basic tutorial stuff
    if (data['Sku'].endsWith('.tutorial')) {
        stats.tutorial++;
        return;
    }

    // convert paid plants and costumes to be gem purchasable
    if (productType == 'plant') {
        if (costsDollahs) {
            data['Price'] = 0;
            data['PriceGems'] = 100;
            stats.plants.converted++;
        }
        stats.plants.total++;
        return;
    }

    if (productType == 'costume') {
        if (data['Price'] > 0) {
            data['Price'] = 0;
            data['PriceGems'] = 100;
            stats.costumes.converted++;
        }
        stats.costumes.total++;
        return;
    }

    if (data['IsAdPlacement']) {
        delete originalStats.objects[index];
        stats.adsRemoved++;
        return;
    }

    if (productType == 'pinata') {
        delete originalStats.objects[index];
        stats.pinatasRemoved++;
        return;
    }

    if (productType == 'bundle') {
        delete originalStats.objects[index];
        stats.bundlesRemoved++;
        return;
    }

    if (data['Price'] > 0 || ['eventenergy1', 'fuel', 'ticket', 'instant', 'powerupuse'].includes(productType)) {
        delete originalStats.objects[index];
        stats.misc++;
        return;
    }
});
originalStats.objects = originalStats.objects.filter((x) => x != null);
stats.endingOffers = originalStats.objects.length;

console.log(`================================`.cyan());
console.log(`Retained:`.green.bold());
console.log(`  ${stats.tutorial} tutorial offers\n`);

console.log(`Removed:`.red.bold());
console.log(`  ${stats.adsRemoved} Ad Placements`);
console.log(`  ${stats.bundlesRemoved} Bundles`);
console.log(`  ${stats.pinatasRemoved} Pinata Offers`);
console.log(`  ${stats.misc} Miscellaneous Offers\n`);

console.log(`Converted:`.magenta.bold());
console.log(`  ${stats.costumes.converted} Costume offers to gems`);
console.log(`  ${stats.plants.converted} Plant offers to gems\n`);

console.log(`================================`.cyan());
console.log(`Offers reduced:`.yellow.bold());
console.log(`  ${stats.startingOffers} → ${stats.endingOffers}`);
console.log(`================================`.cyan());
console.log(`Writing to ${outputFile}`);

writeFileSync(outputFile, JSON.stringify(originalStats, null, 4), 'utf-8');
