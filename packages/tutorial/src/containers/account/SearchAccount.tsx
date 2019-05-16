import React from 'react';
import { Example, Screen } from '../../components';
import { generateRandomEnsLabel } from '../../shared';

const example1 = (ensLabel: string) => `
const ensLabel = "${ensLabel}";
sdk
  .updateAccount(ensLabel)
  .then(account => console.log('account:', account)
  .catch(console.error);
`;

interface IState {
  ensLabel: string;
}

export class SearchAccount extends Screen<IState> {
  public state = {
    ensLabel: generateRandomEnsLabel(),
  };

  public componentWillMount(): void {
    this.runExample1 = this.runExample1.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { ensLabel } = this.state;
    return (
      <div>
        <Example
          title="Example 2"
          code={example1(ensLabel)}
          enabled={enabled}
          run={this.runExample1}
        />
      </div>
    );
  }
  private runExample1(): void {
    const { ensLabel } = this.state;
    this
      .logger
      .wrapSync('sdk.updateAccount', async (console) => {
        console.log('account', await this.sdk.updateAccount(ensLabel));

        this.setState({
          ensLabel: generateRandomEnsLabel(),
        });
      });
  }
}
