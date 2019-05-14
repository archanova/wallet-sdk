import { reduxSdkReducer as sdk } from '@archanova/sdk';
import { combineReducers } from 'redux';
import { screen } from './screen';

export default combineReducers({
  sdk,
  screen,
});
