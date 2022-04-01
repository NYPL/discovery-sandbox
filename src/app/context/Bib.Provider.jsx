import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import BibContext from './Bib.Context';

const BibProvider = ({ bib, children }) => {
  return <BibContext.Provider value={bib}>{children}</BibContext.Provider>;
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
  // WIP
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
