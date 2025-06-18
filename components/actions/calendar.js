import axios from 'axios';
import {HOST} from './allowedhost';
// import { returnErrors } from "./messages";
import {
  LOAD_CALENDAR,
  REFRESH_CALENDAR,
  LOAD_CALENDAR_NEXT,
  LOAD_CALENDAR_PREV,
  LOAD_CALENDAR_3_NEXT,
  LOAD_CALENDAR_3_PREV,
  LOAD_CALENDAR_DAILY,
  LOAD_CALENDAR_DATA_ALL,
  LOAD_CALENDAR_DATA_MORE,
  IS_LOADING_CALENDAR_NEXT,
  IS_LOADING_CALENDAR_PREV,
  GET_EVENT,
  ADD_EVENT,
  CLEAR_EVENT,
  GET_CLIENT_EVENTS,
  LOADING_CLIENT_EVENTS,
  UPDATE_EVENT,
  DELEATE_EVENT,
  NEW_EVENT_ON_MON,
  NEW_EVENT_ON_TUE,
  NEW_EVENT_ON_WED,
  NEW_EVENT_ON_THU,
  NEW_EVENT_ON_FRI,
  GET_CLIENTS_DETAIL,
  CLEAR_CLIENTS_DETAIL,
  LOAD_CALENDAR_DAILY_FORMAT_PREV,
  LOAD_CALENDAR_DAILY_FORMAT_NEXT,
} from './types';
import moment from 'moment';
import {tokenConfig} from './auth';
const tabEvents = [
  NEW_EVENT_ON_MON,
  NEW_EVENT_ON_TUE,
  NEW_EVENT_ON_WED,
  NEW_EVENT_ON_THU,
  NEW_EVENT_ON_FRI,
];

export const getNextCalendar = () => (dispatch, getState) => {
  const servisant = getState().member.member_calendar.id;
  const weeks = getState().calendar.weeks;
  const day = weeks[weeks.length - 1][0].clone();
  const day1 = weeks[weeks.length - 1][1].clone();
  console.log(day.clone().format('YYYY-MM-DD'));
  if (weeks.length < 5) {
    dispatch({type: LOAD_CALENDAR_NEXT});

    axios
      .get(
        `${HOST}/api/calendarv4/${servisant}/${day1
          .clone()
          .add(1, 'week')
          .format('YYYY-MM-DD')}/`,
        tokenConfig(getState),
      )
      .then(res => {
        dispatch({
          type: LOAD_CALENDAR_DATA_MORE,
          payload: res.data,
        });
      });
  } else {
    dispatch({
      type: LOAD_CALENDAR,
      payload: day,
    });
    axios
      .get(
        `${HOST}/api/calendarv5/${servisant}/${day1
          .clone()
          .format('YYYY-MM-DD')}/`,
        tokenConfig(getState),
      )
      .then(res => {
        dispatch({
          type: LOAD_CALENDAR_DATA_ALL,
          payload: res.data,
        });
      });
  }
};

export const getPrevCalendar = () => (dispatch, getState) => {
  const servisant = getState().member.member_calendar.id;
  const weeks = getState().calendar.weeks;
  const day = weeks[0][0].clone();
  const day1 = weeks[0][1].clone();
  console.log('????');
  console.log(day.clone().format('YYYY-MM-DD'));
  if (weeks.length < 5) {
    dispatch({type: LOAD_CALENDAR_PREV});

    axios
      .get(
        `${HOST}/api/calendarv4/${servisant}/${day1
          .clone()
          .subtract(1, 'week')
          .format('YYYY-MM-DD')}/`,
        tokenConfig(getState),
      )
      .then(res => {
        dispatch({
          type: LOAD_CALENDAR_DATA_MORE,
          payload: res.data,
        });
      });
  } else {
    dispatch({
      type: LOAD_CALENDAR,
      payload: day,
    });
    axios
      .get(
        `${HOST}/api/calendarv5/${servisant}/${day1
          .clone()
          .format('YYYY-MM-DD')}/`,
        tokenConfig(getState),
      )
      .then(res => {
        dispatch({
          type: LOAD_CALENDAR_DATA_ALL,
          payload: res.data,
        });
      });
  }
};

