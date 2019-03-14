import { filter, map } from 'rxjs/operators';
import { UniqueBehaviorSubject } from 'rxjs-addons';
import { IAction, IActionService } from '../action';
import { IUrlService } from './interfaces';
import { actionToUrl, urlToAction } from './helpers';
import { URL_DEFAULT_ENDPOINT } from './constants';

export class UrlService implements IUrlService {

  public incoming$ = new UniqueBehaviorSubject<string>(null);
  public outgoing$ = new UniqueBehaviorSubject<string>(null);

  constructor(
    private options: IUrlService.IOptions = {},
    actionService: IActionService,
  ) {
    this
      .incoming$
      .pipe(
        map(url => urlToAction(url)),
        filter(action => !!action),
      )
      .subscribe(actionService.$incoming);

    this
      .incoming$
      .subscribe(console.log);

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

  public buildActionUrl(action: IAction, endpoint = null): string {
    if (!endpoint) {
      endpoint = this.options.endpoint || URL_DEFAULT_ENDPOINT;
    }

    return actionToUrl(action, endpoint);
  }

  public openActionUrl(action: IAction, endpoint = null): void {
    this.outgoing$.next(this.buildActionUrl(action, endpoint));
  }
}
