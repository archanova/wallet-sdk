import { sdkConstants, ISdkReduxState } from '@archanova/sdk';
import React from 'react';
import { connect } from 'react-redux';
import { Menu } from '../components';
import { Screens } from './constants';
import styles from './ScreenRouter.module.scss';
import { Initialize, Reset } from './sdk';
import { CreateAccount, ConnectAccount, UpdateAccount, DisconnectAccount, DeployAccount, DepositToAccountVirtualBalance } from './account';
import { GetConnectedAccountTransactions } from './accountTransaction';
import { GetConnectedAccountPayments, CreateAccountPayment } from './accountPayment';

interface IProps {
  sdk: ISdkReduxState;
}

interface IState {
  screen: string;
}

class ScreenRouter extends React.Component<IProps, IState> {
  private static getScreenNode(screen: string, enabledScreens: { [key: string]: boolean }): React.ReactNode {
    // tslint:disable-next-line:variable-name
    let Screen: React.JSXElementConstructor<{
      enabled: boolean;
    }> = null;

    switch (screen) {
      // sdk
      case Screens.Initialize:
        Screen = Initialize;
        break;

      case Screens.Reset:
        Screen = Reset;
        break;

      // account
      case Screens.CreateAccount:
        Screen = CreateAccount;
        break;

      case Screens.UpdateAccount:
        Screen = UpdateAccount;
        break;

      case Screens.ConnectAccount:
        Screen = ConnectAccount;
        break;

      case Screens.DisconnectAccount:
        Screen = DisconnectAccount;
        break;

      case Screens.DepositToAccountVirtualBalance:
        Screen = DepositToAccountVirtualBalance;
        break;

      case Screens.DeployAccount:
        Screen = DeployAccount;
        break;

      // account transactions
      case Screens.GetConnectedAccountTransactions:
        Screen = GetConnectedAccountTransactions;
        break;

      // account payments
      case Screens.GetConnectedAccountPayments:
        Screen = GetConnectedAccountPayments;
        break;

      case Screens.CreateAccountPayment:
        Screen = CreateAccountPayment;
        break;
    }

    return Screen
      ? (
        <Screen
          enabled={enabledScreens[screen]}
        />
      ) : null;
  }

  public state = {
    screen: Screens.DeployAccount,
  };

  public componentWillMount(): void {
    this.openScreen = this.openScreen.bind(this);
  }

  public render() {
    const { screen } = this.state;

    const enabledScreens = this.getEnabledScreens();
    const screenNode = ScreenRouter.getScreenNode(screen, enabledScreens);

    return (
      <div className={styles.content}>
        <Menu
          items={[{
            header: 'SDK',
            screens: [
              Screens.Initialize,
              Screens.Reset],
          }, {
            header: 'Account',
            screens: [
              Screens.CreateAccount,
              Screens.UpdateAccount,
              Screens.ConnectAccount,
              Screens.DisconnectAccount,
              Screens.DeployAccount,
              Screens.DepositToAccountVirtualBalance,
            ],
          }, {
            header: 'Account Transaction',
            screens: [
              Screens.GetConnectedAccountTransactions,
            ],
          }, {
            header: 'Account Payment',
            screens: [
              Screens.GetConnectedAccountPayments,
              Screens.CreateAccountPayment,
            ],
          }]}
          enabledScreens={enabledScreens}
          activeScreen={screen}
          openScreen={this.openScreen}
        />
        {screenNode}
      </div>
    );
  }

  private getEnabledScreens(): { [key: string]: boolean } {
    const { sdk: { account, initialized } } = this.props;

    const accountConnected = initialized && !!account;
    const accountDisconnected = initialized && !account;
    const accountUpdated = accountConnected && !!account.ensName;
    const accountCreated = accountConnected && !account.nextState && account.state === sdkConstants.AccountStates.Created;
    const accountDeployed = accountConnected && !account.nextState && account.state === sdkConstants.AccountStates.Deployed;

    return {
      // sdk
      [Screens.Initialize]: initialized === null,
      [Screens.Reset]: initialized,

      // account
      [Screens.CreateAccount]: accountDisconnected,
      [Screens.UpdateAccount]: accountCreated,
      [Screens.ConnectAccount]: initialized,
      [Screens.DisconnectAccount]: accountConnected,
      [Screens.DeployAccount]: accountUpdated && accountCreated,
      [Screens.DepositToAccountVirtualBalance]: accountDeployed,

      // account transaction
      [Screens.GetConnectedAccountTransactions]: accountConnected,

      // account payment
      [Screens.GetConnectedAccountPayments]: accountConnected,
      [Screens.CreateAccountPayment]: accountDeployed,
    };
  }

  private openScreen(screen: string): void {
    this.setState({
      screen,
    });
  }
}

export default connect<IProps, {}, {}, IProps>(
  state => state,
)(ScreenRouter);
