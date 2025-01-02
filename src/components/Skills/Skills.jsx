import "./Skills.scss";

const Skills = ({ skill }) => {
  return (
    <div className="section-skills">
      <div className="skills-1">
        <p>Skills</p>
      </div>
      <div className="skills-2">
        <input type="text" className="skills-2-input" value="+" />
        <button>Add</button>
      </div>
    </div>
  );
};

export default Skills;
