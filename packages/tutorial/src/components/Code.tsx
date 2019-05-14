import React from 'react';
import Highlight from 'react-highlight';

interface IProps {
  data: string;
}

export class Code extends React.Component<IProps> {
  public render(): any {
    const { data } = this.props;
    return (
      <Highlight language="javascript">
        {data.trim()}
      </Highlight>
    );
  }
}
