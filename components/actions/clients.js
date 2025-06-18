import axios from 'axios';
import {HOST} from './allowedhost';
// import { returnErrors } from "./messages";
import {getClientEvents} from './calendar';
import {
  GET_CLIENTS_LIST,
  GET_CLIENTS_NEXT_PAGE,
  ADD_CLIENT,
  UPDATE_CLIENT,
  GET_CLIENTS_DETAIL,
  LOADING_CLIENTS_DATA,
  CLIENT_DELETE,
  CLEAR_CLIENTS_DETAIL,
} from './types';

import {tokenConfig} from './auth';

export const get_clients_list = (search, page) => (dispatch, getState) => {
  dispatch({type: LOADING_CLIENTS_DATA});

  axios
    .get(
      `${HOST}/api/clients-list-2?search=${search}&page=${page}`,
      tokenConfig(getState),
    )
    .then(res => {
      dispatch({
        type: GET_CLIENTS_LIST,
        payload: res.data,
      });
    });
};

export const delete_client = id => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})

  axios
    .delete(`${HOST}/api/clients-detail/${id}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: CLIENT_DELETE,
        payload: id,
      });
    });
};

export const get_clients_next_page = () => async (dispatch, getState) => {
  // dispatch({type: LOADING_CLIENTS_DATA});
  // dispatch({type: USER_LOADING})
  const url = getState().clients.next;
  const isLoading = getState().clients.isLoading;
  // dispatch({type: LOADING_CLIENTS_DATA});
  // console.log('elo  sdaiodnjiasnduasbduasbdusadbusadn');
  console.log(url);
  console.log(isLoading);
  if (!isLoading) {
    if (url) {
      dispatch({type: LOADING_CLIENTS_DATA});
      try {
        const res = await axios.get(url, tokenConfig(getState));
        // console.log('ugibugi');
        // console.log(JSON.stringify(res.data));
        dispatch({
          type: GET_CLIENTS_NEXT_PAGE,
          payload: res.data,
        });
      } catch (error) {
        console.error('Wystąpił błąd:', error);
      }
    }
  }
};

export const get_clients_detail = id => (dispatch, getState) => {
  dispatch({type: CLEAR_CLIENTS_DETAIL});

  axios
    .get(`${HOST}/api/clients-detail/${id}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_CLIENTS_DETAIL,
        payload: res.data,
      });
    });
};

export const add_client = data => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})

  axios
    .post(`${HOST}/api/clients-list/`, data, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: ADD_CLIENT,
        payload: res.data,
      });
    });
};
export const add_client_to_calendar = data => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})

  axios
    .post(`${HOST}/api/clients-list/`, data, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: ADD_CLIENT,
        payload: res.data,
      });
      dispatch({
        type: GET_CLIENTS_DETAIL,
        payload: res.data,
      });
    });
};

export const update_client = (data, id) => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})

  axios
    .put(`${HOST}/api/clients-detail/${id}/`, data, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: UPDATE_CLIENT,
        payload: res.data,
      });
    });
};
