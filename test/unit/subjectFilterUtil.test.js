/* eslint-env mocha */
import { expect } from 'chai';
import subjectFilterUtil from '../../src/app/utils/subjectFilterUtils';

describe('subjectFilterUtil', () => {
  describe('getSubjectLiteralFilters', () => {
    it('should return null if apiFilters has no filters with subjectLiteral field', () => {
      const noSubjectFilters = [
        { field: 'Language' },
        { field: 'MaterialType' },
      ];
      expect(subjectFilterUtil.getSubjectLiteralFilters(noSubjectFilters)).to.equal(null);
    });

    it('should return the filters with a subjectLiteral field if they exist', () => {
      const subjectFiltersPresent = [
        { field: 'subjectLiteral' },
        { field: 'Language' },
      ];
      expect(
        subjectFilterUtil
          .getSubjectLiteralFilters(subjectFiltersPresent),
      ).to
        .equal(subjectFiltersPresent[0],
        );
    });
  });

  describe('subjectFilterIsSelected', () => {
    const selectedSubjectLiteralFilters = [
      { value: 'puppy' },
      { value: 'hot dog' },
    ];

    const returnedFunction = subjectFilterUtil
      .subjectFilterIsSelected(selectedSubjectLiteralFilters);

    it('should return a function which returns true if value is selected', () => {
      expect(returnedFunction({ value: 'puppy' })).to.equal(true);
    });

    it('should return a function which returns false if value is not selected', () => {
      expect(returnedFunction({ value: 'kitten' })).to.equal(false);
    });
  });

  describe('narrowSubjectFilters', () => {
    const apiFilters = [
      { field: 'subjectLiteral',
        values: [
          { value: 'puppy' },
          { value: 'hot dog' },
        ],
      },
      {
        field: 'Language',
        values: [
          { value: 'English' },
          { value: 'Greek' },
        ],
      },
    ];
    const selectedFilters = {
      subjectLiteral: [{ value: 'puppy' }],
    };
    it('should change the subjectLiteral values to only include those which are selected', () => {
      subjectFilterUtil.narrowSubjectFilters(apiFilters, selectedFilters);
      expect(apiFilters[0].values.length).to.equal(1);
      expect(apiFilters[0].values[0].value).to.equal('puppy');
    });

    it('should change the subjectLiteral values to be empty if none are selected', () => {
      subjectFilterUtil.narrowSubjectFilters(apiFilters, {});
      expect(apiFilters[0].values.length).to.equal(0);
    });

    it('should leave the other filters unchanged', () => {
      expect(apiFilters[1].values.length).to.equal(2);
    });
  });
});
