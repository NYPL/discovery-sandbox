/* global window */
import axios from 'axios';

import appConfig from '../data/appConfig';

const makePostRequest = (updateAccountHtml, updateErrorMessage, patronId, body) => {
  axios.post(`${appConfig.baseUrl}/api/account/items`, body)
    .then((res) => {
      const { data } = res;
      if (data.redirect) {
        const fullUrl = encodeURIComponent(window.location.href);
        window.location.replace(`${appConfig.loginUrl}?redirect_uri=${fullUrl}`);
        return { redirect: true };
      }
      if (data.error) updateErrorMessage(data.error);
      return updateAccountHtml(data);
    })
    .catch(res => console.log('ERROR', res));
};

const addEventListenersToAccountLinks = (
  links,
  updateAccountHtml,
  updateErrorMessage,
  patronId,
  selectedItems,
) => {
  const eventListenerCb = body => makePostRequest(
    updateAccountHtml,
    updateErrorMessage,
    patronId,
    body,
  );
  links.forEach((link) => {
    switch (link.textContent) {
      case 'Sort by Checkout':
        link.addEventListener('click', () => eventListenerCb({ sortByCheckoutDate: 'bycheckoutdate' }));
        break;
      case 'Sort by Due Date':
        link.addEventListener('click', () => eventListenerCb({ sortByDueDate: 'byduedate' }));
        break;
      case 'Renew All':
        link.addEventListener('click', () => eventListenerCb({ renewall: 'YES' }));
        break;
      case 'Renew Marked':
        link.addEventListener('click', () => eventListenerCb({ renewsome: 'YES', ...selectedItems }));
        break;
      default:
        break;
    }
  });
};

export {
  addEventListenersToAccountLinks,
};
