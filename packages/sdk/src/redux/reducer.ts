import { combineReducers } from 'redux';
import { ReduxActionTypes } from './constants';
import { createReducer } from './helpers';

export const reduxReducer = combineReducers({
  account: createReducer(ReduxActionTypes.SetAccount),
  accountBalance: createReducer(ReduxActionTypes.SetAccountBalance),
  accountDevice: createReducer(ReduxActionTypes.SetAccountDevice),
  device: createReducer(ReduxActionTypes.SetDevice),
  faucet: createReducer(ReduxActionTypes.SetFaucet),
  network: createReducer(ReduxActionTypes.SetNetwork),
  completed: createReducer(ReduxActionTypes.SetCompleted),
  ready: createReducer(ReduxActionTypes.SetReady),
  online: createReducer(ReduxActionTypes.SetOnline),
}) as any;
