import { Link } from "react-router-dom";
import { useReducer } from "react";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import { nanoid } from "nanoid";
import { ClipLoader } from "react-spinners";
import { ACTIONS, loginReducer } from "../../helpers/reducer";
import { ERROR_MSG } from "../../config/messages.js";
import { user } from "../../constants/registration.js";
import RegistrationForm from "../../components/RegistrationForm/RegistrationForm";
import Animation from "../../components/Animation/Animation";
import logo from "../../assets/logo/icon.png";
import anim from "../../assets/png/home_anim.png";

import "./Register.scss";

const initialState = {
  error: null,
  googleSignIn: false,
  user: { ...user },
};

export const Register = () => {
  const [state, dispatch] = useReducer(loginReducer, initialState);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const { data: googleUserInfo } = await axios.get(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          { headers: { Authorization: `Bearer ${response.access_token}` } }
        );

        const userData = {
          email: googleUserInfo.email,
          name: googleUserInfo.given_name + " " + googleUserInfo.family_name,
          image: [googleUserInfo.picture],
          id: nanoid(),
        };

        const { data: existingUsers } = await axios.get(
          //! Checking if the user already exists
          "http://localhost:8001/users"
        );

        const userExists = existingUsers.some(
          (user) => user.email === userData.email
        );

        userExists
          ? dispatch({ type: ACTIONS.SET_ERROR, payload: ERROR_MSG.REGISTERED })
          : dispatch({
              type: ACTIONS.SET_USER,
              payload: { ...user, ...userData },
            }),
          dispatch({ type: ACTIONS.SET_GOOGLE_SIGN_IN, payload: true });
      } catch (error) {
        if (error.response?.status === 403) {
          dispatch({
            type: ACTIONS.SET_ERROR,
            payload: ERROR_MSG.GOOGLE_FETCH_ERROR,
          });
        } else if (error.response) {
          console.error("HTTP error:", error.response);
          dispatch({
            type: ACTIONS.SET_ERROR,
            payload: ERROR_MSG.SERVER_ERROR,
          });
        } else {
          console.error("System error:", error);
          dispatch({
            type: ACTIONS.SET_ERROR,
            payload: ERROR_MSG.IP_ERROR,
          });
        }
      }
    },
    onError: (error) => {
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: ERROR_MSG.FAILED_LOGIN,
      });
      console.error(error);
    },
    scope: "profile email",
  });

  return (
    <main className="register">
      {state.loading && <ClipLoader color="#34D399" />}
      <ToastContainer className="notification" />
      <div className="container">
        <div className="reg-box">
          <header>
            <Link to="/">
              <img src={logo} alt="Bchat" id="logo" />
              <h1>Bchat</h1>
            </Link>
          </header>
          <h2>REGISTRATION</h2>
          <RegistrationForm
            defaultValue={state.user}
            googleSignIn={state.googleSignIn}
            handleClick={handleGoogleLogin}
            initialState={initialState}
          />
        </div>
        <Animation anim={anim} />
      </div>
    </main>
  );
};
