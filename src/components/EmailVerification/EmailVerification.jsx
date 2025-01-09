import { useRef, useEffect, useReducer } from "react";
import axios from "axios";
import Button from "../Button/Button";
import { loginReducer, ACTIONS } from "../../helpers/reducer";
import { ERROR_MSG, SUCCESS_MSG } from "../../config/messages";

import "./EmailVerification.scss";

const EmailVerification = ({
  verificationCode,
  changeToggleModal,
  verifyEmail,
  cancel,
  initialState,
  navigate,
  path,
  toast,
}) => {
  const inputsRef = useRef([]);
  const [state, dispatch] = useReducer(loginReducer, initialState);

  useEffect(() => {
    if (state.error) toast.error(state.error);
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });
  }, [state.error]);

  useEffect(() => {
    if (state.success) toast.success(state.success);
    dispatch({ type: ACTIONS.SET_SUCCESS, payload: null });
  }, [state.success]);

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  const handleInputChange = (e, index) => {
    const { value } = e.target;

    if (value.length > 1) {
      e.target.value = value[0];
    }

    if (value.length === 1 && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    const enteredCode = inputsRef.current.map((input) => input.value).join("");
    if (enteredCode === String(verificationCode)) {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        verifyEmail();
        await axios.post(import.meta.env.VITE_REACT_USERS_URL, state.user);
        setTimeout(() => {
          navigate(path);
        }, 3000);
      } catch (error) {
        dispatch({
          type: ACTIONS.SET_ERROR,
          payload: ERROR_MSG.SERVER_ERROR,
        });
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        dispatch({
          type: ACTIONS.SET_SUCCESS,
          payload: SUCCESS_MSG.REGISTRATION,
        });
        changeToggleModal();
      }
    } else {
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: ERROR_MSG.VERIFICATION_ERROR,
      });
      inputsRef.current.forEach((input) => {
        input.value = "";
      });
      inputsRef.current[0]?.focus();
    }
  };

  return (
    <div className="formBox">
      <p>A verification code was sent to your email, please confirm it</p>
      <form onSubmit={(e) => handleVerifyEmail(e)}>
        <div className="inputField">
          {Array(6)
            .fill("")
            .map((_, index) => (
              <input
                key={index}
                type="text"
                placeholder="-"
                maxLength="1"
                ref={(el) => (inputsRef.current[index] = el)}
                onChange={(e) => handleInputChange(e, index)}
                required
              />
            ))}
        </div>
        <div className="btnField">
          <Button
            button_class="btnSignIn"
            content="Submit"
            button_type="submit"
          />
          <Button
            button_class="btnSignIn"
            content="Cancel"
            button_function={cancel}
          />
        </div>
      </form>
    </div>
  );
};

export default EmailVerification;
