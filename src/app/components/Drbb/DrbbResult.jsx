import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import DownloadIcon from '../../../client/icons/Download';

import appConfig from '../../data/appConfig';
import {
  authorQuery,
  formatUrl,
  generateStreamedReaderUrl,
} from '../../utils/researchNowUtils';
import {
  truncateStringOnWhitespace,
} from '../../utils/utils';

const DrbbResult = (props) => {
  const { work } = props;
  if (!work || !work.uuid || !work.title) return null;

  const {
    agents,
    title,
    editions,
  } = work;

  const {
    environment,
  } = appConfig;

  const drbbFrontEnd = appConfig.drbbFrontEnd[environment];
  const eReader = appConfig.drbbEreader[environment];

  const authorship = () => {
    const authors = agents.filter(agent => agent.roles.includes('author'));

    if (!authors || !authors.length) return null;
    const authorLinks = authors.map((agent, i) => [
      (i > 0 ? ', ' : null),
      <Link
        to={{
          pathname: `${drbbFrontEnd}/search`,
          query: authorQuery(agent),
        }}
        className="drbb-result-author"
        key={agent.viaf ? `author-${agent.viaf}` : `author-${agent.name}`}
        target="_blank"
      >
        {agent.name}
      </Link>]);

    return (
      <div className="drbb-authorship">
        By {authorLinks}
      </div>
    );
  };

  const selectEdition = () => (editions.find(edition => (
    edition && edition.items && edition.items[0].links && edition.items[0].links.length
  ))) || editions[0];

  const edition = selectEdition();
  const { items } = edition;

  const readOnlineLinkElement = () => {
    if (!items) return null;

    const editionWithTitle = edition;
    editionWithTitle.title = edition.title || work.title;

    let selectedLink;
    const selectedItem = items.find(item => item.links.find((link) => {
      selectedLink = link;
      return (!link.local && !link.download) || (link.local && link.download);
    }));

    if (!selectedItem || !selectedLink || !selectedLink.url) return null;

    const eReaderUrl = selectedLink.local ?
      generateStreamedReaderUrl(selectedLink.url, eReader) : formatUrl(selectedLink.url);

    return (
      <Link
        target="_blank"
        to={{
          pathname: `${drbbFrontEnd}/read-online`,
          search: `?url=${eReaderUrl}`,
        }}
        className="drbb-read-online"
      >
        Read Online
      </Link>
    );
  };

  const downloadLinkElement = () => {
    if (!items) return null;

    let downloadLink;
    edition.items.find(item => item.links.find((link) => {
      downloadLink = link;
      return link.download;
    }));

    if (!downloadLink || !downloadLink.download) return null;

    const mediaType = downloadLink.media_type.replace(/(application|text)\/|\+zip/gi, '').toUpperCase();

    return (
      <Link
        target="_blank"
        to={formatUrl(downloadLink.url)}
        className="drbb-download-pdf"
      >
        <DownloadIcon />
        Download{mediaType ? ` ${mediaType}` : ''}
      </Link>
    );
  };

  return (
    <li className="drbb-result">
      <Link
        target="_blank"
        to={`${drbbFrontEnd}/work?recordType=editions&workId=${work.uuid}`}
        className="drbb-result-title"
      >
        {truncateStringOnWhitespace(title, 92)}
      </Link>
      {agents && agents.length ? authorship() : null}
      { readOnlineLinkElement() }
      { downloadLinkElement() }
    </li>
  );
};

DrbbResult.propTypes = {
  work: PropTypes.object,
};

export default DrbbResult;
