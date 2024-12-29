import axios from "axios";
import "./Dashboard.scss";

export function Dashboard() {
  async function getUser() {
    await axios({
      method: "GET",
      baseURL: "http://localhost:8001/loggedInUsers",
    }).then((res) => console.log(res.data, "test"));
  }

  getUser()

  return <h2 style={{ color: "white" }}>Hello from</h2>;
}
