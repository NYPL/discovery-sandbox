import React from 'react';
import InformationLinks from './InformationLinks';
import RequestButtons from './RequestButtons';

import { aeonUrl } from '../../utils/utils';

const StatusLinks = ({ item, bibId, searchKeywords, appConfig, page }) => {
  const { features } = appConfig;
  const isAeon = item.aeonUrl && features.includes('aeon-links');

  return (
    <div>
      <RequestButtons
        item={item}
        bibId={bibId}
        searchKeywords={searchKeywords}
        appConfig={appConfig}
        page={page}
      />
      <InformationLinks
        {...item}
        computedAeonUrl={isAeon ? aeonUrl(item) : undefined}
      />
    </div>
  );
};

export default StatusLinks;
