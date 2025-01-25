import Button from "../Button/Button";

import { useDispatch, useSelector } from "react-redux";
import { getText } from "../../store/Selectors/skillsSelector";
import { addSkills, removeSkills } from "../../store/Actions/skillsActions";

import "./Skills.scss";
import { useParams } from "react-router-dom";

const Skills = () => {
  const dispatch = useDispatch();
  const skillList = useSelector(getText);
  const { id } = useParams();

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
            dispatch(addSkills(e.target[0].value));
            e.target.reset();
          }}
        >
          <input type="text" className="skills-2-input" placeholder="+" />
          <Button content={"Add"} button_class={"btn_skills"} />
        </form>
      </div>
      <div className="every-single-skill-div">
        {skillList?.map((item) => {
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
        })}
      </div>
    </div>
  );
};

export default Skills;
