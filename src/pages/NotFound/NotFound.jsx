import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import { ROUTES } from "../../routes";
import notFoundImg from "../../assets/images/png/pageNotFound.png";

import "./NotFound.scss";

export const NotFound = () => {
  return (
    <div className="notFoundPage">
      <Link to={ROUTES.HOME}>
        <Button
          content="Go To Login Page"
          button_class="notFound_page_button"
          button_type="submit"
          button_disabled={false}
        />
      </Link>
      <div className="notFoundBox">
        <h1>Page Not Found.</h1>
        <img src={notFoundImg} alt="Not Found Image" />
      </div>
    </div>
  );
};
