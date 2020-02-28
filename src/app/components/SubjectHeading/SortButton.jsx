import React from 'react';
import PropTypes from 'prop-types';

const SortButton = (props) => {
  const columnText = () => {
    return {
      bibs: 'Titles',
      descendants: 'Subheadings',
      alphabetical: 'Heading',
    }[props.type];
  };

  return (
    <button
      className='subjectSortButton'
      onClick={() => props.handler(props.type, props.direction)}
    >
      <span className="emph">
        <span className="noEmph">{columnText()}
          <span className="sortCharacter">^</span>
        </span>
      </span>
    </button>
  )
};

SortButton.propTypes = {
  handler: PropTypes.func,
  type: PropTypes.string,
  direction: PropTypes.string,
};

export default SortButton;
