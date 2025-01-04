import bg from "../../assets/png/circle.png";
import "./UserAvatar.scss";
import Button from "../Button/Button";
import user from "../../assets/png/user.png";

const UserAvatar = ({
  following,
  followers,
  img,
  name,
  email,
  status,
  path,
}) => {
  return (
    <div className="thumbnail">
      <img src={bg} alt="background image" className="bg-img" />
      <div className="userInfo">
        <div className="followerRow">
          <div className="userAvatar">
            <img src={img ? img : user} alt={name} />
          </div>
          <div className="follow">
            <span>{followers}</span>
            <p>Followers</p>
          </div>
          <div className="follow">
            <span>{following}</span>
            <p>Following</p>
          </div>
        </div>
        <div className="userInfoRow">
          <h2>{name}</h2>
          <p>{email}</p>
        </div>
        <div className="status-row">
          <p className="status">{status}</p>
        </div>
        {path && (
          <div className="button">
            <Button
              button_class="btn_my_profile"
              content="My Profile"
              path={path}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAvatar;
