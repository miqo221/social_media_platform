import { createSlice } from "@reduxjs/toolkit";
import { addSkills, fetchSkills, removeSkill } from "./api";

const skillSlice = createSlice({
  name: "skills",
  initialState: {
    loading: false,
    data: [],
    errorMessage: "",
  },
  reducers: {
    getSkills(state, action) {
      state.data = action.payload;
    },
  },
  selectors: {
    getSkillsData: (state) => state,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSkills.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSkills.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload.skills;
      state.errorMessage = "";
    });
    builder.addCase(fetchSkills.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.errorMessage = action.error.message;
    });
    builder.addCase(addSkills.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addSkills.fulfilled, (state, action) => {
      state.loading = false;
      const newSkill = action.meta.arg.newSkill;
      state.data.push({
        id: new Date().getTime(),
        text: newSkill,
      });
    });
    builder.addCase(addSkills.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.errorMessage = action.error.message;
    });
    builder.addCase(removeSkill.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeSkill.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload.skills;
      state.errorMessage = "";
    });
    builder.addCase(removeSkill.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.errorMessage = action.error.message;
    });
  },
});

export const skillsReducer = skillSlice.reducer;
export const { getSkillsData } = skillSlice.selectors;
