import React from 'react';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ObjectInspector } from 'react-inspector';
import { ContextComponent, ILoggerEvent } from '../shared';
import styles from './Footer.module.scss';

interface IState {
  events: ILoggerEvent[];
}

export default class Footer extends ContextComponent<{}, IState> {
  public state = {
    events: [],
  };

  private subscription: Subscription;

  public componentWillMount(): void {
    this.subscription = this
      .logger
      .stream$
      .pipe(
        filter(event => !!event),
      )
      .subscribe((event) => {
        const { events } = this.state;

        this.setState({
          events: [
            event,
            ...events,
          ],
        });
      });
  }

  public componentWillUnmount(): void {
    this.subscription.unsubscribe();
  }

  public render() {
    const { events } = this.state;
    return !events.length ? null : (
      <div className={styles.content}>
        {events.map(({ id, args }) => {
          return (
            <div key={`${id}`}>
              {args.map((arg, index) => (
                <ObjectInspector
                  key={`${id}_${index}`}
                  data={arg}
                />
              ))}
            </div>
          );
        })}
      </div>
    );
  }
}
