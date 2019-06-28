import React from 'react';
import { Box } from 'ink';
import { ContextComponent } from '../context';

export class DevelopApp extends ContextComponent {
  public componentWillMount(): void {
    //
  }

  public componentWillUnmount(): void {
    //
  }

  public render(): any {
    return (
      <Box flexDirection="column" padding={2}>
        Develop App
      </Box>
    );
  }
}
