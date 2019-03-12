import { Subject } from 'rxjs';
import { IAction, IActionService } from './interfaces';

export class ActionService implements IActionService {
  public $incoming = new Subject<IAction>();
  public $accepted = new Subject<IAction>();

  public acceptAction(action: IAction): void {
    this.$accepted.next(action);
  }
}
