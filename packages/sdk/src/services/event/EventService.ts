import { EMPTY, Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IApi } from '../../api';
import { IState } from '../../state';
import { IEventService, IEvent } from './interfaces';
import { EventTypes } from './constants';

export class EventService implements IEventService {

  public $incoming: Subject<IEvent> = null;

  constructor(
    private api: IApi,
    private state: IState,
  ) {
    //
  }

  public setup(): void {
    const { connected$, message$ } = this.api.buildWsSubjects();

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
