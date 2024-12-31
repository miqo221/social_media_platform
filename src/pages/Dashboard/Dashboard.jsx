import axios from "axios";
import "./Dashboard.scss";
import { useParams } from "react-router-dom";

export function Dashboard() {
  const { id } = useParams();
  async function getUser() {
    await axios({
      method: "GET",
      baseURL: "http://localhost:8001/loggedInUsers",
      url: `?id=${id}`,
    }).then((res) => console.log(res.data));
  }

  getUser();

  return <h2 style={{ color: "white" }}>Hello from</h2>;
}
