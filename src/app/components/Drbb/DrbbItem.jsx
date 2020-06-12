import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import DownloadIcon from '../../../client/icons/Download';

import appConfig from '../../data/appConfig';
import {
  authorQuery,
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

  const authorship = () => {
    const authors = agents.map((agent, i) => [
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
      <div>
        By {authors}
      </div>
    );
  };

  let downloadLink;

  const selectEdition = () => (editions.find(workEdition => (
    workEdition.items.find(editionItem => editionItem.links.find((link) => {
      downloadLink = link;
      return link.download;
    }))
  )) || editions[0]);

  const edition = selectEdition();

  const readOnlineLink = () => {
    const editionWithTitle = edition;
    editionWithTitle.title = edition.title || work.title;

    let selectedLink;
    const selectedItem = edition.items.find(item => item.links.find((link) => {
      selectedLink = link;
      return (!link.local && !link.download) || (link.local && link.download);
    }));

    if (!selectedItem || !selectedLink || !selectedLink.url) return null;

    return (
      <Link
        target="_blank"
        to={{
          pathname: `${drbbFrontEnd}/read-online`,
          search: `?url=${formatUrl(selectedLink.url)}#/edition?editionId=${edition.id}`,
        }}
        className="drbb-read-online"
      >
        Read Online
      </Link>
    );
  };

  const downloadLinkElement = () => {
    if (!downloadLink) return null;
    if (!downloadLink.download) return null;

    const mediaType = downloadLink.media_type.replace('application/', '').toUpperCase()

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
    <li className="drbb-item">
      <Link
        target="_blank"
        to={`${drbbFrontEnd}/work?recordType=editions&workId=${work.uuid}`}
        className="drbb-result-title"
      >
        {title}
      </Link>
      {agents && agents.length ? authorship() : null}
      { readOnlineLink() }
      { downloadLinkElement() }
    </li>
  );
};

DrbbItem.propTypes = {
  work: PropTypes.object,
};

export default DrbbItem;
