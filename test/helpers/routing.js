import { stub } from 'sinon';
import PropTypes from 'prop-types';

const mockRouter = push => ({
  push,
  createHref: stub(),
  replace: stub(),
  go: stub(),
  goBack: stub(),
  goForward: stub(),
  setRouteLeaveHook: stub(),
  isActive: stub(),
  location: {
    query: {},
    pathname: '',
  },
  routes: [
    { component: { name: 'default' } },
  ],
});

const mockRouterContext = (push = stub()) => ({
  router: mockRouter(push),
});

mockRouter.propTypes = {
  push: PropTypes.func,
  createHref: PropTypes.func,
  replace: PropTypes.func,
  go: PropTypes.func,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  setRouteLeaveHook: PropTypes.func,
  isActive: PropTypes.func,
  location: PropTypes.objectOf(PropTypes.any),
  routes: PropTypes.obj,
};

mockRouterContext.propTyps = {
  router: PropTypes.func,
};

export { mockRouter, mockRouterContext };
