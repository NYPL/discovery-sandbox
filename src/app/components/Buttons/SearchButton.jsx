import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  ButtonTypes,
  Icon,
  IconNames,
} from '@nypl/design-system-react-components';

import SearchIconReversed from './SearchIconReversed';

const SearchButton = ({
  id,
  onClick,
  value,
}) => (
  <Button
    id={id}
    buttonType={ButtonTypes.Primary}
    onClick={onClick}
    type="submit"
    aria-controls="results-description"
  >
    <Icon name={IconNames.search} decorative={true} />
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
