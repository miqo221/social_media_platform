import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import "./Dashboard.scss";

export function Dashboard({ user }) {
  const [loadedUser, setLoadedUser] = useState(null);

  useEffect(() => {
    if (user) {
      setLoadedUser(user);
    }
  }, [user]);
  console.log(user, "user");

  return loadedUser && <h2>Hello from {loadedUser?.email}</h2>;
}

Dashboard.propTypes = {
  user: PropTypes.object,
};
