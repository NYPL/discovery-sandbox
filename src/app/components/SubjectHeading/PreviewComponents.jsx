import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import appConfig from '../../../../appConfig';

export const Preview = (props) => {
  const {topHeadings} = props

  return (
    <div className="preview"><em>Most common subheadings:</em>
      <ul>
        {topHeadings.map(heading => <PreviewItem heading={heading} key={heading.uuid}/>)}
      </ul>
    </div>
  )
}

export const PreviewItem = (props) => {
  const {heading} = props

  const displayLabel = heading.label.split(" -- ").slice(1).join(" -- ")

  const path = `${appConfig.baseUrl}/subject_headings/${heading.uuid}`

  return (
    <li>
      <Link
        to={path}
      >
        <ul className="details">
          <li>{displayLabel}</li>
          <li className="bibCount">[{heading.bib_count} bibs]</li>
          <li className="fullLabel"><em>{heading.label}</em></li>
        </ul>
      </Link>
    </li>
  )
}

Preview.propTypes = {
  preview: PropTypes.array
};
