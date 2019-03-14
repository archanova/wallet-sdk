import { combineReducers } from 'redux';
import { reduxReducer as sdk, ReduxActionTypes } from '@archanova/wallet-sdk';
import { SET_SDK_ACCOUNTS } from './actions';

function sdkAccounts(state = null, {type, payload}) {
  switch (type) {
    case SET_SDK_ACCOUNTS:
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
});
