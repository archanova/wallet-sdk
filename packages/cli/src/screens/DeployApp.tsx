import React from 'react';
import { Box } from 'ink';
import { ContextComponent } from '../context';

export class DeployApp extends ContextComponent {
  public componentWillMount(): void {
    //
  }

  public componentWillUnmount(): void {
    //
  }

  public render(): any {
    return (
      <Box flexDirection="column" padding={2}>
        Deploy App
      </Box>
    );
  }
}
