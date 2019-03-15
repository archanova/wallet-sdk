import { combineReducers } from 'redux';
import { reduxReducer as sdk, ReduxActionTypes } from '@archanova/wallet-sdk';
import {
  SET_SDK_ACCOUNTS,
  SET_TOP_UP_SDK_ACCOUNT_RECEIPT,
} from './actions';

function sdkAccounts(state = null, { type, payload }) {
  switch (type) {
    case SET_SDK_ACCOUNTS:
      return payload;

    case ReduxActionTypes.SetAccount:
      return null;

    default:
      return state;
  }
}

function topUpSdkAccountReceipt(state = null, { type, payload }) {
  switch (type) {
    case SET_TOP_UP_SDK_ACCOUNT_RECEIPT:
      return payload;

    case ReduxActionTypes.SetAccount:
      return null;

    default:
      return state;
  }
}

export default combineReducers({
  sdk,
  sdkAccounts,
  topUpSdkAccountReceipt,
});
