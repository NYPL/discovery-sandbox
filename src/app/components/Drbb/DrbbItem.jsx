import React from 'react';
import PropTypes from 'prop-types';

import appConfig from '../../data/appConfig';
import { authorUrl } from '../../utils/researchNowUtils';

const DrbbItem = (props) => {
  const { work } = props;
  const {
    agents,
    title,
  } = work;
  console.log(agents);
  console.log(authorUrl(agents[0].name));

  const authorship = () => {
    const authors = agents.map((agent, i) => [
      (i > 0 ? ', ' : null),
      <a
        key={agent.name}

      >
        {agent.name}
      </a>]);

    return (
      <div>
        By {authors}
      </div>
    );
  };

  return (
    <li className="drbb-item">
      <a
        target="_blank"
        href={`${appConfig.drbbFrontEnd}work?recordType=editions&workId=${work.uuid}`}
      >
        {title}
      </a>
      {agents && agents.length ? authorship() : null}
      <a
        target="_blank"
        href={`${appConfig.drbbFrontEnd}work?recordType=editions&workId=${work.uuid}`}
        className="drbb-read-online"
      >
        Read Online
      </a>
      <a
        target="_blank"
        href={`${appConfig.drbbFrontEnd}work?recordType=editions&workId=${work.uuid}`}
        className="drbb-download-pdf"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
          <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 15.3C4 15.3.7 12 .7 8S4 .7 8 .7 15.3 4 15.3 8 12 15.3 8 15.3z" />
          <path d="M11.3 8.2c-.2-.2-.5-.2-.7 0l-2.2 2.2V4.5h-.9v5.9L5.3 8.2c-.1-.2-.4-.2-.6 0s-.2.5 0 .7l3 3c.2.2.5.2.7 0l3-3c.1-.2.1-.5-.1-.7z" />
        </svg>
        Download PDF
      </a>
    </li>
  );
};

DrbbItem.propTypes = {
  work: PropTypes.object,
};

export default DrbbItem;
