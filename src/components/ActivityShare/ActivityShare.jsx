import "./ActivityShare.scss";
import user from "../../assets/png/user.png";

const ActivityShare = ({ src, alt, submit, placeholder }) => {
  return (
    <form onSubmit={submit} className="activity-form">
      <div className="img-box">
        <img src={src ? src : user} alt={alt} />
      </div>
      <div className="input-box">
        <input type="text" placeholder={placeholder} />
        <button type="submit">
          <i className="bi bi-send"></i>
        </button>
      </div>
    </form>
  );
};

export default ActivityShare;
