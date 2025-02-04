import { configureStore } from "@reduxjs/toolkit";
import { skillsReducer } from "./skillSlice/skillSlice";

const store = configureStore({
  reducer: {
    skills: skillsReducer,
  },
});

export default store;
