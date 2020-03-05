import React from 'react';
import PropTypes from 'prop-types';

const SortButton = (props) => {
  const {
    type,
    direction,
    handler,
    interactive,
  } = props;

  const columnText = () => ({
    bibs: 'Titles',
    descendants: 'Subheadings',
    alphabetical: 'Heading',
  }[type]);

  return (
    <button
      className="subjectSortButton"
      onClick={() => handler(type, direction)}
      disabled={!handler || !interactive}
    >
      <span className="emph">
        <span className="noEmph">{columnText()}
          {(handler && interactive) ? <span className="sortCharacter">^</span> : null}
        </span>
      </span>
    </button>
  );
};

SortButton.propTypes = {
  handler: PropTypes.func,
  type: PropTypes.string,
  direction: PropTypes.string,
  interactive: PropTypes.bool,
};

export default SortButton;
