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
          name: '',
          email: '',
          chapter: '',
          author: '',
          date: '',
          volume: '',
          issue: '',
          'starting-page': '',
          'ending-page': '',
        },
      error: !_isEmpty(this.props.error) ? this.props.error :
        {
          name: '',
          email: '',
          chapter: '',
          author: '',
          date: '',
          volume: '',
          issue: '',
          'starting-page': '',
          'ending-page': '',
        },
    };

    this.submit = this.submit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  submit(e) {
    e.preventDefault();

    if (validate(this.state.form, (error) => this.setState({ error }))) {
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
      name: '',
      email: '',
      chapter: '',
      author: '',
      date: '',
      volume: '',
      issue: '',
      'starting-page': '',
      'ending-page': '',
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

          <div className={`nypl-text-field ${errorClass.name}`}>
            <label htmlFor="patron-name" id="patron-name-label">First and last name
              <span className="nypl-required-field">&nbsp;(Required)</span>
            </label>
            <input
              id="patron-name"
              type="text"
              required
              aria-labelledby="patron-name-label patron-name-status"
              aria-required="true"
              name="name"
              value={this.state.form.name}
              onChange={(e) => this.handleUpdate(e, 'name')}
            />
            {
              errorClass.name &&
                (<span
                  className="nypl-field-status"
                  id="patron-name-status"
                  aria-live="assertive"
                  aria-atomic="true"
                >
                  Please enter your first and last name
                </span>)
            }
          </div>

          <div className={`nypl-text-field ${errorClass.email}`}>
            <label htmlFor="email" id="email-label">Email address
              <span className="nypl-required-field">&nbsp;(Required)</span>
            </label>
            <input
              id="email"
              type="text"
              required
              aria-labelledby="email-label email-status"
              aria-required="true"
              name="email"
              value={this.state.form.email}
              onChange={(e) => this.handleUpdate(e, 'email')}
            />
            {
              errorClass.email &&
                (<span
                  className="nypl-field-status"
                  id="email-status"
                  aria-live="assertive"
                  aria-atomic="true"
                >
                  Please enter a valid email address
                </span>)
            }
          </div>
        </fieldset>

        <fieldset className="nypl-fieldset v2">
          <legend>Chapter or Article Information</legend>
          <h3>Chapter or Article Information</h3>

          <div className={`nypl-text-field ${errorClass.chapter}`}>
            <label htmlFor="chapter" id="chapter-label">Chapter number or article title
              <span className="nypl-required-field">&nbsp;(Required)</span>
            </label>
            <input
              id="chapter"
              type="text"
              required
              aria-labelledby="chapter-label chapter-status"
              aria-required="true"
              name="chapter"
              value={this.state.form.chapter}
              onChange={(e) => this.handleUpdate(e, 'chapter')}
            />
            {
              errorClass.chapter &&
                (<span
                  className="nypl-field-status"
                  id="chapter-status"
                  aria-live="assertive"
                  aria-atomic="true"
                >
                  Please indicate the chapter number or article title
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

          <div className={`nypl-text-field ${errorClass.date}`}>
            <label htmlFor="date" id="date-label">Date published
              <span className="nypl-required-field">&nbsp;(Required)</span>
            </label>
            <input
              id="date"
              type="text"
              required
              aria-labelledby="date-label date-status"
              aria-required="true"
              name="date"
              value={this.state.form.date}
              onChange={(e) => this.handleUpdate(e, 'date')}
            />
            {
              errorClass.date &&
                (<span
                  className="nypl-field-status"
                  id="date-status"
                  aria-live="assertive"
                  aria-atomic="true"
                >
                  Please indicate the date published
                </span>)
            }
          </div>

          <div className={`nypl-text-field ${errorClass.volume}`}>
            <label htmlFor="volume" id="volume-label">Volume
              <span className="nypl-required-field">&nbsp;(Required)</span>
            </label>
            <input
              id="volume"
              type="text"
              required
              aria-labelledby="volume-label volume-status"
              aria-required="true"
              name="volume"
              value={this.state.form.volume}
              onChange={(e) => this.handleUpdate(e, 'volume')}
            />
            {
              errorClass.volume &&
                (<span
                  className="nypl-field-status"
                  id="volume-status"
                  aria-live="assertive"
                  aria-atomic="true"
                >
                  Please indicate the volume
                </span>)
            }
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
        </fieldset>

        <fieldset className="nypl-fieldset v2 number-range">
          <legend>Page Number Range (Max 50 pages)</legend>
          <h3>Page Number Range (Max 50 pages)</h3>

          <div className={`nypl-year-field ${errorClass['starting-page']}`}>
            <label htmlFor="starting-page" id="starting-page-label">Start Page
              <span className="nypl-required-field">&nbsp;(Required)</span>
            </label>
            <input
              id="starting-page"
              type="number"
              className="form-text"
              required
              aria-labelledby="starting-page-label"
              aria-required="true"
              name="starting-page"
              value={this.state.form['starting-page']}
              onChange={(e) => this.handleUpdate(e, 'starting-page')}
            />
            {
              errorClass['starting-page'] &&
                (<span
                  className="nypl-field-status"
                  id="volume-status"
                  aria-live="assertive"
                  aria-atomic="true"
                >
                  Values must be numeric only
                </span>)
            }
          </div>

          <span>&mdash;</span>

          <div className={`nypl-year-field ${errorClass['ending-page']}`}>
            <label htmlFor="ending-page" id="ending-page-label">Ending Page
              <span className="nypl-required-field">&nbsp;(Required)</span>
            </label>
            <input
              id="ending-page"
              type="number"
              className="form-text"
              required
              aria-labelledby="ending-page-label"
              aria-required="true"
              name="ending-page"
              value={this.state.form['ending-page']}
              onChange={(e) => this.handleUpdate(e, 'ending-page')}
            />
            {
              errorClass['ending-page'] &&
                (<span
                  className="nypl-field-status"
                  id="volume-status"
                  aria-live="assertive"
                  aria-atomic="true"
                >
                  Values must be numeric only
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
  bibId: PropTypes.string,
  itemId: PropTypes.string,
  error: PropTypes.object,
  form: PropTypes.object,
};

export default ElectronicDeliveryForm;
