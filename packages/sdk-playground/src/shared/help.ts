import { IHelp } from './interfaces';
import { BehaviorSubject } from 'rxjs';

const active$ = new BehaviorSubject<boolean>(false);
const stream$ = new BehaviorSubject<string>(null);

function show(alias: string): void {
  stream$.next(alias);
}

function hide(): void {
  stream$.next(null);
}

function toggle(): void {
  active$.next(!active$.value);
}

export const help: IHelp = {
  active$,
  stream$,
  show,
  hide,
  toggle,
};
