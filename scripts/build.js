import fs from 'fs';
import path from 'path';
import './util/ansii.js';
import { SenWrapper } from './util/sen.js';
import { Spinner } from './util/spinner.js';

const outDirectory = path.resolve('./build-output');
const sen = new SenWrapper();

// this should be the *.bundle folder
let projectDirectory = path.resolve(process.argv[2]);
console.log('Project: ', projectDirectory.yellow());
console.log('Build-output: ', outDirectory.yellow());

if (!fs.existsSync(projectDirectory)) {
    console.error(
        'Error: The specified project directory does not exist.'.red(),
        '\nMake sure the path you provided points to a valid *.bundle folder.'.yellow(),
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

    let total = packages.length;
    let current = 0;
    let spinner = new Spinner();

    for (const packet of packages) {
        current++;
        spinner.setText(`(${current}/${total}) Packing ${path.basename(packet)}`.cyan());
        if (spinner.stopped) {
            spinner.start();
        }

        let packetData = JSON.parse(fs.readFileSync(path.join(packet, 'data.json')));

        // let scg = path.format({ ...path.parse(packet), base: undefined, ext: '.scg' });
        // if (!fs.existsSync(scg) || fs.statSync(scg).mtimeMs > fs.statSync(packet).mtimeMs) {
        const start = Date.now();
        await sen
            .run({
                method: 'pvz2.custom.scg.encode',
                source: packet,
                generic: packetData['#expand_method'] == 'advanced' ? '1n' : '0n',
            })
            .catch((error) => {
                console.error('\e');
                console.error(`Error while packing ${path.basename(packet)}\n`.red(), error.red());
                process.exit(1);
            });

        const elapsed = ((Date.now() - start) / 1000).toFixed(2);
        // after finishing one package, log a "done" line with timing
        spinner.stop(`✓ (${current}/${total}) Packed ${path.basename(packet)} in ${elapsed}s`.green());
        // } else {
        //     // print text for skipping the package, most likely because it wasn't modified recently
        //     spinner.stop(`✓ (${current}/${total}) Skipped ${path.basename(packet)}`.yellow());
        // }
    }

    spinner.stop(`✓ Done encoding ${total} packages!`.green());
}

async function updateDataFile() {
    console.log('Updating data.json packets..'.cyan());

    let packetsDirectory = path.resolve(projectDirectory, 'packet');
    let dataPath = path.resolve(projectDirectory, 'data.json');

    let dataFile = JSON.parse(fs.readFileSync(dataPath));

    let oldPacket = dataFile.packet;
    let newPacket = fs
        .readdirSync(packetsDirectory)
        .filter((file) => path.extname(file) === '.scg')
        .map((file) => path.resolve(packetsDirectory, file))
        .filter((file) => fs.statSync(file).isFile())
        .map((file) => path.parse(file).name);

    const oldSet = new Set(oldPacket);
    const newSet = new Set(newPacket);

    let added = newPacket.filter((x) => !oldSet.has(x));
    let removed = oldPacket.filter((x) => !newSet.has(x));

    if (added.length === 0 && removed.length === 0) {
        console.log('No packet changes.'.green());
        return;
    }

    console.log('Packet changes:'.cyan());

    if (added.length > 0) {
        console.log('\n  Added:'.green());
        added.forEach((x) => console.log(`    + ${x}`.green()));
    }

    if (removed.length > 0) {
        console.log('\n  Removed:'.red());
        removed.forEach((x) => console.log(`    - ${x}`.red()));
    }

    dataFile.packet = [...newPacket].sort();
    fs.writeFileSync(dataPath, JSON.stringify(dataFile, null, 4) + '\n');
}

async function buildproject() {
    let spinner = new Spinner('Building project...');
    spinner.start();

    const start = Date.now();

    try {
        await sen.run({
            method: 'popcap.rsb.build_project',
            source: projectDirectory,
            generic: '0n',
            destination: path.join(outDirectory, 'main.675.com.ea.game.pvz2_crf.obb'),
        });

        const elapsed = ((Date.now() - start) / 1000).toFixed(2);
        spinner.stop(`✓ Project built successfully in ${elapsed}s`.green());
    } catch (error) {
        spinner.stop(`✗ Project build failed`.red(), '\n', error);
    }
}

if (!process.argv.includes('--nopack')) {
    await buildPackets();
    await updateDataFile();
}

await buildproject();
