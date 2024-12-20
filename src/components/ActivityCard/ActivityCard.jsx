import React from "react";

import verificationIcon from "../../assets/images/icons/verificationIcon.png";
import "./ActivityCard.scss";

const ActivityCard = ({ userPic, userName, activityType, activityTime }) => {
  return (
    <div className="activityCard">
      <div className="activityInfo">
        <div className="imgDiv">
          <img src={userPic} alt="Profile Picture" className="profilePic" />
          <img
            src={verificationIcon}
            alt="Verification Icon"
            className="verified"
          />
        </div>
        <div className="userInfo">
          <h6 className="userName">{userName}</h6>
          <p className="activity">
            {activityType} <span>{activityTime}</span>
          </p>
        </div>
      </div>
      <div className="buttonsDiv">
        {/* toxum em es buttonery stex - minchev verjnakan button component unenanq*/}
        <button className="remove">Remove</button>
        <button className="follow">Follow Back</button>
      </div>
    </div>
  );
};

export default ActivityCard;
