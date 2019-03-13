export interface ISecureService {
  createSecureCode(): Promise<string>;

  signSecureCode(creatorAddress: string, code: string): Promise<boolean>;

  destroySecureCode(): Promise<boolean>;
}
