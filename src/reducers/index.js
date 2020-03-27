import { combineReducers } from 'redux';
import auth from './auth';
import posts from './posts';
import { reducer as formReducer } from 'redux-form';

export default combineReducers({
  auth,
  posts,
  form: formReducer
});