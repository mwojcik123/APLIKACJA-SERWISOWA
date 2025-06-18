import axios from 'axios';
import {HOST} from './allowedhost';
// import { returnErrors } from "./messages";
import {
  GET_MEMBERS,
  GET_INVITE_LIST,
  GET_USERS_LIST,
  MEMBER_USER,
  UPDATE_MEMBER,
  CHANGE_MEMBER_CALENDAR,
  GET_MEMBER_DETAIL,
  UPDATE_MEMBER_SOBOTAUS,
} from './types';
import {tokenConfig} from './auth';

export const get_member_user = () => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})

  axios.get(`${HOST}/api/member-user/`, tokenConfig(getState)).then(res => {
    dispatch({
      type: MEMBER_USER,
      payload: res.data,
    });
  });
};

export const changeMemberCalendar = value => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})

  dispatch({type: CHANGE_MEMBER_CALENDAR, payload: value});
};
GET_MEMBER_DETAIL;
export const getMembers = () => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})

  axios.get(`${HOST}/api/member-list/`, tokenConfig(getState)).then(res => {
    dispatch({
      type: GET_MEMBERS,
      payload: res.data,
    });
  });
};

export const getMemberDetail = id => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})

  axios
    .get(`${HOST}/api/member-detail/${id}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_MEMBER_DETAIL,
        payload: res.data,
      });
    });
};
export const updateMembers = (permissions, id) => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})
  const conn = JSON.stringify({permissions});
  axios
    .put(`${HOST}/api/member-detail/${id}/`, conn, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: UPDATE_MEMBER,
        payload: res.data,
      });
    });
};
export const updateMembersSobotaus = (data, id) => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})

  axios
    .put(`${HOST}/api/member-detail/${id}/`, data, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: UPDATE_MEMBER_SOBOTAUS,
        payload: res.data,
      });
    });
};

export const getInviteList = () => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})

  axios.get(`${HOST}/api/invite-list/`, tokenConfig(getState)).then(res => {
    dispatch({
      type: GET_INVITE_LIST,
      payload: res.data,
    });
  });
};

export const acceptInviteDetail = id => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})
  const is_accepted = {is_accepted: true};
  axios.patch(
    `${HOST}/api/invite-detail/${id}/ `,
    is_accepted,
    tokenConfig(getState),
  );
};

export const searchUsers = search => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})

  axios
    .get(`${HOST}/api/userlist?search=${search}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_USERS_LIST,
        payload: res.data,
      });
    });
};

export const addUserToGroup = (person, group) => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})
  const content = {
    person: person,
    group: group,
  };
  axios.post(`${HOST}/api/invite-user/`, content, tokenConfig(getState));
};
