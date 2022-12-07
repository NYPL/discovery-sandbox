import React from 'react';

import ItemTable from './ItemTable';
import ItemsDefinitionLists from './ItemsDefinitionLists';

import { MediaContext } from '../Application/Application';

const SearchResultsItems = ({ items, bibId, id, searchKeywords, page }) => {
  return (
    <MediaContext.Consumer>
      {(media) => {
        return ['mobile'].includes(media) ? (
          <ItemsDefinitionLists
            items={items}
            bibId={bibId}
            id={id}
            searchKeywords={searchKeywords}
            page={page}
          />
        ) : (
          <ItemTable
            items={items}
            bibId={bibId}
            id={id}
            searchKeywords={searchKeywords}
            page={page}
          />
        );
      }}
    </MediaContext.Consumer>
  );
};

export default SearchResultsItems;
