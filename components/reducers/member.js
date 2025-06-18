import {
  GET_MEMBERS,
  GET_INVITE_LIST,
  GET_USERS_LIST,
  MEMBER_USER,
  UPDATE_MEMBER,
  UPDATE_MEMBER_SOBOTAUS,
  CHANGE_MEMBER_CALENDAR,
  GET_MEMBER_DETAIL,
} from '../actions/types.js';
// member_calendar: action.payload,
const initialState = {
  member_user: {},
  member_detail: {},
  member_calendar: {},
  members: [],
  invite_list: [],
  search_user_list: [],
  invite_detail: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_MEMBER_DETAIL:
      return {
        ...state,
        member_detail: action.payload,
      };
    case UPDATE_MEMBER:
      return {
        ...state,
        member_detail: action.payload,
        members: state.members.map(member => {
          if (member.id == action.payload.id) {
            return action.payload;
          } else {
            return member;
          }
        }),
      };
    case MEMBER_USER:
      console.log(action.payload);
      return {
        ...state,
        member_user: action.payload,
        member_calendar: action.payload,
      };
    case UPDATE_MEMBER_SOBOTAUS:
      return {
        ...state,
        member_calendar: action.payload,
        members: state.members.map(member => {
          if (member.id == action.payload.id) {
            return action.payload;
          } else {
            return member;
          }
        }),
      };
    case CHANGE_MEMBER_CALENDAR:
      console.log(action.payload);
      return {
        ...state,
        member_calendar: action.payload,
      };
    case GET_MEMBERS:
      return {
        ...state,
        members: action.payload,
      };
    case GET_INVITE_LIST:
      return {
        ...state,
        invite_list: action.payload,
      };
    case GET_USERS_LIST:
      return {
        ...state,
        search_user_list: action.payload,
      };

    default:
      return state;
  }
}
