import React, { Component } from 'react';

export class Block extends Component {
  render() {
    const { title, children } = this.props;
    return (
      <div>
        <hr/>
        <h4>{title}</h4>
        {children}
      </div>
    );
  }
}
