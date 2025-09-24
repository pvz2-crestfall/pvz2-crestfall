// colors.js
const codes = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    underline: '\x1b[4m',

    // Foreground
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    magenta: '\x1b[35m',
    red: '\x1b[31m',

    // Background
    bgCyan: '\x1b[46m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgMagenta: '\x1b[45m',
    bgRed: '\x1b[41m',
};

// Build a chained style wrapper
function makeStyledString(str, applied = []) {
    const result = applied.join("") + str + codes.reset;

    // Proxy lets us capture property access like .red, .bgYellow, .bold
    return new Proxy(() => result, {
        apply(_, __, args) {
            // Calling it like a function returns the styled string
            return result;
        },
        get(_, key) {
            if (!(key in codes)) return undefined;
            return makeStyledString(str, [...applied, codes[key]]);
        }
    });
}

// Patch String.prototype
for (const key of Object.keys(codes)) {
    if (key === "reset") continue;

    Object.defineProperty(String.prototype, key, {
        get: function () {
            return makeStyledString(this, [codes[key]]);
        },
        enumerable: false
    });
}

