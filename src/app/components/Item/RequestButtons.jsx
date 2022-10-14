import React from 'react';
import { Link } from 'react-router';
import {
  trackDiscovery,
  aeonUrl,
} from '../../utils/utils';
import InformationLinks from './InformationLinks';

const ifAvailableHandler = (handler, available) => (available ? handler : (e) => { e.preventDefault() })

const RequestButtons = ({item, bibId, searchKeywords, appConfig, page}) => {

  const { closedLocations, recapClosedLocations, nonRecapClosedLocations, features } = appConfig;
  const isRecap = item.isRecap;
  const allClosed = closedLocations.concat((isRecap ? recapClosedLocations : nonRecapClosedLocations)).includes('');
  const isAeon = item.aeonUrl && features.includes('aeon-links')

  const getItemRecord = (e) => {
    let gaLabel = 'Item Holding';
    if (page === 'SearchResults') gaLabel = 'Search Results';
    if (page === 'BibPage') gaLabel = 'Item Details';
    if (page === 'SubjectHeadingShowPage') gaLabel = 'Subject Heading Details';
    trackDiscovery('Item Request', gaLabel);
  }

  const physRequestButton = () => {
    if (isAeon || allClosed || !item.physRequestable) {
      return null;
    }
    return (
        <Link
          to={
            `${appConfig.baseUrl}/hold/request/${bibId}-${item.id}?searchKeywords=${searchKeywords}`
          }
          onClick={ifAvailableHandler(e => getItemRecord(e, bibId, item.id), item.available)}
          tabIndex="0"
          aria-disabled={!item.available}
          className={ item.available ? 'avail-request-button' : 'unavail-request-button' }
        >
          Request for Onsite Use
        </Link>)
  }

  const eddRequestButton = () => {
    if (isAeon || allClosed || !item.eddRequestable) {
      return null;
    }

    return (
      <Link
        to={
          `${appConfig.baseUrl}/hold/request/${bibId}-${item.id}/edd?searchKeywords=${searchKeywords}`
        }
        onClick={ifAvailableHandler(e => getItemRecord(e, bibId, item.id), item.available)}
        tabIndex="0"
        aria-disabled={!item.available}
        className={ item.available ? 'avail-request-button' : 'unavail-request-button' }
      >
        Request Scan
      </Link>
    )
  }

  const aeonRequestButton = () => {
    if (!isAeon || allClosed) { return null }
    return (
      <a
        href={aeonUrl(item)}
        tabIndex="0"
        onClick={ifAvailableHandler(() => { return null }, item.available)}
        aria-disabled={!item.available}
        className={`aeonRequestButton ${item.available ? 'avail-request-button' : 'unavail-request-button'}`}
      >
        Request Appointment
      </a>
    );
  }


  return (
    <div style={{ display: 'flex' }}>
      {physRequestButton()}
      {eddRequestButton()}
      {aeonRequestButton()}
    </div>
  )
}

export default RequestButtons;
