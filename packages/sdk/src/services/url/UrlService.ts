import { filter, map } from 'rxjs/operators';
import { UniqueBehaviorSubject } from 'rxjs-addons';
import { IAction, IActionService } from '../action';
import { IUrlService } from './interfaces';
import { actionToUrl, urlToAction } from './helpers';
import { URL_DEFAULT_ENDPOINT } from './constants';

export class UrlService implements IUrlService {

  public incoming$ = new UniqueBehaviorSubject<string>(null);

  constructor(
    private options: IUrlService.IOptions,
    private actionService: IActionService,
  ) {
    //
  }

  public setup(): void {
    this
      .incoming$
      .pipe(
        map(url => urlToAction(url)),
        filter(action => !!action),
      )
      .subscribe(this.actionService.$incoming);

    const { listener } = this.options;

    if (listener) {
      listener(url => this.incoming$.next(url || null));
    }
  }

  public buildActionUrl(action: IAction, endpoint = null): string {
    if (!endpoint) {
      endpoint = this.options.endpoint || URL_DEFAULT_ENDPOINT;
    }

    return actionToUrl(action, endpoint);
  }
}
