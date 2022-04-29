/* eslint-env mocha */
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import React from 'react';
import { Link } from 'react-router';
import appConfig from '../../src/app/data/appConfig';
import SubjectHeadings from '../../src/app/components/BibPage/SubjectHeadings';

describe('SubjectHeadings', () => {
  describe('No headings', () => {
    const component = shallow(<SubjectHeadings />);
    it('should return null', () => {
      expect(component.html()).to.equal(null);
    });
  });

  describe('Single heading', () => {
    const headings = [
      {
        uuid: '12345',
        label: 'Heading -- Subheading',
        parent: {
          uuid: '67890',
          label: 'Heading',
        },
      },
    ];

    const component = mount(<SubjectHeadings headings={headings} idx={1} />);

    it("should have a dt with text 'Subject' and key i", () => {
      expect(component.find('dt').length).to.equal(1);
      expect(component.find('dt').at(0).text()).to.equal('Subject');
      expect(component.find('dt').at(0).key()).to.equal('term-1');
    });

    it('should have a dd', () => {
      expect(component.find('dd').length).to.equal(1);
    });

    it('should have a ul', () => {
      expect(component.find('ul').length).to.equal(1);
    });

    it('should show the subject heading correctly', () => {
      expect(component.find('li').length).to.equal(1);
      expect(component.find(Link).length).to.equal(2);
      expect(component.find(Link).at(0).text()).to.equal('Heading');
      expect(component.find(Link).at(0).prop('to')).to.equal(
        `${appConfig.baseUrl}/subject_headings/67890?label=${encodeURIComponent(
          'Heading',
        )}`,
      );
      expect(component.find('span').length).to.equal(1);
      expect(component.find('span').at(0).text()).to.equal(' > ');
      expect(component.find(Link).at(1).text()).to.equal('Subheading');
      expect(component.find(Link).at(1).prop('to')).to.equal(
        `${appConfig.baseUrl}/subject_headings/12345?label=${encodeURIComponent(
          'Heading -- Subheading',
        )}`,
      );
    });
  });

  describe('Multiple headings', () => {
    const headings = [
      {
        uuid: '12345',
        label: 'Heading1 -- Subheading1',
        parent: {
          uuid: '67890',
          label: 'Heading1',
        },
      },
      {
        uuid: '00000',
        label: 'Heading+&',
      },
    ];

    const component = mount(<SubjectHeadings headings={headings} idx={1} />);

    it("should have a dt with text 'Subjects' and key i", () => {
      expect(component.find('dt').length).to.equal(1);
      expect(component.find('dt').at(0).text()).to.equal('Subjects');
      expect(component.find('dt').at(0).key()).to.equal('term-1');
    });

    it('should have a dd', () => {
      expect(component.find('dd').length).to.equal(1);
    });

    it('should have a ul', () => {
      expect(component.find('ul').length).to.equal(1);
    });

    it('should have an li for each heading', () => {
      expect(component.find('li').length).to.equal(2);
    });

    it('should show the first heading correctly', () => {
      const firstLi = component.find('li').at(0);
      expect(firstLi.find(Link).length).to.equal(2);
      expect(firstLi.find(Link).at(0).text()).to.equal('Heading1');
      expect(firstLi.find(Link).at(0).prop('to')).to.equal(
        `${appConfig.baseUrl}/subject_headings/67890?label=${encodeURIComponent(
          'Heading1',
        )}`,
      );
      expect(firstLi.find('span').length).to.equal(1);
      expect(firstLi.find('span').at(0).text()).to.equal(' > ');
      expect(firstLi.find(Link).at(1).text()).to.equal('Subheading1');
      expect(firstLi.find(Link).at(1).prop('to')).to.equal(
        `${appConfig.baseUrl}/subject_headings/12345?label=${encodeURIComponent(
          'Heading1 -- Subheading1',
        )}`,
      );
    });

    it('should show the second heading correctly', () => {
      const secondLi = component.find('li').at(1);
      expect(secondLi.find(Link).length).to.equal(1);
      expect(secondLi.find(Link).at(0).text()).to.equal('Heading+&');
      expect(secondLi.find(Link).at(0).prop('to')).to.equal(
        `${appConfig.baseUrl}/subject_headings/00000?label=${encodeURIComponent(
          'Heading+&',
        )}`,
      );
    });
  });
});
