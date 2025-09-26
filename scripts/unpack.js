import fs from 'fs';
import path from 'path';
import './util/ansii.js';
import { SenWrapper } from './util/sen.js';

const sen = new SenWrapper();

let obbPath = path.resolve(process.argv[2]);
if (!fs.existsSync(obbPath) || !obbPath.toLowerCase().endsWith('.obb')) {
    console.error(
        'Error: The specified path does not exist or is invalid.'.red(),
        '\nMake sure the path you provided points to a valid *.obb file.'.yellow()
    );
    process.exit(1);
}

let outputPath = obbPath + '.bundle';
console.log('Output path: ', outputPath.yellow());

const frames = ['-', '\\', '|', '/'];
let i = 0;
let spinnerText = 'Unpacking...';
let spinner = setInterval(() => {
    const frame = frames[(i = (i + 1) % frames.length)].cyan();

    process.stdout.write(`\r${frame} ${spinnerText}`);
}, 100);

await sen.run({
    method: 'popcap.rsb.init_project',
    source: obbPath,
    generic: '0n',
    destination: outputPath,
});

clearInterval(spinner);

process.stdout.clearLine(0);
process.stdout.cursorTo(0);

console.log(`All done!`.green());
