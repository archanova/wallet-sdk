import React from 'react';
import { Box } from 'ink';
import chalk from 'chalk';
import { ContextComponent } from '../context';
import { Actions } from '../constants';

const HELP_OPTIONS = chalk`
{magenta Options}
{cyan --help, -h              } print help
{cyan --global, -g            } use global storage
{cyan --env, -e <env>         } environment [ropsten,rinkeby,kovan,local] (default: kovan)
{cyan --local-env-host <host> } local environment host
{cyan --local-env-port <port> } local environment port
{cyan --private-key <key>     } device private key`;

const HELP_DEFAULT = chalk`
{magenta Usage} {cyan archanova-cli} [action] [options] [workingPath]

${chalk.magenta('Actions')}
{cyan ${Actions.Init}}     initialize application
{cyan ${Actions.Develop}}  develop application
{cyan ${Actions.Deploy}}   deploy application
${HELP_OPTIONS}
`;

const HELP_INIT = chalk`
{magenta Usage} {cyan archanova-cli} {cyanBright ${Actions.Init}} [options] [workingPath]
${HELP_OPTIONS}
`;

const HELP_DEVELOP = chalk`
{magenta Usage} {cyan archanova-cli} {cyanBright ${Actions.Develop}} [options] [workingPath]
${HELP_OPTIONS}
`;

const HELP_DEPLOY = chalk`
{magenta Usage} {cyan archanova-cli} {cyanBright ${Actions.Deploy}} [options] [workingPath]
${HELP_OPTIONS}
`;

export class Help extends ContextComponent {
  public render(): any {
    const { config: { action } } = this.context;
    let help: string = null;

    switch (action) {
      case null:
        help = HELP_DEFAULT;
        break;

      case Actions.Init:
        help = HELP_INIT;
        break;

      case Actions.Develop:
        help = HELP_DEVELOP;
        break;

      case Actions.Deploy:
        help = HELP_DEPLOY;
        break;
    }

    return (
      <Box flexDirection="column" padding={1}>
        {help.trim()}
      </Box>
    );
  }
}
