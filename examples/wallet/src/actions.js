export const SET_SDK_ACCOUNTS = 'SET_SDK_ACCOUNTS';
export const SET_TOP_UP_SDK_ACCOUNT_RECEIPT = 'SET_SDK_TOP_UP_ACCOUNT_RECEIPT';

export function setSdkAccounts(payload) {
  return {
    type: SET_SDK_ACCOUNTS,
    payload,
  };
}

export function setTopUpSdkAccountReceipt(payload) {
  return {
    type: SET_TOP_UP_SDK_ACCOUNT_RECEIPT,
    payload,
  };
}

export function initializeSdk() {
  return (dispatch, getState, sdk) => {
    sdk
      .initialize()
      .catch(console.error);
  };
}

export function resetSdk() {
  return (dispatch, getState, sdk) => {
    sdk
      .reset()
      .catch(console.error);
  };
}

export function createSdkAccount(ensLabel = null) {
  return (dispatch, getState, sdk) => {
    sdk
      .createAccount(ensLabel)
      .catch(console.error);
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

export function topUpSdkAccount() {
  return (dispatch, getState, sdk) => {
    sdk
      .topUpAccount()
      .then(receipt => dispatch(setTopUpSdkAccountReceipt(receipt)))
      .catch(console.error);
  };
}
