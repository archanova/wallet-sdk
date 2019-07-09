import { SdkEnvironmentNames } from '@archanova/sdk';
import { BehaviorSubject } from 'rxjs';
import './environments';

const {
  REACT_APP_ACTIVATE_HELP,
  REACT_APP_ACTIVATE_LOCAL_SDK_ENV,
  REACT_APP_LOCAL_SDK_ENV_PORT,
  REACT_APP_AUTO_INITIALIZE_SDK,
  REACT_APP_AUTO_ACCEPT_SDK_ACTIONS,
} = process.env;

const STORAGE_PREFIX = '@archanova-playground';

const storageHelper = {
  get<T>(key: string, defaultValue: T = null): T {
    let result = defaultValue;
    const item = localStorage.getItem(`${STORAGE_PREFIX}:${key}`);
    if (item) {
      result = JSON.parse(item);
    }
    return result;
  },
  set<T>(key: string, value: T): void {
    localStorage.setItem(`${STORAGE_PREFIX}:${key}`, JSON.stringify(value));
  },
};

const reloadHelper = () => {
  setTimeout(() => window.location.reload(), 500);
};

export let sdkEnvs: string[] = [
  ...Object.values(SdkEnvironmentNames),
];

const activateLocalSdkEnv = REACT_APP_ACTIVATE_LOCAL_SDK_ENV === '1';

if (activateLocalSdkEnv) {
  sdkEnvs = [
    'local',
    ...sdkEnvs,
  ];
}

class Config {
  public sdkEnvs = sdkEnvs;
  public sdkEnv$ = new BehaviorSubject<string>(this.sdkEnv);
  public showHelp$ = new BehaviorSubject<boolean>(this.showHelp);
  public activateHelp = REACT_APP_ACTIVATE_HELP === '1';
  public activateLocalSdkEnv = activateLocalSdkEnv;
  public localSdkEnvPort = parseInt(REACT_APP_LOCAL_SDK_ENV_PORT, 10) || null;

  public get sdkEnv(): string {
    const defaultEnv = this.activateLocalSdkEnv ? 'local' : SdkEnvironmentNames.Kovan;
    let result = storageHelper.get('sdkEnv', defaultEnv);

    if (!sdkEnvs.includes(result)) {
      result = defaultEnv;
    }

    return result;
  }

  public set sdkEnv(value: string) {
    storageHelper.set('sdkEnv', value);
    this.sdkEnv$.next(value);
  }

  public get showHelp(): boolean {
    return this.activateHelp ? storageHelper.get('showHelp', true) : false;
  }

  public set showHelp(value: boolean) {
    storageHelper.set('showHelp', value);
    this.showHelp$.next(value);
  }

  public get autoInitializeSdk(): boolean {
    return storageHelper.get('autoInitializeSdk', REACT_APP_AUTO_INITIALIZE_SDK === '1');
  }

  public set autoInitializeSdk(value: boolean) {
    storageHelper.set('autoInitializeSdk', value);
    reloadHelper();
  }

  public get autoAcceptSdkActions(): boolean {
    return storageHelper.get('autoAcceptSdkActions', REACT_APP_AUTO_ACCEPT_SDK_ACTIONS === '1');
  }

  public set autoAcceptSdkActions(value: boolean) {
    storageHelper.set('autoAcceptSdkActions', value);
    reloadHelper();
  }
}

export const config = new Config();
