import PropTypes from 'prop-types';
import React from 'react';
import { isObject as _isObject } from 'underscore';
import { useBibParallel } from '../../../context/Bib.Provider';
import LinkableBibField from './LinkableField';

const DefinitionField = ({ field, bibValues = [], additional = false }) => {
  const {
    hasParallels,
    field: { mapping = [] },
  } = useBibParallel(field.value);

  const list = (hasParallels && mapping) || bibValues;

  return (
    <ul className={additional && 'additionalDetails'}>
      {list
        .map((value, idx) => {
          if (!value) return null;

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
  additional: PropTypes.boolean,
  bibValues: PropTypes.array,
};

DefinitionField.default = {
  additional: false,
  bibValues: [],
};

export default DefinitionField;
