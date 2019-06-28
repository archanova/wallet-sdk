import React from 'react';
import { IContextProps } from './interfaces';
import { context } from './context';

export abstract class ContextComponent<P = any, S = any> extends React.Component<P, S> {
  public static contextType = context;

  public context: IContextProps;

  public abstract render(): any;

  protected wrapAsync(fun: () => Promise<any>): void {
    fun().catch(err => console.error(err));
  }
}
