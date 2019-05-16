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
  TopUpAccountVirtualBalance = 'topUpAccountVirtualBalance',

  // account transaction
  GetConnectedAccountTransactions = 'getConnectedAccountTransactions',

  // account payment
  GetConnectedAccountPayments = 'getConnectedAccountPayments',
  CreateAccountPayment = 'createAccountPayment',
  GrabAccountPayment = 'grabAccountPayment',
  DepositAccountPayment = 'depositAccountPayment',
  WithdrawAccountPayment = 'withdrawAccountPayment',
}
