import axios from 'axios';
import {HOST} from './allowedhost';
// import { returnErrors } from "./messages";
import {
  LOGIN_SUCCES,
  LOGIN_FAIL,
  GET_BEER,
  REGISTER_SUCCES,
  REGISTER_FAIL,
  AUTH_ERROR,
  USER_LOADING,
  LOGOUT_SUCCES,
  CLEAR_GROUP,
  LOAD_OTHER_USER,
  RETRIEVE_TOKEN,
  USER_LOADED,
  CLIENT_CLEAR,
  CLEAR_PARTS,
  CLEAR_CALENDAR,
} from './types';

export const loadUser = () => (dispatch, getState) => {
  dispatch({type: USER_LOADING});
  axios
    .get(`${HOST}/api/user/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    })
    .catch(err => {
      // dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR,
      });
    });
};
export const loadUser2 = tentoken => (dispatch, getState) => {
  dispatch({type: USER_LOADING});

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${tentoken}`,
    },
  };

  axios
    .get(`${HOST}/api/user/`, config)
    .then(res => {
      dispatch({
        type: USER_LOADED,
        payload: {token: tentoken, user: {...res.data}},
      });
    })
    .catch(err => {
      // dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR,
      });
    });
};

export const login = (email, password) => dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };
  const body = JSON.stringify({email, password});
  console.log(body);
  axios
    .post(`${HOST}/api/login/`, body, config)
    .then(res => {
      dispatch({
        type: LOGIN_SUCCES,
        payload: res.data,
      });
    })
    .catch(err => {
      // dispatch(returnErrors(err.response.data, err.response.status));
      console.log(err);
      dispatch({
        type: LOGIN_FAIL,
      });
    });
};
export const register = (email, username, password) => dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({email, username, password});
  console.log(body);
  axios
    .post(`${HOST}/api/register/`, body, config)
    .then(res => {
      dispatch({
        type: REGISTER_SUCCES,
        payload: res.data,
      });
    })
    .catch(err => {
      // dispatch(returnErrors(err.response.data, err.response.status));
      // console.log("ASa");
      dispatch({
        type: REGISTER_FAIL,
      });
    });
};

export const Logout = () => (dispatch, getState) => {
  axios.post(`${HOST}/api/logout/`, null, tokenConfig(getState)).then(res => {
    dispatch({
      type: LOGOUT_SUCCES,
    });
    dispatch({
      type: CLIENT_CLEAR,
    });
    dispatch({
      type: CLEAR_PARTS,
    });
    dispatch({
      type: CLEAR_CALENDAR,
    });
  });
  // .catch((err) => {
  //     dispatch(returnErrors(err.response.data, err.response.status));
  // });
};

export const getbeer = () => dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  axios.get('api.thecatapi.com/v1/images/search', config).then(res => {
    console.log(res);
    dispatch({
      type: GET_BEER,
      payload: res.data,
    });
  });
};

export const tokenConfig = getState => {
  const token = getState().auth.token;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }
  return config;
};

export const tokenConfigWithForm = getState => {
  const token = getState().auth.token;

  const config = {
    headers: {
      'Content-Type':
        'multipart/form-data; boundary=----WebKitFormBoundarydMIgtiA2YeB1Z0kl',
    },
  };

  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }
  return config;
};
