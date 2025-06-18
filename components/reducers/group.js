import {LOAD_GROUP, GROUP_FAIL, GROUP_UPDATE} from '../actions/types.js';

const initialState = {
  group: {},
  isGroup: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_GROUP:
    case GROUP_UPDATE:
      console.log(action.payload);
      return {
        ...state,
        group: action.payload,
        isGroup: true,
      };

    case GROUP_FAIL:
      // console.log("nie ma grupy");
      return {
        ...state,
        group: {},
        isGroup: false,
      };
    default:
      return state;
  }
}
