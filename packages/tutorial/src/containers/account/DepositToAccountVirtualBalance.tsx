import React from 'react';
import { ethToWei } from '@netgum/utils';
import { sdkModules } from '@archanova/sdk';
import { Example, Screen } from '../../components';

const code1 = () => `
sdk
  .estimateDepositToAccountVirtualBalance()
  .then(estimated => console.log('estimated', estimated));
  .catch(console.error);
`;

const code2 = () => `
sdk
  .submitAccountTransaction(estimated)
  .then(hash => console.log('hash', hash));
  .catch(console.error);
`;

interface IState {
  estimated: sdkModules.AccountTransaction.IEstimatedProxyTransaction;
}

export class DepositToAccountVirtualBalance extends Screen<IState> {
  public state = {
    estimated: null,
  };

  public componentWillMount(): void {
    this.estimateAccountDeployment = this.estimateAccountDeployment.bind(this);
    this.deployAccount = this.deployAccount.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { estimated } = this.state;
    return (
      <div>
        <Example
          title="Estimate"
          code={code1()}
          enabled={enabled}
          run={this.estimateAccountDeployment}
        />
        <Example
          title="Submit"
          code={code2()}
          enabled={enabled && !!estimated}
          run={this.deployAccount}
        />
      </div>
    );
  }

  private estimateAccountDeployment(): void {
    this
      .logger
      .wrapSync('sdk.estimateDepositToAccountVirtualBalance', async (console) => {
        const estimated = console.log('estimated', await this.sdk.estimateDepositToAccountVirtualBalance(ethToWei(0.001)));

        this.setState({
          estimated,
        });
      });
  }

  private deployAccount(): void {
    const { estimated } = this.state;
    this
      .logger
      .wrapSync('sdk.submitAccountTransaction', async (console) => {
        console.log('hash', await this.sdk.submitAccountTransaction(estimated));

        this.setState({
          estimated: null,
        });
      });
  }
}
