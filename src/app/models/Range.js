class Range {
  constructor(start, end, intervals = []) {
    this.start = start;
    this.end = end;
    this.intervals = intervals;
  }

  normalize() {
    this.intervals.forEach((interval) => {
      interval.start = max(interval.start, this.start);
      interval.end = min(interval.end, this.end);
    });
    this.intervals = this.intervals.reduce((acc, el) => {
      const last = acc[acc.length - 1];
      if (last.end >= el.start) {
        last.end = el.end;
      } else {
        acc.push(el);
      }
      return acc;
    });
  }
}

export default Range;
