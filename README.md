# urls-downloader

A simple generic URL(s) downloader script using streams. Using [got](https://github.com/sindresorhus/got) under the hood.

## Installation
Download or clone this repository, then run the following command in the directory where you extracted or cloned this repository
```
npm install
```

## Usage
Edit the `urls.txt` file and add the URLs you want to download and then run `main.js` with node. (i.e. `node main.js`)

The format for `urls.txt` is in the pattern of one URL per line, optionally the url can be followed a pipe `|` and the filename you want to save the file as.

if no pipe is specified then the filename will be the last part of the url.

e.g. `https://www.domain.com/path/to/filename.txt` will be saved as `filename.txt` in the current working directory,
while `https://www.domain.com/path/to/filename.txt|foo.txt` will be saved as `foo.txt` in the current working directory.

## Options

This script is using [got](https://github.com/sindresorhus/got) for downloading the files, so you can use any of the options that are supported by got.

Create an `options.json5` file in the root directory of this repository and add the options you want to use.

Since json5 is used, you can add comments to the file and conform to any valid JSON5 rules.

# The `urls.txt` file

Any lines which do not start with `https` will be ignored. so comments can be included with any or no prefix.
