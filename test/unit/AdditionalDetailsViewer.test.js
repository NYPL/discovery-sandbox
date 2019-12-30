import React from 'react';
import { expect } from 'chai';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
// Import the component that is going to be tested
import AdditionalDetailsViewer from './../../src/app/components/BibPage/AdditionalDetailsViewer';

describe('AdditionalDetailsViewer', () => {
  const sampleBib =
  {
  "annotatedMarc" : {
  "bib": {
    "id": "12082323",
    "nyplSource": "sierra-nypl",
    "fields": [
      {
        "label": "Abbreviated Title",
        "values": [
          {
            "content": "Abrev. title -- 210 ",
            "source": {
              "fieldTag": "u",
              "marcTag": "210",
              "ind1": "1",
              "ind2": "0",
              "content": null,
              "subfields": [
                {
                  "tag": "a",
                  "content": "Abrev. title -- 210 "
                }
              ]
            }
          }
        ]
      },
      {
        "label": "Access",
        "values": [
          {
            "content": "Access -- 506 blank,any",
            "source": {
              "fieldTag": "n",
              "marcTag": "506",
              "ind1": " ",
              "ind2": " ",
              "content": null,
              "subfields": [
                {
                  "tag": "a",
                  "content": "Access -- 506 blank,any"
                }
              ]
            }
          },
          {
            "content": "Access -- 506 0,any",
            "source": {
              "fieldTag": "n",
              "marcTag": "506",
              "ind1": "0",
              "ind2": " ",
              "content": null,
              "subfields": [
                {
                  "tag": "a",
                  "content": "Access -- 506 0,any"
                }
                ]
              }
            }
          ]
        },
        {
        "label": "Url",
        "values": [
          {
            "label": "856 40",
            "content": "http://blogs.nypl.org/rcramer/",
            "source": {
              "fieldTag": "y",
              "marcTag": "856",
              "ind1": "4",
              "ind2": "0",
              "content": null,
              "subfields": [
                {
                  "tag": "u",
                  "content": "http://blogs.nypl.org/rcramer/"
                },
                {
                  "tag": "z",
                  "content": "[redacted]"
                }
              ]
            }
          }
          ]
        }
      ]
    }
  }
};

let component = mount(<AdditionalDetailsViewer bib={sampleBib}/>);


describe('After Clicking on Button', () => {

  let link = component.find('a');


  //These tests should be changed to be more informative

  it('should display Abbreviated Title', () => {
    expect(component.find('div').someWhere(item => item.text() === "Abrev. title -- 210 ")).to.equal(true);
  });

  it('should display url fields', () => {
    expect(link);
  });

  it('should have correct href for url fields', () => {
    expect(link.someWhere(item => item.prop("href") === "http://blogs.nypl.org/rcramer/" )).to.equal(true);
  });

  it('should display correct text for url fields', () => {
    expect(link.someWhere(item => item.text().trim() === "856 40")).to.equal(true);
  });

});

});
