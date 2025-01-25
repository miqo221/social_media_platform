import { ADD_SKILL, GET_SKILLS, REMOVE_SKILL } from "../Types/skillsType";

export const addSkills = (payload) => ({
  type: ADD_SKILL,
  payload,
});

export const removeSkills = (payload) => ({
  type: REMOVE_SKILL,
  payload,
});

export const getSkills = (payload) => ({
  type: GET_SKILLS,
  payload,
});
