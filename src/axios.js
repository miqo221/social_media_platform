import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8001",
  timeout: 3000,
  timeoutErrorMessage: "Request Timeout",
});

export const Axios = {
  getOneUser(id) {
    return instance.get(`/loggedInUsers/${id}`);
  },
};
