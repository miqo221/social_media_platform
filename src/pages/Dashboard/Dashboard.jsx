import axios from "axios";
import "./Dashboard.scss";
import { useParams } from "react-router-dom";
import UserAvatar from "../../components/UserAvatar/UserAvatar";
import { useEffect, useState } from "react";
import ActivityShare from "../../components/ActivityShare/ActivityShare";
import { timeAgo } from "../../constants/functions";
import Navbar from "../../components/Navbar/Navbar";
import NewActivities from "../../components/NewActivities/NewActivities";

export function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_LOGGED_IN_USER_URL}/${id}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const newActivity = async (e) => {
    e.preventDefault();
    const url = `${import.meta.env.VITE_REACT_LOGGED_IN_USER_URL}/${id}`;

    const activityText = e.target[0].value.trim();
    if (!activityText) {
      return;
    }

    try {
      const updatedUser = {
        ...user,
        posts: [
          {
            post: activityText,
            date: new Date(),
            author: user.name,
            author_nickname: user.username,
            comments: [],
            likes: [],
          },
          ...user.posts,
        ],
      };
      const response = await axios.put(url, updatedUser);
      response.data.posts && setUser(response.data);
    } catch (error) {
      console.error("Error updating activity:", error);
    }

    e.target.reset();
  };

  return (
    <main className="dashboard">
      {user && (
        <>
          <Navbar
            src={user.image[0] || null}
            alt={user.username}
            id={user.id}
          />
          <div className="container">
            <div className="dashboard-body">
              <div className="left-side">
                <UserAvatar
                  followers={user.followers.length}
                  following={user.following.length}
                  img={user.image[0] || null}
                  alt={user.name}
                  name={user.name}
                  email={user.username}
                  status={user.status || "Hi"}
                  path={"/profile"}
                />
              </div>
              <div className="middle">
                <div className="activity-share">
                  <ActivityShare
                    src={user?.image[0]}
                    alt={user.name}
                    submit={(e) => newActivity(e)}
                    placeholder="Tell your friends about your thoughts.."
                  />
                </div>
                {user.posts.map((post) => (
                  <NewActivities
                    post={post}
                    user={user}
                    image={user.image[0] || null}
                    timeAgo={timeAgo}
                  />
                ))}
              </div>
              <div className="right-side"></div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
