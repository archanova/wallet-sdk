import React from 'react';
import { Example, InputText, Screen } from '../../components';

const code = (token: string) => `
const token = ${token ? `"${token}"` : 'null'};

sdk
  .getUnprocessedPaymentsSum(token)
  .then(sum => console.log('UnprocessedPaymentsSum', sum))
  .catch(console.error);
`;

interface IState {
  token: string;
}

export class GetUnprocessedPaymentsSum extends Screen<IState> {
  public state = {
    token: '',
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.tokenChanged = this.tokenChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { token } = this.state;
    return (
      <div>
        <Example
          title="Get Connected Account Payments"
          code={code(token)}
          enabled={enabled}
          run={this.run}
        >
          <InputText
            value={token}
            label="tokenAddress"
            type="text"
            onChange={this.tokenChanged}
          />
        </Example>
      </div>
    );
  }

  private tokenChanged(token: string): void {
    this.setState({
      token,
    });
  }

  private run(): void {
    const { token } = this.state;
    this
      .logger
      .wrapSync('sdk.getUnprocessedPaymentsSum', async (console) => {
        console.log('UnprocessedPaymentsSum', await this.sdk.getUnprocessedPaymentsSum(token || null));
      });
  }

}
