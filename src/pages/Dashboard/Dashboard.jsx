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
import SkillsCard from "../../components/SkillsCard/SkillsCard";

export function Dashboard() {
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
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

  useEffect(() => {
    if (!user || !user.followers) return;

    const myFollowers = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_REACT_USERS_URL);

        const followerUsernames = new Set(
          user.followers.map((f) => f.username)
        );

        setFollowers(
          response.data.filter((follower) =>
            followerUsernames.has(follower.username)
          )
        );
      } catch (error) {
        console.error("Error fetching followers data:", error);
      }
    };

    myFollowers();
  }, [user]);

  const newActivity = async (e) => {
    e.preventDefault();

    const activityText = e.target[0].value.trim();
    if (!activityText) return;

    const updateUserIds = followers.map((follower) => follower.id);
    const IDs = [id, ...updateUserIds];

    const newPost = {
      post: activityText,
      date: new Date(),
      author: user.name,
      author_nickname: user.username,
      comments: [],
      likes: [],
    };

    try {
      await Promise.all(
        IDs.map(async (userId) => {
          try {
            const { data: userData } = await axios.get(
              `${import.meta.env.VITE_REACT_USERS_URL}/${userId}`
            );

            const updatedUser = {
              ...userData,
              posts: [newPost, ...(userData.posts || [])],
            };

            await axios.put(
              `${import.meta.env.VITE_REACT_USERS_URL}/${userId}`,
              updatedUser
            );

            try {
              const { data: onlineUserData } = await axios.get(
                `${import.meta.env.VITE_REACT_LOGGED_IN_USER_URL}/${userId}`
              );

              const updatedOnlineUser = {
                ...onlineUserData,
                posts: [newPost, ...(onlineUserData.posts || [])],
              };

              await axios.put(
                `${import.meta.env.VITE_REACT_LOGGED_IN_USER_URL}/${userId}`,
                updatedOnlineUser
              );
            } catch (onlineError) {
              console.warn(`Online user not found for ID ${userId}`);
            }

            if (userId === id) {
              setUser(updatedUser);
            }
          } catch (userError) {
            console.error(`Error updating user ID ${userId}:`, userError);
          }
        })
      );
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
                <SkillsCard userId={id} />
              </div>
              <div className="middle">
                <OnlineFollowers user={user} />
                <div className="activityShare">
                  <ActivityShare
                    src={user?.image[0]}
                    alt={user.name}
                    submit={(e) => newActivity(e)}
                    placeholder="Tell your friends about your thoughts.."
                  />
                </div>
                {user.posts.map((post, index) => (
                  <NewActivities
                    post={post}
                    timeAgo={timeAgo}
                    key={index}
                    myUser={user}
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
