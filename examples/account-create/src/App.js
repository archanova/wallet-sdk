/* eslint-disable jsx-a11y/anchor-is-valid,no-script-url */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sdkSetup, createSdkAccount } from './actions';

class App extends Component {
  render() {
    const {
      sdkAccount,
      sdkDevice,
      sdkSetupCompleted,
      sdkRequestUrl,
      sdkSetup,
      createSdkAccount,
    } = this.props;

    if (!sdkSetupCompleted) { // Step 1
      return (
        <div>
          <p>Step 1. Setup SDK</p>
          <p>
            <a
              className="App-link"
              href="javascript:void(0);"
              onClick={sdkSetup}
            >
              Setup
            </a>
          </p>
        </div>
      );

    } else if (!sdkAccount && !sdkRequestUrl) { // Step 2
      return (
        <div>
          <p>Step 2. Create Account</p>
          <p>
            <a
              className="App-link"
              href="javascript:void(0);"
              onClick={createSdkAccount}
            >
              Create
            </a>
          </p>
          <small>Device {sdkDevice.address}</small>
        </div>
      );
    } else if (sdkAccount) { // Completed
      return (
        <div>
          <p>
            Account Created!
          </p>
          <small>Account {sdkAccount.address}</small>
          <small>Device {sdkDevice.address}</small>
        </div>
      );
    }

    return null;
  }
}

export default connect(
  state => ({
    sdkAccount: state.sdk.account,
    sdkDevice: state.sdk.device,
    sdkSetupCompleted: state.sdkSetupCompleted,
  }),
  dispatch => ({
    sdkSetup: () => dispatch(sdkSetup()),
    createSdkAccount: () => dispatch(createSdkAccount()),
  }),
)(App);
