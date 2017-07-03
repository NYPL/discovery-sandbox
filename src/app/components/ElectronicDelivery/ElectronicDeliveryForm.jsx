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

    this.props.submitRequest(this.state);
  }

  handleUpdate(e, input) {
    this.setState({ [input]: e.target.value });
  }

  render() {
    return (
      <form
        className="place-hold-form form electronic-delivery-form"
        action="/edd"
        method="POST"
        onSubmit={(e) => this.submit(e)}
      >
        <fieldset>
          <legend>Contact Information:</legend>
          <h3>Contact Information:</h3>
          <ul>
            <li>
              <label htmlFor="patron-name">First and Last Name: <span>Required</span></label>
              <input
                type="text"
                id="patron-name"
                name="name"
                value={this.state.name}
                onChange={(e) => this.handleUpdate(e, 'name')}
              />
              <p>Please enter your First and Last Name</p>
            </li>
            <li>
              <label htmlFor="email">Email Address: <span>Required</span></label>
              <input
                type="text"
                id="email"
                name="email"
                value={this.state.email}
                onChange={(e) => this.handleUpdate(e, 'email')}
              />
              <p>Please enter a valid email address</p>
            </li>
          </ul>
        </fieldset>

        <fieldset>
          <legend>Chapter or Article Information:</legend>
          <h3>Chapter or Article Information:</h3>

          <ul>
            <li>
              <label htmlFor="chapter">Chapter / Article: <span>Required</span></label>
              <input
                type="text"
                id="chapter"
                name="chapter"
                value={this.state.chapter}
                onChange={(e) => this.handleUpdate(e, 'chapter')}
              />
              <p>Please indicate the chapter or article</p>
            </li>
            <li>
              <label htmlFor="author">Article Author:</label>
              <input
                type="text"
                id="author"
                name="author"
                value={this.state.author}
                onChange={(e) => this.handleUpdate(e, 'author')}
              />
              <p>Please indicate the article author's name</p>
            </li>
            <li>
              <label htmlFor="date">Date Published: <span>Required</span></label>
              <input
                type="text"
                id="date"
                name="date"
                value={this.state.date}
                onChange={(e) => this.handleUpdate(e, 'date')}
              />
              <p>Please indicate the date published</p>
            </li>
            <li>
              <label htmlFor="volume">Volume: <span>Required</span></label>
              <input
                type="text"
                id="volume"
                name="volume"
                value={this.state.volume}
                onChange={(e) => this.handleUpdate(e, 'volume')}
              />
              <p>Please indicate the volume</p>
            </li>
            <li>
              <label htmlFor="issue">Issue:</label>
              <input
                type="text"
                id="issue"
                name="issue"
                value={this.state.issue}
                onChange={(e) => this.handleUpdate(e, 'issue')}
              />
              <p>Please indicate the issue</p>
            </li>
          </ul>
        </fieldset>

        <fieldset>
          <legend>Select Page Number Range:</legend>
          <h3>Select Page Number Range:</h3>

          <ul>
            <li>
              <label htmlFor="starting-page">Starting Page: <span>Required</span></label>
              <input
                type="text"
                id="starting-page"
                name="starting-page"
                value={this.state['starting-page']}
                onChange={(e) => this.handleUpdate(e, 'starting-page')}
              />

              <label htmlFor="ending-page">Ending Page: <span>Required</span></label>
              <input
                type="text"
                id="ending-page"
                name="ending-page"
                value={this.state['ending-page']}
                onChange={(e) => this.handleUpdate(e, 'ending-page')}
              />
              <p>Values must be numeric only</p>
              <p>(No special characters allowed)</p>
            </li>
          </ul>
        </fieldset>

        <input type="hidden" name="bibId" value={this.props.bibId} />
        <input type="hidden" name="itemId" value={this.props.itemId} />

        <button type="submit" className="large" onClick={this.submit} onSubmit={this.submit}>
          Submit
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
