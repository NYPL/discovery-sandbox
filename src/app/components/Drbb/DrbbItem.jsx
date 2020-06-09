import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import appConfig from '../../data/appConfig';
import {
  authorQuery,
  generateStreamedReaderUrl,
  formatUrl,
} from '../../utils/researchNowUtils';

const DrbbItem = (props) => {
  const { work } = props;
  const {
    agents,
    title,
    editions,
  } = work;

  const {
    environment,
  } = appConfig;

  const drbbFrontEnd = appConfig.drbbFrontEnd[environment];

  const edition = editions[0];
  const item = edition.items[0];

  const authorship = () => {
    const authors = agents.map((agent, i) => [
      (i > 0 ? ', ' : null),
      <Link
        to={{
          pathname: `${drbbFrontEnd}/search`,
          query: authorQuery(agent),
        }}
        className="link"
        key={agent.viaf ? `author-${agent.viaf}` : `author-${agent.name}`}
        target="_blank"
      >
        {agent.name}
      </Link>]);

    return (
      <div>
        By {authors}
      </div>
    );
  };

  const readOnlineLink = () => {
    const eReaderUrl = appConfig.drbbEreader[environment];
    const editionWithTitle = edition;
    editionWithTitle.title = edition.title || work.title;

    const selectedLink = item.links.find(link => (
      (!link.local && !link.download) || (link.local && link.download)
    ));
    if (!selectedLink || !selectedLink.url) return null;
    if (selectedLink.local) {
      const encodedUrl = generateStreamedReaderUrl(selectedLink.url, eReaderUrl);
      return (
        <Link
          to={{ pathname: '/read-online', search: `?url=${encodeURI(encodedUrl)}`, state: { edition: editionWithTitle } }}
        >
          Read Online
        </Link>
      );
    }

    return (
      <Link
        target="_blank"
        to={{ pathname: `${drbbFrontEnd}/read-online`, search: `?url=${formatUrl(selectedLink.url)}`, state: { edition: editionWithTitle } }}
        className="drbb-read-online"
      >
        Read Online
      </Link>
    );
  };

  return (
    <li className="drbb-item">
      <Link
        target="_blank"
        to={`${drbbFrontEnd}/work?recordType=editions&workId=${work.uuid}`}
      >
        {title}
      </Link>
      {agents && agents.length ? authorship() : null}
      { readOnlineLink() }
      <Link
        target="_blank"
        to={`${drbbFrontEnd}/work?recordType=editions&workId=${work.uuid}`}
        className="drbb-download-pdf"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
          <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 15.3C4 15.3.7 12 .7 8S4 .7 8 .7 15.3 4 15.3 8 12 15.3 8 15.3z" />
          <path d="M11.3 8.2c-.2-.2-.5-.2-.7 0l-2.2 2.2V4.5h-.9v5.9L5.3 8.2c-.1-.2-.4-.2-.6 0s-.2.5 0 .7l3 3c.2.2.5.2.7 0l3-3c.1-.2.1-.5-.1-.7z" />
        </svg>
        Download PDF
      </Link>
    </li>
  );
};

DrbbItem.propTypes = {
  work: PropTypes.object,
};

export default DrbbItem;
