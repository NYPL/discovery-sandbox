import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import appConfig from '../../../../appConfig';

const Preview = (props) => {
  const { topHeadings } = props;
  const groupedHeadings = [[topHeadings[0], topHeadings[2]], [topHeadings[1], topHeadings[3]]];
  return (
    <tr className="preview subjectHeadingRow">
      <td colSpan="4">
        <div className="previewDiv">
          <em>Most common subheadings:</em>
          <div className="previewInner">
            <ul className="previewUl">
              {groupedHeadings.map(headings => <PreviewCol col={headings} />)}
            </ul>
          </div>
        </div>
      </td>
    </tr>
  );
};

const PreviewCol = (props) => {
  const { col } = props;
  return (
    <li>
      <ul className="previewCol">
        {col.map(heading => <PreviewItem heading={heading} key={heading.uuid} />)}
      </ul>
    </li>
  );
};

const PreviewItem = (props) => {
  const { heading } = props;

  const displayLabel = heading.label.split(" -- ").slice(1).join(" -- ");

  const path = `${appConfig.baseUrl}/subject_headings/${heading.uuid}`;

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
  );
};

Preview.propTypes = {
  preview: PropTypes.array
};

export { Preview }
