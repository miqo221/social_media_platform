import { combineReducers } from "redux";
import skillsReducer from "./skillsReducer";

const reducers = combineReducers({
  skills: skillsReducer,
});
 export default reducers
 