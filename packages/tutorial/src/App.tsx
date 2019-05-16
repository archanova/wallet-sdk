import React from 'react';
import { ScreenRouter, LoggerEvents, SdkStatus } from './containers';

export default class App extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <SdkStatus />
        <ScreenRouter />
        <LoggerEvents />
      </React.Fragment>
    );
  }
}
