import { useGoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "axios";
import { loginReducer, ACTIONS } from "../../helpers/reducer";
import { ROUTES } from "../../routes";
import google from "../../assets/png/google.png";
import logo from "../../assets/logo/icon.png";
import anim from "../../assets/png/home_anim.png";
import Animation from "../../components/Animation/Animation";
import RegistrationForm from "../../components/RegistrationForm/RegistrationForm";

import "./Register.scss";

export const Register = () => {
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

  return (
    <main className="register">
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
          <RegistrationForm />
        </div>
        <Animation anim={anim} />
      </div>
    </main>
  );
};
