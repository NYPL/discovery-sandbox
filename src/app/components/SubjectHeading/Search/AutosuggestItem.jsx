import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const AutosuggestItem = (props) => {
  const { item, activeSuggestion, onClick, path } = props;
  const subjectComponent = item.class === 'subject_component';

  let className = "suggestion";
  if (activeSuggestion) {
    className += "-active";
  }

  return (
    <li
      className={`${className} ${item.class}`}
      data={subjectComponent ? item.label : item.uuid}
      onClick={onClick}
    >
      <Link
        to={path}
      >
        {
          subjectComponent ?
            <div className="autosuggest component">
              <span>{item.label}</span>
              <span className="aggregateBibCount">{item.aggregate_bib_count} titles</span>
            </div>
            :
            <div className="autosuggest subject">

              <span><em>Subject:</em> {item.label}</span>
              <div className="aggregateBibCount">{item.aggregate_bib_count} titles</div>
            </div>
        }
      </Link>
    </li>
  );
};

AutosuggestItem.propTypes = {
  item: PropTypes.object,
  activeSuggestion: PropTypes.bool,
  onClick: PropTypes.func,
  path: PropTypes.string,
};

export default AutosuggestItem;
