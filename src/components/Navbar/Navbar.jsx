import { NavLink } from "react-router-dom";
import logo from "../../assets/logo/icon.png";
import user from "../../assets/png/user.png";

import "./Navbar.scss";

const Navbar = ({ src, alt, id }) => {
  return (
    <nav>
      <div>
        <img src={logo} alt="Bchat" />
        <input type="text" placeholder="Search" />
      </div>
      <ul>
        <li>
          <NavLink to={`/dashboard/${id}`}>
            <i className="bi bi-house-door-fill"></i>
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile">
            <i className="bi bi-person-fill"></i>
          </NavLink>
        </li>
        <li>
          <NavLink to="/chat">
            <i className="bi bi-chat-fill"></i>
          </NavLink>
        </li>
        <li>
          <NavLink to="preferences">
            <i className="bi bi-gear-fill"></i>
          </NavLink>
        </li>
      </ul>
      <button>
        <img src={src ? src : user} alt={alt} />
      </button>
    </nav>
  );
};

export default Navbar;
