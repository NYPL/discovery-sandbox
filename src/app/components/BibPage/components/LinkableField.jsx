import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import appConfig from '../../../data/appConfig';
import { trackDiscovery } from '../../../utils/utils';
import DirectionalText from './DirectionalText';

/**
 * @typedef {Object} LinkableBibFieldProps
 * @property {string | object} value - The value to display
 * @property {string} field - The bib member name
 * @property {string} label - The display name of the bib member
 * @property {true=} outbound - Internal or external navigation
 * @property {string=} filterQuery - Subject Literal query value. *** FOR SubjectLiteralBibField ONLY ***
 * @property {((event: MouseEvent) => void)=} onClick - On Click Handler
 */

/**
 * @param {LinkableBibFieldProps} props
 * @returns {React.Node}
 */
const LinkableBibField = ({
  value,
  field,
  label,
  outbound,
  filterQuery,
  onClick,
}) => {
  if (!value || !field) return null;

  const text = outbound ? value.prefLabel || value.label || value.url : value;

  const queryString = `${filterQuery ?? value['@id'] ?? value ?? ''}`;
  const filter = `filters[${field}]=${encodeURIComponent(queryString)}`;

  const url = outbound
    ? value['@id'] || value.url
    : `${appConfig.baseUrl}/search?${filter}`;

  const handler = (event) => {
    if (!outbound) {
      !!onClick && onClick(event);
    }

    trackDiscovery('Bib fields', `${label} - ${text}`);
  };

  return (
    <Link onClick={handler} to={url} target={outbound ? '_blank' : undefined}>
      <DirectionalText text={text} />
    </Link>
  );
};

LinkableBibField.propTypes = {
  /** @type {string | object} */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  /** @type {string} */
  field: PropTypes.string.isRequired,
  /** @type {string} */
  label: PropTypes.string,
  /** @type {true=} */
  outbound: PropTypes.bool,
  /** @type {string=} */
  filterQuery: PropTypes.string,
  /** @type {((event: MouseEvent) => void)=} */
  onClick: PropTypes.func,
};

export default LinkableBibField;
