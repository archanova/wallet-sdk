import { combineReducers } from 'redux';
import { ReduxActionTypes } from './constants';
import { createReducer } from './helpers';

export const reduxReducer = combineReducers({
  account: createReducer(ReduxActionTypes.SetAccount),
  accountBalance: createReducer(ReduxActionTypes.SetAccountBalance),
  accountDevice: createReducer(ReduxActionTypes.SetAccountDevice),
  device: createReducer(ReduxActionTypes.SetDevice),
  networkVersion: createReducer(ReduxActionTypes.SetNetworkVersion),
  initialized: createReducer(ReduxActionTypes.SetInitialized),
  authenticated: createReducer(ReduxActionTypes.SetAuthenticated),
  connected: createReducer(ReduxActionTypes.SetConnected),
  incomingAction: createReducer(ReduxActionTypes.SetIncomingAction),
}) as any;
