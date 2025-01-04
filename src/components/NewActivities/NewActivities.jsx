import "./NewActivities.scss";
import userImage from "../../assets/png/user.png";
import check from "../../assets/png/check.png";
import ActivityShare from "../ActivityShare/ActivityShare";

const NewActivities = ({ post, user, timeAgo, image }) => {
  return (
    <article>
      <div className="n-a-t">
        <div className="img-box">
          <img src={image || userImage} alt={user.name} />
        </div>
        <div className="n-a-tt">
          <p>
            <span>{user.username}</span>
            <img src={check} alt="check" />
          </p>
          <div>
            <h3>{user.name}</h3>
            <span>{timeAgo(post.date)}</span>
          </div>
        </div>
      </div>
      <p className="post">{post.post}</p>
      {post.images &&
        post.images.map((img, i) => {
          post.images.length === 1 ? (
            <img src={img} alt={post.post} />
          ) : post.images.length > 1 && post.images.length <= 4 ? (
            <img src={img} alt="" className={i === 0 ? "main-img" : ""} />
          ) : (
            <img
              src={img}
              alt=""
              className={i === 0 ? "main-img" : i > 3 ? "hidden" : ""}
            />
          );
        })}
      <div className="btn-row">
        <ul>
          <li>
            <button>
              <i className="bi bi-heart"></i>
            </button>
          </li>
          <li>
            <button>
              <i className="bi bi-chat-dots"></i>
            </button>
          </li>
          <li>
            <button>
              <i className="bi bi-send"></i>
            </button>
          </li>
        </ul>
      </div>
      <ActivityShare placeholder="Write your comment..."/>
    </article>
  );
};

export default NewActivities;
