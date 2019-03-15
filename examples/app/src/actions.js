export const SET_REQUEST_ADD_SDK_ACCOUNT_DEVICE_URLS = 'SET_REQUEST_ADD_SDK_ACCOUNT_DEVICE_URLS';

export function setRequestAddSdkAccountDeviceUrls(payload) {
  return {
    type: SET_REQUEST_ADD_SDK_ACCOUNT_DEVICE_URLS,
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

export function generateRequestAddSdkAccountDeviceUrls() {
  return (dispatch, getState, sdk) => {

    const redirect = sdk.createRequestAddAccountDeviceUrl({
      endpoint: 'http://localhost:5100',
      callbackEndpoint: 'http://localhost:5200',
    });

    const qrCode = sdk.createRequestAddAccountDeviceUrl();

    dispatch(
      setRequestAddSdkAccountDeviceUrls({
        redirect,
        qrCode,
      }),
    );
  };
}
