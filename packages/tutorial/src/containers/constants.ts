export enum Screens {
  // sdk
  Initialize = 'initialize',
  Reset = 'reset',

  // account
  CreateAccount = 'createAccount',
  UpdateAccount = 'updateAccount',
  ConnectAccount = 'connectAccount',
  DisconnectAccount = 'disconnectAccount',
  DeployAccount = 'deployAccount',
  SearchAccount = 'searchAccount',
  DepositToAccountVirtualBalance = 'depositToAccountVirtualBalance',

  // account transaction
  GetConnectedAccountTransactions = 'getConnectedAccountTransactions',

  // account payment
  CreateAccountPayment = 'createAccountPayment',
  GetConnectedAccountPayments = 'getConnectedAccountPayments',
}
