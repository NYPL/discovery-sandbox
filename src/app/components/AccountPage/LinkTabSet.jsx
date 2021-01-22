import React from 'react';
import PropTypes from 'prop-types';

import { Link as RouterLink } from 'react-router';
import { Link } from '@nypl/design-system-react-components';

const LinkTabSet = ({ tabs, activeTab }) => (
  <div className="tabbed">
    <ul role="tablist">
      { tabs.map((tab) => {
        const isActiveTab = tab.content === activeTab;
        return (
          <li
            id={`tab-${tab.content}`}
            key={`tab-${tab.content}`}
            className={isActiveTab ? 'activeTab' : null}
            role="presentation"
          >
            <Link>
              <RouterLink
                href={tab.link}
                id={`link-${tab.content}`}
                aria-selected={isActiveTab}
                role="tab"
              >{tab.label}
              </RouterLink>
            </Link>
          </li>
        );
      })}
    </ul>
  </div>
);

LinkTabSet.propTypes = {
  tabs: PropTypes.array,
  activeTab: PropTypes.string,
};

export default LinkTabSet;
