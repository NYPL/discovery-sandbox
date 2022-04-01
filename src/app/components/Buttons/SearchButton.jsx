import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  ButtonTypes,
  Icon,
  IconNames,
} from '@nypl/design-system-react-components';

const SearchButton = ({ id, onClick, value }) => (
  <Button
    id={id}
    buttonType={ButtonTypes.Primary}
    type='submit'
    aria-controls='results-description'
    onClick={onClick}
  >
    <Icon
      name={IconNames.search}
      decorative
      modifiers={['small', 'icon-left']}
    />
    {value}
  </Button>
);

SearchButton.propTypes = {
  onClick: PropTypes.func,
  id: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string,
};

SearchButton.defaultProps = {
  id: 'nypl-omni-button',
  value: 'Search',
};

export default SearchButton;
