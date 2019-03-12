import { Subject } from 'rxjs';
import { IAction } from '../action';

export interface IUrlService {
  incoming$: Subject<string>;
  outgoing$: Subject<string>;

  openActionUrl(action: IAction, endpoint?: string): void;
}

export namespace IUrlService {
  export interface IOptions {
    listener?: (callback: (url: string) => any) => any;
    opener?: (url: string) => any;
  }
}
