export const SET_SDK_SETUP_COMPLETED = 'SET_SDK_SETUP_COMPLETED';
export const SET_SDK_SECURE_CODE_URL = 'SET_SDK_SECURE_CODE_URL';

export function setSdkSetupCompleted() {
  return {
    type: SET_SDK_SETUP_COMPLETED,
  };
}

export function setSdkSecureCodeUrl(payload) {
  return {
    type: SET_SDK_SECURE_CODE_URL,
    payload,
  };
}

export function createSdkAccount() {
  return (dispatch, getState, sdk) => {
    sdk
      .createAccount()
      .catch(console.error);
  };
}

export function createSdkSecureUrl() {
  return (dispatch, getState, sdk) => {
    dispatch(setSdkSecureCodeUrl('test'));
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

