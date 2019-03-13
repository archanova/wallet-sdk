export interface IDeviceService {
  setup(): Promise<void>;

  reset(): Promise<void>;

  signPersonalMessage(message: string | Buffer): Promise<Buffer>;
}

export interface IDevice {
  address: string;
}
