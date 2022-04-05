import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import { trackDiscovery } from '../../../utils/utils';
import appConfig from '../../../data/appConfig';
import LinkableBibField from './LinkableField';
import { useBibParallel } from '../../../context/Bib.Provider';

const DefinitionField = ({ bibValues, field, additional = false }) => {
  const {
    hasParallels,
    field: { mapping },
  } = useBibParallel(field.value);

  const list = (hasParallels && mapping) || bibValues;

  return (
    <ul className={additional && 'additionalDetails'}>
      {list.map((value, idx) => {
        return (
          <li key={`${value}-${idx}`}>
            {(field.linkable && (
              <LinkableBibField
                label={field.label}
                field={field.value}
                bibValue={value}
                outbound={field.selfLinkable}
              />
            )) ||
              value}
          </li>
        );

        // const url = `filters[${field.value}]=${value['@id']}`;

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

DefinitionField.propTypes = {
  bibValues: PropTypes.object,
  field: PropTypes.object,
  additional: PropTypes.boolean,
};

DefinitionField.default = {
  additional: false,
};

export default DefinitionField;
