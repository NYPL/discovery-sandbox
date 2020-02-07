const fs = require('fs');

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
  let shortened = split.pop().replace(/\..*/, '');
  while (files[shortened]) {
    shortened = split.pop() + shortened;
  }
  return `${shortened}`;
}

function mapNames(files) {
  const withoutAt = files
    .reduce(
      (mapped, file) =>
        Object
          .assign(mapped, { [shortenName(file, mapped)]: file }),
      {},
    );
  return Object.keys(withoutAt)
    .reduce(
      (mapped, key) =>
        Object
          .assign(mapped, { [`@${key}`]: withoutAt[key] }),
      {},
    );
}

function modifyNestedKey(object, key, value) {
  if (typeof object === 'string') return object;
  if (Array.isArray(object)) return object.map(el => modifyNestedKey(el, key, value));
  if (typeof object === 'object') {
    if (!object[key]) {
      return Object.keys(object)
        .reduce(
          (mapped, nestedKey) =>
            Object
              .assign(mapped, { [nestedKey]: modifyNestedKey(object[nestedKey], key, value) }),
          {},
        );
    }
    return Object.keys(object)
      .reduce(
        (mapped, nestedKey) =>
          Object
            .assign(mapped,
              {
                [nestedKey]: nestedKey === key ?
                  value
                  : modifyNestedKey(object[nestedKey], key, value),
              },
            ),
        {},
      );
  }
  return null;
}

function write() {
  const mapped = mapNames(getFileNames('.'));
  fs.writeFileSync(
    '.babelrcExp',
    JSON.stringify(
      modifyNestedKey(
        JSON.parse(
          fs.readFileSync(
            '.babelrc',
            'utf8',
          ),
        ),
        'alias',
        mapped,
      ),
      null,
      2,
    ),
  );
}

module.exports = { constructFileStructure, getFileNames, mapNames, modifyNestedKey, write };
