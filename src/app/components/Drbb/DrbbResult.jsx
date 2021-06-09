import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import DownloadIcon from '../../../client/icons/Download';

import appConfig from '../../data/appConfig';
import {
  authorQuery,
  formatUrl,
} from '../../utils/researchNowUtils';
import {
  truncateStringOnWhitespace,
} from '../../utils/utils';

// TODO: When the EDD integration is turned on in DRB we will need to handle application/edd+html media types as well
const readOnlineMediaTypes = ['application/epub+xml', 'application/webpub+json', 'text/html']
const downloadMediaTypes = ['application/epub+zip', 'application/pdf']

const DrbbResult = (props) => {
  const { work } = props;
  if (!work || !work.uuid || !work.title) return null;

  const {
    title,
    editions,
  } = work;
  // Get authors from `authors` property (DRB v4) or `agents` property (DRB v3)
  const authors = work.authors ? work.authors : work.agents.filter(agent => agent.roles.includes('author'));

  const {
    environment,
  } = appConfig;

  const drbbFrontEnd = appConfig.drbbFrontEnd[environment];
  const eReader = appConfig.drbbEreader[environment];

  const authorship = () => {
    if (!authors || !authors.length) return null;
    const authorLinks = authors.map((agent, i) => [
      (i > 0 ? ', ' : null),
      <Link
        to={{
          pathname: `${drbbFrontEnd}/search`,
          query: authorQuery(agent),
        }}
        className="drbb-result-author"
        key={`author-${agent.name}`}
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
      // See above for media types that are used for "Read Online" links
      return readOnlineMediaTypes.indexOf(link.mediaType) > -1
    }));

    if (!selectedItem || !selectedLink || !selectedLink.url) return null;

    // NOTE: All read online links now use a /read/link_id structure. The DRB read page loads the necessary files for the reader
    return (
      <Link
        target="_blank"
        to={{
          pathname: `${drbbFrontEnd}/read/${selectedLink.link_id}`,
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
      // See above for downloadable media types
      return downloadMediaTypes.indexOf(link.mediaType) > -1
    }));

    if (!downloadLink || !downloadLink.download) return null;

    const mediaType = downloadLink.mediaType.replace(/(application|text)\/|\+zip/gi, '').toUpperCase();

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
        to={`${drbbFrontEnd}/${work.uuid}`}
        className="drbb-result-title"
      >
        {truncateStringOnWhitespace(title, 92)}
      </Link>
      {authors && authors.length ? authorship() : null}
      { readOnlineLinkElement() }
      { downloadLinkElement() }
    </li>
  );
};

DrbbResult.propTypes = {
  work: PropTypes.object,
};

export default DrbbResult;
