import { useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { loginReducer, ACTIONS } from "../../helpers/reducer";
import logo from "../../assets/logo/icon.png";
import google from "../../assets/png/google.png";
import anim from "../../assets/png/home_anim.png";
import { ToastContainer, toast } from "react-toastify";
import { ROUTES } from "../../routes";

import "./Login.scss";

const initialState = {
  email: "",
  password: "",
  success: null,
  error: null,
  loading: false,
};

export function Login() {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const navigate = useNavigate();

  const handleGoogleLogin = useGoogleLogin({
    //! Handle google login
    onSuccess: async (response) => {
      try {
        const { data: googleUserInfo } = await axios.get(
          //! Fetch the user info from google
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: { Authorization: `Bearer ${response.access_token}` },
          }
        );

        const userData = {
          //! Construct user data object
          email: googleUserInfo.email,
          name: googleUserInfo.given_name,
          surname: googleUserInfo.family_name,
          image: googleUserInfo.picture,
          id: googleUserInfo.id,
        };

        const { data: existingUsers } = await axios.get(
          //! Checking if the user already exists
          "http://localhost:8001/users"
        );

        const userExists = existingUsers.some(
          (user) => user.email === userData.email
        );

        if (userExists) {
          //! Throwing error for existing user
          dispatch({
            type: ACTIONS.SET_ERROR,
            payload: "You already have an account",
          });
        } else {
          await axios.post("http://localhost:8001/users", userData); //! Register new user and navigate to registration
          dispatch({
            type: ACTIONS.SET_SUCCESS,
            payload: `Welcome ${userData.name} ${userData.surname}. Please finish the registration.`,
          });
          navigate(ROUTES.REGISTER, {
            state: {
              newUser: [userData, state.success], //! Success message for Toastify
            },
          });
        }
      } catch (error) {
        //! Google login errors
        dispatch({
          type: ACTIONS.SET_ERROR,
          payload: "Google login failed. Please try again.",
        });
      }
    },
    onError: (error) => {
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Google login failed. Please try again.",
      });
      console.error(error);
    },
    scope: "profile email",
  });

  //! Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    try {
      //! Fetching users from db.json
      const { data: users } = await axios.get("http://localhost:8001/users");

      //! Find user with matching credentials
      const user = users.find(
        (u) => u.email === state.email && u.password === state.password
      );

      if (!user) {
        //! Throwing error if the email or password are incorrect
        dispatch({
          type: ACTIONS.SET_ERROR,
          payload: "Invalid username or password.",
        });
      } else {
        //! Destructuring of user to not send the password to db.json
        const { password, ...signedUser } = user;

        axios({  //! Setting the user in db.json as logged in user
          method: "POST",
          baseURL: "http://localhost:8001",
          url: "/loggedInUsers",
          data: {
            ...signedUser,
            success: `Welcome ${signedUser.name}!`,
            signedIn: true,
          },
        });

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
              <input
                type="password"
                value={state.password}
                onChange={(e) =>
                  dispatch({
                    type: ACTIONS.SET_PASSWORD,
                    payload: e.target.value,
                  })
                }
              />
              <div className="remember_me_row">
                <div>
                  <input type="checkbox" id="remember_me" />
                  <label htmlFor="remember_me" id="label_remember"></label>
                  <span>Remember me</span>
                </div>
                <Link to={ROUTES.FORGOT_PASSWORD}>Forgot Password</Link>
                {state.error && <p className="error">{state.error}</p>}
              </div>
            </div>
            <div className="btn-box">
              <button type="submit" disabled={state.loading}>
                {state.loading ? "Loading..." : "Submit"}
              </button>
              <button type="button" onClick={handleGoogleLogin}>
                <img src={google} alt="Google login" />
                Sign in with Google
              </button>
            </div>
          </form>
          <p>Copyright @ 2024 Banish</p>
        </div>
        <div className="anim-box">
          <img src={anim} alt="Home animation" id="anim" />
        </div>
      </div>
    </main>
  );
}
