import React from 'react';
import { Example, Screen, InputText } from '../../components';

const code = (hash: string) => `
const hash = ${hash ? `"${hash}"` : 'null'};

sdk
  .getConnectedAccountPayment(hash)
  .then(accountPayment => console.log('accountPayment', accountPayment))
  .catch(console.error);
`;

interface IState {
  hash: string;
}

export class GetConnectedAccountPayment extends Screen<IState> {
  public state = {
    hash: '',
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);

    this.hashChanged = this.hashChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { hash } = this.state;
    return (
      <div>
        <Example
          title="Get Connected Account Payment"
          code={code(hash)}
          enabled={hash && enabled}
          run={this.run}
        >
          <InputText
            value={hash}
            label="hash"
            type="text"
            onChange={this.hashChanged}
          />
        </Example>
      </div>
    );
  }

  private hashChanged(hash: string): void {
    this.setState({
      hash,
    });
  }

  private run(): void {
    const { hash } = this.state;
    this
      .logger
      .wrapSync('sdk.getConnectedAccountPayment', async (console) => {
        console.log('accountPayment', await this.sdk.getConnectedAccountPayment(hash));
      });
  }
}
