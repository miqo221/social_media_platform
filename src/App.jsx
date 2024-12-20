import { useReducer, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Login, Dashboard, Preferences } from "./pages";
import { ROUTES } from "./routes";
import { appReducer, ACTIONS } from "./helpers/reducer";

import "./App.scss";

const initialState = {
  token: null,
  user: null,
};

function App() {
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
        <Route
          path={ROUTES.DASHBOARD}
          element={<Dashboard user={state.user} />}
        />
        <Route path={ROUTES.PREFERENCES} element={<Preferences />} />
      </Routes>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default App;
