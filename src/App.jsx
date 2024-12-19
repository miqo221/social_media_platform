import { useReducer, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Login, Dashboard, Preferences } from "./pages";
import { appReducer, ACTIONS } from "./helpers/reducer";
import { ROUTES } from "./routes";
import "./App.scss";

const initialState = {
  token: null,
  user: null,
};

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const navigate = useNavigate();

  const setToken = async (token) => {
    await new Promise(resolve => setTimeout(resolve, 0));
    dispatch({ type: ACTIONS.SET_TOKEN, payload: token });
    localStorage.setItem("authToken", token);
  };

  const isTokenValid = async (token) => {
    try {
      const decodedToken = await new Promise((resolve, reject) => {
        try {
          const decoded = jwtDecode(token);
          resolve(decoded);
        } catch (error) {
          reject("Invalid token");
        }
      });

      return decodedToken.exp > Date.now() / 1000;
    } catch (error) {
      console.error("Invalid token:", error);
      return false;
    }
  };

  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem("authToken");

      if (storedToken && await isTokenValid(storedToken)) {
        const decodedToken = jwtDecode(storedToken);
        console.log(decodedToken);
        await setToken(storedToken);
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
  }, [state.token]);

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

  console.log(state.user, "state-user");

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
