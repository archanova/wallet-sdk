import { Observable, Subject } from 'rxjs';
import { ActionTypes } from './constants';

export interface IAction<T = any> {
  type: ActionTypes;
  payload: T;
  timestamp: number;
}

export interface IActionService {
  $incoming: Subject<IAction>;

  $accepted: Subject<IAction>;

  acceptAction(action: IAction): void;

  createAction<T = any>(type: ActionTypes, payload: T): IAction<T>;

  ofType<T = any>(type: ActionTypes): Observable<T>;
}
