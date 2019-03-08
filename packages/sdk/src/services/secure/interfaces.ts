import { ILinkingService } from '../linking';

export interface ISecureService {
  createCodeUrl(): Promise<ILinkingService.TUrlCreator>;

  verifyCode(creatorAddress: string, code: string): Promise<void>;

  destroyCode(): Promise<void>;
}
