import PropTypes from 'prop-types';
import React from 'react';
import { flatten as _flatten } from 'underscore';
import { useBibParallel } from '../../../context/Bib.Provider';
import LinkableBibField from './LinkableField';

const DefinitionField = ({ field, bibValues = [], additional = false }) => {
  const { bib, parallel } = useBibParallel(field.value);

  // BibValues is an array of various values
  // Set bibValues as a 2D array becuase parallels is also a 2D array
  // Keep things in sync.
  const list = parallel ?? [bibValues];

  return (
    <ul className={additional && 'additionalDetails'}>
      {_flatten(list)
        .map((value, idx) => {
          if (!value) return null;

          // WIP
          if (field.value === 'identifier') {
            return null;
          }

          const element = { value };

          if (field.linkable) {
            element.value = (
              <LinkableBibField
                label={field.label}
                field={field.value}
                bibValue={value}
                outbound={field.selfLinkable}
              />
            );
          }

          const definition =
            element.value.prefLabel ?? element.value.label ?? element.value;

          return <li key={`${value}-${idx}`}>{definition}</li>;

          // TODO: Handle case below
          // const url = `filters[${field.value}]=${value['@id']}`;

          // let itemValue = field.linkable ? (
          //   <Link
          //     onClick={(event) =>
          //       this.newSearch(event, url, field.value, value['@id'], field.label)
          //     }
          //     to={`${appConfig.baseUrl}/search?${url}`}
          //   >
          //     {value.prefLabel}
          //   </Link>
          // ) : (
          //   <span>{value.prefLabel}</span>
          // );
          // if (field.selfLinkable) {
          //   itemValue = (
          //     <a
          //       href={value['@id']}
          //       onClick={() =>
          //         trackDiscovery(
          //           'Bib fields',
          //           `${field.label} - ${value.prefLabel}`,
          //         )
          //       }
          //     >
          //       {value.prefLabel}
          //     </a>
          //   );
          // }

          // return <li key={value.prefLabel}>{itemValue}</li>;
        })
        .filter(Boolean)}
    </ul>
  );
};

DefinitionField.propTypes = {
  field: PropTypes.object,
  additional: PropTypes.bool,
  bibValues: PropTypes.array,
};

DefinitionField.default = {
  additional: false,
  bibValues: [],
};

export default DefinitionField;
