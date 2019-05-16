import React from 'react';
import { ethToWei } from '@netgum/utils';
import { Example, Screen, InputText } from '../../components';
import { generateRandomAddress } from '../../shared';

const code1 = (recipient: string, value: number) => `
import { ethToWei } from '@netgum/utils';

const recipient = "${recipient}";
const value = ethToWei(${value});
sdk
  .createAccountPayment(recipient, value)
  .then(estimated => console.log('estimated', estimated));
  .catch(console.error);
`;

interface IState {
  value: string;
  valueParsed: number;
  recipient: string;
}

export class CreateAccountPayment extends Screen<IState> {
  public state = {
    recipient: generateRandomAddress(),
    value: '0',
    valueParsed: 0,
  };

  public componentWillMount(): void {
    this.estimateAccountDeployment = this.estimateAccountDeployment.bind(this);
    this.valueChanged = this.valueChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { value, valueParsed, recipient } = this.state;
    return (
      <div>
        <Example
          title="Create"
          code={code1(recipient, valueParsed)}
          enabled={enabled}
          run={this.estimateAccountDeployment}
        >
          <InputText
            value={recipient}
            label="recipient"
            type="text"
            onChange={this.recipientChanged}
          />
          <InputText
            value={value}
            label="value"
            type="number"
            onChange={this.valueChanged}
          />
        </Example>
      </div>
    );
  }

  private valueChanged(value: string, valueParsed: number): void {
    this.setState({
      value,
      valueParsed,
    });
  }

  private recipientChanged(value: string): void {
    this.setState({
      value,
    });
  }

  private estimateAccountDeployment(): void {
    this
      .logger
      .wrapSync('sdk.estimateDepositToAccountVirtualBalance', async (console) => {
        console.log('accountPayment', await this.sdk.createAccountPayment(
          '0x9d1259623Bf0f08e7F1B6129d3D173fE98dBf753',
          ethToWei(0.001)),
        );
      });
  }
}
