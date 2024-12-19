import { useReducer } from "react";
import logo from "../../assets/logo/icon.png";
import anim from "../../assets/png/home_anim.png";
import PropTypes from "prop-types";
import axios from "axios";
import { loginReducer, ACTIONS } from "../../helpers/reducer";
import "./Login.scss";

const initialState = {
  email: "",
  password: "",
  error: null,
  loading: false,
};

export function Login({ setToken }) {
  const [state, dispatch] = useReducer(loginReducer, initialState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    try {
      const response = await axios.post("http://localhost:8000/login", {
        email: state.email,
        password: state.password,
      });

      const token = response.data.token;
      localStorage.setItem("authToken", token);

      setToken(token);
    } catch (error) {
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: error.response?.data?.message || "An unexpected error occurred",
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
            <label>
              <p>Email</p>
              <input
                type="text"
                value={state.email}
                onChange={(e) =>
                  dispatch({ type: ACTIONS.SET_EMAIL, payload: e.target.value })
                }
              />
            </label>
            <label>
              <p>Password</p>
              <input
                type="password"
                value={state.password}
                onChange={(e) =>
                  dispatch({ type: ACTIONS.SET_PASSWORD, payload: e.target.value })
                }
              />
            </label>
            {state.error && <p className="error">{state.error}</p>}
            <div>
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
        <div className="anim-box">
          <img src={anim} alt="Home" id="anim" />
        </div>
      </div>
    </main>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
