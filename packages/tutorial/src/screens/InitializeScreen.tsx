import React from 'react';
import { ContextComponent } from '../shared';

export class InitializeScreen extends ContextComponent {

  public componentWillMount(): void {
    this.onClick = this.onClick.bind(this);
  }

  public render(): any {
    return (
      <div>
        <button onClick={this.onClick}>Click me!</button>
      </div>
    );
  }

  private onClick(): void {
    console.log(this.sdk.state.deviceAddress);
  }
}
