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

module.exports = {constructFileStructure} ;

// console.log(constructFileStructure(process.cwd()));