export const getNextCalendarDaily = () => (dispatch, getState) => {
  const servisant = getState().member.member_calendar.id;
  const weeks = getState().calendar.days_format;
  const day = weeks[weeks.length - 1].clone();
  if (weeks.length < 5) {
    dispatch({type: LOAD_CALENDAR_DAILY_FORMAT_NEXT});

    //   axios
    //     .get(
    //       `${HOST}/api/calendarv4/${servisant}/${day1
    //         .clone()
    //         .add(1, 'week')
    //         .format('YYYY-MM-DD')}/`,
    //       tokenConfig(getState),
    //     )
    //     .then(res => {
    //       dispatch({
    //         type: LOAD_CALENDAR_DATA_MORE,
    //         payload: res.data,
    //       });
    //     });
    // } else {
    //   dispatch({
    //     type: LOAD_CALENDAR,
    //     payload: day,
    //   });
    //   axios
    //     .get(
    //       `${HOST}/api/calendarv5/${servisant}/${day1
    //         .clone()
    //         .format('YYYY-MM-DD')}/`,
    //       tokenConfig(getState),
    //     )
    //     .then(res => {
    //       dispatch({
    //         type: LOAD_CALENDAR_DATA_ALL,
    //         payload: res.data,
    //       });
    //     });
  }
};

export const getPrevCalendarDaily = () => (dispatch, getState) => {
  const servisant = getState().member.member_calendar.id;
  const weeks = getState().calendar.days_format;
  const day = weeks[0].clone();
  if (weeks.length < 5) {
    dispatch({type: LOAD_CALENDAR_DAILY_FORMAT_PREV});

    //   axios
    //     .get(
    //       `${HOST}/api/calendarv4/${servisant}/${day1
    //         .clone()
    //         .subtract(1, 'week')
    //         .format('YYYY-MM-DD')}/`,
    //       tokenConfig(getState),
    //     )
    //     .then(res => {
    //       dispatch({
    //         type: LOAD_CALENDAR_DATA_MORE,
    //         payload: res.data,
    //       });
    //     });
    // } else {
    //   dispatch({
    //     type: LOAD_CALENDAR,
    //     payload: day,
    //   });
    //   axios
    //     .get(
    //       `${HOST}/api/calendarv5/${servisant}/${day1
    //         .clone()
    //         .format('YYYY-MM-DD')}/`,
    //       tokenConfig(getState),
    //     )
    //     .then(res => {
    //       dispatch({
    //         type: LOAD_CALENDAR_DATA_ALL,
    //         payload: res.data,
    //       });
    //     });
  }
};

export const getCalendarToday = () => (dispatch, getState) => {
  const servisant = getState().member.member_calendar.id;
  const day = moment().startOf('week');

  dispatch({
    type: LOAD_CALENDAR,
    payload: day,
  });
  axios
    .get(
      `${HOST}/api/calendarv5/${servisant}/${day
        .clone()
        .add(1, 'week')
        .format('YYYY-MM-DD')}/`,
      tokenConfig(getState),
    )
    .then(res => {
      dispatch({
        type: LOAD_CALENDAR_DATA_ALL,
        payload: res.data,
      });
    });
};

export const getCalendarv4 = (servisant, data) => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})
  console.log(data);
  axios
    .get(`${HOST}/api/calendarv4/${servisant}/${data}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: LOAD_CALENDAR_NEXT,
        payload: res.data,
      });
    });
};

export const getCalendarv5 = (servisant, data) => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})
  console.log(data);
  axios
    .get(`${HOST}/api/calendarv5/${servisant}/${data}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: LOAD_CALENDAR,
        payload: res.data,
      });
    });
};

export const getCalendarv6 = () => (dispatch, getState) => {
  const servisant = getState().member.member_calendar.id;
  const weeks = getState().calendar.weeks;
  const firstWeek = weeks[0][0].format('YYYY-MM-DD');
  const lastWeek = weeks[weeks.length - 1][5].format('YYYY-MM-DD');
  // dispatch({type: USER_LOADING})
  // console.log(data);
  axios
    .get(
      `${HOST}/api/calendarv6/${servisant}/${firstWeek}/${lastWeek}/`,
      tokenConfig(getState),
    )
    .then(res => {
      dispatch({
        type: LOAD_CALENDAR_DATA_ALL,
        payload: res.data,
      });
    })
    .catch(error => console.log('error'));
};

