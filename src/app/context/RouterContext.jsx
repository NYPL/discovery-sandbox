import PropTypes from 'prop-types';
import React from 'react';

// Create a React context and provider meant for using
// React Router's own context values.
export const RouterContext = React.createContext(null);
export const RouterProvider = ({ children, value }) => {
  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  );
};

RouterProvider.propTypes = {
  children: PropTypes.node,
  value: PropTypes.object,
};
