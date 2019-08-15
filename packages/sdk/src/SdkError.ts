import { ApiError, EthError } from './modules';

export class SdkError extends Error {
  public static isSdkError(err: any): boolean {
    return (
      typeof err === 'object' &&
      err &&
      err instanceof this
    );
  }

  public static fromAny(err: any): Error {
    let result: Error = null;

    switch (typeof err) {
      case 'string':
        result = new Error(err);
        break;

      case 'object':
        if (err instanceof Error) {
          result = err;
        } else if (ApiError.isApiError(err)) {
          const { error, errors, message } = err as ApiError;
          result = new SdkError(error || message, SdkError.Types.Http, errors, err);
        } else if (EthError.isEthError(err)) {
          const { message } = err as EthError;
          result = new SdkError(message, SdkError.Types.EthNode);
        } else if (err instanceof Error) {
          const { message } = err;
          result = new SdkError(message, undefined, err);
        }
    }

    return result;
  }

  public static throwFromAny(err: any): any {
    throw this.fromAny(err);
  }

  public static throwEthTransactionReverted(data?: any): any {
    throw new SdkError('reverted', SdkError.Types.EthTransaction, data);
  }

  private constructor(
    message: string = 'unknown',
    public readonly type: SdkError.Types = SdkError.Types.Internal,
    public readonly data?: any,
    public readonly origin?: any,
  ) {
    super(message);
  }

  public toRawObject(): {
    message: string;
    type: SdkError.Types;
    data: any;
  } {
    return {
      message: this.message,
      type: this.type,
      data: this.data || null,
    };
  }
}

export namespace SdkError {
  export enum Types {
    Internal = 'Internal',
    Http = 'Http',
    EthNode = 'EthNode',
    EthTransaction = 'EthTransaction',
  }
}
