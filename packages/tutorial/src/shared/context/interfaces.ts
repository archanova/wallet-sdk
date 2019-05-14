import { Sdk } from '@archanova/sdk';
import { ILogger } from '../logger';

export interface IContextProps {
  sdk: Sdk;
  logger: ILogger;
}
