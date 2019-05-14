import { createActionCreator, Screens } from '../shared';
import { Types } from './constants';

export const openScreen = createActionCreator<Screens>(Types.OpenScreen);
