import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { Middleware, Store } from 'redux';
import { Sdk } from '../Sdk';
import { ReduxSdkActionTypes } from './actions';
import { createActionCreator } from './helpers';

export function createReduxSdkMiddleware(sdk: Sdk): Middleware {
  const {
    initialized$,
    connected$,
    account$,
    accountBalance$,
    accountDevice$,
    device$,
    ens$,
    eth$,
    incomingAction$,
    session$,
  } = sdk.state;

  return (store: Store) => {
    setTimeout(
      () => {
        merge(
          initialized$.pipe(map(createActionCreator(ReduxSdkActionTypes.SetInitialized))),
          connected$.pipe(map(createActionCreator(ReduxSdkActionTypes.SetConnected))),
          account$.pipe(map(createActionCreator(ReduxSdkActionTypes.SetAccount))),
          accountDevice$.pipe(map(createActionCreator(ReduxSdkActionTypes.SetAccountDevice))),
          accountBalance$.pipe(map(createActionCreator(ReduxSdkActionTypes.SetAccountBalance))),
          device$.pipe(map(createActionCreator(ReduxSdkActionTypes.SetDevice))),
          ens$.pipe(map(createActionCreator(ReduxSdkActionTypes.SetEns))),
          eth$.pipe(map(createActionCreator(ReduxSdkActionTypes.SetEth))),
          incomingAction$.pipe(map(createActionCreator(ReduxSdkActionTypes.SetIncomingAction))),
          session$.pipe(
            map(session => !!session),
            map(createActionCreator(ReduxSdkActionTypes.SetAuthenticated)),
          ),
        )
          .subscribe(store.dispatch);
      },
      0,
    );

    return next => action => next(action);
  };
}