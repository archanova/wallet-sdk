import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { initializeSdk } from '../actions';

class InitializeSdk extends Component {
  render() {
    const { initializeSdk } = this.props;
    return (
      <div>
        <h4>Initialize SDK</h4>
        <pre>
            <code>
              sdk.initialize().catch(console.error);{'\n'}
            </code>
          </pre>
        <Button variant="primary" onClick={initializeSdk}>
          Initialize
        </Button>
      </div>
    );
  }
}

export default connect(
  null,
  dispatch => ({
    initializeSdk: () => dispatch(initializeSdk()),
  }),
)(InitializeSdk);
