import { useEffect, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { ACTIONS, loginReducer } from "../../helpers/reducer";
import { ROUTES } from "../../routes";
import { ERROR_MSG } from "../../config/messages.js";
import Button from "../../components/Button/Button";
import Animation from "../../components/Animation/Animation";
import logo from "../../assets/logo/icon.png";
import anim from "../../assets/png/home_anim.png";
import { nanoid } from "nanoid";
import useToggle from "../../hooks/useToggle.jsx";

import "./Login.scss";

const initialState = {
  email: "",
  password: "",
  success: null,
  error: null,
  loading: false,
  checked: false,
  IP: null,
  user: {},
};

export function Login() {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem("rememberMe"));
  const { toggle, changeToggle } = useToggle();

  //! When the user has checked remember me, navigate to his page
  useEffect(() => {
    if (savedUser) {
      navigate(`/dashboard/${savedUser.id}`);
    }
  }, [savedUser, navigate]);

  //! Get IP Address every time
  useEffect(() => {
    (async () => {
      await fetchIP();
    })();
  }, []);

  //! Toastify errors
  useEffect(() => {
    if (state.error) toast.error(state.error);
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });
  }, [state.error]);

  //! function fetchIP for getting IP
  async function fetchIP() {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_REACT_IP_API_URL}`
      );
      dispatch({ type: ACTIONS.SET_IP, payload: data.ip });
    } catch {
      dispatch({ type: ACTIONS.SET_ERROR, payload: ERROR_MSG.IP_ERROR_MSG });
    }
  }

  //! mark the user online or offline on different devices
  useEffect(() => {
    async function cleanupLoggedInUsers() {
      const device = JSON.parse(localStorage.getItem("device"));
      if (!device) {
        return;
      }

      const { deviceId } = device;

      try {
        const { data: loggedInUsers } = await axios.get(
          `${import.meta.env.VITE_REACT_LOGGED_IN_USER_URL}`
        );

        const activeUser = loggedInUsers.find((user) =>
          user.isSigned?.some(
            (entry) => entry.deviceId === deviceId && entry.isSigned
          )
        );

        if (!activeUser) return;

        const updatedIsSigned = activeUser.isSigned.map((entry) =>
          entry.deviceId === deviceId
            ? { ...entry, isSigned: false, date: new Date(), IP: entry.IP }
            : entry
        );

        const activeDevices = updatedIsSigned.filter((entry) => entry.isSigned);
        const { data: user } = await axios.get(
          `${import.meta.env.VITE_REACT_USERS_URL}/${activeUser.id}`
        );

        if (activeDevices.length === 0) {
          await Promise.all([
            axios.delete(
              `${import.meta.env.VITE_REACT_LOGGED_IN_USER_URL}/${
                activeUser.id
              }`
            ),
            axios.put(
              `${import.meta.env.VITE_REACT_USERS_URL}/${activeUser.id}`,
              {
                ...user,
                isSigned: updatedIsSigned,
                posts: activeUser.posts,
              }
            ),
          ]);
        } else {
          await Promise.all([
            axios.put(
              `${import.meta.env.VITE_REACT_USERS_URL}/${activeUser.id}`,
              {
                ...user,
                isSigned: updatedIsSigned,
              }
            ),
            axios.put(
              `${import.meta.env.VITE_REACT_LOGGED_IN_USER_URL}/${
                activeUser.id
              }`,
              {
                ...activeUser,
                isSigned: updatedIsSigned,
              }
            ),
          ]);
        }
      } catch (error) {
        console.error("Error during cleanup:", error.response?.data || error);
      }
    }

    cleanupLoggedInUsers();
  }, []);

  //!verify the user checking the email and password
  async function verifyUser(email, password) {
    const { data: users } = await axios.get(
      `${import.meta.env.VITE_REACT_USERS_URL}`
    );
    return users.find(
      (user) => user.email === email && user.password === password
    );
  }

  //! generate a new device id and set it in locale Storage. Push the new device id in isSigned array of user
  async function updateUserDevicesInDB(user) {
    let storedDevice = JSON.parse(localStorage.getItem("device"));
    const deviceId = storedDevice?.deviceId || nanoid();

    !storedDevice &&
      localStorage.setItem("device", JSON.stringify({ deviceId }));

    const deviceData = {
      deviceId,
      date: new Date(),
      IP: state.IP,
      isSigned: true,
    };

    const isDeviceAdded = user.isSigned?.some((d) => d.deviceId === deviceId);

    user.isSigned = isDeviceAdded
      ? user.isSigned.map((device) =>
          device.deviceId === deviceId
            ? { ...device, isSigned: true, date: new Date() }
            : device
        )
      : [...(user.isSigned || []), deviceData];

    await axios.put(`${import.meta.env.VITE_REACT_USERS_URL}/${user.id}`, user);
    return user;
  }

  //! Set the user in loggedInUsers array
  async function saveLoggedInUser(user) {
    const { password, ...userWithoutPassword } = user;
    const { data: loggedInUsers } = await axios.get(
      `${import.meta.env.VITE_REACT_LOGGED_IN_USER_URL}`
    );

    const existingUser = loggedInUsers.find((u) => u.email === user.email);
    const endpoint = existingUser
      ? `${import.meta.env.VITE_REACT_LOGGED_IN_USER_URL}/${existingUser.id}`
      : `${import.meta.env.VITE_REACT_LOGGED_IN_USER_URL}`;

    const method = existingUser ? axios.put : axios.post;
    await method(endpoint, userWithoutPassword);
  }

  //! Set the user email in locale storage, if the user allows
  function handleRememberMe(checked, user) {
    if (checked) {
      const { password, isSigned, ...userData } = user;
      localStorage.setItem("rememberMe", JSON.stringify(userData));
    } else {
      localStorage.removeItem("rememberMe");
    }
  }

  //! Sign in, if the user is verified
  async function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    try {
      const user = await verifyUser(state.email, state.password);

      if (!user) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: ERROR_MSG.L_P_ERROR });
        return;
      }

      const updatedUser = await updateUserDevicesInDB(user);

      await saveLoggedInUser(updatedUser);
      handleRememberMe(state.checked, updatedUser);
      navigate(`/dashboard/${user.id}`);
    } catch {
      dispatch({ type: ACTIONS.SET_ERROR, payload: ERROR_MSG.FAILED_LOGIN });
      console.log("failed");
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }

  //! Hide and show password

  //! toggle Remember
  function toggleRememberMe() {
    dispatch({ type: ACTIONS.SET_REMEMBER, payload: !state.checked });
  }

  return (
    <main className="home">
      <ToastContainer className="notification" />
      <div className="container">
        <div className="regBox">
          <header>
            <img src={logo} alt="Bchat" id="logo" />
            <h1>Bchat</h1>
          </header>
          <h2>WELCOME BACK</h2>
          <form onSubmit={handleSubmit}>
            <div className="inputBox">
              <label>Email</label>
              <input
                type="email"
                value={state.email}
                onChange={(e) =>
                  dispatch({ type: ACTIONS.SET_EMAIL, payload: e.target.value })
                }
              />
            </div>
            <div className="inputBox">
              <label>Password</label>
              <div className="passwordInput">
                <input
                  type={toggle ? "password" : "text"}
                  value={state.password}
                  onChange={(e) =>
                    dispatch({
                      type: ACTIONS.SET_PASSWORD,
                      payload: e.target.value,
                    })
                  }
                />
                <i
                  className={`bi bi-${toggle ? "eye" : "eye-slash"}`}
                  onClick={changeToggle}></i>
              </div>
              <div className="rememberMeRow">
                <div>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={state.checked}
                    onChange={toggleRememberMe}
                  />
                  <label htmlFor="rememberMe"></label>
                  <span>Remember me</span>
                </div>
                <Link to={ROUTES.REC_PASSWORD}>Forgot Password</Link>
              </div>
            </div>
            <div className="btnBox">
              <Button
                button_type="submit"
                content={
                  state.loading ? (
                    <ClipLoader size={15} color="white" />
                  ) : (
                    "Sign In"
                  )
                }
                button_class="btnSignIn"
                button_disabled={state.loading}
              />
              <Link className="btnSignIn" to={ROUTES.REGISTER}>
                Sign up
              </Link>
            </div>
            <p>Copyright @ 2024 Banish</p>
          </form>
        </div>
        <Animation anim={anim} />
      </div>
    </main>
  );
}
