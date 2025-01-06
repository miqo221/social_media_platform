import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import Button from "../../components/Button/Button";
import Animation from "../../components/Animation/Animation";
import logo from "../../assets/logo/icon.png";
import anim from "../../assets/png/home_anim.png";

import "./RecoverPassword.scss";

export const RecoverPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const questionAnswerMap = {
    q1: "blue",
    q2: "fluffy",
    q3: "smith",
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) setStep(2);
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (
      answer.trim().toLowerCase() ===
      questionAnswerMap[selectedQuestion].toLowerCase()
    ) {
      setStep(3);
    } else {
      alert("Incorrect answer. Please try again.");
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === repeatPassword) alert("Password updated successfully!");
    else alert("Passwords do not match. Please try again.");
  };

  return (
    <main className="RecoverPassword">
      <ToastContainer className="notification" />
      <div className="container">
        <div className="reg-box">
          <header>
            <img src={logo} alt="Bchat" id="logo" />
            <h1>Bchat</h1>
          </header>
          <h2>Recover Password</h2>
          {step === 1 && (
            <form onSubmit={handleEmailSubmit}>
              <div className="input-box">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="btn-box">
                <Button
                  button_type="submit"
                  content={"Next Step"}
                  button_class="btn_sign_in"
                />
              </div>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleAnswerSubmit}>
              <div className="input-box">
                <label>Security Question</label>
                <select
                  className="question-select"
                  value={selectedQuestion}
                  onChange={(e) => setSelectedQuestion(e.target.value)}
                >
                  <option value="" hidden>
                    Select a Question
                  </option>
                  <option value="q1">What is your favorite color?</option>
                  <option value="q2">What is your pet's name?</option>
                  <option value="q3">What is your mother's maiden name?</option>
                </select>
              </div>
              <div className="input-box">
                <label>Answer</label>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </div>
              <div className="btn-box">
                <Button
                  button_type="submit"
                  content={"Next Step"}
                  button_class="btn_sign_in"
                />
              </div>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="input-box">
                <label>New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="input-box">
                <label>Repeat Password</label>
                <input
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              <div className="btn-box">
                <Button
                  button_type="submit"
                  content={"Update Password"}
                  button_class="btn_sign_in"
                />
              </div>
            </form>
          )}
          <p>Copyright @ 2024 Banish</p>
        </div>
        <Animation anim={anim} />
      </div>
    </main>
  );
};
