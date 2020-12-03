/* global window */
import axios from 'axios';

import appConfig from '../data/appConfig';

const makeRequest = (
  updateAccountHtml,
  updateErrorMessage,
  patronId,
  body,
  content,
) => {
  const url = `${appConfig.baseUrl}/api/account/${content}`;
  axios.post(url, body)
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
  patron,
  selectedItems,
  content,
) => {
  const eventListenerCb = body => makeRequest(
    updateAccountHtml,
    updateErrorMessage,
    patron.id,
    body,
    content,
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
        if (link.href && link.href.includes('/mylists?listNum=')) {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const splitLink = link.href.split('/mylists?listNum=') || [];
            const listNum = splitLink[1];
            eventListenerCb({ listNum });
          });
          break;
        }
        if (link.textContent.includes('Pay Online')) {
          link.href = `https://ilsstaff.nypl.org/webapp/iii/ecom/pay.do?lang=eng&scope=1&ptype=${patron.patronType}&tty=800`;
          link.target = '_blank';
          break;
        }
    }
  });
};

export {
  addEventListenersToAccountLinks,
  makeRequest,
};
