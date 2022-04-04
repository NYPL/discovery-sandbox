import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import { trackDiscovery } from '../../../utils/utils';
import appConfig from '../../../data/appConfig';
import LinkableBibField from './LinkableField';

const DefinitionObject = ({ bibValues, field }) => {
  // Add parallels here
  // Make every item a UL LI item

  if (bibValues.length === 1) {
    const bibValue = bibValues[0];

    if (field.linkable) {
      return (
        <LinkableBibField
          label={field.label}
          bibValue={bibValue}
          outbound={field.selfLinkable}
        />
      );
    }

    return <span>{bibValue.prefLabel}</span>;
  }

  return (
    <ul className='additionalDetails'>
      {bibValues.map((value) => {
        const url = `filters[${field.value}]=${value['@id']}`;
        let itemValue = field.linkable ? (
          <Link
            onClick={(event) =>
              this.newSearch(event, url, field.value, value['@id'], field.label)
            }
            to={`${appConfig.baseUrl}/search?${url}`}
          >
            {value.prefLabel}
          </Link>
        ) : (
          <span>{value.prefLabel}</span>
        );
        if (field.selfLinkable) {
          itemValue = (
            <a
              href={value['@id']}
              onClick={() =>
                trackDiscovery(
                  'Bib fields',
                  `${field.label} - ${value.prefLabel}`,
                )
              }
            >
              {value.prefLabel}
            </a>
          );
        }

        return <li key={value.prefLabel}>{itemValue}</li>;
      })}
    </ul>
  );
};

DefinitionObject.propTypes = {
  bibValues: PropTypes.object,
  field: PropTypes.object,
};

export default DefinitionObject;
