import "./Button.scss";

const Button = ({
  content,
  button_class,
  button_function,
  button_type,
  button_disabled,
  button_id,
}) => {
  return (
    <>
      {/* <button className="btn_sign_in">Sign In</button>
      <button className="btn_sign_in_google">Sign In With Google</button>
      <button className="btn_my_profile">My Profile</button>
      <button className="btn_save">Save</button>
      <button className="btn_follow_back">Follow Back</button>
      <button className="btn_remove">Remove</button>
      <button className="btn_edit_profile">Edit profile</button> */}
      <button
        id={button_id}
        className={button_class}
        onClick={button_function}
        type={button_type}
        disabled={button_disabled}>
        {content}
      </button>
    </>
  );
};

export default Button;
