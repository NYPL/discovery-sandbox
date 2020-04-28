import React from 'react';
import PropTypes from 'prop-types';

import AscendingIcon from '../../../client/assets/Ascending';
import DescendingIcon from '../../../client/assets/Descending';
import DefaultIcon from '../../../client/assets/Default';

const SortButton = (props) => {
  const {
    type,
    direction,
    handler,
    interactive,
    numberOpen,
    active,
  } = props;

  const columnText = () => ({
    bibs: 'Titles',
    descendants: 'Subheadings',
    alphabetical: 'Heading',
  }[type]);

  const icon = () => {
    if (!active) return <DefaultIcon />;
    else if (direction === 'ASC') return <AscendingIcon />;
    return <DescendingIcon />;
  };

  return (
    <button
      className="subjectSortButton"
      onClick={() => handler(type, direction, numberOpen)}
      disabled={!handler || !interactive || numberOpen < 2}
    >
      <span className="emph">
        <span className="noEmph">{columnText()}
          {(handler && interactive) ? <span className="sortCharacter">{ icon() }</span> : null}
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
