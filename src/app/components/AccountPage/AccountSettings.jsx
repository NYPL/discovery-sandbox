import React from 'react';
import PropTypes from 'prop-types';

import { Heading, Link, LinkTypes } from '@nypl/design-system-react-components';

import appConfig from '../../data/appConfig';

const AccountSettings = ({ patron }) => {
  const { legacyCatalog } = appConfig;

  return (
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
        <dd>{patron.phones ? patron.phones[0].number : null}</dd>
        <dt>Email</dt>
        <dd>{patron.emails[0]}</dd>
        <dt>Preferred Pick Up Location</dt>
        <dd>{patron.homeLibraryCode}</dd>
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
};

AccountSettings.propTypes = {
  patron: PropTypes.object,
};

export default AccountSettings;
