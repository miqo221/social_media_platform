import { useDispatch, useSelector } from "react-redux";
import Button from "../Button/Button";
import { getSkillsData } from "../../store/skillSlice/skillSlice";
import { useEffect } from "react";
import {
  addSkills,
  fetchSkills,
  removeSkill,
} from "../../store/skillSlice/api";
import { useParams } from "react-router-dom";

import "./Skills.scss";

const Skills = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, loading } = useSelector(getSkillsData);

  useEffect(() => {
    dispatch(fetchSkills(id));
  }, []);

  return (
    <div className="section-skills">
      <div className="skills-1">
        <p>Skills</p>
      </div>
      <div className="skills-2">
        <form
          className="skills-2-form"
          onSubmit={(e) => {
            e.preventDefault();
            const newSkill = e.target[0].value.trim();
            if (newSkill) {
              dispatch(addSkills({ userId: id, newSkill }));
              e.target.reset();
            } else {
              alert("Skill cannot be empty!");
            }
          }}
        >
          <input type="text" className="skills-2-input" placeholder="+" />
          <Button content={"Add"} button_class={"btn_skills"} />
        </form>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="every-single-skill-div">
          {data.length > 0 ? (
            data.map((item, index) => {
              return (
                <div key={index} className="skill-div">
                  <p className="skill-p">{item.text}</p>
                  <i
                    className="bi bi-x"
                    onClick={() => {
                      dispatch(removeSkill({ userId: id, skillId: item.id }));
                    }}
                  ></i>
                </div>
              );
            })
          ) : (
            <p>No Skills</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Skills;
