import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { topUpSdkAccount } from '../actions';
import { Block, Code } from '../components';

class TopUpSdkAccount extends Component {
  render() {
    const { topUpSdkAccount, topUpSdkAccountReceipt } = this.props;
    return (
      <Block title="Top-Up SDK Account">
        <Code data={
          `
            sdk
            .topUpAccount
            .then(receipt => console.log(receipt))
            .catch(console.error);
          `
        } />
        <Button
          variant="primary"
          onClick={topUpSdkAccount}
          disabled={!!topUpSdkAccountReceipt}
        >
          Top-Up
        </Button>
        <Code data={topUpSdkAccountReceipt} />
      </Block>
    );
  }
}

export default connect(
  ({ topUpSdkAccountReceipt }) => ({
    topUpSdkAccountReceipt,
  }),
  dispatch => ({
    topUpSdkAccount: () => dispatch(topUpSdkAccount()),
  }),
)(TopUpSdkAccount);
