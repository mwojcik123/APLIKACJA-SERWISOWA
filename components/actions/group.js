import axios from 'axios';
import {tokenConfig} from './auth';
import {GROUP_FAIL, LOAD_GROUP, GROUP_UPDATE} from './types';
import {HOST} from './allowedhost';

export const loadGroup = () => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})

  // axios
  //   .get("127.0.0.1/api/get-group/", tokenConfig(getState))
  //   .then((res) => {
  //     dispatch({
  //       type: LOAD_GROUP,
  //       payload: res.data,
  //     });
  //   })
  //   .catch((err) => {
  //     dispatch({
  //       type: GROUP_FAIL,
  //     });
  //   });s
  axios
    .get(`${HOST}/api/get-groupbymember/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: LOAD_GROUP,
        payload: res.data,
      });
    })
    .catch(err => {
      dispatch({
        type: GROUP_FAIL,
      });
    });
};

export const updateGroup = body => (dispatch, getState) => {
  axios
    .patch(`${HOST}/api/get-group/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GROUP_UPDATE,
        payload: res.data,
      });
    });
};
