import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import userImage from "../../assets/png/user.png";
import axios from "axios";

import "./OnlineFollowers.scss";
import "swiper/css";

const OnlineFollowers = ({ user }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getOnlineUsers = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_REACT_LOGGED_IN_USER_URL
        );
        const filteredUsers = response.data.filter((onlineUser) =>
          user?.following?.some((f) => f.username === onlineUser.username)
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching online users:", error);
      }
    };

    getOnlineUsers();
  }, [user]);

  return (
    <div className="onlineFollowers">
      <Swiper
        spaceBetween={40}
        slidesPerView={7}
        onSlideChange={() => console.log("Slide change")}
        onSwiper={(swiper) => console.log(swiper)}>
        <SwiperSlide>
          <div className="imgBox">
            <img src={user.image[0] || userImage} alt={user.name} />
          </div>
          <span>{user.username}</span>
        </SwiperSlide>
        {users.length > 0 &&
          users.map((us, index) => (
            <SwiperSlide key={index}>
              <div className="imgBox">
                <img src={us.image[0] || userImage} alt={us.name} />
              </div>
              <span>{us.username}</span>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default OnlineFollowers;
