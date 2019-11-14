import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const AutosuggestItem = (props) => {
  const {item, activeSuggestion, onClick, path} = props
  const subfield = item.class === 'subfield'

  let className = "suggestion"
  if (activeSuggestion) {
    className += "-active"
  }

  return (
    <li
      className={`${className} ${item.class}`}
      data={subfield ? item.label : item.uuid}
      onClick={onClick}
    >
      <Link
        to={path}
        className='extendAutosuggestFormFocus'
      >
        {subfield ?
          <div className="autosuggest component">
            <span>{item.label}</span>
            <div className="heading-count">
              [{item.heading_count} {item.heading_count > 1 ? 'headings' : 'heading'}]
            </div>
          </div>
          : <div className="autosuggest subject"><em>Subject:</em> {item.label}</div>}
      </Link>
    </li>
  )
}

AutosuggestItem.propTypes = {
  location: PropTypes.object
};

export default AutosuggestItem;
