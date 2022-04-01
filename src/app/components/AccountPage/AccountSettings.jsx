import React from 'react';
import PropTypes from 'prop-types';

import { Heading, Link, LinkTypes } from '@nypl/design-system-react-components';

const AccountSettings = ({ patron, legacyBaseUrl }) => (
  <div className='account-settings'>
    <div className='account-settings__heading-3'>
      <Heading level={3} text='Personal Information' />
      <Link
        href={`${legacyBaseUrl}/patroninfo*eng~Sdefault/${patron.id}/modpinfo`}
        type={LinkTypes.Default}
        className='edit-link settings'
        attributes={{
          target: '_blank',
        }}
      >
        Edit
      </Link>
    </div>
    <hr />
    <dl>
      <dt>Telephone</dt>
      <dd>{patron.phones ? patron.phones[0].number : 'None'}</dd>
      <dt>Email</dt>
      <dd>{patron.emails ? patron.emails[0] : 'None'}</dd>
      <dt>Preferred Pick Up Location</dt>
      <dd>{patron.homeLibraryName || patron.homeLibraryCode || 'None'}</dd>
      <dt>Preferred Contact Method</dt>
      <dd>{patron.noticePreference}</dd>
    </dl>
    <hr />
    <div className='pin'>
      <dl>
        <dt>Pin/Password</dt>
        <dd>
          <span>&middot;&middot;&middot;&middot;</span>
        </dd>
        <Link
          href={`${legacyBaseUrl}/patroninfo*eng~Sdefault/${patron.id}/newpin`}
          type={LinkTypes.Default}
          className='edit-link'
          attributes={{
            target: '_blank',
          }}
        >
          Edit
        </Link>
      </dl>
    </div>
    <hr />
  </div>
);

AccountSettings.propTypes = {
  patron: PropTypes.object,
  legacyBaseUrl: PropTypes.string,
};

export default AccountSettings;
