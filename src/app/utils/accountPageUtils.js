/* global window, document */
import axios from 'axios';

import appConfig from '../data/appConfig';

const makeRequest = (
  updateAccountHtml,
  patronId,
  body,
  contentType,
  setIsLoading,
) => {
  const url = `${appConfig.baseUrl}/api/account/${contentType}`;
  setIsLoading(true);
  return axios.post(url, body)
    .then((res) => {
      const { data } = res;
      if (data.redirect) {
        const fullUrl = encodeURIComponent(window.location.href);
        window.location.replace(`${appConfig.loginUrl}?redirect_uri=${fullUrl}`);
        return { redirect: true };
      }
      if (data.error) console.error(data.error);
      return updateAccountHtml(data);
    })
    .catch(res => console.error('ERROR', res))
    .finally(() => setIsLoading(false));
};

const buildReqBody = (content, itemObj, locationData) => {
  switch (content) {
    case 'items':
      return { ...itemObj, renewsome: 'YES' };
    case 'holds':
      return Object.assign(itemObj, {
        updateholdssome: 'YES',
        currentsortorder: 'current_pickup',
      }, locationData);
    default:
      return itemObj;
  }
};

const manipulateAccountPage = (
  accountPageContent,
  updateAccountHtml,
  patron,
  contentType,
  setIsLoading,
) => {
  const eventListenerCb = body => makeRequest(
    updateAccountHtml,
    patron.id,
    body,
    contentType,
    setIsLoading,
  );

  const eventListeners = [];
  // all <inputs> of type 'submit' are removed
  const submits = accountPageContent.querySelectorAll('input[type=submit]');
  submits.forEach(submit => submit.remove());

  // use 'patFuncEntry' class to access items (checkouts or holds)
  const items = accountPageContent.querySelectorAll('.patFuncEntry') || [];

  accountPageContent.getElementsByTagName('th').forEach((th) => {
    const { textContent } = th;
    // this "Ratings" feature is in the html, but is not in use
    if (textContent.trim() === 'CANCEL' || ['Ratings', 'RENEW', 'FREEZE'].find(text => textContent.includes(text))) {
      th.remove();
      return;
    }
    th.textContent = th.textContent.toLowerCase();
    // change th that originally says '{x} ITEMS CHECKED OUT'
    if (th.textContent.includes('checked')) {
      const length = items.length;
      th.textContent = `Checkouts - ${length || 'No'} item${length !== 1 ? 's' : ''}`;
    }
  });

  items.forEach((el) => {
    const locationData = {};
    if (contentType === 'holds') {
      const locationSelect = el.getElementsByTagName('select')[0];
      if (!locationSelect) return;
      const locationProp = locationSelect.name;
      let locationValue;
      el.querySelectorAll('option').forEach((option) => {
        if (option.selected) locationValue = `${option.value.trim()}+++`;
      });
      locationData[locationProp] = locationValue;
      const locationChangeCb = (e) => {
        locationData[locationProp] = e.target.value.replace('+++', '');
        eventListenerCb(buildReqBody(contentType, {}, locationData));
      };
      locationSelect.addEventListener('change', locationChangeCb);
      eventListeners.push({ element: locationSelect, cb: locationChangeCb });
    }
    // get name and value from checkbox
    const inputs = el.querySelectorAll('input');
    const buttons = [];
    const removeTd = (element) => {
      if (element.tagName === 'TD') {
        element.remove();
      } else {
        removeTd(element.parentElement);
      }
    };
    inputs.forEach((input) => {
      const button = document.createElement('button');
      button.name = input.name;
      button.value = input.value;
      button.textContent = ['Renew', 'Freeze', 'Cancel'].find(text => input.name.includes(text.toLowerCase()));
      if (input.checked && button.textContent === 'Freeze') {
        button.textContent = 'Unfreeze';
        input.value = 'off';
      }
      button.className = 'button button--filled';
      const eventCb = (e) => {
        e.preventDefault();
        eventListenerCb(buildReqBody(
          contentType,
          { [input.name]: input.value },
          locationData,
        ));
      };
      button.addEventListener('click', eventCb);
      buttons.push(button);
      removeTd(input);
      eventListeners.push({ element: button, cb: eventCb });
    });
    buttons.forEach((button) => {
      const td = document.createElement('td');
      td.appendChild(button);
      el.appendChild(td);
    });
  });
  accountPageContent.querySelectorAll('.patFuncRating').forEach(el => el.remove());

  const errorMessageEls = accountPageContent.getElementsByClassName('errormessage');
  if (errorMessageEls.length) {
    // in original HTML this is `hidden`
    errorMessageEls[0].style.display = 'block';
  }

  // there are two "Renew All" buttons
  // we just want the first one
  let isFirstRenewAll = true;
  const links = accountPageContent.querySelectorAll('a');
  links.forEach((link) => {
    switch (link.textContent) {
      case 'Sort by Checkout':
        link.remove();
        break;
      case 'Sort by Due Date':
        link.remove();
        break;
      case 'Cancel All':
        link.remove();
        break;
      case 'Renew All':
        if (isFirstRenewAll) {
          isFirstRenewAll = false;
          const button = document.createElement('button');
          button.textContent = 'Renew All';
          const renewAllCb = (e) => {
            e.preventDefault();
            eventListenerCb({ renewall: 'YES' });
          };
          button.addEventListener('click', renewAllCb);
          button.className = 'button button--filled';
          link.parentElement.replaceChild(button, link);
          eventListeners.push({ element: button, cb: button });
        } else {
          link.remove();
        }
        break;
      case 'Renew Marked':
        link.remove();
        break;
      default:
        if (link.textContent.includes('Pay Online')) {
          link.href = `https://ilsstaff.nypl.org/webapp/iii/ecom/pay.do?lang=eng&scope=1&ptype=${patron.patronType}&tty=800`;
          link.target = '_blank';
          break;
        }
    }
  });
  setIsLoading(false);
  return eventListeners;
};

export default manipulateAccountPage;
