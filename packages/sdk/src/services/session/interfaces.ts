import { TUniqueBehaviorSubject } from 'rxjs-addons';

export interface ISessionService {
  readonly ready$: TUniqueBehaviorSubject<boolean>;
  readonly ready: boolean;

  create(): Promise<void>;

  reset(): Promise<void>;
}
