import {
  GET_SMS_LIST,
  GET_SMS_LIST_DAY,
  GET_SMS_DETAIL,
  GET_SMS_LIST_NEXT_PAGE,
  SMS_LOADING,
  SEND_SMS,
  SMS_LOADING_DAY,
  SMS_LOADING_DETAIL,
  SMS_LIST_DAY_DELEATE,
} from '../actions/types';

const initialState = {
  sms_list: [],
  sms_list_day: [],
  sms_next: null,
  sms_detail: null,
  isLoading: false,
  isLoadingDay: false,
  isLoadingDetail: false,
  isRefreshingSms: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SMS_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case SMS_LOADING_DAY:
      return {
        ...state,
        isLoadingDay: true,
      };
    case SMS_LOADING_DETAIL:
      return {
        ...state,
        isLoadingDetail: true,
      };
    case GET_SMS_DETAIL:
      return {
        ...state,
        isLoadingDetail: false,
        sms_detail: action.payload,
      };
    case GET_SMS_LIST:
      return {
        ...state,

        isLoading: false,
        sms_list: action.payload.results,
        sms_next: action.payload.next,
      };
    case GET_SMS_LIST_NEXT_PAGE:
      return {
        ...state,
        isLoading: false,
        sms_next: action.payload.next,
        sms_list: [
          ...state.sms_list,
          ...action.payload.results.filter(
            newClient =>
              !state.sms_list.some(
                existingClient => existingClient.id === newClient.id,
              ),
          ),
        ],
      };
    case GET_SMS_LIST_DAY:
      return {
        ...state,
        isLoadingDay: false,

        sms_list_day: action.payload,
      };
    case SEND_SMS:
      return {
        ...state,
        sms_list: state.sms_list.map(item =>
          item.id === action.payload.id ? action.payload : item,
        ),
      };
    case SMS_LIST_DAY_DELEATE:
      return {
        ...state,
        sms_list_day: state.sms_list_day.filter(
          item => item.id !== action.payload,
        ),
      };
    default:
      return state;
  }
}
