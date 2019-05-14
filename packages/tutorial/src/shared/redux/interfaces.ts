import { ISdkReduxState } from '@archanova/sdk';
import { Screens } from '../constants';

export interface IState {
  sdk: ISdkReduxState;
  screen: Screens;
}

export interface IAction<T = any> {
  type: string;
  payload: T;
}
