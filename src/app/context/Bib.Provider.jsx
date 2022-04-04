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
  children: PropTypes.elementType,
};

const useBib = () => {
  const context = useContext(BibContext);

  if (context === undefined) {
    throw new Error(`useBib must be used within a BibProvider`);
  }

  return context;
};

const useBibParallel = (field = '') => {
  const { bib, parallels = {} } = useBib();
  const hasParallels = !!Object.keys(parallels).length && !!parallels[field];

  // WIP
  // Possible constructs
  // return [[original, parallel], [original, paralle]]
  return {
    bib,
    hasParallels,
    field: bib[field],
    parallel: parallels[field],
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
        const field = key.slice('parallel'.length);
        const match = field.charAt(0).toLocaleLowerCase() + field.slice(1);

        return {
          ...store,
          [match]: { original: bib[match], paralell: bib[key] },
        };
      }

      return store;
    }, {}) || {}
  );
}
