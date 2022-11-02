/*
 * chunk(arr, n)
 * @description Break up all the items in the array into array of size n arrays.
 * @param {array} arr The array of items.
 * @param {n} number The number we want to break the array into.
 */
function chunk (arr, n) {
  if (Array.isArray(arr) && !arr.length) {
    return [];
  }
  return [arr.slice(0, n)].concat(chunk(arr.slice(n), n));
}

export { chunk }