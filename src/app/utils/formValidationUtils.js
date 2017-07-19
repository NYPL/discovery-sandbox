import React from 'react';
import {
  isEmail,
  isLength,
  isNumeric,
} from 'validator';
import {
  mapObject as _mapObject,
  isEmpty as _isEmpty,
} from 'underscore';

function isDate(input, minYear = 1902, maxYear = new Date().getFullYear()) {
  // regular expression to match required date format
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  if (input === '') {
    return false;
  }

  if (input.match(regex)) {
    const temp = input.split('/');
    const dateFromInput = new Date(`${temp[2]}/${temp[0]}/${temp[1]}`);

    return (
      dateFromInput.getDate() === Number(temp[1])
      && (dateFromInput.getMonth() + 1) === Number(temp[0])
      && Number(temp[2]) > minYear
      && Number(temp[2]) < maxYear
    );
  }

  return false;
}

/**
 * createAnchorID(wholeText)
 * Splits the error message into two parts. One will be wrapped by an <a> tag, and another will not.
 *
 * @param {string} wholeText
 * return {object} {anchorText, restText}
 */
function createAnchorText(wholeText) {
  const anchorText = (wholeText && typeof wholeText === 'string') ?
    wholeText.split(' field')[0] : '';
  const restText = (!anchorText) ? '' : ` field ${wholeText.split(' field')[1]}`;

  return { anchorText, restText };
}

/**
 * createAnchorID(key)
 * Creates the proper anchor ID for the href of the <a> tag in the error message.
 *
 * @param {string} key
 * return {string}
 */
function createAnchorID(key) {
  const hashElement = (key && typeof key === 'string') ?
    `${key.charAt(0).toUpperCase()}${key.substr(1)}` : '';

  if (!hashElement) { return null; }

  return `#patron${hashElement}`;
}

/**
 * renderServerValidationError(object)
 * Renders the proper error messages based on each error field.
 * Returns all the messages as an array.
 *
 * @param {object} object
 * return {array}
 */
function renderServerValidationError(object) {
  const errorMessages = [];

  Object.keys(object).forEach((key, index) => {
    if (object.hasOwnProperty(key)) {
      let errorMessage = null;

      if (object[key].indexOf('empty') !== -1) {
        const anchorText = createAnchorText(object[key]).anchorText || '';
        const restText = createAnchorText(object[key]).restText || '';

        errorMessage = (!anchorText && !anchorText) ? <li>One of the fields is incorrect.</li> :
          <li key={index}><a href={createAnchorID(key)}>{anchorText}</a>{restText}</li>;
      } else {
        if (key === 'email') {
          errorMessage = (
            <li key={index}>
              Please enter a valid <a href={createAnchorID(key)}>email address</a>.
            </li>
          );
        }
      }

      errorMessages.push(errorMessage);
    }
  });

  return errorMessages;
}

/**
 * validate(form, cb)
 *
 * @param {object} form
 * @param {function} cb
 * return {boolean}
 */
function validate(form, cb) {
  const fieldsToCheck = {
    emailAddress: {
      validate: (val) => (val.trim().length && isEmail(val)),
      errorMsg: 'Please enter a correct email',
    },
    chapterTitle: {
      validate: (val) => !!val && isNumeric(val),
      errorMsg: 'Please enter the item chapter',
    },
    // optional
    author: {
      validate: () => true,
      errorMsg: '',
    },
    // optional
    date: {
      validate: () => true,
      errorMsg: 'Please enter the date published',
    },
    // optional
    volume: {
      validate: () => true,
      errorMsg: 'Please enter the item volume',
    },
    // optional
    issue: {
      validate: () => true,
      errorMsg: '',
    },
    // optional
    notes: {
      validate: () => true,
      errorMsg: '',
    },
    startPage: {
      validate: (val) => isNumeric(val),
      errorMsg: 'Please enter the starting page',
    },
    endPage: {
      validate: (val) => isNumeric(val),
      errorMsg: 'Please enter the end page',
    },
  };

  const error = {};
  _mapObject(form, (val, key) => {
    const isValid = fieldsToCheck[key].validate('' + val);

    if (!isValid) {
      error[key] = fieldsToCheck[key].errorMsg;
    }
  });

  cb(error);

  if (!_isEmpty(error)) {
    return false;
  }

  return true;
}

export {
  isDate,
  renderServerValidationError,
  validate,
};
