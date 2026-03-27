import { readFileSync, writeFileSync } from 'fs';

const marketSchedule = JSON.parse(readFileSync('MARKET_SCHEDULE.json'));
const currentTime = Date.now();

marketSchedule.objects[0].objdata.MarketScheduleEntries = marketSchedule.objects[0].objdata.MarketScheduleEntries.filter(
    (offer) => {
        if (!offer.EndDateTime) return true;

        if (offer.EndDateTime < currentTime) return false;
        return true;
    },
);

writeFileSync('MARKET_SCHEDULE.new.json', JSON.stringify(marketSchedule, null, 4));
