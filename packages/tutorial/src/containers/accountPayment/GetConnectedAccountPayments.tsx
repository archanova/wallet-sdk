import React from 'react';
import { Example, Screen } from '../../components';

const code1 = (page = 0) => `
${page ? `const page = ${page};` : ''}
sdk
  .getConnectedAccountPayments(${page ? 'page' : ''})
  .then(accountPayments => console.log('accountPayments', accountPayments));
  .catch(console.error);
`;

export class GetConnectedAccountPayments extends Screen {

  public componentWillMount(): void {
    this.getConnectedAccountTransactions = this.getConnectedAccountTransactions.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    return (
      <div>
        <Example
          title="Example"
          code={code1()}
          enabled={enabled}
          run={this.getConnectedAccountTransactions}
        />
      </div>
    );
  }

  private getConnectedAccountTransactions(): void {
    this
      .logger
      .wrapSync('sdk.getConnectedAccountPayments', async (console) => {
        console.log('accountPayments', await this.sdk.getConnectedAccountPayments());
      });
  }

}
