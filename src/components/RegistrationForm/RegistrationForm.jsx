import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { object, string } from "yup";
import { toast, ToastContainer } from "react-toastify";
import { ClipLoader } from "react-spinners";
import useToggle from "../../hooks/useToggle";
import { loginReducer, ACTIONS } from "../../helpers/reducer";
import { ERROR_MSG } from "../../config/messages";
import { signup } from "../../constants/registration";
import google from "../../assets/png/google.png";
import Button from "../Button/Button";

import "./RegistrationForm.scss";

const RegistrationForm = ({
  handleClick,
  defaultValue,
  initialState,
  googleSignIn,
  path,
}) => {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const navigate = useNavigate();
  const { toggle, changeToggle } = useToggle();
  const { toggle: toggle2, changeToggle: changeToggle2 } = useToggle();

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state.error]);

  useEffect(() => {
    if (state.success) toast.success("Registration was successful");
  }, [state.success]);

  const [formValues, setFormValues] = useState({
    ...defaultValue,
    password: "",
    password2: "",
  });

  useEffect(() => {
    if (googleSignIn) {
      setFormValues({
        ...defaultValue,
        password: "",
        password2: "",
      });
    }
  }, [googleSignIn, defaultValue]);

  const validationSchema = object(
    signup.reduce((acc, field) => {
      switch (field.name) {
        case "securityAnswer":
          acc[field.name] = string()
            .min(2, `${field.placeholder} must be at least 2 characters`)
            .max(50, `${field.placeholder} cannot exceed 50 characters`)
            .required(`${field.placeholder} is a required field`);
          break;
        case "email":
          acc[field.name] = string()
            .matches(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              "E-mail must be a valid email address"
            )
            .required("E-mail is a required field")
            .test("user-match", "Email already exists", async (value) => {
              if (!value) return true;
              try {
                const response = await axios.get(
                  import.meta.env.VITE_REACT_USERS_URL
                );
                const userExists = response.data.some(
                  (user) => user.email === value
                );
                return !userExists;
              } catch (error) {
                console.error(error);
                return false;
              }
            });
          break;
        case "birthday":
          acc[field.name] = string()
            .matches(
              /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/,
              "Date must be in dd.mm.yyyy format"
            )
            .required("Required field")
            .test("age", "You must be at least 15 years old", (value) => {
              if (!value) return false;

              const [day, month, year] = value
                .split(".")
                .map((v) => parseInt(v, 10));
              const birthDate = new Date(year, month - 1, day);
              const today = new Date();

              const age = today.getFullYear() - birthDate.getFullYear();
              const isYearBefore =
                today.getMonth() < birthDate.getMonth() ||
                (today.getMonth() === birthDate.getMonth() &&
                  today.getDate() < birthDate.getDate());

              return age > 15 || (age === 15 && !isYearBefore);
            });
          break;
        case "address":
          acc[field.name] = string()
            .min(5, "Address must be at least 5 characters")
            .max(100, "Address cannot exceed 100 characters")
            .required("Address is a required field");
          break;
        case "postalCode":
          acc[field.name] = string()
            .matches(/^\d{4,6}$/, "Invalid ZIP code")
            .required("Postal code is a required field");
          break;
        case "country":
        case "city":
        case "name":
          acc[field.name] = string()
            .matches(/^[\p{L}\p{M}\s\-]{2,50}$/u, `Invalid format`)
            .min(2, `Invalid format`)
            .max(50, `Invalid format`)
            .required(`${field.placeholder} is a required field`)
            .test(
              "capitalize",
              `${field.placeholder} starts with uppercase`,
              (value) => {
                if (!value) return true;
                const words = value.split(" ");
                const formattedWords = words.map((word) => {
                  return (
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  );
                });
                return formattedWords.join(" ") === value;
              }
            );
          break;
        case "phone":
          acc[field.name] = string()
            .matches(
              /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
              "Invalid phone number"
            )
            .required("Phone number is a required field");
          break;
        case "password":
          acc[field.name] = string()
            .matches(
              /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
              "Minimum 8 characters, at least 1 letter & 1 number"
            )
            .min(8, `${field.placeholder} must be at least 8 characters`)
            .max(16, `${field.placeholder} cannot exceed 16 characters`)
            .required(`${field.placeholder} is a required field`);
          break;
        case "username":
          acc[field.name] = string()
            .matches(
              /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
              "Minimum 6 characters, at least 1 letter & 1 number"
            )
            .min(6, `${field.placeholder} must be at least 6 characters`)
            .max(20, `${field.placeholder} cannot exceed 20 characters`)
            .required(`${field.placeholder} is a required field`)
            .test("user-match", "Email already exists", async (value) => {
              if (!value) return true;
              try {
                const response = await axios.get(
                  import.meta.env.VITE_REACT_USERS_URL
                );
                const userExists = response.data.some(
                  (user) => user.username === `@${value.toLowerCase()}`
                );
                return !userExists;
              } catch (error) {
                console.error(error);
                return false;
              }
            });
          break;
        case "password2":
          acc[field.name] = string()
            .required("Confirm password is required")
            .test("", "Passwords must match", function (value) {
              const { password } = this.options.context || {};
              return value === password;
            });
          break;
        case "gender":
        case "securityQuestion":
          acc[field.name] = string()
            .required("Gender is required")
            .notOneOf([""], "Gender is required");
        default:
          break;
      }
      return acc;
    }, {})
  );

  const createUser = async (values, formikEvent) => {
    if (values.password !== values.password2) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: ERROR_MSG.PASS_ERROR });
      return;
    }

    const { password2, ...newUser } = values;
    newUser.age = getAge(values.birthday);
    newUser.username = `@${values.username.toLowerCase()}`;

    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      await axios.post(import.meta.env.VITE_REACT_USERS_URL, newUser);
      setTimeout(() => {
        formikEvent.resetForm();
        navigate(path);
      }, 3000);
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: ERROR_MSG.SERVER_ERROR });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      console.error(error);
    } finally {
      dispatch({ type: ACTIONS.SET_SUCCESS, payload: true });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  function getAge(birthdate) {
    const [day, month, year] = birthdate.split(".").map(Number);
    const dateOfBirth = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const hasHadBirthday =
      today.getMonth() > dateOfBirth.getMonth() ||
      (today.getMonth() === dateOfBirth.getMonth() &&
        today.getDate() >= dateOfBirth.getDate());
    return hasHadBirthday ? age : age - 1;
  }

  return (
    <>
      <ToastContainer className="notification" />
      <Formik
        initialValues={formValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={(values, formikEvent) => createUser(values, formikEvent)}>
        {({ errors, touched }) => (
          <Form className="regForm">
            {signup.map((elm, index) => {
              const fieldError = errors[elm.name];
              const fieldTouched = touched[elm.name];

              const fieldClassName =
                fieldTouched && fieldError
                  ? "inputError inputField"
                  : fieldTouched
                  ? "inputValid inputField"
                  : "inputField";

              const showSuccessIcon = fieldTouched && !fieldError;

              if (elm.type === "select") {
                return (
                  <fieldset className={fieldClassName} key={index}>
                    <Field as="select" name={elm.name}>
                      {elm.value.map((option, i) =>
                        i === 0 ? (
                          <option key={i + option} value="" hidden>
                            {option}
                          </option>
                        ) : (
                          <option key={i} value={option}>
                            {option}
                          </option>
                        )
                      )}
                    </Field>
                    {(fieldError || fieldTouched) && (
                      <legend className="errorMessage">
                        {showSuccessIcon && <span>✔</span>}
                        {fieldError && (
                          <ErrorMessage name={elm.name} component="span" />
                        )}
                      </legend>
                    )}
                  </fieldset>
                );
              } else if (elm.name === "email" && googleSignIn) {
                return (
                  <fieldset className={fieldClassName} key={index}>
                    <Field
                      type={elm.type}
                      name={elm.name}
                      placeholder={elm.placeholder}
                      autoComplete="off"
                      readOnly
                    />
                    {(fieldError || fieldTouched) && (
                      <legend className="errorMessage">
                        {showSuccessIcon && <span>✔</span>}
                        {fieldError && (
                          <ErrorMessage name={elm.name} component="span" />
                        )}
                      </legend>
                    )}
                  </fieldset>
                );
              } else {
                return (
                  <fieldset className={fieldClassName} key={index}>
                    <Field
                      type={
                        elm.name !== "password" && elm.name !== "password2"
                          ? elm.type
                          : elm.name === "password"
                          ? toggle
                            ? "password"
                            : "text"
                          : elm.name === "password2"
                          ? toggle2
                            ? "password"
                            : "text"
                          : elm.type
                      }
                      name={elm.name}
                      placeholder={elm.placeholder}
                    />
                    {(fieldError || fieldTouched) && (
                      <legend className="errorMessage">
                        {showSuccessIcon && <span>✔</span>}
                        {fieldError && (
                          <ErrorMessage name={elm.name} component="span" />
                        )}
                      </legend>
                    )}
                    {elm.name === "password" && (
                      <i
                        className={`bi bi-${toggle ? "eye" : "eye-slash"}`}
                        onClick={changeToggle}></i>
                    )}
                    {elm.name === "password2" && (
                      <i
                        className={`bi bi-${toggle2 ? "eye" : "eye-slash"}`}
                        onClick={changeToggle2}></i>
                    )}
                  </fieldset>
                );
              }
            })}
            <div className="buttonField">
              {" "}
              {handleClick && (
                <Button
                  button_class="btnSignIn"
                  button_function={handleClick}
                  button_type="button"
                  content={
                    state.loading ? (
                      <ClipLoader size={15} color="white" />
                    ) : (
                      <>
                        <img src={google} alt="" />
                        Sign up with Google
                      </>
                    )
                  }
                />
              )}
              <Button
                button_class="btnSignIn"
                button_type="submit"
                content={
                  state.loading ? (
                    <ClipLoader size={15} color="white" />
                  ) : (
                    "Confirm"
                  )
                }
              />
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default RegistrationForm;
