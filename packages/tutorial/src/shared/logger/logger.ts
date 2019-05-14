import { ILogger } from './interfaces';

export const logger: ILogger = {
  log(...args): any {
    console.log(...args);
  },
  info(...args): any {
    console.info(...args);
  },
  error(...args): any {
    console.error(...args);
  },
};
