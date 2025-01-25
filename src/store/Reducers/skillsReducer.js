import { nanoid } from "nanoid";
import { ADD_SKILL, REMOVE_SKILL } from "../Types/skillsType";
import { Axios } from "../../axios";
import { getSkills } from "../Actions/skillsActions";

const initialState = [];

const skillsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SKILL:
      return [
        ...state,
        {
          id: nanoid(8),
          text: action.payload,
        },
      ];
    case REMOVE_SKILL:
      return [
        ...state.filter((elm) => {
          return elm.id !== action.payload;
        }),
      ];
    default:
      return state;
  }
};

export const getSkillsMiddleware = () => {
  return (dispatch) => {
    Axios.getSkillsData().then((res) => {
      dispatch(getSkills(res.data));
    });
  };
};

export default skillsReducer;
