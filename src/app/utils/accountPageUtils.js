/* global window, document */
import axios from 'axios';

import appConfig from '../data/appConfig';
import { CLOSED_LOCATION_REGEX } from '../data/constants';

export const isClosed = (optionInnerText) =>
  optionInnerText && !!optionInnerText.match(CLOSED_LOCATION_REGEX);

export const makeRequest = (
  updateAccountHtml,
  patronId,
  body,
  contentType,
  setIsLoading,
) => {
  const url = `${appConfig.baseUrl}/api/account/${contentType}`;
  setIsLoading(true);

  return axios
    .post(url, body)
    .then((res) => {
      const { data } = res;
      if (data.redirect) {
        const fullUrl = encodeURIComponent(window.location.href);
        window.location.replace(
          `${appConfig.loginUrl}?redirect_uri=${fullUrl}`,
        );
        return { redirect: true };
      }
      if (data.error) console.error(data.error);
      return updateAccountHtml(data);
    })
    .catch((res) => console.error('ERROR', res))
    .finally(() => setIsLoading(false));
};

export const buildReqBody = (content, itemObj, locationData = {}) => {
  switch (content) {
    case 'items':
      return { ...itemObj, renewsome: 'YES' };
    case 'holds':
      return {
        ...itemObj,
        updateholdssome: 'YES',
        currentsortorder: 'current_pickup',
        ...locationData,
      };
    default:
      return itemObj;
  }
};

export const convertEncoreUrl = (encoreUrl) => {
  const bibId =
    encoreUrl.match(/C__R(b\d*)/) && encoreUrl.match(/C__R(b\d*)/)[1];
  if (!bibId) return encoreUrl;
  return `${appConfig.baseUrl}/bib/${bibId}`;
};

/**
 * Takes a patron expiration date in form YYYY-MM-DD
 * and return it in form MM-DD-YYYY
 */
export const formatPatronExpirationDate = (expirationDate) => {
  // If it doesn't match the known YYYY-MM-DD format, return it unchanged:
  if (!expirationDate || !/\d{4}-\d{1,2}-\d{1,2}/.test(expirationDate)) {
    return expirationDate;
  }

  const [_y, _m, _d] = expirationDate.split('-');
  return [_m, _d, _y].join('-');
};

