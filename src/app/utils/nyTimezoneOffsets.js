const MS_PER_DAY = 1000 * 60 * 60 * 24

/**
 *  Get current and future NY TZ offsets over the next week.
 *
 *  Returns an array of objects, each defining:
 *   - offset {int} - Hours offset from UTC
 *   - from {string} - ISO8601 timestamp indicating when the offset was/will be
 *     active
 *
 *  Most of the time, this will return a single entry representing the current
 *  offset. On the week leading up to a DST change, it will return two entries,
 *  the first giving the current offset and the second giving the new offset
 *  and the time it will become active.
 */
export const nyTimezoneOffsets = (from = new Date(), numDays = 7) => {
  let currentOffset = null

  // Make a copy of the `from` date because we're going to change it:
  from = new Date(from)
  // DST shifts happen at 2am:
  from.setHours(2, 0, 0, 0)
  // Backdate to yesterday just in case we're called before 2am on a DST
  // change day:
  from = new Date(from.getTime() - MS_PER_DAY)

  // Build an array representing current TZ offset and all changes over the
  // next `numDays` days
  return Array(numDays)
    .fill()
    .map((_, index) => {
      // Create a new date offset by `index` numbers of days
      const time = from.getTime() + index * MS_PER_DAY
      const date = new Date(time)

      // Calculate TZ offset of this future date:
      const offset = date.getTimezoneOffset() / 60

      // If TZ offset hasn't changed since the last one seen, ignore it:
      if (currentOffset === offset) return null

      // Otherwise, register the date as the start of the new offset:
      currentOffset = offset
      const day = date.toISOString()
      return { from: day, offset }
    })
    .filter((entry) => entry)
}
