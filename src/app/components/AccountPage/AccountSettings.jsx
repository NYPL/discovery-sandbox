import React from 'react';
import PropTypes from 'prop-types';

import { Heading, Link } from '@nypl/design-system-react-components';
import appConfig from '../../data/appConfig';

const AccountSettings = ({ patron, legacyBaseUrl }) => {
  const patronInfoUrlParam = appConfig.sierraUpgradeAugust2023 ? '' : '*eng~Sdefault'
  const accountSettingsUrl = `${legacyBaseUrl}/patroninfo${patronInfoUrlParam}/${patron.id}/`
  return (
    <div className="account-settings">
      <div className="account-settings__heading-3">
        <Heading level="three" text="Personal Information" />
        <Link
          href={accountSettingsUrl + `modpinfo`}
          className="edit-link settings"
          target="_blank"
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
      <div className="pin">
        <dl>
          <dt>Pin/Password</dt>
          <dd><span>&middot;&middot;&middot;&middot;</span></dd>
          <Link
            href={accountSettingsUrl + `newpin`}
            className="edit-link"
            target='_blank'
          >
            Edit
          </Link>
        </dl>
      </div>
      <hr />
    </div >
  )
};

AccountSettings.propTypes = {
  patron: PropTypes.object,
  legacyBaseUrl: PropTypes.string,
};

export default AccountSettings;
