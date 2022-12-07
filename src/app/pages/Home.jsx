import React from 'react';
import PropTypes from 'prop-types';

import { Heading, Link } from '@nypl/design-system-react-components';

import Search from '../components/Search/Search';
import Notification from '../components/Notification/Notification';
import SccContainer from '../components/SccContainer/SccContainer';

import { basicQuery, trackDiscovery } from '../utils/utils';

const Home = (props, context) => (
  <SccContainer className='home' activeSection='search'>
    <div className='research-search'>
      <div className='research-search__inner-content'>
        <Search createAPIQuery={basicQuery(props)} router={context.router} />
      </div>
    </div>

    <Notification notificationType='searchResultsNotification' />
    <Heading level='two'>
      Explore the Library's Vast Research Collections & More
    </Heading>
    <div className='nypl-column-full'>
      <p>
        Discover millions of items from The New York Public Library's Stephen A.
        Schwarzman Building, Schomburg Center for Research in Black Culture, and
        The New York Public Library for the Performing Arts. Plus, access
        materials from library collections at Columbia University, Harvard
        University, and Princeton University.{' '}
        <Link href='https://www.nypl.org/research/collections/about/shared-collection-catalog'>
          Learn more.
        </Link>
      </p>
      <p>
        Please note that the Research Catalog does not include circulating
        materials. For books and more that you can check out to take home please
        visit our{' '}
        <Link href='https://browse.nypl.org'>circulating branch catalog.</Link>{' '}
        The{' '}
        <Link href='https://legacycatalog.nypl.org/'>
          legacy research catalog
        </Link>{' '}
        is still available, but does not include all of our Scan & Deliver
        options or the Columbia University, Harvard University, and Princeton
        University material from the Shared Collection.
      </p>
    </div>
    <div>
      <Heading level='three'>Research at NYPL</Heading>

      <div className='nypl-row nypl-quarter-image'>
        <div className='nypl-column-one-quarter'>
          <img
            className='nypl-quarter-image'
            src='https://cdn-petrol.nypl.org/sites/default/media/styles/extralarge/public/archives-portal.jpg?itok=-oYtHmeO'
            alt=''
            role='presentation'
          />
        </div>
        <div className='nypl-column-three-quarters image-column-three-quarters'>
          <Heading level='four'>
            <a
              href='/research/collections'
              onClick={() => trackDiscovery('Research Links', 'Collections')}
            >
              Collections
            </a>
          </Heading>
          <p>
            Discover our world-renowned research collections, featuring more
            than 46 million items.
          </p>
        </div>
      </div>

      <div className='nypl-row nypl-quarter-image'>
        <div className='nypl-column-one-quarter'>
          <img
            className='nypl-quarter-image'
            src='https://cdn-petrol.nypl.org/sites/default/media/styles/extralarge/public/sasb.jpg?itok=sdQBITR7'
            alt=''
            role='presentation'
          />
        </div>
        <div className='nypl-column-three-quarters image-column-three-quarters'>
          <Heading level='four'>
            <a
              href='/locations/map?libraries=research'
              onClick={() => trackDiscovery('Research Links', 'Locations')}
            >
              Locations
            </a>
          </Heading>
          <p>
            Access items, one-on-one reference help, and dedicated research
            study rooms.
          </p>
        </div>
      </div>

      <div className='nypl-row nypl-quarter-image'>
        <div className='nypl-column-one-quarter'>
          <img
            className='nypl-quarter-image'
            src='https://cdn-petrol.nypl.org/sites/default/media/styles/extralarge/public/divisions.jpg?itok=O4uSedcp'
            alt=''
            role='presentation'
          />
        </div>
        <div className='nypl-column-three-quarters image-column-three-quarters'>
          <Heading level='four'>
            <a
              href='/about/divisions'
              onClick={() => trackDiscovery('Research Links', 'Divisions')}
            >
              Divisions
            </a>
          </Heading>
          <p>
            Learn about the subject and media specializations of our research
            divisions.
          </p>
        </div>
      </div>

      <div className='nypl-row nypl-quarter-image'>
        <div className='nypl-column-one-quarter'>
          <img
            className='nypl-quarter-image'
            src='https://cdn-petrol.nypl.org/sites/default/media/styles/extralarge/public/plan-you-visit.jpg?itok=scG6cFgy'
            alt=''
            role='presentation'
          />
        </div>
        <div className='nypl-column-three-quarters image-column-three-quarters'>
          <Heading level='four'>
            <a
              href='/research/support'
              onClick={() => trackDiscovery('Research Links', 'Support')}
            >
              Support
            </a>
          </Heading>
          <p>
            Plan your in-person research visit and discover resources for
            scholars and writers.
          </p>
        </div>
      </div>

      <div className='nypl-row nypl-quarter-image'>
        <div className='nypl-column-one-quarter'>
          <img
            className='nypl-quarter-image'
            src='https://cdn-petrol.nypl.org/sites/default/media/styles/extralarge/public/research-services.jpg?itok=rSo9t1VF'
            alt=''
            role='presentation'
          />
        </div>
        <div className='nypl-column-three-quarters image-column-three-quarters'>
          <Heading level='four'>
            <a
              href='/research/services'
              onClick={() => trackDiscovery('Research Links', 'Services')}
            >
              Services
            </a>
          </Heading>
          <p>
            Explore services for online and remote researchers, as well as our
            interlibrary services.
          </p>
        </div>
      </div>
    </div>
  </SccContainer>
);

Home.contextTypes = {
  router: PropTypes.object,
};

export default Home;
