import React from 'react';
import PropTypes from 'prop-types';

import { Heading, Link, LinkTypes } from '@nypl/design-system-react-components';

import appConfig from '../../data/appConfig';

const AccountSettings = ({ patron }) => {
  console.log('appConfig', appConfig);
  const { legacyCatalog } = appConfig;
  console.log('patron', patron);
  return (
    <div className="account-settings">
      <div>
        <Heading level={3} text="Personal Information" />
        <Link
          href={`${legacyCatalog}/patroninfo*eng~Sdefault/${patron.id}/modpinfo`}
          type={LinkTypes.Default}
          className="edit-link"
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
        <dd>{patron.phones[0].number}</dd>
        <dt>Email</dt>
        <dd>{patron.emails[0]}</dd>
        <dt>Preferred Pick Up Location</dt>
        <dd>{patron.homeLibraryCode}</dd>
      </dl>
      <hr />
      <a
        href={`https://ilsstaff.nypl.org:443/patroninfo*eng~Sdefault/${patron.id}/newpin`}
        target="_blank"
      >Change Pin
      </a>
    </div>
  );
};

AccountSettings.propTypes = {
  patron: PropTypes.object,
};

export default AccountSettings;
