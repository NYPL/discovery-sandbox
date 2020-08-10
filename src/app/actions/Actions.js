export const Actions = {
  APP_CONFIG: 'APP_CONFIG',
};

export const setAppConfig = data => ({
  type: Actions.APP_CONFIG,
  appConfig: data,
});

export default {
  setAppConfig,
};
