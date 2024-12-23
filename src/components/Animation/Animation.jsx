import "./Animation.scss";

const Animation = ({ anim, alt }) => {
  return (
    <div className="anim-box">
      <img src={anim} alt="Home animation" id="anim" className="animtaion"/>
    </div>
  );
};

export default Animation;
