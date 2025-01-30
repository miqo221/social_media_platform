import axios from "axios";
import { data } from "react-router-dom";

const instance = axios.create({
  baseURL: "http://localhost:8001",
  timeout: 3000,
  timeoutErrorMessage: "Request Timeout",
});

export const Axios = {
  postSkill(id, newSkill) {
    return instance({
      method: "POST",
      url: `/loggedInUsers/${id}`,
      data: newSkill,
    });
  },
  getOneUser(id) {
    return instance.get(`/loggedInUsers/${id}`);
  },
};
