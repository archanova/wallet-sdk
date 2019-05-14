import { IAction } from './interfaces';

export function createActionCreator<T = any>(type: string): (payload: T) => IAction<T> {
  return payload => ({
    type,
    payload,
  });
}
