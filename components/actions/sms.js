import axios from 'axios';
import {HOST} from './allowedhost';
import {SendDirectSms} from 'react-native-send-direct-sms';
import SendSMS from 'react-native-sms';
import {decode as atob, encode as btoa} from 'base-64';
// import { returnErrors } from "./messages";
import {
  GET_SMS_LIST,
  GET_SMS_LIST_DAY,
  GET_SMS_DETAIL,
  GET_SMS_LIST_NEXT_PAGE,
  SMS_LOADING,
  SMS_LOADING_DAY,
  SMS_LOADING_DETAIL,
  SEND_SMS,
} from './types';

import {tokenConfig} from './auth';

const splitMessage = (message, maxLength) => {
  const parts = [];
  while (message.length > 0) {
    parts.push(message.substring(0, maxLength));
    message = message.substring(maxLength);
  }
  return parts;
};

function splitMessageAtSpaces(message, maxLength) {
  const parts = [];
  let currentPart = '';

  for (let word of message.split(' ')) {
    if ((currentPart + word).length <= maxLength) {
      currentPart += (currentPart === '' ? '' : ' ') + word;
    } else {
      parts.push(currentPart);
      currentPart = word;
    }
  }

  if (currentPart !== '') {
    parts.push(currentPart);
  }

  return parts;
}

export const getSmsList = () => (dispatch, getState) => {
  dispatch({type: SMS_LOADING});
  // const partspage = getState().parts.partspage + 1;
  axios.get(`${HOST}/api/sms-to-send/`, tokenConfig(getState)).then(res => {
    dispatch({
      type: GET_SMS_LIST,
      payload: res.data,
    });
  });
};

export const getSmsDetail = id => (dispatch, getState) => {
  dispatch({type: SMS_LOADING_DETAIL});
  // const partspage = getState().parts.partspage + 1;
  axios
    .get(`${HOST}/api/sms-detail/${id}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_SMS_DETAIL,
        payload: res.data,
      });
    });
};

export const getSmsNextPage = () => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})
  // const search = getState().parts.search;
  const url = getState().sms.sms_next;
  const isLoading = getState().sms.isLoading;

  console.log(url);
  console.log(isLoading);
  if (!isLoading) {
    if (url) {
      dispatch({type: SMS_LOADING});
      axios.get(url, tokenConfig(getState)).then(res => {
        dispatch({
          type: GET_SMS_LIST_NEXT_PAGE,
          payload: res.data,
        });
      });
    }
  }
};

export const getSmsListDay = day => (dispatch, getState) => {
  dispatch({type: SMS_LOADING_DAY});

  axios
    .get(`${HOST}/api/sms-to-send-day/${day}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_SMS_LIST_DAY,
        payload: res.data,
      });
    });
};

export const SendSMSList = () => (dispatch, getState) => {
  const list = getState().sms.sms_list_day;
  const data = getState().group.group.smsNote;

  const done = id => {
    const body = {
      checked: true,
      error: false,
    };
    axios
      .patch(`${HOST}/api/sms-detail/${id}/`, body, tokenConfig(getState))
      .then(res => {
        dispatch({
          type: SEND_SMS,
          payload: res.data,
        });
      });
  };

  const noDone = id => {
    const body = {
      checked: false,
      error: true,
    };
    axios
      .patch(`${HOST}/api/sms-detail/${id}/`, body, tokenConfig(getState))
      .then(res => {
        dispatch({
          type: SEND_SMS,
          payload: res.data,
        });
      });
  };

  const splitMessageAtSpaces = (message, maxLength) => {
    const parts = [];
    let currentPart = '';

    for (let word of message.split(' ')) {
      if ((currentPart + word).length <= maxLength) {
        currentPart += (currentPart === '' ? '' : ' ') + word;
      } else {
        parts.push(currentPart);
        currentPart = word;
      }
    }

    if (currentPart !== '') {
      parts.push(currentPart);
    }

    return parts;
  };

  const maxSMSLength = 70; // Maksymalna długość wiadomości SMS (w znakach Unicode)

  const messageParts = splitMessageAtSpaces(data, maxSMSLength); // Podziel wiadomość na mniejsze części w miejscach spacji

  // Funkcja do wysyłania części wiadomości sekwencyjnie
  const sendSMSPartsSequentially = (parts, tel, id) => {
    const sendNextPart = index => {
      if (index < parts.length) {
        return SendDirectSms(tel, parts[index]) // Wyślij pojedynczą część wiadomości
          .then(() => {
            if (index === parts.length - 1) {
              // Oznacz jako zakończone, gdy wszystkie części zostaną wysłane
              done(id);
            } else {
              // Przejdź do wysyłki następnej części
              return sendNextPart(index + 1);
            }
          })
          .catch(() => {
            // Obsłuż błędy w przypadku niepowodzenia wysyłki części wiadomości
            noDone(id);
          });
      }
    };

    // Rozpocznij wysyłanie pierwszej części
    return sendNextPart(0);
  };

  list.forEach(element => {
    if (!element.checked || element.error) {
      sendSMSPartsSequentially(messageParts, '662051956');
      // SendDirectSms('662051956', data)
      //   .then(res => done(element.id))
      //   .catch(err => noDone(element.id));
    }
  });
};

