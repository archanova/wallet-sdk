import { sdkConstants, sdkInterfaces } from '@archanova/sdk';
import React from 'react';
import { map } from 'rxjs/operators';
import { Spinner } from './components';
import { Actions, Screens } from './constants';
import { ContextComponent } from './context';
import { Help, DeployApp, DevelopApp, SetupAccount, SetupApp } from './screens';

interface IState {
  initialized: boolean;
  screen: Screens;
  exit: boolean;
}

export class Main extends ContextComponent<{}, IState> {
  public state: IState = {
    initialized: false,
    screen: null,
    exit: false,
  };

  public componentWillMount(): void {
    const { config: { showHelp } } = this.context;
    if (!showHelp) {
      this.wrapAsync(() => this.initialize());
    }
  }

  public componentDidUpdate(): void {
    const { exit } = this.state;
    if (exit) {
      process.exit(0);
    }
  }

  public render(): any {
    const { initialized, screen } = this.state;
    const { config: { showHelp } } = this.context;

    let content: React.ReactNode = null;

    if (showHelp) {
      content = <Help />;
    } else if (!initialized) {
      content = <Spinner padding={2}>Initializing SDK</Spinner>;
    } else {
      switch (screen) {
        case Screens.SetupAccount:
          content = <SetupAccount />;
          break;
        case Screens.SetupApp:
          content = <SetupApp />;
          break;
        case Screens.DevelopApp:
          content = <DevelopApp />;
          break;
        case Screens.DeployApp:
          content = <DeployApp />;
          break;
      }
    }

    return content;
  }

  private async initialize(): Promise<void> {
    const { config: { privateKey, action }, sdkService } = this.context;

    await sdkService
      .initialize({
        device: {
          privateKey,
        },
      });

    this.setState({ initialized: true }, () => {
      const { account$, app$ } = sdkService.state;

      const mapper = (account: sdkInterfaces.IAccount, app: any) => {
        let { screen, exit } = this.state;
        const hasAccount = account && account.type === sdkConstants.AccountTypes.Developer;
        const hasApp = !!app;

        if (!hasAccount) {
          screen = Screens.SetupAccount;
        } else {
          switch (action) {
            case null:
              screen = Screens.SetupAccount;
              exit = true;
              break;

            case Actions.Init:
              screen = Screens.SetupApp;
              exit = hasApp;
              break;

            case Actions.Develop:
              screen = hasApp ? Screens.DevelopApp : Screens.SetupApp;
              break;

            case Actions.Deploy:
              screen = hasApp ? Screens.DeployApp : Screens.SetupApp;
              break;
          }
        }

        return {
          screen,
          exit,
        };
      };

      account$
        .pipe(map(payload => mapper(payload, app$.value)))
        .subscribe(state => this.setState(state as any));

      app$
        .pipe(map(payload => mapper(account$.value, payload)))
        .subscribe(state => this.setState(state as any));

    });
  }
}
