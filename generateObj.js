const gen = function (array) {
  var obj = {};
  array.forEach((item) => {
    if (obj[item[0]]){
      obj[item[0]].push(item[1]);
    } else {
      obj[item[0]] = [item[1]];
    }
  });
  return obj;
}

exports.function =  gen;
