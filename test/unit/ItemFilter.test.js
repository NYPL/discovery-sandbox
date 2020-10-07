/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import ItemFilter from './../../src/app/components/Item/ItemFilter';
import LibraryItem from './../../src/app/utils/item';
import item from '../fixtures/libraryItems';

const items = [
  item.full,
  item.missingData,
  item.requestable_ReCAP_available,
  item.requestable_ReCAP_not_available,
  item.requestable_nonReCAP_NYPL,
].map(LibraryItem.mapItem);
