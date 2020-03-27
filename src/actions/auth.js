import { AUTH_USER, AUTH_ERROR, SIGN_OUT } from './types';
import axios from 'axios';

const SIGNIN_URL = 'http://localhost:4000/api/auth/login';
const SIGNUP_URL = 'http://localhost:4000/api/auth/register';

export const signup = (formProps, callback) => async dispatch => {
  try {
    const response = await axios.post(SIGNUP_URL, formProps);
    dispatch({ type: AUTH_USER, payload: response.data.accessToken });
    localStorage.setItem('accessToken', response.data.accessToken)
    callback();
  } catch (e) {
    dispatch({ type: AUTH_ERROR, payload: 'Email in use' });
  }
}


export const signin = (formProps, callback) => async dispatch => {
  try {
    const response = await axios.post(SIGNIN_URL, formProps);
    dispatch({ type: AUTH_USER, payload: response.data.accessToken });
    localStorage.setItem('accessToken', response.data.accessToken)
    callback();
  } catch (e) {
    dispatch({ type: AUTH_ERROR, payload: 'Password doesn\'t match' });
  }
}

export const signout = () => {
  localStorage.removeItem('accessToken');
  return {
    type: SIGN_OUT
  }  
}