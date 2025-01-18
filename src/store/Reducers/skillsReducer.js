import { ADD_SKILL, REMOVE_SKILL } from "../Types/skillsType";

const initialState = [];

const skillsReducer = (state = initialState, action) => {
  switch (action.type) {
    case REMOVE_SKILL:
      return { ...state, ...action.payload };
    case ADD_SKILL:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default skillsReducer;
