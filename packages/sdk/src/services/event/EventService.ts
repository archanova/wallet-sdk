import { EMPTY, Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IState } from '../../state';
import { IApiService } from '../api';
import { IEventService, IEvent } from './interfaces';
import { EventTypes } from './constants';

export class EventService implements IEventService {

  public $incoming: Subject<IEvent> = null;

  constructor(
    private state: IState,
    private apiService: IApiService,
  ) {
    //
  }

  public setup(): void {
    const { connected$, message$ } = this.apiService.buildWsSubjects();

    connected$
      .subscribe(this.state.connected$);

    this.$incoming = message$;
  }

  public ofType<T = any>(type: EventTypes): Observable<T> {
    return !this.$incoming
      ? EMPTY
      : this.$incoming.pipe(
        filter((event: IEvent<T>) => (
          event &&
          typeof event === 'object' &&
          event.payload &&
          event.type === type
        )),
        map(({ payload }) => payload),
      );
  }
}
