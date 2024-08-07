const Fs = require('fs');
const JSONStream = require('JSONStream');

const readLargeFile = (file, filterElement = '*') =>
  new Promise((resolve, reject) => {
    const stream = Fs.createReadStream(file);
    const parser = JSONStream.parse(filterElement);

    stream.on('error', reject);
    parser.on('error', reject);

    const data = [];
    parser.on('data', (chunk) => data.push(chunk));
    parser.on('end', () => resolve(data));

    stream.pipe(parser);
  });

module.exports = { readLargeFile };
