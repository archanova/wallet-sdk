import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonToolbar, Alert } from 'react-bootstrap';
import { fetchSdkAccounts, createSdkAccount, connectSdkAccount } from '../actions';
import { Block, Code } from '../components';
import { generateRandomEnsLabel } from '../utils';

class SetupSdkAccount extends Component {
  render() {
    const { sdkAccounts, createSdkAccount, fetchSdkAccounts, connectSdkAccount } = this.props;

    const ensLabel = generateRandomEnsLabel();

    return (
      <div>
        <Block title="Create SDK Account">
          <Code>
            {
              `
            // anonymous account
            sdk
              .createAccount()
              .then(account => console.log(account)
              .catch(console.error);

            const ensLabel = "${ensLabel}";

            // account with ens label
            sdk
              .createAccount(ensLabel)
              .then(account => console.log(account)
              .catch(console.error);
            `
            }
          </Code>
          <ButtonToolbar>
            <Button variant="primary" onClick={() => createSdkAccount()}>
              Create anonymous Account
            </Button>
            <Button variant="primary" onClick={() => createSdkAccount(ensLabel)}>
              Create Account with ens label
            </Button>
          </ButtonToolbar>
        </Block>
        {!sdkAccounts && (
          <Block title="Fetch connected SDK Accounts">
            <Code>
              {
                `
            sdk
              .getAccounts()
              .then(accounts => console.log(accounts)
              .catch(console.error);
            `
              }
            </Code>
            <ButtonToolbar>
              <Button variant="secondary" onClick={fetchSdkAccounts}>
                Fetch Accounts
              </Button>
            </ButtonToolbar>
          </Block>
        )}
        {sdkAccounts && !sdkAccounts.length && (
          <Block title="Fetch connected SDK Accounts">
            <Alert variant="light">
              No account has been found
            </Alert>
          </Block>
        )}
        {sdkAccounts && sdkAccounts.length && (
          <Block title="Connect to SDK Account">
            <Code>
              {
                `
            sdk
              .connectAccount(accountAddress)
              .then(account => console.log(account)
              .catch(console.error);
            `
              }
            </Code>
            {sdkAccounts.map(({address}) => (
              <Button
                key={address}
                variant="light"
                block={true}
                className="text-left"
                onClick={() => connectSdkAccount(address)}
              >
                Connect to {address}
              </Button>
            ))}
          </Block>
        )}
      </div>
    );
  }
}

export default connect(
  ({ sdkAccounts }) => ({
    sdkAccounts,
  }),
  dispatch => ({
    createSdkAccount: (ensLabel = null) => dispatch(createSdkAccount(ensLabel)),
    fetchSdkAccounts: () => dispatch(fetchSdkAccounts()),
    connectSdkAccount: (accountAddress) => dispatch(connectSdkAccount(accountAddress)),
  }),
)(SetupSdkAccount);
