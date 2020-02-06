/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import SubjectHeadingShow from '@SubjectHeadingShow';

Enzyme.configure({ adapter: new Adapter() });

describe('SubjectHeadingShow', () => {
  describe('finding uuid', () => {
    const params = {
      subjectHeadingUuid: 1,
    };
    const wrapper = shallow(<SubjectHeadingShow params={params} />);
    const instance = wrapper.instance();

    it('should accept a list containing a subject heading with correct uuid', () => {
      const headings = [
        { uuid: 2 }, { uuid: 1 }, { uuid: 3 },
      ];
      expect(instance.hasUuid(headings)).to.equal(true);
    });

    it('should accept a list containing a nested subject heading with correct uuid', () => {
      const headings = [
        { uuid: 2 }, { uuid: 4 }, { uuid: 3, children: [{ uuid: 1 }] },
      ];
      expect(instance.hasUuid(headings)).to.equal(true);
    });

    it('should accept an object with correct uuid', () => {
      const headings = { uuid: 1 };
      expect(instance.hasUuid(headings)).to.equal(true);
    });

    it('should accept an object containing a nested subject heading with correct uuid', () => {
      const headings = { uuid: 3, children: [{ uuid: 4, children: [{ uuid: 1 }] }] };
      expect(instance.hasUuid(headings)).to.equal(true);
    });

    it('should reject an object if no subject heading has the correct id', () => {
      const headings = { uuid: 3, children: [{ uuid: 4, children: [{ uuid: 6 }] }] };
      expect(instance.hasUuid(headings)).to.equal(false);
    });

    it('should reject a list if no subject heading has the correct id', () => {
      const headings = [
        { uuid: 2 }, { uuid: 4 }, { uuid: 3, children: [{ uuid: 5 }] },
      ];
      expect(instance.hasUuid(headings)).to.equal(false);
    });
  });
});
