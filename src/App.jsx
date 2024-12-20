import Button from "./components/Buttons/Button";
import ActivityCard from "./components/ActivityCard/ActivityCard";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

function App() {
  return (
    <div className="app">
      <div className="container">
        <Button
          button_function={() => console.log("Sign In")}
          id="signIn"
          content="Sign In"
          button_class="btn_sign_in"
        />
        <Button
          button_function={() => console.log("Sign In With Google")}
          id="signInWithGoogle"
          content="Sign In With Google"
          button_class="btn_sign_in_google"
        />
        <Button
          button_function={() => console.log("My Profile")}
          id="myProfile"
          content="My Profile"
          button_class="btn_my_profile"
        />
        <Button
          button_function={() => console.log("Save")}
          id="save"
          content="Save"
          button_class="btn_save"
        />
        <Button
          button_function={() => console.log("Follow Back")}
          id="followBack"
          content="Follow Back"
          button_class="btn_follow_back"
        />
        <Button
          button_function={() => console.log("Remove")}
          id="remove"
          content="Remove"
          button_class="btn_remove"
        />
        <Button
          button_function={() => console.log("Edit Profile")}
          id="editProfile"
          content="Edit profile"
          button_class="btn_edit_profile"
        />
      </div>
    </div>
  );
}

export default App;
