import React from 'react';
import { ethToWei } from '@netgum/utils';
import { sdkModules } from '@archanova/sdk';
import { Example, Screen, InputText, InputTransactionSpeed } from '../../components';
import { mergeMethodArgs } from '../../shared';

const code1 = (value: number, transactionSpeed: string) => `
${!transactionSpeed ? '' : 'import { sdkModules } from \'@archanova/sdk\';'}
import { ethToWei } from '@netgum/utils';

const value = ethToWei(${value});
${!transactionSpeed ? '' : `const transactionSpeed = ${transactionSpeed};`}

sdk
  .estimateDepositToAccountVirtualBalance(${mergeMethodArgs('value', transactionSpeed && 'transactionSpeed')})
  .then(estimated => console.log('estimated', estimated));
  .catch(console.error);
`;

const code2 = () => `
const estimated; // estimated transaction

sdk
  .submitAccountTransaction(estimated)
  .then(hash => console.log('hash', hash));
  .catch(console.error);
`;

interface IState {
  transactionSpeed: any;
  estimated: sdkModules.AccountTransaction.IEstimatedProxyTransaction;
  value: string;
  valueParsed: number;
}

export class DepositToAccountVirtualBalance extends Screen<IState> {
  public state = {
    transactionSpeed: null,
    estimated: null,
    value: '0',
    valueParsed: 0,
  };

  public componentWillMount(): void {
    this.run1 = this.run1.bind(this);
    this.run2 = this.run2.bind(this);

    this.valueChanged = this.valueChanged.bind(this);
    this.transactionSpeedChanged = this.transactionSpeedChanged.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { estimated, value, valueParsed, transactionSpeed } = this.state;
    return (
      <div>
        <Example
          title="Estimate Deposit To Account Virtual Balance"
          code={code1(valueParsed, InputTransactionSpeed.selectedToText(transactionSpeed))}
          enabled={enabled}
          run={this.run1}
        >
          <InputText
            label="value"
            type="number"
            decimal={true}
            value={value}
            onChange={this.valueChanged}
          />
          <InputTransactionSpeed
            selected={transactionSpeed}
            onChange={this.transactionSpeedChanged}
          />
        </Example>
        <Example
          title="Submit Account Transaction"
          code={code2()}
          enabled={enabled && !!estimated}
          run={this.run2}
        />
      </div>
    );
  }

  private valueChanged(value: string, valueParsed: number): void {
    this.setState({
      value,
      valueParsed,
    });
  }

  private transactionSpeedChanged(transactionSpeed: any): void {
    this.setState({
      transactionSpeed,
    });
  }

  private run1(): void {
    const { valueParsed, transactionSpeed } = this.state;
    this
      .logger
      .wrapSync('sdk.estimateDepositToAccountVirtualBalance', async (console) => {
        const estimated = console.log('estimated', await this.sdk.estimateDepositToAccountVirtualBalance(
          ethToWei(valueParsed),
          transactionSpeed,
        ));

        this.setState({
          estimated,
        });
      });
  }

  private run2(): void {
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
