const times = n => (n === 0 ? '' : ` ${times(n - 1)}`);

const printUtil = (obj, tabIndex = 0) => {
  if (typeof obj !== 'object') {
    console.log(obj)
  } else {
    console.log("{\n");
    Object.keys(obj).forEach((key) => {
      console.log(`${times(tabIndex)}${key}:${printUtil(obj[key], tabIndex + 1)}`)
    },
    )
    console.log("\n}");
  }
};

export default printUtil;
