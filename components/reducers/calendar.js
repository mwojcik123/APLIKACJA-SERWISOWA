import {
  LOAD_CALENDAR,
  EVENT_DATE,
  REFRESH_CALENDAR,
  LOAD_CALENDAR_NEXT,
  LOAD_CALENDAR_PREV,
  LOAD_CALENDAR_DATA_MORE,
  LOAD_CALENDAR_DATA_ALL,
  LOAD_CALENDAR_3_NEXT,
  LOAD_CALENDAR_3_PREV,
  IS_LOADING_CALENDAR_NEXT,
  IS_LOADING_CALENDAR_PREV,
  LOAD_CALENDAR_DAILY,
  CLEAR_CALENDAR_DAILY,
  LOAD_CALENDAR_DAILY_FORMAT_NEXT,
  LOAD_CALENDAR_DAILY_FORMAT_PREV,
  // CLEAR_CALENDAR,
  LOAD_CALENDAR_DAILY_FORMAT,
  CLEAR_CALENDAR,
  GET_EVENT,
  GET_CLIENT_EVENTS,
  CLEAR_CLIENT_EVENTS,
  LOADING_CLIENT_EVENTS,
  UPDATE_EVENT,
  DELEATE_EVENT,
  NEW_EVENT_ON_MON,
  NEW_EVENT_ON_TUE,
  NEW_EVENT_ON_WED,
  NEW_EVENT_ON_THU,
  NEW_EVENT_ON_FRI,
  CLEAR_EVENT,
  ADD_EVENT,
} from '../actions/types.js';
import moment from 'moment';

const generateWeek = startDate => {
  const daysInWeek = [];
  for (let i = 0; i < 7; i++) {
    daysInWeek.push(startDate.clone().add(i, 'days'));
  }
  return daysInWeek;
};

const adjustDay = date => {
  if (date.isoWeekday() === 7) {
    return date.subtract(2, 'days'); // Jeśli niedziela → piątek
  } else if (date.isoWeekday() === 6) {
    return date.add(2, 'days'); // Jeśli sobota → poniedziałek
  }
  return date;
};

const sort_events = tablica => {
  tablica.sort(function (obj1, obj2) {
    // pobierz godziny z obiektów
    const time1 = obj1.godzina_wizyty.split(':');
    const time2 = obj2.godzina_wizyty.split(':');
    const time1_2 = obj1.godzina_wizyty2.split(':');
    const time2_2 = obj2.godzina_wizyty2.split(':');

    // przekształć godziny na minuty
    const minutes1 = +time1[0] * 60 + +time1[1];
    const minutes2 = +time2[0] * 60 + +time2[1];
    const minutes1_2 = +time1_2[0] * 60 + +time1_2[1];
    const minutes2_2 = +time2_2[0] * 60 + +time2_2[1];

    // porównaj godziny_wizyty
    if (minutes1 !== minutes2) {
      return minutes1 - minutes2;
    }

    // jeśli godziny_wizyty są równe, porównaj godziny_wizyty2
    return minutes1_2 - minutes2_2;
  });
  return tablica;
};

