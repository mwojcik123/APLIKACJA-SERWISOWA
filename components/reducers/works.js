import {
  WORKS_LOADING,
  GET_WORKS_ALL,
  GET_WORKS_YOUR,
  GET_WORKS_DONE,
  GET_WORKS_DETAIL,
  WORKS_DELEATE,
  WORKS_UPDATE,
  WORKS_ADD,
  WORKS_DETAIL_CLEAR,
  WORKS_ALL,
  WORKS_DONE,
  WORKS_YOUR,
  WORKS_SEARCH_INPUT,
  GET_WORKS_ALL_NEXT_PAGE,
  GET_WORKS_DONE_NEXT_PAGE,
  GET_WORKS_YOUR_NEXT_PAGE,
  WORKS_ARE_DONE,
  WORKS_ARE_NOT_DONE,
  WORKS_CLEAR,
  WORKS_LOADING_ALL,
  WORKS_LOADING_YOUR,
  WORKS_LOADING_DONE,
} from '../actions/types.js';

const initialState = {
  search: '',
  isLoading: false,
  thePage: 'your',
  refreshing_all: false,
  refreshing_your: false,
  refreshing_done: false,
  works_loading: false,
  works_list_all: [],
  works_list_your: [],
  works_list_done: [],
  next_all: null,
  next_your: null,
  next_done: null,
  works_detail: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case WORKS_LOADING_ALL:
      return {
        ...state,
        refreshing_all: false,
      };
    case WORKS_LOADING_YOUR:
      return {
        ...state,
        refreshing_your: false,
      };
    case WORKS_LOADING_DONE:
      return {
        ...state,
        refreshing_done: false,
      };
    case WORKS_DETAIL_CLEAR:
      return {
        ...state,
        works_detail: {},
      };
    case WORKS_CLEAR:
      return {
        ...state,
        search: '',
      };
    case WORKS_SEARCH_INPUT:
      return {
        ...state,
        search: action.payload,
      };
    case WORKS_LOADING:
      return {
        ...state,
        works_loading: true,
      };
    case WORKS_ALL:
      return {
        ...state,
        thePage: 'all',
      };
    case WORKS_DONE:
      return {
        ...state,
        thePage: 'done',
      };
    case WORKS_YOUR:
      return {
        ...state,
        thePage: 'your',
      };
    case GET_WORKS_ALL:
      return {
        ...state,
        refreshing_all: false,

        works_loading: false,
        works_list_all: action.payload.results,
        next_all: action.payload.next,
        // works_list_your: [],
        // works_list_done: [],
      };
    case GET_WORKS_YOUR:
      return {
        ...state,

        refreshing_your: false,

        works_loading: false,
        // works_list_all: [],
        works_list_your: action.payload.results,
        next_your: action.payload.next,
        // works_list_done: [],
      };

    case GET_WORKS_DONE:
      console.log(action.payload.results);
      console.log(action.payload);
      return {
        ...state,
        refreshing_done: false,
        works_loading: false,
        works_list_done: action.payload.results,
        next_done: action.payload.next,
      };

    case GET_WORKS_ALL_NEXT_PAGE:
      return {
        ...state,
        works_loading: false,
        works_list_all: [
          ...state.works_list_all,
          ...action.payload.results.filter(
            newWork =>
              !state.works_list_all.some(
                existingWork => existingWork.id === newWork.id,
              ),
          ),
        ],
        next_all: action.payload.next,
        // works_list_your: [],
        // works_list_done: [],
      };
    case GET_WORKS_YOUR_NEXT_PAGE:
      return {
        ...state,
        works_loading: false,
        // works_list_all: [],
        works_list_your: [
          ...state.works_list_all,
          ...action.payload.results.filter(
            newWork =>
              !state.works_list_your.some(
                existingWork => existingWork.id === newWork.id,
              ),
          ),
        ],
        next_your: action.payload.next,
        // works_list_done: [],
      };
    case GET_WORKS_DONE_NEXT_PAGE:
      return {
        ...state,
        works_loading: false,
        // works_list_all: [],
        // works_list_your: [],

        works_list_done: [
          ...state.works_list_done,
          ...action.payload.results.filter(
            newWork =>
              !state.works_list_done.some(
                existingWork => existingWork.id === newWork.id,
              ),
          ),
        ],
        next_done: action.payload.next,
      };

    case GET_WORKS_DETAIL:
      return {
        ...state,
        works_loading: false,
        works_detail: action.payload,
      };
    case WORKS_ADD:
      return {
        ...state,
        works_loading: false,
        works_list: [...state.works_list, action.payload],
      };
    case WORKS_DETAIL_CLEAR:
      return {
        works_loading: false,
        works_detail: null,
      };
    case WORKS_UPDATE:
      console.log(action.payload.id);
      return {
        ...state,
        works_loading: false,
        works_list_all: state.works_list_all.map(event => {
          if (event.id == action.payload.id) {
            return action.payload;
          } else {
            return event;
          }
        }),
        works_list_done: state.works_list_done.map(event => {
          if (event.id == action.payload.id) {
            return action.payload;
          } else {
            return event;
          }
        }),
        works_list_your: state.works_list_your.map(event => {
          if (event.id == action.payload.id) {
            return action.payload;
          } else {
            return event;
          }
        }),
        works_detail: action.payload,
      };

    case WORKS_ARE_DONE:
      return {
        ...state,
        works_list_all: [
          ...state.works_list_all.filter(work => work.id !== action.payload.id),
        ],
        works_list_your: [
          ...state.works_list_your.filter(
            work => work.id !== action.payload.id,
          ),
        ],
        works_list_done: [action.payload, ...state.works_list_done],
      };
    case WORKS_ARE_NOT_DONE:
      const ifMember = (data, state) => {
        console.log(data);
        if (data.user == data.data.servisant.id) {
          return [...[data.data, ...state.works_list_your]];
        } else {
          return [...state.works_list_your];
        }
      };
      return {
        ...state,
        works_list_all: [...[action.payload.data, ...state.works_list_all]],

        works_list_your: ifMember(action.payload, state),

        works_list_done: [
          ...state.works_list_done.filter(
            work => work.id !== action.payload.data.id,
          ),
        ],
      };
    case WORKS_DELEATE:
      return {
        ...state,
        works_loading: false,
        works_list_all: [
          ...state.works_list_all.filter(work => work.id !== action.payload),
        ],
        works_list_done: [
          ...state.works_list_done.filter(work => work.id !== action.payload),
        ],
        works_list_your: [
          ...state.works_list_your.filter(work => work.id !== action.payload),
        ],
      };
    default:
      return state;
  }
}
