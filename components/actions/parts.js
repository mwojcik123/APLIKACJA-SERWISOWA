import axios from 'axios';
import {HOST} from './allowedhost';
// import { returnErrors } from "./messages";
import {
  GET_PARTS_LIST,
  GET_PARTS_LIST_ALL,
  GET_PARTS_LIST_AVILABLE,
  GET_PARTS_DETAIL,
  ONE_MORE_PARTS,
  ONE_LESS_PARTS,
  BACK_PARTS,
  LOADING_DETAIL_PARTS,
  PARTS_SEARCH_INPUT,
  PARTS_ALL,
  PARTS_AVILABLE,
  LOADING_PARTS_DATA,
  GET_PARTS_NEXT_PAGE,
  GET_PARTS_ALL_NEXT_PAGE,
  GET_PARTS_AVILABLE_NEXT_PAGE,
  UPDATE_DETAIL_PARTS,
  PARTS_CHANGE_COLOR,
  PARTS_CHANGE_QUANTITY,
  PARTS_LOADING_ALL,
  PARTS_LOADING_AVILABLE,
  CLEAR_DETAIL_PARTS,
  CLEAR_PARTS,
} from './types';

import {tokenConfig} from './auth';

export const getAllParts = () => (dispatch, getState) => {
  dispatch({type: PARTS_LOADING_ALL});
  const search = getState().parts.search;
  // const partspage = getState().parts.partspage + 1;
  axios
    .get(`${HOST}/api/parts-list-all/?search=${search}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_PARTS_LIST_ALL,
        payload: res.data,
      });
    });
};

export const getAvilableParts = () => (dispatch, getState) => {
  dispatch({type: PARTS_LOADING_AVILABLE});
  // dispatch({type: USER_LOADING})
  const search = getState().parts.search;

  axios
    .get(
      `${HOST}/api/parts-list-avilable/?search=${search}`,
      tokenConfig(getState),
    )
    .then(res => {
      dispatch({
        type: GET_PARTS_LIST_AVILABLE,
        payload: res.data,
      });
    });
};

export const clearParts = () => (dispatch, getState) => {
  dispatch({type: CLEAR_PARTS});
  dispatch({type: PARTS_SEARCH_INPUT, payload: ''});
  // dispatch({type: USER_LOADING})
  const search = getState().parts.search;

  axios
    .get(`${HOST}/api/parts-list-avilable/?search=`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_PARTS_LIST_AVILABLE,
        payload: res.data,
      });
    });
  axios
    .get(`${HOST}/api/parts-list-all/?search=`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_PARTS_LIST_ALL,
        payload: res.data,
      });
    });
};

export const get_parts_avilable_next_page = () => (dispatch, getState) => {
  //   dispatch({type: LOADING_CLIENTS_DATA});

  // dispatch({type: USER_LOADING})
  const url = getState().parts.next_avilable;
  const isLoading = getState().parts.isLoading;
  const searchToogle = getState().parts.searchToogle;
  //   dispatch({type: LOADING_CLIENTS_DATA});

  if (!isLoading) {
    if (!searchToogle) {
      if (url) {
        console.log('dostempne');
        console.log(url);
        dispatch({type: LOADING_PARTS_DATA});
        axios.get(url, tokenConfig(getState)).then(res => {
          dispatch({
            type: GET_PARTS_AVILABLE_NEXT_PAGE,
            payload: res.data,
          });
        });
      }
    }
  }
};

export const get_parts_all_next_page = () => (dispatch, getState) => {
  //   dispatch({type: LOADING_CLIENTS_DATA});

  // dispatch({type: USER_LOADING})

  const url = getState().parts.next_all;
  const isLoading = getState().parts.isLoading;
  const searchToogle = getState().parts.searchToogle;
  // console.log(url);
  // console.log(isLoading);
  // console.log(searchToogle);get_parts_all_next_page

  //   dispatch({type: LOADING_CLIENTS_DATA});
  if (!isLoading) {
    if (searchToogle) {
      if (url) {
        console.log('wszystkie');
        console.log(url);
        dispatch({type: LOADING_PARTS_DATA});
        axios.get(url, tokenConfig(getState)).then(res => {
          dispatch({
            type: GET_PARTS_ALL_NEXT_PAGE,
            payload: res.data,
          });
        });
      }
    }
  }
};

export const getPartsDetail = id => (dispatch, getState) => {
  dispatch({type: LOADING_DETAIL_PARTS});
  dispatch({type: CLEAR_DETAIL_PARTS});

  axios
    .get(`${HOST}/api/parts-detail/${id}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_PARTS_DETAIL,
        payload: res.data,
      });
    });
};

export const partsQuantity = (body, id) => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})
  const quantity = getState().parts.quantity;
  const color = getState().parts.color;

  const data = {
    quantity,
    color,
  };

  axios
    .patch(`${HOST}/api/update-part/${id}/`, data, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: UPDATE_DETAIL_PARTS,
        payload: res.data,
      });
    });
};

export const partsback = id => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})

  axios
    .patch(`${HOST}/api/back-part/${id}/`, null, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: BACK_PARTS,
        payload: id,
      });
    });
};

export const partsSearchInput = data => (dispatch, getState) => {
  dispatch({type: PARTS_SEARCH_INPUT, payload: data});
};
export const partsAll = () => (dispatch, getState) => {
  dispatch({type: PARTS_ALL});
};
export const partsAvilable = () => (dispatch, getState) => {
  dispatch({type: PARTS_AVILABLE});
};
export const partsChangeColor = data => (dispatch, getState) => {
  dispatch({type: PARTS_CHANGE_COLOR, payload: data});
};
export const partsChangeQuantity = data => (dispatch, getState) => {
  dispatch({type: PARTS_CHANGE_QUANTITY, payload: data});
};
// export const oneLessParts = (body, id) => (dispatch, getState) => {
//   // dispatch({type: USER_LOADING})

//   axios
//     .put(`${HOST}/api/work-detail/${id}/`, body, tokenConfig(getState))
//     .then(res => {
//       dispatch({
//         type: ONE_LESS_PARTS,
//         payload: res.data,
//       });
//     });
// };
