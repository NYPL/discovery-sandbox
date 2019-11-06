import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const AutosuggestItem = (props) => {
  const {item, activeSuggestion} = props
  const subfield = item.class === 'subfield'

  function onClick(clickEvent) {
    console.log(props);
  }

  const generatePath = (item) => {
    const base = '/research/collections/shared-collection-catalog'
    if (subfield) {
      return `${base}/subject_headings?filter=${item.label}`
    } else if (item.uuid) {
      return `${base}/subject_headings/${item.uuid}`
    }
  }

  let className = "suggestion"
  if (activeSuggestion) {
    className += "-active"
  }

  return (
    <li
      className={`${className} ${item.class}`}
      data={subfield ? item.label : item.uuid}
    >
      <Link to={generatePath(item)}>
        {subfield ? item.label : <em><em>Subject:</em> {item.label}</em>}
      </Link>
    </li>
  )
}

AutosuggestItem.propTypes = {
  location: PropTypes.object
};

export default AutosuggestItem;
