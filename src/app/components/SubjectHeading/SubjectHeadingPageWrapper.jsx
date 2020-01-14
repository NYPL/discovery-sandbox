import React, { useState } from 'react'
import PropTypes from 'prop-types';
import SubjectHeadingShow from './SubjectHeadingShow';
import SubjectHeadingsContainer from './SubjectHeadingsContainer';
import SubjectHeadingSearch from './Search/SubjectHeadingSearch';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import DocumentTitle from 'react-document-title';
// import Store from '../../stores/Store';

const SubjectHeadingPageWrapper = (props) => {
  const {
    location: {
      query,
      query: {
        filter,
      },
    },
    params: {
      subjectHeadingUuid,
    }
  } = props;

  const containerKey = Object.keys(query)
    .map(key => `${key}=${query[key]}`)
    .join('&');

  const [label, setLabel] = useState('');

  return (
    <DocumentTitle title="Subject Headings">
      <main className="main-page">
        <div className="nypl-page-header">
          <div className="nypl-full-width-wrapper filter-page">
            <div className="nypl-row">
              <div className="nypl-column-full">
                <Breadcrumbs type="subjectHeading" headingDetails={!!subjectHeadingUuid}/>
                <h1>
                    { subjectHeadingUuid
                      ? label
                      : ['Subject Headings ', filter ? <span key='bannerText'>containing <em>{filter}</em></span>: '']
                    }
                </h1>
                
              </div>
            </div>
          </div>
        </div>
              {subjectHeadingUuid ?
                <SubjectHeadingShow
                  {...props}
                  key={subjectHeadingUuid}
                  setBannerText={setLabel}
                />
                :
                <SubjectHeadingsContainer {...props} key={containerKey} />
              }
      </main>
    </DocumentTitle>
  );
};

export default SubjectHeadingPageWrapper;
