import { combineReducers } from 'redux';
import { reduxReducer as sdk, ReduxActionTypes } from '@archanova/wallet-sdk';
import {
  SET_REQUEST_ADD_SDK_ACCOUNT_DEVICE_URLS,
} from './actions';

function requestAddSdkAccountDeviceUrls(state = null, { type, payload }) {
  switch (type) {
    case SET_REQUEST_ADD_SDK_ACCOUNT_DEVICE_URLS:
      return payload;

    case ReduxActionTypes.SetAccount:
      return null;

    default:
      return state;
  }
}


export default combineReducers({
  sdk,
  requestAddSdkAccountDeviceUrls,
});
