import React, { Component } from 'react';
import Prism from 'prismjs';

export class Code extends Component {
  static defaultProps = {
    data: null,
  };

  componentDidMount() {
    Prism.highlightAll();
  }

  componentDidUpdate() {
    Prism.highlightAll();
  }

  render() {
    const { data } = this.props;

    if (!data) {
      return null;
    }

    const type = typeof data === 'string' ? 'javascript' : 'json';

    let code;

    switch (type) {
      case 'javascript':
        code = data
          .split('\n')
          .map((line) => {
            let result = line.trim();
            return result.startsWith('.') ? `  ${result}` : result;
          })
          .join('\n')
          .trim();
        break;

      case 'json':
        code = JSON.stringify(data, null, 2);
        break;

      default:
        code = null;
    }

    return code && (
      <pre>
        <code className={`language-${type}`}>{code}</code>
      </pre>
    );
  }
}
