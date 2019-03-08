import { Subject } from 'rxjs';
import { TUniqueBehaviorSubject } from 'rxjs-addons';
import { NotificationEventTypes } from './constants';

export interface INotificationService {
  connected$: TUniqueBehaviorSubject<boolean>;
  connected: boolean;
  event$: Subject<INotificationService.IEvent>;

  setup(): void;
}

export namespace INotificationService {
  export interface IEvent<T = any> {
    type: NotificationEventTypes;
    payload: T;
  }

  export interface IAccountDeviceEventPayload {
    accountAddress: string;
    deviceAddress: string;
  }

  export interface ISecureCodeEventPayload {
    code: string;
    signerAddress: string;
  }
}
