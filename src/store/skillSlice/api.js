import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSkills = createAsyncThunk(
  "skills/fetchSkills",
  async (userId) => {
    const res = await fetch(`http://localhost:8001/loggedInUsers/${userId}`);
    const json = await res.json();
    return json;
  }
);

export const addSkills = createAsyncThunk(
  "skills/addSkills",
  async ({ userId, newSkill }) => {
    const res = await fetch(`http://localhost:8001/loggedInUsers/${userId}`);
    const user = await res.json();

    const updatedSkills = [
      ...user.skills,
      {
        id: new Date().getTime(),
        text: newSkill,
      },
    ];

    const updateRes = await fetch(
      `http://localhost:8001/loggedInUsers/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skills: updatedSkills }),
      }
    );

    return await updateRes.json();
  }
);

export const removeSkill = createAsyncThunk(
  "skills/removeSkill",
  async ({ userId, skillId }) => {
    const res = await fetch(`http://localhost:8001/loggedInUsers/${userId}`);
    const user = await res.json();

    const decreasedSkills = user.skills.filter((elm) => {
      return elm.id !== skillId;
    });
    const updateRes = await fetch(
      `http://localhost:8001/loggedInUsers/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skills: decreasedSkills }),
      }
    );

    return await updateRes.json();
  }
);
