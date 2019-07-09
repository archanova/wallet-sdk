import React from 'react';
import { Subscription } from 'rxjs';
import styles from './Menu.module.scss';
import { ContextComponent } from '../shared';
import { HelpTrigger } from './HelpTrigger';
import { MenuOption } from './MenuOption';

interface IProps {
  items: {
    header: string;
    alwaysOpen?: boolean;
    screens: string[];
  }[];
  enabledScreens: { [key: string]: boolean };
  activeScreen: string;
  openScreen: (screen: string) => any;
}

interface IState {
  showHelps: boolean;
  autoInitializeSdk: boolean;
  autoAcceptSdkActions: boolean;
  activeIndex: number;
}

export class Menu extends ContextComponent<IProps, IState> {
  public state: IState = {
    showHelps: true,
    autoInitializeSdk: true,
    autoAcceptSdkActions: true,
    activeIndex: -1,
  };

  private subscriptions: Subscription[] = [];

  public componentWillMount(): void {
    this.subscriptions = [
      this
        .config
        .showHelp$
        .subscribe(showHelps => this.setState({
          showHelps,
        })),
    ];

    this.setState({
      showHelps: this.context.config.showHelp,
    });

    this.setState({
      autoInitializeSdk: this.context.config.autoInitializeSdk,
    });

    this.setState({
      autoAcceptSdkActions: this.context.config.autoAcceptSdkActions,
    });

    this.toggleShowHelp = this.toggleShowHelp.bind(this);
    this.toggleAutoInitializeSdk = this.toggleAutoInitializeSdk.bind(this);
    this.toggleAutoAcceptSdkActions = this.toggleAutoAcceptSdkActions.bind(this);
  }

  public componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any): void {
    this.setState({
      activeIndex: -1,
    });
  }

  public componentWillUnmount(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public render(): any {
    const { items, activeScreen, enabledScreens } = this.props;
    const { showHelps, autoAcceptSdkActions, autoInitializeSdk, activeIndex } = this.state;

    return (
      <div className={styles.content}>
        <div className={styles.wrapper}>
          {items.map(({ screens, header, alwaysOpen }, index) => {
            const isOpen = alwaysOpen || activeIndex === index || !!screens.find(screen => activeScreen === screen);
            return (
              <div key={`${index}`}>
                <h4 onClick={this.createOpenSection(index)}>{header.toUpperCase()}</h4>
                {!isOpen ? null : (
                  <div>
                    {screens.map((screen, subIndex) => {
                      const classNames: string[] = [];
                      if (activeScreen === screen) {
                        classNames.push(styles.active);
                      }
                      if (!enabledScreens[screen]) {
                        classNames.push(styles.off);
                      }

                      const helpAlias = screen
                        .replace(/([ -][a-z])/ig, found => found.replace('-', '').trim().toUpperCase());

                      return (
                        <HelpTrigger
                          key={`${index}_${subIndex}`}
                          alias={`menu.${helpAlias}`}
                        >
                          <button
                            onClick={this.createOnClickHandler(screen)}
                            title={screen}
                            className={classNames.join(' ')}
                          >
                            {screen}
                          </button>
                        </HelpTrigger>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className={styles.options}>
            <h4>SETTINGS</h4>
            {!this.config.activateHelp ? null : (
              <MenuOption checked={showHelps} onToggle={this.toggleShowHelp}>show help messages</MenuOption>
            )}
            <MenuOption checked={autoInitializeSdk} onToggle={this.toggleAutoInitializeSdk}>auto initialize sdk</MenuOption>
            <MenuOption checked={autoAcceptSdkActions} onToggle={this.toggleAutoAcceptSdkActions}>auto accept sdk actions</MenuOption>
          </div>
        </div>
        <footer>
          Copyright © 2019 <a href="https://netgum.io">NetGum</a>
        </footer>
      </div>
    );
  }

  private createOnClickHandler(screen: string): () => any {
    const { openScreen } = this.props;

    return () => openScreen(screen);
  }

  private createOpenSection(index: number): () => void {
    return () => {
      this.setState({
        activeIndex: index,
      });
    };
  }

  private toggleShowHelp(): void {
    this.config.showHelp = !this.config.showHelp;
  }
  private toggleAutoInitializeSdk(): void {
    this.config.autoInitializeSdk = !this.config.autoInitializeSdk;
  }
  private toggleAutoAcceptSdkActions(): void {
    this.config.autoAcceptSdkActions = !this.config.autoAcceptSdkActions;
  }
}
