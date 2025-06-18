// import {getAllParts, getAvilableParts} from '../actions/parts.js';

import {
  GET_PARTS_LIST,
  GET_PARTS_LIST_AVILABLE,
  GET_PARTS_LIST_ALL,
  GET_PARTS_DETAIL,
  ONE_MORE_PARTS,
  ONE_LESS_PARTS,
  LOADING_DETAIL_PARTS,
  BACK_PARTS,
  PARTS_SEARCH_INPUT,
  PARTS_ALL,
  PARTS_AVILABLE,
  LOADING_PARTS_DATA,
  GET_PARTS_NEXT_PAGE,
  GET_PARTS_ALL_NEXT_PAGE,
  GET_PARTS_AVILABLE_NEXT_PAGE,
  PARTS_CHANGE_COLOR,
  UPDATE_DETAIL_PARTS,
  PARTS_CHANGE_QUANTITY,
  PARTS_LOADING_ALL,
  PARTS_LOADING_AVILABLE,
  CLEAR_DETAIL_PARTS,
  CLEAR_PARTS,
} from '../actions/types.js';

const initialState = {
  searchToogle: true,
  search: '',
  isLoading: false,
  next_all: null,
  next_avilable: null,
  detailLoading: false,
  parts_list_avilable: [],
  parts_list_all: [],
  parts_list: [],
  color: '#ffffff',
  quantity: 0,
  refreshingAll: false,
  refreshingAvilable: false,
  parts_detail: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CLEAR_DETAIL_PARTS:
      return {
        ...state,
        parts_detail: {},
      };
    case PARTS_LOADING_ALL:
      return {
        ...state,
        refreshingAll: true,
      };
    case PARTS_LOADING_AVILABLE:
      return {
        ...state,
        refreshingAvilable: true,
      };
    case LOADING_PARTS_DATA:
      return {
        ...state,
        isLoading: true,
      };
    case GET_PARTS_ALL_NEXT_PAGE:
      return {
        ...state,
        isLoading: false,
        next_all: action.payload.next,
        parts_list_all: [
          ...state.parts_list_all,
          ...action.payload.results.filter(
            newClient =>
              !state.parts_list_all.some(
                existingClient => existingClient.id === newClient.id,
              ),
          ),
        ],
      };
    case GET_PARTS_AVILABLE_NEXT_PAGE:
      return {
        ...state,
        isLoading: false,
        next_avilable: action.payload.next,
        parts_list_avilable: [
          ...state.parts_list_avilable,
          ...action.payload.results.filter(
            newClient =>
              !state.parts_list_avilable.some(
                existingClient => existingClient.id === newClient.id,
              ),
          ),
        ],
      };
    case CLEAR_PARTS:
      return {
        ...state,
        search: '',
        parts_list_avilable: [],
        parts_list_all: [],
      };
    case PARTS_ALL:
      // getAllParts(state.search);
      return {
        ...state,

        searchToogle: true,
      };
    case PARTS_AVILABLE:
      return {
        ...state,

        searchToogle: false,
      };
    case PARTS_SEARCH_INPUT:
      return {
        ...state,
        search: action.payload,
      };
    case LOADING_DETAIL_PARTS:
      return {
        ...state,
        detailLoading: true,
      };
    case GET_PARTS_LIST:
      return {
        ...state,
        isLoading: false,
        parts_list: action.payload.results,
        next_all: action.payload.next,
      };
    case GET_PARTS_LIST_AVILABLE:
      return {
        ...state,
        isLoading: false,
        refreshingAvilable: false,
        parts_list_avilable: action.payload.results,
        next_avilable: action.payload.next,
      };
    case GET_PARTS_LIST_ALL:
      return {
        ...state,
        refreshingAll: false,
        parts_list_all: action.payload.results,
        next_all: action.payload.next,
      };
    case PARTS_CHANGE_COLOR:
      return {
        ...state,
        color: action.payload,
      };
    case PARTS_CHANGE_QUANTITY:
      if (action.payload >= 0) {
        return {
          ...state,
          quantity: action.payload,
        };
      }
      return {
        ...state,
      };
    case GET_PARTS_DETAIL:
      return {
        ...state,
        detailLoading: false,
        parts_detail: action.payload,
        color: action.payload.color,
        quantity: action.payload.quantity,
      };
    case BACK_PARTS:
      return {
        ...state,
        parts_list_avilable: [
          ...state.parts_list_avilable.filter(
            part => part.id !== action.payload,
          ),
        ],
      };
    case UPDATE_DETAIL_PARTS:
      return {
        ...state,
        parts_list_avilable: state.parts_list_avilable.map(item =>
          item.id === action.payload.id ? action.payload : item,
        ),
        parts_list_all: state.parts_list_all.map(item =>
          item.id === action.payload.id ? action.payload : item,
        ),
      };
    case ONE_MORE_PARTS:
      return {
        ...state,
        parts_list: state.parts_list.map(item =>
          item.id === action.payload.id ? action.payload : item,
        ),
        parts_detail: action.payload,
      };
    case ONE_LESS_PARTS:
      return {
        ...state,
        parts_list: state.parts_list.map(item =>
          item.id === action.payload.id ? action.payload : item,
        ),
        parts_detail: action.payload,
      };
    default:
      return state;
  }
}
