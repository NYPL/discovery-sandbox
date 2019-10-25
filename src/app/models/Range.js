class Range {
  constructor(start, end, intervals = []) {
    this.start = start;
    this.end = end;
    this.intervals = intervals;
  }

  normalize() {
    this.intervals.forEach((interval) => {
      interval.start = this.max(interval.start, this.start);
      interval.end = this.min(interval.end, this.end);
    });
    this.intervals = this.intervals.reduce((acc, el) => {
      const last = acc[acc.length - 1];
      if (last.end === 'infinity' || last.end >= el.start - 1) {
        last.end = this.max(last.end, el.end);
      } else {
        acc.push(el);
      }
      return acc;
    });
  }

  max(a, b) {
    if (a === 'infinity' || b === 'infinity') {
      return 'infinity';
    }
    return a > b ? a : b;
  }

  min(a, b) {
    return a > b ? b : a;
  }
}

export default Range;