export const SendSMSone = (tel, id) => (dispatch, getState) => {
  const data = getState().group.group.smsNote;

  const done = id => {
    const body = {
      checked: true,
      error: false,
    };
    axios
      .patch(`${HOST}/api/sms-detail/${id}/`, body, tokenConfig(getState))
      .then(res => {
        dispatch({
          type: SEND_SMS,
          payload: res.data,
        });
      });
  };

  const noDone = id => {
    const body = {
      checked: false,
      error: true,
    };
    axios
      .patch(`${HOST}/api/sms-detail/${id}/`, body, tokenConfig(getState))
      .then(res => {
        dispatch({
          type: SEND_SMS,
          payload: res.data,
        });
      });
  };

  const splitMessageAtSpaces = (message, maxLength) => {
    const parts = [];
    let currentPart = '';

    for (let word of message.split(' ')) {
      if ((currentPart + word).length <= maxLength) {
        currentPart += (currentPart === '' ? '' : ' ') + word;
      } else {
        parts.push(currentPart);
        currentPart = word;
      }
    }

    if (currentPart !== '') {
      parts.push(currentPart);
    }

    return parts;
  };

  const maxSMSLength = 70; // Maksymalna długość wiadomości SMS (w znakach Unicode)

  const messageParts = splitMessageAtSpaces(data, maxSMSLength); // Podziel wiadomość na mniejsze części w miejscach spacji

  // Funkcja do wysyłania części wiadomości sekwencyjnie
  const sendSMSPartsSequentially = (parts, tel, id) => {
    const sendNextPart = index => {
      if (index < parts.length) {
        return SendDirectSms(tel, parts[index]) // Wyślij pojedynczą część wiadomości
          .then(() => {
            if (index === parts.length - 1) {
              // Oznacz jako zakończone, gdy wszystkie części zostaną wysłane
              done(id);
            } else {
              // Przejdź do wysyłki następnej części
              return sendNextPart(index + 1);
            }
          })
          .catch(() => {
            // Obsłuż błędy w przypadku niepowodzenia wysyłki części wiadomości
            noDone(id);
          });
      }
    };

    // Rozpocznij wysyłanie pierwszej części
    return sendNextPart(0);
  };

  // Wyślij wszystkie części wiadomości sekwencyjnie
  sendSMSPartsSequentially(messageParts, tel, id);
};

export const sendSMSoneVer2 = tel => (dispatch, getState) => {
  const data = getState().group.group.smsNote;
  SendSMS.send(
    {
      body: data,
      recipients: [tel],
      successTypes: ['sent', 'queued'],
      allowAndroidSendWithoutReadPermission: true,
    },
    (completed, cancelled, error) => {},
  );
};

export const done = id => (dispatch, getState) => {
  const body = {
    checked: true,
    error: false,
  };
  axios
    .patch(`${HOST}/api/sms-detail/${id}/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: SEND_SMS,
        payload: res.data,
      });
    });
};

export const noDone = id => (dispatch, getState) => {
  const body = {
    checked: false,
    error: false,
  };
  axios
    .patch(`${HOST}/api/sms-detail/${id}/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: SEND_SMS,
        payload: res.data,
      });
    });
};
// export const clearParts = () => (dispatch, getState) => {
//   dispatch({type: CLEAR_PARTS});
//   dispatch({type: PARTS_SEARCH_INPUT, payload: ''});
//   // dispatch({type: USER_LOADING})
//   const search = getState().parts.search;

