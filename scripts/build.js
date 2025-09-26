import fs from 'fs';
import path from 'path';
import './util/ansii.js';
import { SenWrapper } from './util/sen.js';

const outDirectory = path.resolve('./build-output');
const sen = new SenWrapper();

// this should be the *.bundle folder
let projectDirectory = path.resolve(process.argv[2]);
console.log('Project: ', projectDirectory.yellow());
console.log('Build-output: ', outDirectory.yellow());

if (!fs.existsSync(projectDirectory)) {
    console.error(
        'Error: The specified project directory does not exist.'.red(),
        '\nMake sure the path you provided points to a valid *.bundle folder.'.yellow()
    );
    process.exit(1);
}

async function buildPackets() {
    let packetsDirectory = path.resolve(projectDirectory, 'packet');
    let packages = fs
        .readdirSync(packetsDirectory)
        .filter((file) => path.extname(file) === '.package')
        .map((file) => path.resolve(packetsDirectory, file))
        .filter((file) => fs.statSync(file).isDirectory());

    console.log('Encoding packages...'.cyan());

    const frames = ['-', '\\', '|', '/'];
    let i = 0;
    let spinnerText = '';
    let total = packages.length;
    let current = 0;
    let spinner = setInterval(() => {
        const frame = frames[(i = (i + 1) % frames.length)];

        process.stdout.write(`\r${frame} ${spinnerText}`);
    }, 100);

    for (const packet of packages) {
        current++;
        spinnerText = `(${current}/${total}) Packing ${path.basename(packet)}`.cyan();

        let scg = path.format({ ...path.parse(packet), base: undefined, ext: '.scg' });
        if (!fs.existsSync(scg) || fs.statSync(scg).mtimeMs > fs.statSync(packet).mtimeMs) {
            const start = Date.now();
            await sen
                .run({
                    method: 'pvz2.custom.scg.encode',
                    source: packet,
                    generic: '1n',
                })
                .catch((error) => {
                    console.error(`Error while packing ${path.basename(packet)}\n`, error);
                });
            const elapsed = ((Date.now() - start) / 1000).toFixed(2);

            // after finishing one package, log a "done" line with timing
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            console.log(`✓ (${current}/${total}) Packed ${path.basename(packet)} in ${elapsed}s`.green());
        } else {
            // print text for skipping the package, most likely because it wasn't modified recently
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            console.log(`✓ (${current}/${total}) Skipped ${path.basename(packet)}`.yellow());
        }
    }

    clearInterval(spinner);

    // clear spinner line before final message
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);

    console.log(`✓ Done encoding ${total} packages!`.green());
}

async function buildproject() {
    const frames = ['-', '\\', '|', '/'];
    let i = 0;

    let spinner = setInterval(() => {
        const frame = frames[(i = (i + 1) % frames.length)];
        process.stdout.write(`\r${frame} Building project...`.cyan());
    }, 100);

    const start = Date.now();

    try {
        await sen.run({
            method: 'popcap.rsb.build_project',
            source: projectDirectory,
            generic: '0n',
            destination: path.join(outDirectory, 'main.702.com.ea.game.pvz2_row.obb'),
        });

        const elapsed = ((Date.now() - start) / 1000).toFixed(2);

        clearInterval(spinner);
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        console.log(`✓ Project built successfully in ${elapsed}s`.green());
    } catch (error) {
        clearInterval(spinner);
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        console.error(`✗ Project build failed`.red(), '\n', error);
    }
}

// await buildPackets();
await buildproject();
