const findProperty = (obj, string) => {
  if (obj && typeof obj === 'object') {
    const newObj = {};
    let any = false;
    Object.keys(obj).forEach((key) => {
      const property = findProperty(obj[key], string);
      if ((typeof property === 'object')) {
        newObj[key] = property;
        any = true;
      } else if (key.match(string)) {
        newObj[key] = obj[key];
        any = true;
      }
    });
    return any ? newObj : false;
  }

  return obj;
};

export default findProperty;
