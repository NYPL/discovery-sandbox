import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {
  isArray as _isArray,
  isEmpty as _isEmpty,
} from 'underscore';
import DefinitionList from './DefinitionList';

class BibMainInfo extends React.Component {

  getMainInfo(bib) {

    const fields = [
      { label: 'Author', value: 'creatorLiteral' },
      { label: 'Additional Authors', value: 'contributorLiteral' },
    ];

    return fields.map((field) => {
      const fieldLabel = field.label;
      const fieldValue = field.value;
      const bibValues = bib[fieldValue];

      if (!bibValues || !bibValues.length || !_isArray(bibValues)) {
        return false;
      }

      return {
        term: fieldLabel,
        definition: (
          <span>
            {
              bibValues.map((value, i) => {
                const url = `filters[${fieldValue}]=${value}`;
                return (
                    <Link
                      key={i}
                      onClick={e => this.newSearch(e, url)}
                      title={`Make a new search for ${fieldLabel}: "${value}"`}
                      to={`/search?${url}`}
                    >
                      {value}
                    </Link>
                );
              })
            }
          </span>
        ),
      };
    });
  }

  render() {
    if (_isEmpty(this.props.bib)) {
      return null;
    }

    const bibMainInfo = this.getMainInfo(this.props.bib);

    return (
      <DefinitionList
        data={bibMainInfo}
      />
    );
  }
}

BibMainInfo.propTypes = {
  bib: PropTypes.object,
};

export default BibMainInfo;
