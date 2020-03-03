const calculateDirection = (currentSortType, currentDirection) => (sortType) => {
  console.log('currentSortType ', currentSortType, 'sortType ', sortType)
  if (sortType === currentSortType) return (currentDirection === 'ASC' ? 'DESC' : 'ASC');
  return {
    alphabetical: 'ASC',
    bibs: 'DESC',
    descendants: 'DESC',
  }[sortType];
};

export default calculateDirection;
