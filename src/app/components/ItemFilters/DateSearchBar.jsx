import { Button, SearchBar, Text, TextInput } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const DateSearchBar = ({
  selectedYear,
  setSelectedYear,
  submitFilterSelections,
}) => {
  const [invalidYear, setInvalidYear] = useState(false);

  return (
    <div className='search-year-wrapper'>
      <Text isBold fontSize="text.caption" mb="xs">Search by Year</Text>
      <SearchBar
        id="search-year"
        onSubmit={(event) => {
          event.preventDefault();
          if (selectedYear.length === 4) {
            submitFilterSelections();
            setInvalidYear(false);
          } else {
            setInvalidYear(true);
          }
        }}
        textInputElement={
          <TextInput
            id='search-year-input'
            isClearable
            isClearableCallback={() => { setSelectedYear('') }}
            isInvalid={invalidYear}
            invalidText='Error: Please enter a valid year.'
            labelText='Search by Year'
            maxLength={4}
            name='search-year'
            pattern='[0-9]+'
            placeholder='YYYY'
            showLabel={false}
            textInputType='searchBarSelect'
            onChange={(event) => setSelectedYear(event.target.value)}
            value={selectedYear}
          />
        }
      />
      <Button
        buttonType="text"
        id="clear-year-button"
        onClick={() => {
          const clearYear = true;
          setSelectedYear('');
          submitFilterSelections(false, clearYear)
        }}
      >
        Clear search year
      </Button>
    </div>
  );
};

DateSearchBar.propTypes = {
  submitFilterSelections: PropTypes.func,
  setSelectedYear: PropTypes.func,
  selectedYear: PropTypes.string,
};

export default DateSearchBar;