export const manipulateAccountPage = (
  accountPageContent,
  updateAccountHtml,
  patron,
  contentType,
  setIsLoading,
  setItemToCancel,
) => {
  const eventListenerCb = (body) =>
    makeRequest(updateAccountHtml, patron.id, body, contentType, setIsLoading);

  const eventListeners = [];
  if (['items', 'holds'].includes(contentType)) {
    // all <inputs> of type 'submit' are removed
    const submits = accountPageContent.querySelectorAll('input[type=submit]');
    submits.forEach((submit) => submit.remove());

    // use 'patFuncEntry' class to access items (checkouts or holds)
    const items = accountPageContent.querySelectorAll('.patFuncEntry') || [];

    const buttonTh = document.createElement('th');
    buttonTh.classList.add('patFuncHeaders');
    if (contentType === 'holds') buttonTh.textContent = 'Cancel/Freeze';
    const patFuncHeaderTrs =
      accountPageContent.querySelectorAll('tr.patFuncHeaders');
    if (patFuncHeaderTrs && patFuncHeaderTrs.length)
      patFuncHeaderTrs[0].appendChild(buttonTh);

    accountPageContent.querySelectorAll('th.patFuncHeaders').forEach((th) => {
      const { textContent } = th;
      // this "Ratings" feature is in the html, but is not in use
      if (
        textContent.trim() === 'CANCEL' ||
        ['Ratings', 'RENEW', 'FREEZE'].find((text) =>
          textContent.includes(text),
        )
      ) {
        th.remove();
        return;
      }
      th.textContent = th.textContent.toLowerCase();
      // change th that originally says '{x} ITEMS CHECKED OUT'
      if (th.textContent.includes('checked')) {
        const length = items.length;
        th.textContent = `Checkouts - ${length || 'No'} item${
          length !== 1 ? 's' : ''
        }`;
      }

      if (th.textContent.includes('holds')) {
        const length = items.length;
        th.textContent = `Holds - ${length || 'No'} item${
          length !== 1 ? 's' : ''
        }`;
      }
    });

    items.forEach((el) => {
      const locationData = {};
      if (contentType === 'holds') {
        // Manipulate hold location selector
        const locationSelect = el.getElementsByTagName('select')[0];
        if (locationSelect) {
          const locationProp = locationSelect.name;
          let locationValue;
          locationSelect.querySelectorAll('option').forEach((option) => {
            // hide closed locations
            if (option.selected) locationValue = `${option.value.trim()}+++`;
            else if (isClosed(option.innerText)) option.remove();
          });
          locationData[locationProp] = locationValue;
          const locationChangeCb = (event) => {
            locationData[locationProp] = event.target.value.replace('+++', '');
            eventListenerCb(buildReqBody(contentType, {}, locationData));
          };
          locationSelect.addEventListener('change', locationChangeCb);
          eventListeners.push({
            element: locationSelect,
            cb: locationChangeCb,
          });
        }
      }
      el.querySelectorAll('.patFuncTitle,.patFuncBibTitle').forEach(
        (titleTd) => {
          const isOtfRecord = [
            '[Supervised use]',
            '[In Library Use]',
            '[Standard NYPL restrictions apply]',
          ].some((phrase) => titleTd.textContent.includes(phrase));
          // Remove link if it appears to be an OTF record (it's not in index)
          if (isOtfRecord) {
            titleTd.querySelectorAll('a').forEach((link) => {
              // In 5.3, the link may be wrapped in a label
              link.parentNode.removeChild(link);
              titleTd.appendChild(link.firstChild);
            });
          } else {
            titleTd.querySelectorAll('a').forEach((link) => {
              link.href = convertEncoreUrl(link.href);
            });
          }
        },
      );

      // Remove any left-column checkmarks, replacing them with right-column buttons
      const inputs = el.querySelectorAll('input');
      const holdActionElements = [];
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
        if (contentType === 'items') {
          // In 5.3 Checkouts ("items") view, the input name looks like
          // "name_pfmark_canceli15686436x00", but the only relevant action is
          // Renew
          button.textContent = 'Renew';
        } else {
          // In Holds view, set button text based on presense of one of these
          // phrases:
          button.textContent = ['Renew', 'Freeze', 'Cancel'].find((text) =>
            input.name.includes(text.toLowerCase()),
          );
        }
        if (input.checked && button.textContent === 'Freeze') {
          button.textContent = 'Unfreeze';
          input.value = 'off';
        }
        button.className = 'button button--outline';
        const eventCb = (event) => {
          event.preventDefault();
          eventListenerCb(
            buildReqBody(
              contentType,
              { [input.name]: input.value },
              locationData,
            ),
          );
        };
        if (button.textContent === 'Cancel') {
          // This element should always be found, but let's not depend on it:
          const titleTd = el.querySelectorAll('.patFuncTitleMain');
          const title = titleTd && titleTd[0] ? titleTd[0].textContent : null;

          button.addEventListener('click', (event) => {
            event.preventDefault();
            setItemToCancel({
              name: input.name,
              value: input.value,
              title,
            });
          });
        } else {
          button.addEventListener('click', eventCb);
        }
        holdActionElements.push(button);
        removeTd(input);
        eventListeners.push({ element: button, cb: eventCb });
      });
      // Remove any lingering .patFuncMark TDs left over because they didn't have any INPUTs
      el.querySelectorAll('td.patFuncMark').forEach(removeTd);

      // add new TD with account page button(s)
      const td = document.createElement('td');
      td.classList.add('account-table-buttons');

      /**
       * If the freeze cell did not have an `input`, it still needs to be removed.
       * There may be an error message, probably "This hold can not be frozen."
       * If so, create an element to display it and then remove the cell.
       */
      const freezeCells = el.querySelectorAll('.patFuncFreeze');
      if (freezeCells) {
        freezeCells.forEach((cell) => {
          if (cell.textContent) {
            const freezeMessage = document.createElement('em');
            freezeMessage.textContent = cell.textContent;
            holdActionElements.push(freezeMessage);
          }
          cell.remove();
        });
      }
      holdActionElements.forEach((button) => {
        td.appendChild(button);
      });
      el.appendChild(td);
    });
    accountPageContent
      .querySelectorAll('.patFuncRating')
      .forEach((el) => el.remove());

    const errorMessageEls =
      accountPageContent.getElementsByClassName('errormessage');
    if (errorMessageEls.length) {
      // in original HTML this is `hidden`
      errorMessageEls[0].style.display = 'block';
    }
  }

  if (contentType === 'overdues') {
    let patFuncFinesEntries = 0;
    accountPageContent.querySelectorAll('td').forEach((td) => {
      if (td.hasAttribute('colspan')) td.removeAttribute('colspan');
      if (td.classList.contains('patFuncFinesEntryTitle')) {
        td.setAttribute('colspan', 2);
        patFuncFinesEntries += 1;
      }
    });

    const overduesTh = accountPageContent.querySelectorAll('th');
    if (overduesTh && overduesTh.length) {
      overduesTh[0].textContent = `Fine/Fee - ${
        patFuncFinesEntries || 'No'
      } item${patFuncFinesEntries === 1 ? '' : 's'}`;
    }
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
          const renewAllCb = (event) => {
            event.preventDefault();
            eventListenerCb({ renewall: 'YES' });
          };
          button.addEventListener('click', renewAllCb);
          button.className = 'button button--outline';
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
