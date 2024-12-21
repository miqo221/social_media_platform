import { useLocation } from "react-router-dom";
import "./Register.scss";

export const Register = () => {
  const location = useLocation();
  const { newUser } = location.state;
  console.log(newUser);

  return (
    <div>
      <h1>hello {newUser[0].name}</h1>
    </div>
  );
};
