import { useLocation } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Link,  useNavigate } from "react-router-dom";
import axios from "axios";
import { loginReducer, ACTIONS } from "../../helpers/reducer";
import { ToastContainer, toast } from "react-toastify";
import { ROUTES } from "../../routes";
import google from "../../assets/png/google.png";

import "./Register.scss";

export const Register = () => {
  const location = useLocation();
  const { newUser } = location.state;
  
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
    <div>
      <h1>hello {newUser[0].name}</h1>
    </div>
  );
};
