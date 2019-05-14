import { Types } from '../actions';
import { Screens, IAction } from '../shared';

export function screen(state: Screens = null, { type, payload }: IAction<Screens>): Screens {
  return type === Types.OpenScreen
    ? payload
    : state;
}
