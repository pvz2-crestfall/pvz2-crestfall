import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

export class SenWrapper {
    constructor() {
        const SEN_PATH = process.env.SEN_PATH;

        // validate the SEN_PATH env variable
        if (!SEN_PATH) {
            console.error(
                'Error: SEN_PATH environment variable is not set.'.red(),
                '\nPlease set SEN_PATH to the folder where Sen is installed before running this script.'.yellow()
            );
            process.exit(1);
        }

        if (!fs.existsSync(path.resolve(SEN_PATH))) {
            console.error(
                'Error: SEN_PATH is set, but the directory does not exist.'.red(),
                '\nPlease verify that SEN_PATH points to the correct Sen installation folder.'.yellow()
            );
            process.exit(1);
        }

        // validate the SEN install and make sure all required files are present
        let shellPath = path.resolve(SEN_PATH, 'Shell.exe');
        let kernelPath = path.resolve(SEN_PATH, 'Kernel.dll');
        let scriptPath = path.resolve(SEN_PATH, 'Script/main.js');

        console.log('Shell:', shellPath.yellow());
        console.log('Kernel:', kernelPath.yellow());
        console.log('Script:', scriptPath.yellow());

        let missing = [];
        if (!fs.existsSync(shellPath)) missing.push('Shell.exe');
        if (!fs.existsSync(kernelPath)) missing.push('Kernel.dll');
        if (!fs.existsSync(scriptPath)) missing.push('Script/main.js');

        if (missing.length > 0) {
            console.error(
                `Error: Missing required SEN files: ${missing.join(', ')}`.red(),
                '\nPlease verify your SEN_PATH is set correctly and points to a valid installation.'.yellow()
            );
            process.exit(1);
        }

        this.shell = shellPath;
        this.kernel = kernelPath;
        this.script = scriptPath;
    }

    run({ method, source, generic }) {
        return new Promise((resolve, reject) => {
            const child = spawn(this.shell, [
                this.kernel,
                this.script,
                '-method',
                method,
                '-source',
                source,
                '-generic',
                generic,
            ]);

            let errorMessage;
            let errorStackTrace;
            let hasError = false;

            child.stdout.on('data', (data) => {
                const messages = data
                    .toString()
                    .split('●')
                    .map((msg) => msg.trim())
                    .filter((msg) => msg);

                messages.forEach((message) => {
                    if (message.includes('Error')) {
                        errorMessage = message;
                        hasError = true;
                    }
                    if (/^Stack for traceback error/i.test(message)) {
                        errorStackTrace = message;
                        hasError = true;
                    }
                });
            });

            child.on('close', (code) => {
                if (code === 0 && !hasError) {
                    resolve();
                } else if (hasError) {
                    reject(errorMessage);
                } else {
                    reject(`Command exited with code ${code}`);
                }
            });

            child.on('error', (err) => {
                reject(err);
            });
        });
    }
}

export function validateSenInstall() {}
