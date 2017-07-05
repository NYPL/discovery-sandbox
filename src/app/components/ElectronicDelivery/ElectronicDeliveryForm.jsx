import React from 'react';
import PropTypes from 'prop-types';

class ElectronicDeliveryForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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

    this.submit = this.submit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  submit(e) {
    e.preventDefault();

    this.validate();
    this.props.submitRequest(this.state);
  }

  handleUpdate(e, input) {
    this.setState({ [input]: e.target.value });
  }

  validate() {
    // Verify data
    console.log(this.state);
  }

  render() {
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

          <div className="nypl-text-field nypl-field-error">
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
              value={this.state.name}
              onChange={(e) => this.handleUpdate(e, 'name')}
            />
            <span
              className="nypl-field-status"
              id="patron-name-status"
              aria-live="assertive"
              aria-atomic="true"
            >
              Please enter your first and last name
            </span>
          </div>

          <div className="nypl-text-field">
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
              value={this.state.email}
              onChange={(e) => this.handleUpdate(e, 'email')}
            />
            <span
              className="nypl-field-status"
              id="email-status"
              aria-live="assertive"
              aria-atomic="true"
            >
              Please enter a valid email address
            </span>
          </div>
        </fieldset>

        <fieldset className="nypl-fieldset v2">
          <legend>Chapter or Article Information</legend>
          <h3>Chapter or Article Information</h3>

          <div className="nypl-text-field">
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
              value={this.state.chapter}
              onChange={(e) => this.handleUpdate(e, 'chapter')}
            />
            <span
              className="nypl-field-status"
              id="chapter-status"
              aria-live="assertive"
              aria-atomic="true"
            >
              Please indicate the chapter number or article title
            </span>
          </div>

          <div className="nypl-text-field">
            <label htmlFor="author" id="author-label">&nbsp;Article author</label>
            <input
              id="author"
              type="text"
              aria-labelledby="author-label author-status"
              name="author"
              value={this.state.author}
              onChange={(e) => this.handleUpdate(e, 'author')}
            />
            <span
              className="nypl-field-status"
              id="author-status"
              aria-live="assertive"
              aria-atomic="true"
            >
              Please indicate the article author's name
            </span>
          </div>

          <div className="nypl-text-field">
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
              value={this.state.date}
              onChange={(e) => this.handleUpdate(e, 'date')}
            />
            <span
              className="nypl-field-status"
              id="date-status"
              aria-live="assertive"
              aria-atomic="true"
            >
              Please indicate the date published
            </span>
          </div>

          <div className="nypl-text-field">
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
              value={this.state.volume}
              onChange={(e) => this.handleUpdate(e, 'volume')}
            />
            <span
              className="nypl-field-status"
              id="volume-status"
              aria-live="assertive"
              aria-atomic="true"
            >
              Please indicate the volume
            </span>
          </div>

          <div className="nypl-text-field">
            <label htmlFor="issue" id="issue-label">Issue</label>
            <input
              id="issue"
              type="text"
              aria-labelledby="issue-label issue-status"
              name="issue"
              value={this.state.issue}
              onChange={(e) => this.handleUpdate(e, 'issue')}
            />
            <span className="nypl-field-status" id="issue-status">
              Please indicate the issue
            </span>
          </div>
        </fieldset>

        <fieldset className="nypl-fieldset v2">
          <legend>Page Number Range (Max 50 pages)</legend>
          <h3>Page Number Range (Max 50 pages)</h3>

          <div className="nypl-year-field">
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
              value={this.state['starting-page']}
              onChange={(e) => this.handleUpdate(e, 'starting-page')}
            />
          </div>

          <div className="nypl-year-field">
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
              value={this.state['ending-page']}
              onChange={(e) => this.handleUpdate(e, 'ending-page')}
            />
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
};

export default ElectronicDeliveryForm;
