import { createContext } from 'react';
import { Sdk } from '@archanova/sdk';

// tslint:disable-next-line:variable-name
export const SdkContext = createContext<Sdk>(null);
