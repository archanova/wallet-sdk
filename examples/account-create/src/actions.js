export const SET_SDK_SETUP_COMPLETED = 'SET_SDK_SETUP_COMPLETED';

export function setSdkSetupCompleted() {
  return {
    type: SET_SDK_SETUP_COMPLETED,
  };
}

export function createSdkAccount() {
  return (dispatch, getState, sdk) => {
    sdk
      .accountProviderService
      .createAccount()
      .catch(console.error);
  };
}

export function sdkSetup() {
  return (dispatch, getState, sdk) => {
    sdk
      .setup()
      .then(() => dispatch(setSdkSetupCompleted()))
      .catch(console.error);
  };
}

