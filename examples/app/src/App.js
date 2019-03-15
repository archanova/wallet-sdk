import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import {
  InitializeSdk,
  SetupSdkAccount,
  SdkState,
} from './containers';

class App extends Component {
  render() {
    const { sdk: { account, initialized } } = this.props;
    let content = null;

    if (!initialized) {
      content = <InitializeSdk />;
    } else if (!account) {
      content = <SetupSdkAccount />;
    }

    return (
      <div>
        <Container>
          <h2>Example App</h2>
          {content}
          <SdkState />
        </Container>
      </div>
    );
  }
}

export default connect(
  ({ sdk }) => ({
    sdk,
  }),
)(App);