const initialState = {
  // the: null,
  event_data: null,
  client: null,
  refreshing: false,
  Loading: false,
  LoadingDaily: false,
  date: moment(),
  isLoadingNext: false,
  isLoadingPrev: false,
  next: 1,
  prev: 1,

  format_day: {
    events: [],
    day: false,
  },

  current_week: false,
  next_week: [],
  prev_week: [],

  event_detail: {},
  loading_client_events: false,
  clients_events: {},
  days_format: [
    adjustDay(moment().subtract(1, 'day')),
    adjustDay(moment()),
    adjustDay(moment().add(1, 'day')),
  ],
  weeks: [
    generateWeek(moment().startOf('week').clone().subtract(1, 'week')),
    generateWeek(moment().startOf('week')),
    generateWeek(moment().startOf('week').clone().add(1, 'week')),
  ],

  mon: {
    events: [],
    day: null,
  },
  tue: {
    events: [],
    day: null,
  },
  wed: {
    events: [],
    day: null,
  },
  thu: {
    events: [],
    day: null,
  },
  fri: {
    events: [],
    day: null,
  },
  days: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case EVENT_DATE:
      // console.log('dsdsdsdsaaaaaaaaaa');
      return {
        ...state,
        event_data: action.payload,
      };
    case IS_LOADING_CALENDAR_NEXT:
      return {
        ...state,
        Loading: true,
      };
    case IS_LOADING_CALENDAR_PREV:
      return {
        ...state,

        Loading: false,
      };
    case LOADING_CLIENT_EVENTS:
      return {
        ...state,
        loading_client_events: true,
      };
    case CLEAR_CALENDAR_DAILY:
      return {
        ...state,
        format_day: {
          events: [],
          day: null,
        },
      };
    case LOAD_CALENDAR_DAILY:
      const sortedDailyPayload = {
        ...action.payload,
        format_day: {
          ...action.payload.format_day,
          events: sort_events(action.payload.format_day.events),
        },
      };

      return {
        ...state,
        ...sortedDailyPayload,
      };
    case GET_EVENT:
      return {
        ...state,
        event_detail: action.payload,
      };

    case GET_CLIENT_EVENTS:
      // console.log('clienteventt');
      // console.log(action.payload);
      return {
        ...state,
        loading_client_events: false,
        clients_events: action.payload,
      };
    case CLEAR_CLIENT_EVENTS:
      return {
        ...state,
        loading_client_events: false,
        clients_events: {},
      };

    case LOAD_CALENDAR_DATA_ALL:
      const sortedDays = {};
      for (const day in action.payload) {
        if (action.payload.hasOwnProperty(day)) {
          sortedDays[day] = sort_events(action.payload[day]);
        }
      }

      return {
        ...state,
        refreshing: false,
        days: sortedDays,
      };

    case LOAD_CALENDAR_DATA_MORE:
      const mergedDays = {...state.days};
      for (const day in action.payload) {
        if (action.payload.hasOwnProperty(day)) {
          mergedDays[day] = sort_events([
            ...(state.days[day] || []),
            ...action.payload[day],
          ]);
        }
      }

      return {
        ...state,
        refreshing: false,
        days: mergedDays,
      };
    case REFRESH_CALENDAR:
      return {
        ...state,
        refreshing: true,
      };
    case LOAD_CALENDAR_DAILY_FORMAT:
      return {
        ...state,
        refreshing_daily_format: false,
        days_format: [
          adjustDay(moment().subtract(1, 'day')),
          adjustDay(moment()),
          adjustDay(moment().add(1, 'day')),
        ],
        // current_week: action.payload,
        // days: {...action.payload},
      };
    case LOAD_CALENDAR_DAILY_FORMAT_NEXT:
      // console.log(LOAD_CALENDAR_NEXT);

      // console.log({...state.days, ...action.payload});
      const nextDaily = adjustDay(
        state.days_format[state.days_format.length - 1].clone().add(1, 'day'),
      );
      console.log([...state.weeks, nextDaily]);
      return {
        ...state,
        refreshingDaily: false,
        days_format: [...state.days_format, nextDaily],
        // days: {...state.days, ...action.payload},
        // next: state.next + 1,
        // next_week: [...[...state.next_week, action.payload]],
      };
    case LOAD_CALENDAR_DAILY_FORMAT_PREV:
      // console.log(action.ref);
      // console.log(action.width);

      // action.ref.current.scrollTo({x: action.width, animated: false});
      // action.payload.ref.data = [...[action.payload.data, ...state.days]];

      // if (action.payload.ref) {
      //   action.payload.ref.current.scrollToIndex({index: 1, animated: false});
      //   // action.payload.ref.data = [...[action.payload.data, ...state.days]];
      // }r
      const prevDaily = adjustDay(
        state.days_format[0].clone().subtract(1, 'day'),
      );

      return {
        ...state,
        refreshingDaily: false,
        days_format: [prevDaily, ...state.days_format],
      };

    case LOAD_CALENDAR:
      // console.log({...action.payload});
      // if (action.ref) {
      //   action.ref.current.scrollTo({x: action.width - 1, animated: false});
      //   // action.payload.ref.data = [...[action.payload.data, ...state.days]];
      // }
      return {
        ...state,
        refreshing: false,
        weeks: [
          generateWeek(action.payload.clone().subtract(1, 'week')),
          generateWeek(action.payload.clone()),
          generateWeek(action.payload.clone().add(1, 'week')),
        ],
        // current_week: action.payload,
        // days: {...action.payload},
      };

    case LOAD_CALENDAR_NEXT:
      console.log(LOAD_CALENDAR_NEXT);

      // console.log({...state.days, ...action.payload});
      const next = generateWeek(
        state.weeks[state.weeks.length - 1][0].clone().add(1, 'week'),
      );
      // console.log([...state.weeks, next]);
      return {
        ...state,
        refreshing: false,
        weeks: [...state.weeks, next],
        // days: {...state.days, ...action.payload},
        // next: state.next + 1,
        // next_week: [...[...state.next_week, action.payload]],
      };
    case LOAD_CALENDAR_PREV:
      // console.log(action.ref);
      // console.log(action.width);

      // action.ref.current.scrollTo({x: action.width, animated: false});
      // action.payload.ref.data = [...[action.payload.data, ...state.days]];

      // if (action.payload.ref) {
      //   action.payload.ref.current.scrollToIndex({index: 1, animated: false});
      //   // action.payload.ref.data = [...[action.payload.data, ...state.days]];
      // }r
      const prev = generateWeek(state.weeks[0][0].clone().subtract(1, 'week'));

      return {
        ...state,
        refreshing: false,
        weeks: [prev, ...state.weeks],
      };

    case CLEAR_EVENT:
      return {
        ...state,
        event_detail: {},
      };
    case CLEAR_CALENDAR:
      return {
        // the: null,
        event_data: null,
        client: null,
        refreshing: false,
        Loading: false,
        LoadingDaily: false,
        date: moment(),
        isLoadingNext: false,
        isLoadingPrev: false,
        next: 1,
        prev: 1,

        format_day: {
          events: [],
          day: false,
        },

        current_week: false,
        next_week: [],
        prev_week: [],

        event_detail: {},
        loading_client_events: false,
        clients_events: {},
        weeks: [
          generateWeek(moment().startOf('week').clone().subtract(1, 'week')),
          generateWeek(moment().startOf('week')),
          generateWeek(moment().startOf('week').clone().add(1, 'week')),
        ],

        mon: {
          events: [],
          day: null,
        },
        tue: {
          events: [],
          day: null,
        },
        wed: {
          events: [],
          day: null,
        },
        thu: {
          events: [],
          day: null,
        },
        fri: {
          events: [],
          day: null,
        },
        days: {},
      };
    case ADD_EVENT:
      // const {day, data} = action.payload;

      return {
        ...state,
        days: {
          ...state.days,
          [action.payload.day]: [
            ...sort_events([
              ...(state.days[action.payload.day] || []),
              action.payload.data,
            ]),
          ],
        },
      };

    case UPDATE_EVENT:
      // const {day, data} = action.payload;
      console.log(action.payload.day);
      console.log(action.payload.data);
      return {
        ...state,
        format_day: {
          events: [
            ...sort_events([
              ...state.format_day.events.map(event => {
                if (event.id == action.payload.data.id) {
                  return action.payload.data;
                } else {
                  return event;
                }
              }),
            ]),
          ],
          day: state.format_day.day,
        },
        days: {
          ...state.days,
          [action.payload.day]: [
            ...sort_events([
              ...state.days[action.payload.day].map(event => {
                if (event.id == action.payload.data.id) {
                  return action.payload.data;
                } else {
                  return event;
                }
              }),
            ]),
          ],
        },
      };

    case DELEATE_EVENT:
      return {
        ...state,
        days: {
          ...state.days,
          [action.payload.day]: state.days[action.payload.day].filter(
            event => event.id !== action.payload.data,
          ),
        },
      };
    // return {
    //   ...state,
    //   mon: {
    //     events: state.mon.events.filter(event => event.id !== action.payload),
    //     day: state.mon.day,
    //   },
    //   tue: {
    //     events: state.tue.events.filter(event => event.id !== action.payload),
    //     day: state.tue.day,
    //   },
    //   wed: {
    //     events: state.wed.events.filter(event => event.id !== action.payload),
    //     day: state.wed.day,
    //   },
    //   thu: {
    //     events: state.thu.events.filter(event => event.id !== action.payload),
    //     day: state.thu.day,
    //   },
    //   fri: {
    //     events: state.fri.events.filter(event => event.id !== action.payload),
    //     day: state.fri.day,
    //   },
    //   sat: {
    //     events: [],
    //     day: state.sat.day,
    //   },
    //   sun: {
    //     events: [],
    //     day: state.sun.day,
    //   },
    // };

    // case NEW_EVENT_ON_MON: action.payload.data,
    //     return {
    //         ...state,
    //         mon: {
    //             events: sort_dates(...state.mon.events, action.payload),
    //         },
    //     };
    default:
      return state;
  }
}
