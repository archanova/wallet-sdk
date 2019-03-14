import React, { Component } from 'react';

export class Code extends Component {
  static defaultProps = {
    trim: true,
  };

  render() {
    const { trim, children } = this.props;

    let code = '';
    if (trim) {
      if (typeof children === 'string') {
        code = children
          .split('\n')
          .map((line) => {
            let result = line.trim();
            return result.startsWith('.') ? `  ${result}` : result;
          })
          .join('\n')
          .trim();
      }
    } else {
      code = children;
    }

    return (
      <pre>
        <code>{code}</code>
      </pre>
    );
  }
}
