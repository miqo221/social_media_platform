import { nanoid } from "nanoid";
import { ADD_SKILL, GET_SKILLS, REMOVE_SKILL } from "../Types/skillsType";
import { Axios } from "../../axios";
import { addSkills, getSkills } from "../Actions/skillsActions";

const initialState = {
  skillText: "",
  skillList: [],
};

const skillsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SKILLS:
      return {
        ...state,
        skillList: [...action.payload],
      };
    case ADD_SKILL:
      return {
        ...state,
        skillList: [
          ...state.skillList,
          {
            id: nanoid(8),
            text: action.payload,
          },
        ],
      };

    // case REMOVE_SKILL:
    //   console.log(action.payload);
    //   return {

    //     ...state,
    //     skillList: state.skillList.filter((elm) => elm.id != action.payload),
    //   };
    default:
      return state;
  }
};

export const getSkillsMiddleware = (id) => {
  return (dispatch) => {
    Axios.getOneUser(id).then((res) => {
      dispatch(getSkills(res.data.skills));
    });
  };
};

export const addSkillsMiddleware = (id, newSkill) => {
  return (dispatch) => {
    Axios.postSkill(id).then(() => dispatch(addSkills(newSkill)));
  };
};

export default skillsReducer;