export const refreshCalendar = () => (dispatch, getState) => {
  const servisant = getState().member.member_calendar.id;
  const weeks = getState().calendar.weeks;
  const firstWeek = weeks[0][0].format('YYYY-MM-DD');
  const lastWeek = weeks[weeks.length - 1][5].format('YYYY-MM-DD');
  dispatch({type: REFRESH_CALENDAR});
  // console.log(data);
  axios
    .get(
      `${HOST}/api/calendarv6/${servisant}/${firstWeek}/${lastWeek}/`,
      tokenConfig(getState),
    )
    .then(res => {
      dispatch({
        type: LOAD_CALENDAR_DATA_ALL,
        payload: res.data,
      });
    })
    .catch(error => console.log('error'));
};
// export const getCalendarNext = (ser, reff) => (dispatch, getState) => {
//   // dispatch({type: USER_LOADING})
//   const servisant = getState().member.member_user.id;
//   const next_week = getState().calendar.next;
//   const prev_week = getState().calendar.prev;
//   const ISLOADING = getState().calendar.isloadingNext;
//   if (!ISLOADING) {
//     dispatch({type: IS_LOADING_CALENDAR_NEXT});
//     axios
//       .get(
//         `${HOST}/api/calendar/${ser}/${next_week}/0/`,
//         tokenConfig(getState),
//       )
//       .then(res => {
//         dispatch({
//           type: LOAD_CALENDAR_NEXT,
//           payload: {data: res.data, reff},
//         });
//       });
//   }
// };
// export const getCalendarPrev = (ser, ref) => (dispatch, getState) => {
//   // dispatch({type: USER_LOADING})
//   const servisant = getState().member.member_user.id;
//   const next_week = getState().calendar.next;
//   const prev_week = getState().calendar.prev;
//   const ISLOADING = getState().calendar.isloadingPrev;
//   if (!ISLOADING) {
//     dispatch({type: IS_LOADING_CALENDAR_PREV});
//     axios
//       .get(
//         `${HOST}/api/calendar/${ser}/0/${prev_week}/`,
//         tokenConfig(getState),
//       )
//       .then(res => {
//         dispatch({
//           type: LOAD_CALENDAR_PREV,
//           payload: {data: res.data, ref},
//         });
//       });
//   }
// };
export const getCalendarDaily = () => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})

  axios.get(`${HOST}/api/calendar/daily/`, tokenConfig(getState)).then(res => {
    dispatch({
      type: LOAD_CALENDAR_DAILY,
      payload: res.data,
    });
  });
};

export const getCalendarDailyFormatScroll = () => (dispatch, getState) => {
  const servisant = getState().member.member_calendar.id;
  const weeks = getState().calendar.weeks;
  const firstWeek = weeks[0][0].format('YYYY-MM-DD');
  const lastWeek = weeks[weeks.length - 1][5].format('YYYY-MM-DD');
  // dispatch({type: USER_LOADING})
  // console.log(data);
  axios
    .get(
      `${HOST}/api/calendar/dailyscroll/${servisant}/${firstWeek}/${lastWeek}/`,
      tokenConfig(getState),
    )
    .then(res => {
      dispatch({
        type: LOAD_CALENDAR_DATA_ALL,
        payload: res.data,
      });
    })
    .catch(error => console.log('error'));
};

export const getEvent = id => (dispatch, getState) => {
  dispatch({type: CLEAR_EVENT});
  dispatch({type: CLEAR_CLIENTS_DETAIL});

  axios
    .get(`${HOST}/api/visits-detail/${id}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_EVENT,
        payload: res.data,
      });
      dispatch({
        type: GET_CLIENTS_DETAIL,
        payload: res.data.client,
      });
    });
};
export const getClientEvents = client => (dispatch, getState) => {
  dispatch({type: LOADING_CLIENT_EVENTS});

  axios
    .get(`${HOST}/api/clients-events/${client}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_CLIENT_EVENTS,
        payload: res.data,
      });
    });
};

export const addEvent = (body, day) => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})
  console.log('GGTGTGTG');
  console.log(`${day}`);
  console.log('GGTGTGTG');

  // console.log(day.format('YYYY-MM-DD'));

  axios
    .post(`${HOST}/api/visits-list/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: ADD_EVENT,
        payload: {data: res.data, day: `${day}`},
      });
    });
};
export const updateEvent = (body, id, data_wizyty) => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})
  console.log('data_wizyty');
  console.log(data_wizyty);
  console.log('data_wizyty');

  axios
    .put(`${HOST}/api/visits-detail/${id}/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: UPDATE_EVENT,
        payload: {data: res.data, day: `${data_wizyty}`},
      });
    })
    .catch(err => {
      console.log(err);
    });
};
export const deleateEvent = (id, day) => (dispatch, getState) => {
  // dispatch({type: USER_LOADING})

  axios
    .delete(`${HOST}/api/visits-detail/${id}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: DELEATE_EVENT,
        payload: {data: id, day: day},
      });
    });
};
