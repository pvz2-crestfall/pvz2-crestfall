import fs from 'fs';
import path from 'path';
import './util/ansii.js';
import { SenWrapper } from './util/sen.js';
import { Spinner } from './util/spinner.js';

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

let spinner = new Spinner('Unpacking...');
spinner.start();

await sen.run({
    method: 'popcap.rsb.init_project',
    source: obbPath,
    generic: '0n',
    destination: outputPath,
});
spinner.stop(`All done!`.green());
