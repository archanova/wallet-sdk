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
        const { state, actionService } = sdk;

        merge(
          state.account$.pipe(map(createActionCreator(ReduxActionTypes.SetAccount))),
          state.accountDevice$.pipe(map(createActionCreator(ReduxActionTypes.SetAccountDevice))),
          state.accountBalance$.pipe(map(createActionCreator(ReduxActionTypes.SetAccountBalance))),
          state.device$.pipe(map(createActionCreator(ReduxActionTypes.SetDevice))),
          state.networkVersion$.pipe(map(createActionCreator(ReduxActionTypes.SetNetworkVersion))),
          state.initialized$.pipe(map(createActionCreator(ReduxActionTypes.SetInitialized))),
          state.authenticated$.pipe(map(createActionCreator(ReduxActionTypes.SetAuthenticated))),
          state.connected$.pipe(map(createActionCreator(ReduxActionTypes.SetConnected))),
          actionService.$incoming.pipe(map(createActionCreator(ReduxActionTypes.SetIncomingAction))),
        )
          .subscribe(store.dispatch);
      },
      0,
    );

    return next => action => next(action);
  };
}
