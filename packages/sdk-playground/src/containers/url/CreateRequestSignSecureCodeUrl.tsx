import React from 'react';
import QrCode from 'qrcode.react';
import { Example, Screen } from '../../components';

const code = () => `
sdk
  .createRequestSignSecureCodeUrl()
  .then(mobileUrl => console.log('mobileUrl', mobileUrl));
  .catch(console.error);
`;

interface IState {
  mobileUrl: string;
}

export class CreateRequestSignSecureCodeUrl extends Screen<IState> {
  public state = {
    mobileUrl: '',
  };

  public componentWillMount(): void {
    this.run = this.run.bind(this);
  }

  public renderContent(): any {
    const { enabled } = this.props;
    const { mobileUrl } = this.state;
    return (
      <div>
        <Example
          title="Create Request Add Account Device Url"
          code={code()}
          enabled={enabled}
          run={this.run}
        />
        {enabled && mobileUrl && (
          <div style={{ marginBottom: 20 }}>
            <QrCode value={mobileUrl} size={250} />
          </div>
        )}
      </div>
    );
  }

  private run(): void {
    this
      .logger
      .wrapSync('sdk.createRequestSignSecureCodeUrl', async (console) => {
        const mobileUrl = console.log('mobileUrl', await this.sdk.createRequestSignSecureCodeUrl());

        this.setState({
          mobileUrl,
        });
      });
  }
}
