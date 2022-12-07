import React from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';
import axios from 'axios';
import {
  Button,
  Heading,
  HelperErrorText,
  Label,
  Link,
  TextInput
} from '@nypl/design-system-react-components';

import { trackDiscovery } from '../../utils/utils';
import appConfig from '../../data/appConfig';

const initialFields = () => ({
  email: '',
  feedback: '',
});

class Feedback extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showForm: false,
      fields: initialFields(),
      success: false,
      commentInputError: false,
    };

    this.commentText = React.createRef();
    this.emailInput = React.createRef();

    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.deactivateForm = this.deactivateForm.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  onSubmitForm(e) {
    e.preventDefault();
    const { fields } = this.state;
    if (!fields.feedback && !fields.feedback.length) {
      this.setState({ commentInputError: true }, () => this.commentText.current.focus())
    } else {
      this.postForm();
      trackDiscovery('Feedback', 'Submit');
    }
  }

  postForm() {
    const { fields } = this.state;
    axios({
      method: 'POST',
      url: `${appConfig.baseUrl}/api/feedback`,
      data: {
        fields,
      },
    }).then((res) => {
      if (res.data.error) {
        console.error(res.data.error);
        return;
      };
      this.setState({
        fields: initialFields(),
        success: true,
      });
    }).catch(error => console.log('Feedback error', error));
  }

  toggleForm() {
    trackDiscovery('Feedback', 'Open');
    this.setState(prevState => ({ showForm: !prevState.showForm }));
  }

  deactivateForm() {
    trackDiscovery('Feedback', 'Close');
    this.setState({ showForm: false, success: false });
  }

  handleInputChange(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState(prevState => ({
      fields: Object.assign(prevState.fields, { [name]: value }),
    }));
  }

  render() {
    const {
      showForm,
      fields,
      success,
      commentInputError,
    } = this.state;

    return (
      <div className="feedback">
        <Button
          aria-haspopup='true'
          aria-expanded={showForm}
          aria-controls='feedback-menu'
          buttonType="secondary"
          id="help-feedback"
          className="feedback-button"
          onClick={() => this.toggleForm()}
        >
          Help & Feedback
        </Button>
        <FocusTrap
          focusTrapOptions={{
            onDeactivate: this.deactivateForm,
            clickOutsideDeactivates: true,
          }}
          active={showForm}
        >
          <div
            role="menu"
            className={showForm ? 'active' : ''}
            id="feedback-menu"
          >
            {!success && (
              <>
                <Heading level="one" size="secondary">We are here to help!</Heading>
                <form
                  target="hidden_feedback_iframe"
                  onSubmit={this.onSubmitForm}
                >
                  <div>
                    <Label htmlFor="feedback-textarea-comment" id="feedback-textarea">
                      Comments*
                    </Label>
                    <textarea
                      id="feedback-textarea-comment"
                      name="feedback"
                      value={fields.feedback}
                      ref={this.commentText}
                      rows="8"
                      aria-required="true"
                      tabIndex="0"
                      onChange={this.handleInputChange}
                    />
                    <HelperErrorText
                      id="helper-text"
                      isInvalid={commentInputError}
                      text={commentInputError ? 'Please fill out this field' : ''}
                    />
                  </div>
                  <div>
                    <TextInput
                      id="feedback-input-email"
                      labelText={
                        <>Email <span>(required if you would like a response from us)</span></>
                      }
                      name='email'
                      onChange={this.handleInputChange}
                      ref={this.emailInput}
                      // isRequired
                      type="email"
                      value={fields.email}
                      marginTop="l"
                    />
                  </div>
                  <div className="privacy-policy">
                    <Link
                      href="https://www.nypl.org/help/about-nypl/legal-notices/privacy-policy"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                  </div>
                  <Button
                    aria-expanded={!showForm}
                    aria-controls='feedback-menu'
                    buttonType="secondary"
                    id="cancel-feedback"
                    className={`cancel-button ${!showForm ? 'hidden' : ''}`}
                    onClick={e => this.deactivateForm(e)}
                    type="reset"
                  >
                    Cancel
                  </Button>

                  <Button
                    className="submit-button"
                    id="submit-feedback"
                    type="submit"
                  >
                    Submit
                  </Button>
                </form>
              </>
            )}
            {success && (
              <p>
                Thank you for submitting your comments.
                If you requested a response, our service staff
                will get back to you as soon as possible.
              </p>
            )}
          </div>
        </FocusTrap>
      </div>
    );
  }
}

Feedback.propTypes = {
  submit: PropTypes.func,
};

export default Feedback;
