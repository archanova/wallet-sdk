import { combineReducers } from 'redux';
import { reduxReducer as sdk } from '@archanova/wallet-sdk';
import { SET_SDK_SETUP_COMPLETED } from './actions';

function sdkSetupCompleted(state = false, action) {
  switch (action.type) {
    case SET_SDK_SETUP_COMPLETED:
      return true;

    default:
      return state;
  }
}

export default combineReducers({
  sdk,
  sdkSetupCompleted,
});
