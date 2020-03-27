import { AUTH_USER, AUTH_ERROR, SIGN_OUT } from '../actions/types';

const INITIAL_STATE = {
  accessToken: false,
  errorMessage: '',
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_USER:
      return { ...state, accessToken: action.payload, errorMessage: '' };
    case AUTH_ERROR:
      return { ...state, accessToken: false, errorMessage: action.payload };
    case SIGN_OUT:
      return { ...state, accessToken: false, errorMessage: '' };
    default:
      return state;
  }
}