export enum Screens {
  // sdk
  Initialize = 'initialize',
  Reset = 'reset',

  // account
  SearchAccount = 'searchAccount',
  CreateAccount = 'createAccount',
  UpdateAccount = 'updateAccount',
  ConnectAccount = 'connectAccount',
  DisconnectAccount = 'disconnectAccount',
  DeployAccount = 'deployAccount',
  TopUpAccountVirtualBalance = 'topUpAccountVirtualBalance',
  WithdrawFromAccountVirtualBalance = 'withdrawFromAccountVirtualBalance',

  // account device
  GetConnectedAccountDevices = 'getConnectedAccountDevices',
  GetConnectedAccountDevice = 'getConnectedAccountDevice',
  GetAccountDevice = 'getAccountDevice',
  CreateAccountDevice = 'createAccountDevice',
  RemoveAccountDevice = 'removeAccountDevice',
  DeployAccountDevice = 'deployAccountDevice',
  UnDeployAccountDevice = 'unDeployAccountDevice',

  // account transaction
  GetConnectedAccountTransactions = 'getConnectedAccountTransactions',
  GetConnectedAccountTransaction = 'getConnectedAccountTransaction',
  SendAccountTransaction = 'sendAccountTransaction',

  // account payment
  GetConnectedAccountPayments = 'getConnectedAccountPayments',
  GetConnectedAccountPayment = 'getConnectedAccountPayment',
  CreateAccountPayment = 'createAccountPayment',
  SignAccountPayment = 'signAccountPayment',
  GrabAccountPayment = 'grabAccountPayment',
  DepositAccountPayment = 'depositAccountPayment',
  WithdrawAccountPayment = 'withdrawAccountPayment',

  // account games
  GetConnectedAccountGames = 'getConnectedAccountGames',
  GetAccountGame = 'getAccountGame',
  CreateAccountGame = 'createAccountGame',
  JoinAccountGame = 'joinAccountGame',
  StartAccountGame = 'startAccountGame',
  UpdateAccountGame = 'updateAccountGame',

  // app
  GetApps = 'getApps',
  GetApp = 'getApp',
  GetAppOpenGames = 'getAppOpenGames',

  // action
  AcceptIncomingAction = 'acceptIncomingAction',
  DismissIncomingAction = 'dismissIncomingAction',

  // url
  ProcessIncomingUrl = 'processIncomingUrl',
  CreateRequestAddAccountDeviceUrl = 'createRequestAddAccountDeviceUrl',
  CreateRequestSignSecureCodeUrl = 'createRequestSignSecureCodeUrl',

  // utils
  SignPersonalMessage = 'signPersonalMessage',
}
