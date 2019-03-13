export interface ISessionService {
  createSession(): Promise<void>;

  resetSession(): Promise<void>;
}
