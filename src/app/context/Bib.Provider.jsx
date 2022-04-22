import PropTypes from 'prop-types';
import React, { useContext, useMemo } from 'react';
import BibContext from './Bib.Context';

const BibProvider = ({ bib, children }) => {
  // This is pointless due to redux.
  // The redux store bib is updated on the bib page
  // With an entirley new object. This causes a rerender
  // with a new bib which causes useMemo to be re-executed.
  // TODO: Would useState be better here?
  // Do we care about a single rerender?
  // As of now there are only two renders.
  const parallels = useMemo(() => extractParallels(bib), [bib]);

  const bibId = bib['@id'] ? bib['@id'].substring(4) : '';

  return (
    <BibContext.Provider value={{ bib, parallels, bibId }}>
      {children}
    </BibContext.Provider>
  );
};

BibProvider.propTypes = {
  bib: PropTypes.object,
  children: PropTypes.node,
};

const useBib = () => {
  const context = useContext(BibContext);

  if (context === undefined) {
    throw new Error(`useBib must be used within a BibProvider`);
  }

  return context;
};

const useBibParallel = (field = '') => {
  const { parallels = {}, ...rest } = useBib();

  return {
    ...rest,
    parallel: (parallels[field] && parallels[field].mapping) || undefined,
    parallels,
  };
};

const WithBib = (Component) => {
  return function WithBib(props) {
    return (
      <BibProvider>
        <Component {...props} />
      </BibProvider>
    );
  };
};

export { useBib, useBibParallel, BibProvider, WithBib };

export default BibProvider;

function extractParallels(bib) {
  return (
    Object.keys(bib).reduce((store, key) => {
      if (key.includes('parallel')) {
        const field = matchField(key);

        // If parallel but no none parallel (original) match
        if (!bib[field]) return store;

        const mapping = bib[field]
          .reduce((acc, curr, idx) => {
            const og = curr;
            const pa = bib[key][idx];
            // @seanredmond would like the parallel to show up first
            // https://jira.nypl.org/browse/SCC-2915?focusedCommentId=68727&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-68727
            acc.push([pa, og]); // Set a 2D array
            return acc;
          }, [])
          .filter(Boolean);

        return {
          ...store,
          [field]: {
            mapping,
            original: bib[field],
            parallel: bib[key],
          },
        };
      }

      return store;
    }, {}) || {}
  );

  function matchField(key) {
    const field = key.slice('parallel'.length);
    const match = field.charAt(0).toLocaleLowerCase() + field.slice(1);
    return match;
  }
}
