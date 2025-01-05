import "./Animation.scss";

const Animation = ({ anim, alt }) => {
  return (
    <div className="animBox">
      <img src={anim} alt="Home animation" className="animation"/>
    </div>
  );
};

export default Animation;
