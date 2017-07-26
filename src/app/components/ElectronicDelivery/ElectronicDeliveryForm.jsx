import React from 'react';
import PropTypes from 'prop-types';
import { validate } from '../../utils/formValidationUtils';
import {
  mapObject as _mapObject,
  extend as _extend,
  isEmpty as _isEmpty,
} from 'underscore';

class ElectronicDeliveryForm extends React.Component {
  constructor(props) {
    super(props);

    // NOTE
    // this.props.form and this.props.error are coming from the server only in the
    // no-js scenario. If they're not available, then we use this 'fallback', but the
    // empty object structure is needed.
    this.state = {
      form: !_isEmpty(this.props.form) ? this.props.form :
      {
        emailAddress: this.props.defaultEmail,
        chapterTitle: '',
        startPage: 0,
        endPage: 0,
      },
      error: !_isEmpty(this.props.error) ? this.props.error :
      {
        emailAddress: '',
        chapterTitle: '',
        startPage: 0,
        endPage: 0,
      },
    };

    this.submit = this.submit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  submit(e) {
    e.preventDefault();

    if (validate(this.state.form, (error) => {
      this.setState({ error })
      this.props.raiseError(error);
    })) {
      this.props.submitRequest(this.state);
    }
  }

  handleUpdate(e, input) {
    // Kind of hard to read. Basically, the `form` property is being updated and all
    // the values are being retained. If we don't `extend` the object value for `form`,
    // then only the last value in the form gets updated and the rest are gone.
    this.setState({ form: _extend(this.state.form, { [input]: e.target.value }) });
  }

  render() {
    const errorClass = {
      emailAddress: '',
      chapterTitle: '',
      startPage: '',
      endPage: '',
    };

    _mapObject(this.state.form, (val, key) => {
      errorClass[key] = this.state.error[key] ? 'nypl-field-error' : '';
    });

    // A lot of this can be refactored to be in a loop but that's a later and next step.
    // I was thinking each `nypl-text-field` or `nypl-year-field` div can be
    // its own component in a loop with the required props and errors passed down.
    return (
      <form
        className="place-hold-form form electronic-delivery-form"
        action="/edd"
        method="POST"
        onSubmit={(e) => this.submit(e)}
      >
        <fieldset className="nypl-fieldset v2">
          <legend>Contact Information</legend>
          <h3>Contact Information</h3>

          <div className={`nypl-text-field ${errorClass.emailAddress}`}>
            <label htmlFor="email-address" id="email-address-label">Email address
              <span className="nypl-required-field">&nbsp;(Required)</span>
            </label>
            <input
              id="email-address"
              type="text"
              required
              aria-labelledby="email-address-label email-address-status"
              aria-required="true"
              name="emailAddress"
              value={this.state.form.emailAddress}
              onChange={(e) => this.handleUpdate(e, 'emailAddress')}
            />
            {
              errorClass.emailAddress &&
                (<span
                  className="nypl-field-status"
                  id="email-address-status"
                  aria-live="assertive"
                  aria-atomic="true"
                >
                  {this.state.error.emailAddress}
                </span>)
            }
          </div>
        </fieldset>

        <fieldset className="nypl-fieldset v2">
          <legend>Chapter or Article Information</legend>
          <h3>Chapter or Article Information</h3>

          <div className={`nypl-text-field ${errorClass.chapterTitle}`}>
            <label htmlFor="chapter-title" id="chapter-title-label">Chapter number or article title
              <span className="nypl-required-field">&nbsp;(Required)</span>
            </label>
            <input
              id="chapter-title"
              type="text"
              required
              aria-labelledby="chapter-title-label chapter-title-status"
              name="chapterTitle"
              value={this.state.form.chapterTitle}
              onChange={(e) => this.handleUpdate(e, 'chapterTitle')}
            />
            {
              errorClass.chapterTitle &&
                (<span
                  className="nypl-field-status"
                  id="chapter-title-status"
                  aria-live="assertive"
                  aria-atomic="true"
                >
                  {this.state.error.chapterTitle}
                </span>)
            }
          </div>

          <div className="nypl-text-field">
            <label htmlFor="author" id="author-label">&nbsp;Article author</label>
            <input
              id="author"
              type="text"
              aria-labelledby="author-label author-status"
              name="author"
              value={this.state.form.author}
              onChange={(e) => this.handleUpdate(e, 'author')}
            />
          </div>

          <div className="nypl-text-field">
            <label htmlFor="date" id="date-label">Date published</label>
            <input
              id="date"
              type="text"
              aria-labelledby="date-label date-status"
              name="date"
              value={this.state.form.date}
              onChange={(e) => this.handleUpdate(e, 'date')}
            />
          </div>

          <div className="nypl-text-field">
            <label htmlFor="volume" id="volume-label">Volume</label>
            <input
              id="volume"
              type="text"
              aria-labelledby="volume-label volume-status"
              name="volume"
              value={this.state.form.volume}
              onChange={(e) => this.handleUpdate(e, 'volume')}
            />
          </div>

          <div className="nypl-text-field">
            <label htmlFor="issue" id="issue-label">Issue</label>
            <input
              id="issue"
              type="text"
              aria-labelledby="issue-label issue-status"
              name="issue"
              value={this.state.form.issue}
              onChange={(e) => this.handleUpdate(e, 'issue')}
            />
          </div>

          <div className="nypl-text-field">
            <label htmlFor="request-notes" id="request-notes-label">Notes</label>
            <input
              id="request-notes"
              type="text"
              aria-labelledby="request-notes-label request-notes-status"
              name="requestNotes"
              value={this.state.form.requestNotes}
              onChange={(e) => this.handleUpdate(e, 'requestNotes')}
            />
          </div>
        </fieldset>

        <fieldset className="nypl-fieldset v2 number-range">
          <legend>Page Number Range (Max 50 pages)</legend>
          <h3>Page Number Range (Max 50 pages)</h3>

          <div className={`nypl-year-field ${errorClass.startPage}`}>
            <label htmlFor="start-page" id="start-page-label">Start Page
              <span className="nypl-required-field">&nbsp;(Required)</span>
            </label>
            <input
              id="start-page"
              type="number"
              required
              className="form-text"
              aria-labelledby="start-page-label"
              name="startPage"
              value={this.state.form.startPage}
              onChange={(e) => this.handleUpdate(e, 'startPage')}
            />
            {
              errorClass.startPage &&
                (<span
                  className="nypl-field-status"
                  id="start-page-status"
                  aria-live="assertive"
                  aria-atomic="true"
                >
                  {this.state.error.startPage}
                </span>)
            }
          </div>

          <span>&mdash;</span>

          <div className={`nypl-year-field ${errorClass.endPage}`}>
            <label htmlFor="end-page" id="end-page-label">End Page
              <span className="nypl-required-field">&nbsp;(Required)</span>
            </label>
            <input
              id="end-page"
              type="number"
              required
              className="form-text"
              aria-labelledby="end-page-label"
              name="endPage"
              value={this.state.form.endPage}
              onChange={(e) => this.handleUpdate(e, 'endPage')}
            />
            {
              errorClass.endPage &&
                (<span
                  className="nypl-field-status"
                  id="end-page-status"
                  aria-live="assertive"
                  aria-atomic="true"
                >
                  {this.state.error.endPage}
                </span>)
            }
          </div>
        </fieldset>

        <input type="hidden" name="bibId" value={this.props.bibId} />
        <input type="hidden" name="itemId" value={this.props.itemId} />

        <button type="submit" className="large" onClick={this.submit} onSubmit={this.submit}>
          Submit request
        </button>
      </form>
    );
  }
}

ElectronicDeliveryForm.propTypes = {
  submitRequest: PropTypes.func,
  raiseError: PropTypes.func,
  bibId: PropTypes.string,
  itemId: PropTypes.string,
  error: PropTypes.object,
  form: PropTypes.object,
  defaultEmail: PropTypes.string,
};

ElectronicDeliveryForm.defaultProps = {
  defaultEmail: '',
};



export default ElectronicDeliveryForm;
