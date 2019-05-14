import React, { Component } from 'react';
import { Sdk } from '@archanova/sdk';
import { SdkContext } from './SdkContext';

interface IProps {
  sdk: Sdk;
}

export class SdkProvider extends Component<IProps> {
  render() {
    const { sdk, children } = this.props;
    return (
      <SdkContext.Provider value={sdk}>{children}</SdkContext.Provider>
    );
  }
}
