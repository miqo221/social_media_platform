import { useReducer, useEffect } from "react";
import PropTypes from "prop-types";
import { ACTIONS, dashboardReducer } from "../../helpers/reducer";

import "./Dashboard.scss";

const initialState = {
  user: null,
};

export function Dashboard({ user }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  useEffect(() => {
    if (user) {
      dispatch({ type: ACTIONS.SET_USER, payload: user });
    }
  }, [user]);

  return state.user && <h2>Hello from {state.user.email}</h2>;
}

Dashboard.propTypes = {
  user: PropTypes.object,
};
