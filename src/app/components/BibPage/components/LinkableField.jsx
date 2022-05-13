import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import appConfig from '../../../data/appConfig';
import { trackDiscovery } from '../../../utils/utils';
import DirectionalText from './DirectionalText';

/**
 * @typedef {Object} LinkableBibFieldProps
 * @property {string} displayText - The bib member name
 * @property {string} field - The bib member name
 * @property {string} label - The display name of the bib member
 * @property {string} searchQuery - The Query To Search for when clicked
 * @property {string=} url - The bib member name
 * @property {((event: MouseEvent) => void)=} onClick - On Click Handler
 */

/**
 * @param {LinkableBibFieldProps} props
 * @returns {React.Node}
 */
const LinkableBibField = ({
  displayText,
  field,
  label,
  searchQuery,
  url,
  onClick,
}) => {
  if (!displayText || !field || !label || (!url && !searchQuery)) return null;

  const to = url
    ? url
    : `${appConfig.baseUrl}/search?filters[${field}]=${encodeURIComponent(
        searchQuery,
      )}`;

  const handler = (event) => {
    if (!url) {
      !!onClick && onClick(event);
    }

    trackDiscovery('Bib fields', `${label} - ${displayText}`);
  };

  return (
    <Link onClick={handler} to={to} target={url ? '_blank' : undefined}>
      <DirectionalText text={displayText} />
    </Link>
  );
};

LinkableBibField.propTypes = {
  /** @type {string} */
  displayText: PropTypes.string.isRequired,
  /** @type {string} */
  field: PropTypes.string.isRequired,
  /** @type {string} */
  label: PropTypes.string.isRequired,
  /** @type {string=} */
  searchQuery: PropTypes.string.isRequired,
  /** @type {string} */
  url: PropTypes.string,
  /** @type {((event: MouseEvent) => void)=} */
  onClick: PropTypes.func,
};

export default LinkableBibField;
