declare module 'react-highlight' {
  import { Component } from 'react';

  declare class Highlight extends Component<Highlight.IProps> {
    //
  }

  declare namespace Highlight {
    export interface IProps {
      innerHTML?: boolean;
      language?: string;
    }
  }

  export = Highlight;
}
