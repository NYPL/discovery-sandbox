import React from 'react';
import { Link } from 'react-router';
import { aeonUrl } from '../../utils/utils';
import { MediaContext } from '../Application/Application';

const RequestButtons = ({ item, bibId, searchKeywords, appConfig, page }) => {
  const media = React.useContext(MediaContext);

  const ifAvailableHandler = (handler, available) => (available ? handler : (e) => { e.preventDefault() })

  const {
    closedLocations,
    recapClosedLocations,
    nonRecapClosedLocations,
    features,
  } = appConfig;
  const isRecap = item.isRecap;
  const allClosed = closedLocations
    .concat(isRecap ? recapClosedLocations : nonRecapClosedLocations)
    .includes('');
  const isAeon = item.aeonUrl && features.includes('aeon-links');

  const physRequestButton = () => {
    if (isAeon || allClosed || !item.physRequestable) {
      return null;
    }
    return (
      <Link
        to={`${appConfig.baseUrl}/hold/request/${bibId}-${item.id}?searchKeywords=${searchKeywords}`}
        tabIndex='0'
        onClick={ifAvailableHandler(e => getItemRecord(e, bibId, item.id), item.available)}
        aria-disabled={!item.available}
        className={
          item.available ? 'avail-request-button' : 'unavail-request-button'
        }
      >
        Request for On-site Use
      </Link>
    );
  };

  const eddRequestButton = () => {
    if (isAeon || allClosed || !item.eddRequestable) {
      return null;
    }

    return (
      <Link
        to={`${appConfig.baseUrl}/hold/request/${bibId}-${item.id}/edd?searchKeywords=${searchKeywords}`}
        tabIndex='0'
        onClick={ifAvailableHandler(e => getItemRecord(e, bibId, item.id), item.available)}
        aria-disabled={!item.available}
        className={
          item.available ? 'avail-request-button' : 'unavail-request-button'
        }
      >
        Request Scan
      </Link>
    );
  };

  const aeonRequestButton = () => {
    if (!isAeon || allClosed) {
      return null;
    }
    return (
      <a
        href={aeonUrl(item)}
        tabIndex='0'
        onClick={ifAvailableHandler(() => { return null }, item.available)}
        aria-disabled={!item.available}
        className={`aeonRequestButton ${
          item.available ? 'avail-request-button' : 'unavail-request-button'
        }`}
      >
        Request Appointment
      </a>
    );
  };

  return (
    <div
      className={`request-buttons-container ${
        page === 'SearchResults' ? '' : 'bib-details'
      } ${media}`}
    >
      {physRequestButton()}
      {eddRequestButton()}
      {aeonRequestButton()}
    </div>
  );
};

export default RequestButtons;
