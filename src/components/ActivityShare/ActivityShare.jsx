import user from "../../assets/png/user.png";

import "./ActivityShare.scss";

const ActivityShare = ({ src, alt, submit, placeholder }) => {
  return (
    <form onSubmit={submit} className="activityForm">
      <div className="imgBox">
        <img src={src ? src : user} alt={alt} />
      </div>
      <div className="inputBox">
        <input type="text" placeholder={placeholder} />
        <button type="submit">
          <i className="bi bi-send"></i>
        </button>
      </div>
    </form>
  );
};

export default ActivityShare;
