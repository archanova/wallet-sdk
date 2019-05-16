import 'highlight.js/styles/a11y-light.css';
import 'highlight.js/lib/languages/javascript';
import 'highlight.js/lib/languages/json';

import React from 'react';
import Highlight from 'react-highlight';
import styles from './Code.module.scss';

interface IProps {
  language: 'javascript' | 'json';
  children: string;
}

export class Code extends React.Component<IProps> {
  public render(): any {
    const { language, children } = this.props;

    return (
      <div className={styles.content}>
        <Highlight language={language}>
          {children.trim()}
        </Highlight>
      </div>
    );
  }
}
