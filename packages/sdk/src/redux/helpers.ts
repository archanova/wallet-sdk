import { AnyAction, Reducer } from 'redux';
import { ReduxActionTypes } from './constants';

export function createActionCreator(type: ReduxActionTypes): (payload: any) => AnyAction {
  return (payload: any) => ({
    type,
    payload,
  });
}

export function createReducer(type: ReduxActionTypes): Reducer {
  return (state = null, action: AnyAction) => {
    switch (action.type) {
      case type:
        return action.payload;
      default:
        return state;
    }
  };
}
