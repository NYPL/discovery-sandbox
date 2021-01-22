import React from 'react';
import PropTypes from 'prop-types';

import { Heading, Link, LinkTypes } from '@nypl/design-system-react-components';

const AccountSettings = ({ patron, legacyCatalog }) => (
  <div className="account-settings">
    <div>
      <Heading level={3} text="Personal Information" />
      <Link
        href={`${legacyCatalog}/patroninfo*eng~Sdefault/${patron.id}/modpinfo`}
        type={LinkTypes.Default}
        className="edit-link settings"
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
      <dd>{patron.homeLibraryCode || 'None'}</dd>
    </dl>
    <hr />
    <div className="pin">
      <dl>
        <dt>Pin</dt>
        <dd><span>&middot;&middot;&middot;&middot;</span></dd>
        <Link
          href={`${legacyCatalog}/patroninfo*eng~Sdefault/${patron.id}/newpin`}
          type={LinkTypes.Default}
          className="edit-link"
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
  legacyCatalog: PropTypes.string,
};

export default AccountSettings;
