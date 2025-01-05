import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import UserAvatar from "../../components/UserAvatar/UserAvatar";
import ActivityShare from "../../components/ActivityShare/ActivityShare";
import Navbar from "../../components/Navbar/Navbar";
import NewActivities from "../../components/NewActivities/NewActivities";
import { timeAgo } from "../../constants/functions";

import "./Dashboard.scss";
import OnlineFollowers from "../../components/OnlineFollowers/OnlineFollowers";

export function Dashboard() {
  const [user, setUser] = useState(null);
  const [loggedUsers, setLoggedUsers] = useState([])
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${import.meta.env.VITE_REACT_LOGGED_IN_USER_URL}/${id}`
  //       );
  //       setUser(response.data);
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchUser();
  // }, [id]);

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
    // const myFollowings = 

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
            <div className="dashboardBody">
              <div className="leftSide">
                <UserAvatar
                  followers={user.followers.length}
                  following={user.following.length}
                  img={user.image[0] || null}
                  alt={user.name}
                  name={user.name}
                  email={user.username}
                  status={user.status || `Hi, I'm ${user.name}`}
                  path={"/profile"}
                />
              </div>
              <div className="middle">
                <OnlineFollowers user={user}/>
                <div className="activityShare">
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
              <div className="rightSide"></div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
