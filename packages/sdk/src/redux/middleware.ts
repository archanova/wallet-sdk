import { Store, Middleware } from 'redux';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { ISdk } from '../interfaces';
import { ReduxActionTypes } from './constants';
import { createActionCreator } from './helpers';

export function createReduxMiddleware(sdk: ISdk): Middleware {
  return (store: Store) => {
    setTimeout(
      () => {
        const { state } = sdk;

        merge(
          state.account$.pipe(map(createActionCreator(ReduxActionTypes.SetAccount))),
          state.accountDevice$.pipe(map(createActionCreator(ReduxActionTypes.SetAccountDevice))),
          state.accountBalance$.pipe(map(createActionCreator(ReduxActionTypes.SetAccountBalance))),
          state.device$.pipe(map(createActionCreator(ReduxActionTypes.SetDevice))),
          state.faucet$.pipe(map(createActionCreator(ReduxActionTypes.SetFaucet))),
          state.network$.pipe(map(createActionCreator(ReduxActionTypes.SetNetwork))),
          state.completed$.pipe(map(createActionCreator(ReduxActionTypes.SetCompleted))),
          state.ready$.pipe(map(createActionCreator(ReduxActionTypes.SetReady))),
          state.online$.pipe(map(createActionCreator(ReduxActionTypes.SetOnline))),
        )
          .subscribe(store.dispatch);
      },
      0,
    );

    return next => action => next(action);
  };
}
