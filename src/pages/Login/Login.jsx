import { useReducer, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { loginReducer, ACTIONS } from "../../helpers/reducer";

import axios from "axios";

import logo from "../../assets/logo/icon.png";
import google from "../../assets/png/google.png";
import anim from "../../assets/png/home_anim.png";

import "./Login.scss";

const initialState = {
  email: "",
  password: "",
  error: null,
  loading: false,
};

export function Login() {
  const [state, dispatch] = useReducer(loginReducer, initialState);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const googleUserInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: { Authorization: `Bearer ${response.access_token}` },
          }
        );

        const userData = {
          email: googleUserInfo.data.email,
          name: googleUserInfo.data.name,
          surname: googleUserInfo.data.family_name,
          image: googleUserInfo.data.picture,
        };

        console.log(userData); // getting user data from google

        await axios({
          baseURL: "http://localhost:8001",
          url: "users",
          method: "POST",
          data: userData,
        }).then((res) => console.log(res.data));

        dispatch({
          type: ACTIONS.SET_USER,
          payload: userData,
        });
      } catch (error) {
        dispatch({
          type: ACTIONS.SET_ERROR,
          payload: error,
        });
      }
    },
    onError: (error) => {
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: error,
      });
    },
    scope: "profile email",
  });

  useEffect(() => {
    if (state.email) {
      console.log(state);
    }
  }, [state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    try {
      const response = await axios.get("http://localhost:8001/users", {
        params: { email: state.email },
      });

      const user = response.data[0];
    } catch (error) {
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: error,
      });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  return (
    <main className="home">
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
                type="text"
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
                  <input type="checkBox" id="remember_me" />
                  <label htmlFor="remember_me" id="label_remember"></label>
                  <span>Remember me</span>
                </div>
                <Link>Forgot Password</Link>
                {state.error && <p className="error">{state.error}</p>}
              </div>
            </div>
            <div className="btn-box">
              <button type="submit" disabled={state.loading}>
                {state.loading ? "Loading..." : "Submit"}
              </button>
              <button type="button" onClick={handleGoogleLogin}>
                <img src={google} alt="" />
                Sign in with Google
              </button>
            </div>
          </form>
          <p>Copyright @ 2024 Banish</p>
        </div>
        <div className="anim-box">
          <img src={anim} alt="Home" id="anim" />
        </div>
      </div>
    </main>
  );
}
