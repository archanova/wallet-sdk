import { combineReducers } from 'redux';
import { ReduxActionTypes } from './constants';
import { createReducer } from './helpers';

export const reduxReducer = combineReducers({
  account: createReducer(ReduxActionTypes.SetAccount),
  accountBalance: createReducer(ReduxActionTypes.SetAccountBalance),
  accountDevice: createReducer(ReduxActionTypes.SetAccountDevice),
  device: createReducer(ReduxActionTypes.SetDevice),
}) as any;
