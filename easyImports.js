const IGNORE = [
  '.ebextensions',
  '.elasticbeanstalk',
  '.git',
  '.nyc_output',
  'coverage',
  'log',
  'node_modules',
  '.env',
];

const fs = require('fs');

console.log(process.cwd());

function getExportStatement(file) {
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(/.*export(.*)/);
  return match ? match[1] : match;
}

function constructFileStructure(file) {
  const fileStructure = {};
  const files = fs.readdirSync(file);
  files.forEach((subfile) => {
    const subfileName = `${file}/${subfile}`;
    try {
      fileStructure[subfileName] = constructFileStructure(subfileName);
    } catch (ex) {
      fileStructure[subfileName] = getExportStatement(subfileName);
    }
  });
  return fileStructure;
}

function getFileNames(file) {
  try {
    if (IGNORE.some(name => file.includes(name))) return [];
    return fs
      .readdirSync(file)
      .map(subfile => getFileNames(`${file}/${subfile}`))
      .reduce((acc, el) => acc.concat(el), []);
  } catch (ex) {
    return [file];
  }
}

function shortenName(fileName, files) {
  const split = fileName.split('/');
  let shortened = split.pop();
  while (files[shortened]) {
    shortened = split.pop() + shortened;
  }
  return `@${shortened.replace(/\..*/, '')}`;
}

function mapNames(files) {
  const mapped = {};
  files.forEach((file) => {
    mapped[shortenName(file, mapped)] = file;
  });
  return mapped;
}

module.exports = { constructFileStructure, getFileNames, mapNames };

// console.log(constructFileStructure(process.cwd()));
