import {
  GET_CLIENTS_LIST,
  GET_CLIENTS_DETAIL,
  CLEAR_CLIENTS_DETAIL,
  UPDATE_CLIENT,
  CLIENT_DELETE,
  GET_CLIENTS_NEXT_PAGE,
  LOADING_CLIENTS_DATA,
  CLIENT_CLEAR,
} from '../actions/types.js';

const initialState = {
  clients_list: [],
  next: null,
  isLoading: false,
  clients_detail: null,
};

export const cellphones = data => {
  const list = [];
  data.map(event => {
    if (event.client) {
      list.push(event.client.tel);
    }
  });
  if (list[0]) {
    if (!list[1]) {
      return list[0];
    } else {
      return list;
    }
  } else {
    return null;
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CLIENT_CLEAR:
      return {
        clients_list: [],
        next: null,
        isLoading: false,
        clients_detail: null,
      };
    case LOADING_CLIENTS_DATA:
      return {
        ...state,
        isLoading: true,
      };
    case GET_CLIENTS_LIST:
      // console.log(action.payload);
      return {
        ...state,
        isLoading: false,
        clients_list: action.payload.results,
        next: action.payload.next,
      };
    case GET_CLIENTS_NEXT_PAGE:
      // console.log(action.payload);
      return {
        ...state,
        isLoading: false,
        clients_list: [
          ...state.clients_list,
          ...action.payload.results.filter(
            newClient =>
              !state.clients_list.some(
                existingClient => existingClient.id === newClient.id,
              ),
          ),
        ],
        next: action.payload.next,
      };
    case GET_CLIENTS_DETAIL:
      return {
        ...state,

        clients_detail: action.payload,
      };
    case CLEAR_CLIENTS_DETAIL:
      return {
        ...state,

        clients_detail: null,
      };

    case CLIENT_DELETE:
      return {
        ...state,
        clients_detail: null,

        clients_list: [
          ...state.clients_list.filter(event => event.id !== action.payload),
        ],
      };

    case UPDATE_CLIENT:
      return {
        ...state,
        clients_list: {
          count: state.clients_list.count,
          next: state.clients_list.next,
          previous: state.clients_list.previous,
          results: [
            action.payload,
            ...state.clients_list.results.filter(
              client => client.id !== action.payload.id,
            ),
          ],
        },
      };
    default:
      return state;
  }
}
