import axios from 'axios';

// import { returnErrors } from "./messages";
import {CHAT_LIST, CHAT_MESSAGES, SEND_MESSAGE, NEW_MESSAGE} from './types';
import {tokenConfig, tokenConfigWithForm} from './auth';
import {HOST} from './allowedhost';
export const getChatList = () => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})

  axios.get(`${HOST}/api/chat-list/`, tokenConfig(getState)).then(res => {
    dispatch({
      type: CHAT_LIST,
      payload: res.data,
    });
  });
};

export const newMessage = () => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})
  axios.get(`${HOST}/api/chat-newmessage/`, tokenConfig(getState)).then(res => {
    dispatch({
      type: NEW_MESSAGE,
      payload: res.data,
    });
  });
};

export const getChatMessages = (sender, receiver) => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})

  axios
    .get(
      `${HOST}/api/messages/${sender.id}/${receiver}/50/`,
      tokenConfig(getState),
    )
    .then(res => {
      dispatch({
        type: CHAT_MESSAGES,
        payload: res.data,
      });
    });
};

export const getChatGroupMessages =
  (group, messagesInt) => (dispatch, getState) => {
    // dispatch({type: USER_LOADING})

    axios
      .get(
        `${HOST}/api/messages-group/${group}/${messagesInt}/`,
        tokenConfig(getState),
      )
      .then(res => {
        dispatch({
          type: CHAT_MESSAGES,
          payload: res.data,
        });
      });
  };

export const SendChatGroupMessages =
  (group, messagesInt, body) => (dispatch, getState) => {
    // dispatch({type: USER_LOADING})

    axios
      .post(
        `${HOST}/api/messages-group/${group.id}/${messagesInt}/`,
        body,
        tokenConfig(getState),
      )
      .then(res => {
        dispatch({
          type: SEND_MESSAGE,
          payload: res.data,
        });
      });
  };
export const reloadChatMessages =
  (sender, receiver, messagesInt) => (dispatch, getState) => {
    // dispatch({type: USER_LOADING})

    axios
      .get(
        `${HOST}/api/messages/${sender}/${receiver}/${messagesInt}/`,
        tokenConfig(getState),
      )
      .then(res => {
        dispatch({
          type: CHAT_MESSAGES,
          payload: res.data,
        });
      });
  };

export const sendMessage =
  (sender, receiver, formdata) => (dispatch, getState) => {
    // dispatch({type: USER_LOADING})
    // const body = JSON.stringify({ message });
    // console.log(body);
    axios
      .post(
        `${HOST}/api/messages/${sender.id}/${receiver.id}/1/`,
        formdata,
        tokenConfig(getState),
      )
      .then(res => {
        dispatch({
          type: SEND_MESSAGE,
          payload: res.data,
        });
      });
  };
