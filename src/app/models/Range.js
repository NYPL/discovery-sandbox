class Range {
  constructor(start, end, intervals = []) {
    this.start = start;
    this.end = end;
    this.intervals = intervals;
  }

  normalize() {
    this.intervals.forEach((interval) => {
      interval.start = Math.max(interval.start, this.start);
      interval.end = Math.min(interval.end, this.end);
    });
    this.intervals = this.intervals.reduce((acc, el) => {
      const last = acc[acc.length - 1];
      if (last.end >= el.start - 1) {
        last.end = Math.max(last.end, el.end);
      } else {
        acc.push(el);
      }
      return acc;
    }, [this.intervals[0]]);
  }
}

Range.default = () => new Range(0, Infinity, [{ start: 0, end: Infinity }]);

Range.fromSubjectHeading = (subjectHeading, linked, show = null) => {
  const {
    children,
    uuid,
  } = subjectHeading;
  let range;
  if (children && uuid !== linked) {
    const mid = children.findIndex(heading => heading.children || heading.uuid === linked);
    const intervals = [
      { start: 0, end: 0 },
    ];
    if (mid > -1) intervals.push({ start: mid - 1, end: mid + 1 });
    range = new Range(0, children.length, intervals);
  } else if (children && uuid === linked && !show) {
    range = new Range(0, children.length, [{ start: 0, end: 4 }]);
  } else if (children && uuid === linked && show) {
    range = new Range(0, children.length, [{ start: 0, end: 2 }]);
  } else {
    range = new Range(0, Infinity, [{ start: 0, end: Infinity }]);
  }
  range.normalize();
  return range;
};


Range.addRangeData = (subjectHeading, linked, show = null) => {
  subjectHeading.range = Range.fromSubjectHeading(subjectHeading, linked, show);
  if (subjectHeading.children) subjectHeading.children.forEach(child => Range.addRangeData(child, linked, show));
};

export default Range;
