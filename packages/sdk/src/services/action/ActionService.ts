import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IAction, IActionService } from './interfaces';
import { ActionTypes } from './constants';

export class ActionService implements IActionService {
  public $incoming = new BehaviorSubject<IAction>(null);
  public $accepted = new Subject<IAction>();

  constructor(private options: IActionService.IOptions = {}) {
    //
  }

  public setup(): void {
    const { autoAccept } = this.options;

    if (autoAccept) {
      this
        .$incoming
        .pipe(
          filter(action => !!action),
        )
        .subscribe(this.$accepted);
    }
  }

  public acceptAction(action: IAction = null): void {
    if (!action) {
      action = this.$incoming.getValue();
      if (action) {
        this.$incoming.next(null);
      }
    }
    if (action) {
      this.$accepted.next(action);
    }
  }

  public dismissAction(): void {
    this.$incoming.next(null);
    this.$accepted.next(null);
  }

  public createAction<T = any>(type: ActionTypes, payload: T): IAction<T> {
    return {
      type,
      payload,
      timestamp: Date.now(),
    };
  }

  public ofType<T = any>(type: ActionTypes): Observable<T> {
    return this
      .$accepted
      .pipe(
        filter((action: IAction<T>) => (
          action &&
          typeof action === 'object' &&
          action.payload &&
          action.type === type
        )),
        map(({ payload }) => payload),
      );
  }
}
