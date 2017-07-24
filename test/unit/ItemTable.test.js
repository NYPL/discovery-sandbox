/* eslint-env mocha */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
// Import the component that is going to be tested
import ItemTable from './../../src/app/components/Item/ItemTable.jsx';

describe('ItemTable', () => {
  describe('If <ItemTable> receives no data', () => {
    it('should have no <table>, <caption>, and <thead>.', () => {

    });

    it('should have no <tbody>.', () => {

    });
  });

  describe('If <ItemTable> receives an array with valid data', () => {
    it('should have a <table>, <caption> with the texts "Item details", <thead> with a <tr>.',
      () => {

    });

    it('should have the <tr> with five <th>, the contents of the <th> are "Location", ' +
      '"Call No.", "Status", "Message", and "".', () => {

      }
    );

    it('should have the same number of the <tr> in its <tbody> as the data lenght it gets.', () => {

    });

    it('should render the item with its "location", "status", and "accessMessage" values', () => {

    });
  });

  describe('If <ItemTable> receives an item without valid "requestable" value', () => {
    it('should render the item with no request link.', () => {

    });
  });

  describe('If <ItemTable> receives an item with "requestable" value, but ' +
    '"availability" is not available""', () => {
    it('should render the item with no request link and the render the hint "Unavailable".', () => {

    });

    it('should have the <tr> with the class "unavailable".', () => {

    });
  });

  describe('If <ItemTable> receives an item with valid "requestable" value and ' +
    '"availability" is available""', () => {
      it('should render the item with request link. The link\'s href should be ' +
        '"/hold/request/[bibId]-[itemId]". The link\'s text should be "Request".', () => {

      });

      it('should have the <tr> with the class "available".', () => {

      });
  });

  describe('If <ItemTable> receives an item with "callNumber" value', () => {
    it('should render the item with the "callNumber" value', () => {

    });
  });

  describe('If <ItemTable> receives an item with "isElectronicResource" value', () => {
    it('should render the item with two "location" value', () => {

    });
  });
});
