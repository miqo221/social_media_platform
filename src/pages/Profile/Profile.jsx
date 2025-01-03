import Skills from "../../components/Skills/Skills";
import Modal from "../../components/Modal/Modal";
import "./Profile.scss";

export function Profile() {
  return (
    <div>
      <p>Profile</p>
      <Skills initialSkill={["human"]} />
      <Modal modal_p={"Sure to delete this skill ?"} />
    </div>
  );
}
