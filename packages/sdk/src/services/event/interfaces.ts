import { Observable, Subject } from 'rxjs';
import { EventTypes } from './constants';

export interface IEventService {
  $incoming: Subject<IEvent>;

  setup(): void;

  ofType<T = any>(type: EventTypes): Observable<T>;
}

export interface IEvent<T = any> {
  type: EventTypes;
  payload: T;
}
