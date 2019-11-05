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
    }, [this.intervals[0]]);
  }

  max(a, b) {
    if (a === 'infinity' || b === 'infinity') {
      return 'infinity';
    }
    return a > b ? a : b;
  }

  min(a, b) {
    if (a === 'infinity') return b;
    if (b === 'infinity') return a;
    return a > b ? b : a;
  }
}

Range.fromSubjectHeading = (subjectHeading, linked) => {
  const {
    children,
    uuid,
  } = subjectHeading;
  let range;
  if (children && uuid !== linked) {
    const mid = children.findIndex(heading => heading.children);
    const intervals = [
      { start: 0, end: 0 },
    ];
    if (mid > -1) intervals.push({ start: mid - 1, end: mid + 4 });
    range = new Range(0, children.length, intervals);
  } else if (children && uuid === linked) {
    range = new Range(0, children.length, [{ start: 0, end: 4 }]);
  } else {
    range = new Range(0, 'infinity', [{ start: 0, end: 'infinity' }]);
  }
  range.normalize();
  return range;
};

export default Range;
