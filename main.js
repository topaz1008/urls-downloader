import fs, { promises as fss } from 'node:fs';
import { promisify } from 'node:util';
import stream from 'node:stream';
import path from 'node:path';
import { EOL } from 'node:os';
import got from 'got';
import JSON5 from 'json5';

const pipeline = promisify(stream.pipeline);

const DESTINATION_FOLDER = './downloads',
    OPTIONS_FILE = './options.json5',
    URLS_FILE = './urls.txt';

const urls = await fss.readFile(URLS_FILE, 'utf8');
const files = urls.toString()
    .split(EOL)
    .map(line => line.trim())
    .filter(line => /^https/.test(line))
    .map(line => {
        const parts = line.split('|').map(part => part.trim());

        let url, name;
        if (parts.length === 1) {
            url = parts[0];

            const urlParts = url.split('/');
            name = urlParts[urlParts.length - 1];

        } else if (parts.length === 2) {
            url = parts[0];
            name = parts[1];

        } else {
            throw new Error(`Invalid line: ${line}`);
        }

        return { url, name };
    });

const options = await loadOptionsJson();
if (!await exists(DESTINATION_FOLDER)) {
    await fss.mkdir(DESTINATION_FOLDER, { recursive: true });
}

if (files.length > 0) {
    log(`Downloading "${files.length}" urls...`);
    for (let i = 0; i < files.length; i++) {
        const url = files[i].url;
        const filename = files[i].name;
        const filepath = path.join(DESTINATION_FOLDER, filename);
        if (await exists(filepath)) {
            log(`Skipping "${url}", file already downloaded.`);
            continue;
        }

        log(`Downloading "${url}" to "${filename}"...`);

        const dest = fs.createWriteStream(filepath);
        await pipeline(got.stream(url, options), dest);
    }

    log('Done.');

} else {
    log('Nothing to download, exiting...');
}

async function exists(filepath) {
    try {
        const stats = await fss.stat(filepath);

        return (stats.isFile() || stats.isDirectory());

    } catch (e) {
        return false;
    }
}

async function loadOptionsJson() {
    if (!await exists(OPTIONS_FILE)) return {};

    const file = await fss.readFile(OPTIONS_FILE, 'utf8');

    return JSON5.parse(file.toString());
}

function log(msg) {
    console.log(msg);
}