export interface ILogger {
  log(...args: any[]): any;

  info(...args: any[]): any;

  error(...args: any[]): any;
}
