import { Subject } from 'rxjs';

export interface IAction<T = any> {
  type: number;
  payload: T;
  timestamp: number;
}

export interface IActionService {
  $incoming: Subject<IAction>;

  $accepted: Subject<IAction>;

  acceptAction(action: IAction): void;
}
