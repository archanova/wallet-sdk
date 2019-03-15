import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { initializeSdk } from '../actions';
import { Block, Code } from '../components';

class InitializeSdk extends Component {
  render() {
    const { initializeSdk } = this.props;
    return (
      <Block title="Initialize SDK">
        <Code data={
          `
            sdk
            .initialize()
            .catch(console.error);
          `
        } />
        <Button variant="primary" onClick={initializeSdk}>
          Initialize
        </Button>
      </Block>
    );
  }
}

export default connect(
  null,
  dispatch => ({
    initializeSdk: () => dispatch(initializeSdk()),
  }),
)(InitializeSdk);
