import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import QrCode from 'qrcode.react';
import { generateRequestAddSdkAccountDeviceUrls } from '../actions';
import { Block, Code } from '../components';

class SetupSdkAccount extends Component {

  render() {
    const {
      requestAddSdkAccountDeviceUrls,
      generateRequestAddSdkAccountDeviceUrls,
    } = this.props;

    return (
      <div>
        <Block title="Generate Request Add SDK Account Device Urls">
          <Code data={
            `
            const endpoint = 'http://localhost:5100';
            const callbackEndpoint = 'http://localhost:5200';

            // for redirect
            const redirectUrl = sdk
              .createRequestAddAccountDeviceUrl({ endpoint, callbackEndpoint });

            // for qr code
            const qrCodeUrl = sdk
              .createRequestAddAccountDeviceUrl();
            `
          } />
          <Button variant="primary" onClick={generateRequestAddSdkAccountDeviceUrls}>
            Generate Urls
          </Button>
        </Block>

        {requestAddSdkAccountDeviceUrls
          ? (
            <Block title="Request Add SDK Account Device">
              <div>
                <QrCode size={300} value={requestAddSdkAccountDeviceUrls.qrCode}/>
              </div>
              <Button variant="primary" href={requestAddSdkAccountDeviceUrls.redirect}>
                Request
              </Button>
            </Block>
          )
          : null
        }


      </div>
    );
  }
}

export default connect(
  ({ requestAddSdkAccountDeviceUrls }) => ({
    requestAddSdkAccountDeviceUrls,
  }),
  dispatch => ({
    generateRequestAddSdkAccountDeviceUrls: () => dispatch(generateRequestAddSdkAccountDeviceUrls()),
  }),
)(SetupSdkAccount);
