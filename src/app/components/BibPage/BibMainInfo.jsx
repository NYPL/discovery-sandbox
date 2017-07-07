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
    ];

    return fields.map((field) => {
      const fieldLabel = field.label;
      const fieldValue = field.value;
      const bibValues = bib[fieldValue];

      if (!bibValues || !bibValues.length || !_isArray(bibValues)) {
        return false;
      }
      const firstFieldValue = bibValues[0];

      if (firstFieldValue['@id']) {
        return {
          term: fieldLabel,
          definition: (
            <ul>
              {
                bibValues.map((valueObj, i) => {
                  const url = `filters[${fieldValue}]=${valueObj['@id']}`;
                  return (
                    <li key={i}>
                      <Link
                        onClick={e => this.newSearch(e, url)}
                        title={`Make a new search for ${fieldLabel}: ${valueObj.prefLabel}`}
                        to={`/search?${url}`}
                      >
                        {valueObj.prefLabel}
                      </Link>
                    </li>
                  );
                })
              }
            </ul>
          ),
        };
      }

      return {
        term: fieldLabel,
        definition: (
          <span>
            {bibValues.map((value, i) => <span key={i}>{value}</span>)}
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
