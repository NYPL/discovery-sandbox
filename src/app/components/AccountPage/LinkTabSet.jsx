import React from 'react';
import PropTypes from 'prop-types';

const LinkTabSet = ({ tabs, activeTab }) => {
  return (
    <div className="tabbed">
      <ul role="tablist">
        { tabs.map((tab) => {
          const isActiveTab = tab.label === activeTab;
          return (
            <li id={`tab-${tab.label}`} key={`tab-${tab.label}`} className={isActiveTab ? 'activeTab' : null} role="presentation">
              <a
                href={tab.link}
                id={`link-${tab.label}`}
                tabIndex="-1"
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
};

LinkTabSet.propTypes = {
  tabs: PropTypes.array,
  activeTab: PropTypes.string,
};

export default LinkTabSet;
