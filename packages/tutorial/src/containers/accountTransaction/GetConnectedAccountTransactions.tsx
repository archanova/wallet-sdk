import React from 'react';
import { Example, Screen } from '../../components';

const code1 = (page = 0) => `
${page ? `const page = ${page};` : ''}
sdk
  .getConnectedAccountTransactions(${page ? 'page' : ''})
  .then(accountTransactions => console.log('accountTransactions', accountTransactions));
  .catch(console.error);
`;

export class GetConnectedAccountTransactions extends Screen {

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
      .wrapSync('sdk.getConnectedAccountTransactions', async (console) => {
        console.log('accountTransactions', await this.sdk.getConnectedAccountTransactions());
      });
  }

}
