import { useReducer, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Login,
  Dashboard,
  Preferences,
  Messages,
  Profile,
  NotFound,
} from "./pages";
import { ROUTES } from "./routes";
import { appReducer, ACTIONS } from "./helpers/reducer";
import Button from "./components/Buttons/Button";
import ActivityCard from "./components/ActivityCard/ActivityCard";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.scss";

const initialState = {
  token: null,
  user: null,
};

function App() {
  const [user, setUser] = useState([]);
  const [state, dispatch] = useReducer(appReducer, initialState);
  const navigate = useNavigate();

  const setToken = (token) => {
    dispatch({ type: ACTIONS.SET_TOKEN, payload: token });
    localStorage.setItem("authToken", token);
  };

  const isTokenValid = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const validateToken = () => {
      const storedToken = localStorage.getItem("authToken");

      if (storedToken && isTokenValid(storedToken)) {
        const decodedToken = jwtDecode(storedToken);
        setToken(storedToken);
        dispatch({ type: ACTIONS.SET_USER, payload: decodedToken });
      } else {
        localStorage.removeItem("authToken");
        navigate(ROUTES.DASHBOARD);
      }
    };

    validateToken();
  }, [navigate]);

  useEffect(() => {
    if (state.token && !state.user) {
      const decodedToken = jwtDecode(state.token);
      dispatch({ type: ACTIONS.SET_USER, payload: decodedToken });
    }
  }, [state.token, state.user]);

  useEffect(() => {
    if (!state.token) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [state.token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    dispatch({ type: ACTIONS.SET_TOKEN, payload: null });
    dispatch({ type: ACTIONS.SET_USER, payload: null });
    navigate(ROUTES.DASHBOARD);
  };

  if (!state.token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div className="app">
      <Routes>
        <Route path={ROUTES.HOME}>
          <Route index element={<Login />} />
          <Route
            path={ROUTES.DASHBOARD}
            element={<Dashboard user={state.user} />}
          />
          <Route path={ROUTES.PREFERENCES} element={<Preferences />} />
          <Route path={ROUTES.MESSAGES} element={<Messages />} />
          <Route path={ROUTES.PROFILE} element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      {/* <button onClick={handleLogout}>Logout</button> */}

      {/* <div className="container">
        <Button
          button_function={() => console.log("Sign In")}
          id="signIn"
          content="Sign In"
          button_class="btn_sign_in"
        />
        <Button
          button_function={() => console.log("Sign In With Google")}
          id="signInWithGoogle"
          content="Sign In With Google"
          button_class="btn_sign_in_google"
        />
        <Button
          button_function={() => console.log("My Profile")}
          id="myProfile"
          content="My Profile"
          button_class="btn_my_profile"
        />
        <Button
          button_function={() => console.log("Save")}
          id="save"
          content="Save"
          button_class="btn_save"
        />
        <Button
          button_function={() => console.log("Follow Back")}
          id="followBack"
          content="Follow Back"
          button_class="btn_follow_back"
        />
        <Button
          button_function={() => console.log("Remove")}
          id="remove"
          content="Remove"
          button_class="btn_remove"
        />
        <Button
          button_function={() => console.log("Edit Profile")}
          id="editProfile"
          content="Edit profile"
          button_class="btn_edit_profile"
        />
      </div> */}
    </div>
  );
}

export default App;
