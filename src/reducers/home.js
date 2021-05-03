import { HOME_PAGE_LOADED, HOME_PAGE_UNLOADED } from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case HOME_PAGE_LOADED:
      // console.log("I am the home page data:::::::::::::::", action)
      return {
        ...state,
        // city: {value: "HYDERABAD", label: "HYDERABAD"},
        tags: action.payload[0].data,
        cityArray: action.payload[1].data,
        refreshDate: action.payload[2].data
      };
    case HOME_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};
