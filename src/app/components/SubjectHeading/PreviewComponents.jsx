import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import appConfig from '../../../../appConfig';

const Preview = (props) => {
  const { topHeadings } = props;
  const groupedHeadings = topHeadings.reduce((acc, el, i) =>
    (i % 2 === 0 ? acc.concat([[el, topHeadings[i + 1]]]) : acc)
    , []);
  return (
    <div className="preview subjectHeadingRow" colSpan="4">
      <div className="previewDiv">
        <em>Most common subheadings:</em>
        <div className="previewInner">
          <table>
            {groupedHeadings.map(headings => <PreviewRow row={headings} />)}
          </table>
        </div>
      </div>
    </div>
  );
};

const PreviewRow = (props) => {
  const { row } = props;
  return (
    <tr>
      {row.map(heading => <PreviewItem heading={heading} key={heading.uuid} />)}
    </tr>
  );
};

const PreviewItem = (props) => {
  const { heading } = props;

  const displayLabel = heading.label.split(" -- ").slice(1).join(" -- ");

  const path = `${appConfig.baseUrl}/subject_headings/${heading.uuid}`;

  return (
    <td>
      <Link
        to={path}
      >
        <ul className="details">
          <li>{displayLabel}</li>
          <li className="bibCount">[{heading.bib_count} bibs]</li>
          <li className="fullLabel"><em>{heading.label}</em></li>
        </ul>
      </Link>
    </td>
  );
};

Preview.propTypes = {
  preview: PropTypes.array
};

export { Preview }
