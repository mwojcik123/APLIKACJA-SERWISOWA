import axios from 'axios';
import {HOST} from './allowedhost';
// import { returnErrors } from "./messages";
import {
  GET_WORKS_LIST,
  GET_WORKS_ALL,
  GET_WORKS_YOUR,
  GET_WORKS_DONE,
  GET_WORKS_DETAIL,
  WORKS_DELEATE,
  WORKS_UPDATE,
  WORKS_ADD,
  WORKS_LOADING,
  WORKS_ALL,
  WORKS_DONE,
  WORKS_YOUR,
  WORKS_SEARCH_INPUT,
  GET_WORKS_ALL_NEXT_PAGE,
  GET_WORKS_DONE_NEXT_PAGE,
  GET_WORKS_YOUR_NEXT_PAGE,
  WORKS_ARE_NOT_DONE,
  WORKS_ARE_DONE,
  WORKS_CLEAR,
  WORKS_DETAIL_CLEAR,
  WORKS_LOADING_ALL,
  WORKS_LOADING_YOUR,
  WORKS_LOADING_DONE,
} from './types';

import {tokenConfig} from './auth';

export const getWorks = () => (dispatch, getState) => {
  dispatch({type: WORKS_LOADING_ALL});
  const search = getState().works.search;
  axios
    .get(`${HOST}/api/work-list/?search=${search}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_WORKS_ALL,
        payload: res.data,
      });
    });
};

export const getWorksServisant = () => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})

  dispatch({type: WORKS_LOADING_YOUR});
  const search = getState().works.search;
  axios
    .get(
      `${HOST}/api/work-list-servisant/?search=${search}`,
      tokenConfig(getState),
    )
    .then(res => {
      dispatch({
        type: GET_WORKS_YOUR,
        payload: res.data,
      });
    });
};

export const getWorksDone = () => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})
  dispatch({type: WORKS_LOADING_DONE});
  const search = getState().works.search;
  axios
    .get(`${HOST}/api/work-list-done/?search=${search}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_WORKS_DONE,
        payload: res.data,
      });
    });
};

export const clearWorks = () => (dispatch, getState) => {
  dispatch({type: WORKS_CLEAR});

  axios
    .get(`${HOST}/api/work-list/?search=`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_WORKS_ALL,
        payload: res.data,
      });
    });
  axios
    .get(`${HOST}/api/work-list-servisant/?search=`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_WORKS_YOUR,
        payload: res.data,
      });
    });
  axios
    .get(`${HOST}/api/work-list-done/?search=`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_WORKS_DONE,
        payload: res.data,
      });
    });
};

export const get_works_all_next_page = () => (dispatch, getState) => {
  //   dispatch({type: LOADING_CLIENTS_DATA});

  // dispatch({type: USER_LOADING})
  const url = getState().works.next_all;
  const isLoading = getState().works.isLoading;
  const thePage = getState().works.thePage;
  //   dispatch({type: LOADING_CLIENTS_DATA});
  console.log(url);
  if (!isLoading) {
    if (thePage == 'all') {
      if (url) {
        console.log(url);
        // dispatch({type: LOADING_PARTS_DATA});
        axios.get(url, tokenConfig(getState)).then(res => {
          dispatch({
            type: GET_WORKS_ALL_NEXT_PAGE,
            payload: res.data,
          });
        });
      }
    }
  }
};

export const get_works_your_next_page = () => (dispatch, getState) => {
  //   dispatch({type: LOADING_CLIENTS_DATA});

  // dispatch({type: USER_LOADING})
  const url = getState().works.next_your;
  const isLoading = getState().works.isLoading;
  const thePage = getState().works.thePage;
  //   dispatch({type: LOADING_CLIENTS_DATA});
  console.log(url);
  if (!isLoading) {
    if (thePage == 'your') {
      if (url) {
        console.log(url);
        // dispatch({type: LOADING_PARTS_DATA});
        axios.get(url, tokenConfig(getState)).then(res => {
          dispatch({
            type: GET_WORKS_YOUR_NEXT_PAGE,
            payload: res.data,
          });
        });
      }
    }
  }
};

export const get_works_done_next_page = () => (dispatch, getState) => {
  //   dispatch({type: LOADING_CLIENTS_DATA});

  // dispatch({type: USER_LOADING})
  const url = getState().works.next_done;
  const isLoading = getState().works.isLoading;
  const thePage = getState().works.thePage;
  //   dispatch({type: LOADING_CLIENTS_DATA});
  console.log(url);
  if (!isLoading) {
    if (thePage == 'done') {
      if (url) {
        console.log(url);
        // dispatch({type: LOADING_PARTS_DATA});
        axios.get(url, tokenConfig(getState)).then(res => {
          dispatch({
            type: GET_WORKS_DONE_NEXT_PAGE,
            payload: res.data,
          });
        });
      }
    }
  }
};

export const getWorkDetail = id => (dispatch, getState) => {
  dispatch({type: WORKS_DETAIL_CLEAR});
  axios
    .get(`${HOST}/api/work-detail/${id}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_WORKS_DETAIL,
        payload: res.data,
      });
    });
};

export const addWork = (body, day) => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})

  axios
    .post(`${HOST}/api/work-list/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: WORKS_ADD,
        payload: res.data,
      });
    });
};
export const updateWork = (body, id) => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})

  axios
    .put(`${HOST}/api/work-detail/${id}/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: WORKS_UPDATE,
        payload: res.data,
      });
    });
};
export const updateWorkDone = (body, id) => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})

  axios
    .patch(`${HOST}/api/work-detail/${id}/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: WORKS_ARE_DONE,
        payload: res.data,
      });
    });
};

export const updateWorkNotDone = (body, id) => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})
  const user = getState().member.member_user.id;
  axios
    .patch(`${HOST}/api/work-detail/${id}/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: WORKS_ARE_NOT_DONE,
        payload: {user, data: res.data},
      });
    });
};
export const deleateWork = id => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})

  axios
    .delete(`${HOST}/api/work-detail/${id}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: WORKS_DELEATE,
        payload: id,
      });
    });
};

export const worksSearchInput = data => (dispatch, getState) => {
  dispatch({type: WORKS_SEARCH_INPUT, payload: data});
};
export const worksAll = () => (dispatch, getState) => {
  dispatch({type: WORKS_ALL});
};
export const worksDone = () => (dispatch, getState) => {
  dispatch({type: WORKS_DONE});
};
export const worksYour = () => (dispatch, getState) => {
  dispatch({type: WORKS_YOUR});
};
