import React from 'react';
import PropTypes from 'prop-types';

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
            <a
              href={tab.link}
              id={`link-${tab.content}`}
              aria-selected={isActiveTab}
              role="tab"
            >{tab.label}
            </a>
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
