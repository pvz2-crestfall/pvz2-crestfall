export class Spinner {
    constructor(spinnerText) {
        this.text = spinnerText;
        this.frames = ['-', '\\', '|', '/'];
        this.frameIndex = 0;
        this.interval = null;
    }

    start() {
        if (process.env.CI || !process.stdout.isTTY) {
            console.log(this.text);
            return null;
        }

        if (this.interval == null) {
            this.interval = setInterval(() => {
                const frame = this.frames[(this.frameIndex = (this.frameIndex + 1) % this.frames.length)];

                process.stdout.write(`\r${frame} ${this.text}`);
            }, 100);
        }

        return this.interval;
    }

    stop(...replacementText) {
        if (process.env.CI || !process.stdout.isTTY) {
            console.log(...replacementText);
            return;
        }

        if (this.interval != null) {
            clearInterval(this.interval);
            this.interval = null;
        }

        if (replacementText != undefined) {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            console.log(...replacementText);
        } else {
            process.stdout.write('\n');
        }
    }

    setText(newText) {
        if (process.env.CI || !process.stdout.isTTY) {
            console.log(newText);
            this.text = newText;
        } else {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);

            this.text = newText;
        }
    }

    get stopped() {
        this.interval == null;
    }
}
