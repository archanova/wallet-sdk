export const SET_SDK_ACCOUNTS = 'SET_SDK_ACCOUNTS';

export function initializeSdk() {
  return (dispatch, getState, sdk) => {
    sdk
      .initialize()
      .catch(console.error);
  };
}

export function resetSdk() {
  return (dispatch, getState, sdk) => {
    sdk.reset();
  };
}

export function createSdkAccount(ensLabel = null) {
  return (dispatch, getState, sdk) => {
    sdk
      .createAccount(ensLabel)
      .catch(console.error);
  };
}


export function setSdkAccounts(payload) {
  return {
    type: SET_SDK_ACCOUNTS,
    payload,
  };
}

export function fetchSdkAccounts() {
  return (dispatch, getState, sdk) => {
    sdk
      .getAccounts()
      .then(accounts => dispatch(setSdkAccounts(accounts)))
      .catch(console.error);
  };
}

export function connectSdkAccount(accountAddress) {
  return (dispatch, getState, sdk) => {
    sdk
      .connectAccount(accountAddress)
      .catch(console.error);
  };
}