//   axios
//     .get(
//       `${HOST}/api/parts-list-avilable/?search=`,
//       tokenConfig(getState),
//     )
//     .then(res => {
//       dispatch({
//         type: GET_PARTS_LIST_AVILABLE,
//         payload: res.data,
//       });
//     });
//   axios
//     .get(`${HOST}/api/parts-list-all/?search=`, tokenConfig(getState))
//     .then(res => {
//       dispatch({
//         type: GET_PARTS_LIST_ALL,
//         payload: res.data,
//       });
//     });
// };

// export const get_parts_avilable_next_page = () => (dispatch, getState) => {
//   //   dispatch({type: LOADING_CLIENTS_DATA});

//   // dispatch({type: USER_LOADING})
//   const url = getState().parts.next_avilable;
//   const isLoading = getState().parts.isLoading;
//   const searchToogle = getState().parts.searchToogle;
//   //   dispatch({type: LOADING_CLIENTS_DATA});

//   if (!isLoading) {
//     if (!searchToogle) {
//       if (url) {
//         console.log('dostempne');
//         console.log(url);
//         dispatch({type: LOADING_PARTS_DATA});
//         axios.get(url, tokenConfig(getState)).then(res => {
//           dispatch({
//             type: GET_PARTS_AVILABLE_NEXT_PAGE,
//             payload: res.data,
//           });
//         });
//       }
//     }
//   }
// };

// export const get_parts_all_next_page = () => (dispatch, getState) => {
//   //   dispatch({type: LOADING_CLIENTS_DATA});

//   // dispatch({type: USER_LOADING})

//   const url = getState().parts.next_all;
//   const isLoading = getState().parts.isLoading;
//   const searchToogle = getState().parts.searchToogle;
//   // console.log(url);
//   // console.log(isLoading);
//   // console.log(searchToogle);get_parts_all_next_page

//   //   dispatch({type: LOADING_CLIENTS_DATA});
//   if (!isLoading) {
//     if (searchToogle) {
//       if (url) {
//         console.log('wszystkie');
//         console.log(url);
//         dispatch({type: LOADING_PARTS_DATA});
//         axios.get(url, tokenConfig(getState)).then(res => {
//           dispatch({
//             type: GET_PARTS_ALL_NEXT_PAGE,
//             payload: res.data,
//           });
//         });
//       }
//     }
//   }
// };

// export const getPartsDetail = id => (dispatch, getState) => {
//   dispatch({type: LOADING_DETAIL_PARTS});
//   dispatch({type: CLEAR_DETAIL_PARTS});

//   axios
//     .get(`${HOST}/api/parts-detail/${id}/`, tokenConfig(getState))
//     .then(res => {
//       dispatch({
//         type: GET_PARTS_DETAIL,
//         payload: res.data,
//       });
//     });
// };

// export const partsQuantity = (body, id) => (dispatch, getState) => {
//   // dispatch({type: USER_LOADING})
//   const quantity = getState().parts.quantity;
//   const color = getState().parts.color;

//   const data = {
//     quantity,
//     color,
//   };

//   axios
//     .patch(`${HOST}/api/update-part/${id}/`, data, tokenConfig(getState))
//     .then(res => {
//       dispatch({
//         type: UPDATE_DETAIL_PARTS,
//         payload: res.data,
//       });
//     });
// };

// export const partsback = id => (dispatch, getState) => {
//   // dispatch({type: USER_LOADING})

//   axios
//     .patch(`${HOST}/api/back-part/${id}/`, null, tokenConfig(getState))
//     .then(res => {
//       dispatch({
//         type: BACK_PARTS,
//         payload: id,
//       });
//     });
// };

// export const partsSearchInput = data => (dispatch, getState) => {
//   dispatch({type: PARTS_SEARCH_INPUT, payload: data});
// };
// export const partsAll = () => (dispatch, getState) => {
//   dispatch({type: PARTS_ALL});
// };
// export const partsAvilable = () => (dispatch, getState) => {
//   dispatch({type: PARTS_AVILABLE});
// };
// export const partsChangeColor = data => (dispatch, getState) => {
//   dispatch({type: PARTS_CHANGE_COLOR, payload: data});
// };
// export const partsChangeQuantity = data => (dispatch, getState) => {
//   dispatch({type: PARTS_CHANGE_QUANTITY, payload: data});
// };
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
