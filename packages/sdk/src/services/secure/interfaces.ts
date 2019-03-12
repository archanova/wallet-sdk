import { ILinkingService } from '../linking';

export interface ISecureService {
  createCodeUrl(): Promise<ILinkingService.TUrlCreator>;

  signCode(creatorAddress: string, code: string): Promise<void>;

  destroyCode(): Promise<void>;
}
