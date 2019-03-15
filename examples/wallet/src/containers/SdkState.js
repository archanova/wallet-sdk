import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { resetSdk } from '../actions';
import { Block, Code } from '../components';

class SdkState extends Component {
  render() {
    const { sdk, resetSdk } = this.props;
    return (
      <Block title="SDK State">
        <Code data={sdk} />
        <Button variant="danger" onClick={resetSdk}>
          Reset SDK
        </Button>
      </Block>
    );
  }
}

export default connect(
  ({ sdk }) => ({
    sdk,
  }),
  dispatch => ({
    resetSdk: () => dispatch(resetSdk()),
  }),
)(SdkState);
