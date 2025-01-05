import { useEffect, useState } from "react";

import Button from "../Button/Button";

import "./Skills.scss";

const Skills = ({ initialSkill }) => {
  const [skills, setSkills] = useState(initialSkill);
  const [length, setLength] = useState(skills.length);

  const addNewSkill = (e) => {
    e.preventDefault();
    setSkills([...skills, e.target[0].value]);
    setLength(skills.length);
    e.target.reset();
  };

  useEffect(() => {
    setSkills(
      Array.from(
        new Set(
          skills.map((skill) => {
            skill = skill.toLowerCase();
            return skill.replace(skill[0], skill[0].toUpperCase());
          })
        )
      )
    );
  }, [length]);

  const deleteSkill = (item) => {
    setSkills(skills.filter((skill) => skill !== item));
  };

  return (
    <div className="section-skills">
      <div className="skills-1">
        <p>Skills</p>
      </div>
      <div className="skills-2">
        <form
        className="skills-2-form"
          onSubmit={(e) => {
            addNewSkill(e);
          }}
        >
          <input type="text" className="skills-2-input" placeholder="+" />
          <Button content={"Add"} button_class={"btn_skills"} />
        </form>
      </div>
      <div className="every-single-skill-div">
        {skills.map((item, index) => {
          return (
            <div key={index} className="skill-div">
              <p className="skill-p">{item}</p>
              <i
                className="bi bi-x"
                onClick={() => {
                  deleteSkill(item);
                }}
              ></i>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Skills;
