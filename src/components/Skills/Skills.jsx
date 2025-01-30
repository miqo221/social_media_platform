import { useEffect, useState } from "react";
import Button from "../Button/Button";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDataOfSkills } from "../../store/Selectors/skillsSelector";
import { removeSkills } from "../../store/Actions/skillsActions";

import "./Skills.scss";
import {
  addSkillsMiddleware,
  getSkillsMiddleware,
} from "../../store/Reducers/skillsReducer";

const Skills = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const dataOfPerson = useSelector(getDataOfSkills);
  console.log(dataOfPerson.skillList);

  useEffect(() => {
    dispatch(getSkillsMiddleware(id));
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
            dispatch(addSkillsMiddleware(id, e.target[0].value));
            e.target.reset();
          }}
        >
          <input type="text" className="skills-2-input" placeholder="+" />
          <Button content={"Add"} button_class={"btn_skills"} />
        </form>
      </div>
      <div className="every-single-skill-div">
        {dataOfPerson?.skillList?.length > 0 ? (
          dataOfPerson.skillList.map((item) => {
            return (
              <div key={item.id} className="skill-div">
                <p className="skill-p">{item.text}</p>
                <i
                  className="bi bi-x"
                  onClick={() => {
                    dispatch(removeSkills(item.id));
                  }}
                ></i>
              </div>
            );
          })
        ) : (
          <p>No Skills</p>
        )}
      </div>
    </div>
  );
};

export default Skills;
