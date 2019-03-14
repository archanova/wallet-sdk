import { Subject } from 'rxjs';
import { IAction } from '../action';

export interface IUrlService {
  incoming$: Subject<string>;

  setup(): void;

  buildActionUrl(action: IAction, endpoint?: string): string;
}

export namespace IUrlService {
  export interface IOptions {
    endpoint?: string;
    listener?: (callback: (url: string) => any) => any;
  }
}
