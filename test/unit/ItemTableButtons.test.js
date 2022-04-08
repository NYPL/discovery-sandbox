import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { Link } from 'react-router';
import { stub } from 'sinon';
import {
  AeonButton,
  EddButton,
  PhysButton,
} from '../../src/app/components/Buttons/ItemTableButtons';
import RequestButton, {
  RequestButtonLabel,
} from '../../src/app/components/Buttons/ItemTableButtons/RequestButton';

const aeonUrl = 'https://nypl-aeon-test.aeon.atlas-sys.com';

describe('RequestButton', function () {
  describe('Base Concerns', function () {
    let component;
    let linkComp;
    const onClick = stub();
    const event = {
      preventDefault: stub(),
    };

    before(() => {
      component = shallow(
        <RequestButton text={'Display Me'} url='Bogus URL' onClick={onClick} />,
      );
      linkComp = component.find(Link);
    });

    afterEach(() => {
      onClick.reset(), event.preventDefault.reset();
    });

    it('Should have a div with className "nypl-request-btn"', () => {
      expect(component.type()).to.equal('div');
      expect(component.hasClass('nypl-request-btn')).to.equal(true);
    });

    describe('Link', function () {
      it('Should contain a Link Component as a child of div', () => {
        expect(component.find(Link).parent().is('div')).to.equal(true);
      });

      describe('Link Options', () => {
        it('Should not have a class', () => {
          expect(linkComp.hasClass()).to.be.false;
        });

        it('Should display a given text in a Link', () => {
          expect(linkComp.render().text()).to.equal('Display Me');
        });

        it('Should contain the given href', () => {
          expect(linkComp.prop('href')).to.equal('Bogus URL');
        });

        it('Should have a tab index of 0', () => {
          expect(linkComp.prop('tabIndex')).to.equal('0');
        });

        it('Should have secondary class name', () => {
          const wrapper = shallow(
            <RequestButton text={'Display Me'} url='Bogus URL' secondary />,
          );
          expect(wrapper.find(Link).hasClass('secondary')).to.be.true;
        });
      });

      describe('Handle Click Options', function () {
        it('Should invoke onClick function with url', () => {
          linkComp.simulate('click', event);
          expect(onClick.called).to.be.true;
          expect(onClick.args[0]).to.include('Bogus URL');
        });

        // it('Should invoke prevent default if not AeonLink', () => {
        //   linkComp.simulate('click', event);
        //   expect(event.preventDefault.called).to.be.true;
        // });

        it('Should not invoke prevent default if AeonLink', () => {
          const wrapper = shallow(
            <RequestButton
              text={'Display Me'}
              url={aeonUrl}
              onClick={onClick}
            />,
          );

          wrapper.find('Link').simulate('click', event);
          expect(event.preventDefault.called).to.be.false;
        });
      });
    });

    describe('Label', function () {
      it('Will not display the Label if Children are not provided', () => {
        expect(component.children().length).to.equal(2);
        expect(component.childAt(1).type()).to.equal(RequestButtonLabel);
        expect(component.childAt(1).children().length).to.equal(0);
      });

      it('Will display the Label if Children are provided', () => {
        const wrapper = shallow(
          <RequestButton text={'Display Me'} url={'Bogus URL'}>
            {'Hello World'}
          </RequestButton>,
        );

        expect(wrapper.children().length).to.equal(2);
        expect(wrapper.childAt(1).type()).to.equal(RequestButtonLabel);
        expect(wrapper.childAt(1).children().length).to.equal(1);
        expect(wrapper.childAt(1).render().text()).to.equal('Hello World');
      });
    });
  });
});

describe('AeonButton', function () {
  let component;
  const item = {
    specRequestable: false,
    aeonUrl: 'Bogus',
    status: {},
  };
  const onClick = stub().callsFake((url) => {
    return url;
  });

  before(() => {
    component = shallow(<AeonButton item={item} onClick={onClick} />);
  });

  describe('When Item is Invalid', function () {
    it('Renders Null when not Special Requestable', () => {
      expect(component.type()).to.be.null;
    });

    it('Renders "Not Available" when no preferred status label', () => {
      item.specRequestable = true;

      component.setProps({ item });

      expect(component.text()).to.eql('Not Available');
    });

    it('Renders the preferred status label', () => {
      item.status = { prefLabel: 'Available' };

      component.setProps({ item });

      expect(component.text()).to.equal('Available');
    });
  });

  describe('When Item is Valid', function () {
    it('Renders the RequestButton Component', () => {
      item.aeonUrl = aeonUrl;
      const wrapper = shallow(<AeonButton item={item} />);

      expect(wrapper.type()).to.equal(RequestButton);
    });
  });
});

describe('EddButton', function () {
  let component;
  const bibId = '123abc';
  const item = {
    id: 'abc123',
    eddRequestable: false,
  };
  const onClick = stub().callsFake((url) => {
    return url;
  });

  before(() => {
    component = shallow(
      <EddButton item={item} bibId={bibId} onClick={onClick} />,
    );
  });

  afterEach(() => {
    onClick.reset();
  });

  describe('When Item is Invalid', function () {
    it('Renders null when item is not Edd Requestable', () => {
      expect(component.type()).to.be.null;
      expect(component.find(RequestButton).exists()).to.equal(false);
    });
  });

  describe('When Item is Valid', function () {
    it('Does render the RequestButton Component', () => {
      item.eddRequestable = true;
      component.setProps({ item });

      expect(component.type()).to.equal(RequestButton);
    });

    it('Displays "Request Scan" as its text', () => {
      expect(component.find(RequestButton).render().text()).to.equal(
        'Request Scan',
      );
    });

    it('Redirects the user to the EDD hold request form', () => {
      const url = component.find(RequestButton).prop('url');
      expect(url).to.include(`/hold/request/${bibId}-${item.id}/edd`);
    });
  });
});

describe('PhysButton', function () {
  let component;
  const item = {
    id: 'abc123',
    physRequestable: false,
    available: false,
    isRecap: false,
    status: {},
  };
  const bibId = '123abc';
  const onClick = stub().callsFake((url) => {
    return url;
  });

  before(() => {
    component = shallow(
      <PhysButton item={item} bibId={bibId} onClick={onClick} />,
    );
  });

  afterEach(() => {
    onClick.reset();
  });

  describe('When Item is Invalid', function () {
    it('Renders null when item is not Phys requestable', () => {
      expect(component.type()).to.be.null;
    });

    describe('Displays a message if not available or not recap', () => {
      it('Renders "Not Available" when no preferred label', () => {
        item.physRequestable = true;
        component.setProps({ item });

        expect(component.text()).to.equal('Not Available');
      });

      it('Renderes a div with the preferred status label', () => {
        item.status.prefLabel = 'Render me';
        component.setProps({ item });

        expect(component.type()).to.equal('div');
        expect(component.text()).to.equal(item.status.prefLabel);
      });
    });
  });

  describe('When Item is Valid', function () {
    it('Does render the RequestButton Component', () => {
      item.physRequestable = true;
      item.available = true;
      item.isRecap = true;
      component.setProps({ item });

      expect(component.type()).to.equal(RequestButton);
    });

    it('Button Style is "secondary"', () => {
      expect(component.find(RequestButton).prop('secondary')).to.be.true;
    });

    it('Displays "Request for Onsite Use" as its text', () => {
      expect(component.find(RequestButton).render().text()).to.contain(
        'Request for Onsite Use',
      );
    });

    it('Redirects the user to the hold request page', () => {
      const url = component.find(RequestButton).prop('url');
      expect(url).to.include(`/hold/request/${bibId}-${item.id}`);
    });
  });
});
