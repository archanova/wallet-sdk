import React from 'react';
import { Code } from '../components';
import { ContextComponent } from '../shared';

const code = () => `
sdk
  .createAccount()
  .then(account => console.log(account);
`;

export class InitializeScreen extends ContextComponent {

  public componentWillMount(): void {
    this.onClick = this.onClick.bind(this);
  }

  public render(): any {
    return (
      <div>
        <Code data={code()} />
        <button onClick={this.onClick}>Click me!</button>
      </div>
    );
  }

  private onClick(): void {
    this
      .sdk
      .createAccount()
      .then(account => this.logger.log('account:', account))
      .catch(err => this.logger.error(err));
  }
}
