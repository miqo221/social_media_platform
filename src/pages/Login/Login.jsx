import { useReducer, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Button from "../../components/Button/Button";
import { loginReducer, ACTIONS } from "../../helpers/reducer";
import { ROUTES } from "../../routes";
import logo from "../../assets/logo/icon.png";
import anim from "../../assets/png/home_anim.png";
import Animation from "../../components/Animation/Animation";

import "./Login.scss";

const initialState = {
  email: "",
  password: "",
  success: null,
  error: null,
  loading: false,
  checked: false,
  IP: null,
};

export function Login() {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem("rememberMe"));
  const [type, setType] = useState("password");

  //! if the user is saved on localstorage the email input field will be filled automatic
  useEffect(() => {
    if (savedUser) {
      dispatch({ type: ACTIONS.SET_EMAIL, payload: savedUser.email });
      dispatch({ type: ACTIONS.SET_REMEMBER, payload: savedUser.checked });
    }
  }, []);

  useEffect(() => {
    axios
      .get("https://api.ipify.org?format=json")
      .then((response) =>
        dispatch({
          type: ACTIONS.SET_IP,
          payload: response.data.ip,
        })
      )
      .catch((error) => {
        console.error("Error fetching IP address:", error);
      });
  }, []);

  //! Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    localStorage.getItem("memorizedUser");

    try {
      //! Fetching users from db.json
      const { data: users } = await axios.get("http://localhost:8001/users");

      //! Find user with matching credentials
      const user = users.find(
        (u) => u.email === state.email && u.password === state.password
      );

      //! Throwing error if the email or password are incorrect
      if (!user) {
        dispatch({
          type: ACTIONS.SET_ERROR,
          payload: "Invalid username or password.",
        });
      } else {
        //! Destructuring of user to not send the password to db.json
        const { password, ...signedUser } = user;

        //! Check if the user is already logged in or add a new logged-in user
        const { data: loggedInUsers } = await axios.get(
          "http://localhost:8001/loggedInUsers"
        );

        const existingUser = loggedInUsers.find(
          (u) => u.email === signedUser.email
        );

        //! Check if the User is already loggedIn from one IP address, don't add the user in loggedInUsers array
        if (existingUser) {
          if (existingUser.IP !== state.IP) {
            await axios.put(
              `http://localhost:8001/loggedInUsers/${existingUser.id}`,
              {
                ...existingUser,
                IP: state.IP,
                success: `Welcome back ${signedUser.name}!`,
              }
            );
          }
        } else {
          await axios.post("http://localhost:8001/loggedInUsers", {
            ...signedUser,
            success: `Welcome ${signedUser.name}!`,
            signedIn: true,
            IP: state.IP,
          });
        }

        //! Handle remember me functionality
        if (state.checked && !savedUser) {
          localStorage.setItem("rememberMe", JSON.stringify(state));
        } else if (
          !state.checked &&
          savedUser &&
          state.email === savedUser.email
        ) {
          localStorage.removeItem("rememberMe");
        } else if (
          state.checked &&
          savedUser &&
          savedUser.email !== state.email
        ) {
          localStorage.removeItem("rememberMe");
          localStorage.setItem("rememberMe", JSON.stringify(state));
        }

        //! Looking for a saved user in localstorage,if the user is saved it doesn't save the user again, if he is not saved, it saves the user, and if the user was saved but he doesn't want want to be saved more it removes the user from localstorage
        if (state.checked === true && !savedUser) {
          localStorage.setItem("rememberMe", JSON.stringify(state));
        } else if (
          state.checked === false &&
          savedUser &&
          state.email === savedUser.email
        ) {
          localStorage.removeItem("rememberMe");
        }

        //! after login navigating to dashboard
        navigate(`/dashboard/${user.id}`);
      }
    } catch (error) {
      //! Handle login errors
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Login failed. Please try again.",
      });
    } finally {
      //! Reset loading state
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const notify = () => {
    if (state.error) toast.error(state.error);
  };

  useEffect(() => {
    notify();
  }, [state.error]);

  const setChecked = () => {
    dispatch({ type: ACTIONS.SET_REMEMBER, payload: !state.checked });
  };

  const showPassword = () => {
    type === "password" ? setType("text") : setType("password");
  };

  return (
    <main className="home">
      <ToastContainer className="notification" />
      <div className="container">
        <div className="reg-box">
          <header>
            <img src={logo} alt="Bchat" id="logo" />
            <h1>Bchat</h1>
          </header>
          <h2>WELCOME BACK</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <label>Email</label>
              <input
                type="email"
                value={state.email}
                onChange={(e) =>
                  dispatch({
                    type: ACTIONS.SET_EMAIL,
                    payload: e.target.value,
                  })
                }
              />
            </div>
            <div className="input-box">
              <label>Password</label>
              <div className="password-input">
                <input
                  type={type}
                  value={state.password}
                  onChange={(e) =>
                    dispatch({
                      type: ACTIONS.SET_PASSWORD,
                      payload: e.target.value,
                    })
                  }
                />
                <i
                  className={`bi bi-${
                    type === "password" ? "eye" : "eye-slash"
                  }`}
                  onClick={showPassword}
                ></i>
              </div>
              <div className="remember_me_row">
                <div>
                  <input
                    type="checkbox"
                    id="remember_me"
                    checked={state.checked}
                    onChange={setChecked}
                  />
                  <label htmlFor="remember_me"></label>
                  <span>Remember me</span>
                </div>
                <Link to={ROUTES.REC_PASSWORD}>Forgot Password</Link>
              </div>
            </div>
            <div className="btn-box">
              <Button
                button_type="submit"
                content={state.loading ? "Loading..." : "Sign In"}
                button_class="btn_sign_in"
                button_disabled={state.loading}
                button_function={notify}
              />
              <Link className="btn_sign_in" to="/register">
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
