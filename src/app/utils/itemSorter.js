const ItemSorter = {};

/**
 * Get a sortable shelfmark value by collapsing whitespace and zero-padding
 * anything that looks like a box, volume, or tube number, identified as:
 *  - any number terminating the string, or
 *  - any number following known prefixes (e.g. box, tube, v., etc).
 *
 * If number is identified by prefix (e.g. box, tube), prefix will be made
 * lowercase.
 *
 * @return {string} A sortable version of the given shelfmark
 *
 * e.g.:
 *  "*T-Mss 1991-010   Box 27" ==> "*T-Mss 1991-010 box 000027"
 *  "*T-Mss 1991-010   Tube 70" ==> "*T-Mss 1991-010 tube 000070"
 *  "Map Div. 98­914    Box 25, Wi­Z')" ==> "Map Div. 98­914 box 000025, Wi­Z')"
 *
 * In addition to padding terminating numbers, any number following one of
 * these sequences anywhere in the string, case-insensitive, is padded:
 *  - box
 *  - tube
 *  - v.
 *  - no.
 *  - r.
 */
ItemSorter.sortableShelfMark = (shelfMark) => {
  // NodeJS doesn't have lookbehinds, so fake it with replace callback:
  const reg = /(\d+$|((^|\s)(box|v\.|no\.|r\.|box|tube) )(\d+))/i;
  // This callback will receive all matches:
  const replace = (m0, fullMatch, label, labelWhitespace, labelText, number) =>
    // If we matched a label, build string from label and then pad number
    label
      ? `${label.toLowerCase()}${ItemSorter.zeroPadString(number)}`
      : // Otherwise just pad whole match (presumably it's a line terminating num):
        ItemSorter.zeroPadString(fullMatch);
  return (
    shelfMark
      .replace(reg, replace)
      // Collapse redundant whitespace:
      .replace(/\s{2,}/g, ' ')
  );
};

/**
 * Returns a '0' left-padded string to default length of 6
 */
ItemSorter.zeroPadString = (str, padLen = 6) =>
  new Array(Math.max(0, padLen - str.length + 1)).join('0') + str;

/**
 * Add sortableShelfMark
 */
ItemSorter.itemWithSortableShelfMark = (item) => {
  let shelfMarkSort;
  // Order by id if we have no call numbers, but make sure these items
  // go after items with call numbers
  if (!item.shelfMark || item.shelfMark.length === 0) {
    if (item.uri) {
      shelfMarkSort = `b${item.uri}`;
    } else {
      shelfMarkSort = 'c';
    }
  } else {
    // order by call number, put these items first
    shelfMarkSort = `a${ItemSorter.sortableShelfMark(item.shelfMark[0])}`;
  }

  return { item, shelfMarkSort };
};

ItemSorter.sortItems = (items) =>
  items
    .map(ItemSorter.itemWithSortableShelfMark)
    .sort((i1, i2) => (i1.shelfMarkSort > i2.shelfMarkSort ? 1 : -1))
    .map((_i) => _i.item);

export default ItemSorter;
