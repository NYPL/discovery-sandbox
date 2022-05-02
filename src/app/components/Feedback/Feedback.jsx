import React from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';
import axios from 'axios';
import {
  Button,
  ButtonTypes,
  Input,
  Label,
  HelperErrorText,
  Link,
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
      this.setState({ commentInputError: true }, () =>
        this.commentText.current.focus(),
      );
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
    })
      .then((res) => {
        if (res.data.error) {
          console.error(res.data.error);
          return;
        }
        this.setState({
          fields: initialFields(),
          success: true,
        });
      })
      .catch((error) => console.log('Feedback error', error));
  }

  toggleForm() {
    trackDiscovery('Feedback', 'Open');
    this.setState((prevState) => ({ showForm: !prevState.showForm }));
  }

  deactivateForm() {
    trackDiscovery('Feedback', 'Close');
    this.setState({ showForm: false, success: false });
  }

  handleInputChange(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState((prevState) => ({
      fields: Object.assign(prevState.fields, { [name]: value }),
    }));
  }

  render() {
    const { showForm, fields, success, commentInputError } = this.state;
    const { submit } = this.props;

    return (
      <div className='feedback nypl-ds'>
        <Button
          className='feedback-button'
          onClick={() => this.toggleForm()}
          attributes={{
            'aria-haspopup': 'true',
            'aria-expanded': showForm,
            'aria-controls': 'feedback-menu',
          }}
          buttonType={ButtonTypes.Secondary}
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
            role='menu'
            className={showForm ? 'active' : ''}
            id='feedback-menu'
          >
            {!success && (
              <>
                <h1>We are here to help!</h1>
                <form
                  target='hidden_feedback_iframe'
                  onSubmit={this.onSubmitForm}
                >
                  <div>
                    <Label htmlFor='feedback-textarea-comment'>Comments*</Label>
                    <textarea
                      id='feedback-textarea-comment'
                      name='feedback'
                      value={fields.feedback}
                      ref={this.commentText}
                      rows='8'
                      aria-required='true'
                      tabIndex='0'
                      onChange={this.handleInputChange}
                    />
                    <HelperErrorText
                      id='helper-text'
                      isError={commentInputError}
                    >
                      {commentInputError ? 'Please fill out this field' : ''}
                    </HelperErrorText>
                  </div>
                  <div>
                    <Label htmlFor='feedback-input-email'>
                      Email{' '}
                      <span>
                        (required if you would like a response from us)
                      </span>
                    </Label>
                    <Input
                      required
                      attributes={{
                        name: 'email',
                        onChange: this.handleInputChange,
                        ref: this.emailInput,
                      }}
                      id='feedback-input-email'
                      type='email'
                      value={fields.email}
                    />
                  </div>
                  <div className='privacy-policy'>
                    <Link
                      href='https://www.nypl.org/help/about-nypl/legal-notices/privacy-policy'
                      target='_blank'
                    >
                      Privacy Policy
                    </Link>
                  </div>
                  <Button
                    type='reset'
                    className={`cancel-button ${!showForm ? 'hidden' : ''}`}
                    onClick={(e) => this.deactivateForm(e)}
                    attributes={{
                      'aria-expanded': !showForm,
                      'aria-controls': 'feedback-menu',
                    }}
                    buttonType={ButtonTypes.Secondary}
                  >
                    Cancel
                  </Button>

                  <Button
                    type='submit'
                    buttonType={ButtonTypes.Primary}
                    className='submit-button'
                  >
                    Submit
                  </Button>
                </form>
              </>
            )}
            {success && (
              <p>
                Thank you for submitting your comments. If you requested a
                response, our service staff will get back to you as soon as
                possible.
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
