import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSkillsData } from "../../store/skillSlice/skillSlice";
import { fetchSkills } from "../../store/skillSlice/api";

import "./SkillsCard.scss";

const SkillsCard = ({ userId }) => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector(getSkillsData);

  useEffect(() => {
    dispatch(fetchSkills(userId));
  }, []);

  return (
    <div className="skillCard">
      <h2>Skills</h2>
      <div className="skillBox">
        {loading ? (
          <p>Loading...</p>
        ) : (
          data.map((skill) => {
            return (
              <p className="oneSkill" key={skill.id}>
                {skill.text}
              </p>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SkillsCard;
