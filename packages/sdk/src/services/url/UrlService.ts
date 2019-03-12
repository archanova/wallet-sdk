import { jsonReplacer, jsonReviver } from '@netgum/utils';
import { filter, map } from 'rxjs/operators';
import { UniqueBehaviorSubject } from 'rxjs-addons';
import { IAction, IActionService } from '../action';
import { IUrlService } from './interfaces';

export class UrlService implements IUrlService {
  public static QUERY_FIELD_NAME = 'sdkQuery';

  private static urlToAction(url: string): IAction {
    let result: IAction = null;

    if (url) {
      try {
        let [, raw] = url.split(`${this.QUERY_FIELD_NAME}=`);
        [raw] = raw.split('&');

        if (raw) {
          const action: IAction = JSON.parse(decodeURIComponent(raw), jsonReviver);
          if (
            action.type &&
            action.payload &&
            action.timestamp
          ) {
            result = action;
          }
        }

      } catch (err) {
        result = null;
      }
    }

    return result;
  }

  private static actionToUrl(action: IAction, endpoint: string): string {
    let result: string = null;

    if (action && endpoint) {
      try {
        result = endpoint;
        if (result.includes('?')) {
          if (!result.endsWith('?')) {
            result = `${result}&`;
          }
        } else {
          result = `${result}?`;
        }

        result = `${result}${this.QUERY_FIELD_NAME}=${encodeURIComponent(JSON.stringify(action, jsonReplacer))}`;
      } catch (err) {
        result = null;
      }
    }

    return result;
  }

  public incoming$ = new UniqueBehaviorSubject<string>(null);
  public outgoing$ = new UniqueBehaviorSubject<string>(null);

  constructor(
    actionService: IActionService,
    options: IUrlService.IOptions = {},
  ) {
    this
      .incoming$
      .pipe(
        map(url => UrlService.urlToAction(url)),
        filter(action => !!action),
      )
      .subscribe(actionService.$incoming);

    const { listener, opener } = options;

    if (listener) {
      listener(url => this.incoming$.next(url || null));
    }

    if (opener) {
      this
        .outgoing$
        .pipe(
          filter(url => !!url),
        )
        .subscribe(opener);
    }
  }

  public openActionUrl(action: IAction, endpoint = '://'): void {
    const url = UrlService.actionToUrl(action, endpoint);
    this.outgoing$.next(url);
  }
}
