import userImage from "../../assets/png/user.png";
import check from "../../assets/png/check.png";
import ActivityShare from "../ActivityShare/ActivityShare";

import "./NewActivities.scss";
import { useState, useEffect } from "react";
import axios from "axios";

const NewActivities = ({ post, timeAgo, myUser }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_REACT_USERS_URL);
        setUser(
          response.data.filter((u) => u.username === post.author_nickname)
        );
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [post]);

  return (
    user && (
      <article>
        <div className="n-a-t">
          <div className="img-box">
            <img
              src={user[0].image[0] ? user[0].image[0] : userImage}
              alt={post.author}
            />
          </div>
          <div className="n-a-tt">
            <p>
              <span>{post.author_nickname}</span>
              <img src={check} alt="check" />
            </p>
            <div>
              <h3>{post.author}</h3>
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
        <ActivityShare
          placeholder="Write your comment..."
          src={myUser.image[0] ? myUser.image[0] : userImage}
        />
      </article>
    )
  );
};

export default NewActivities;
