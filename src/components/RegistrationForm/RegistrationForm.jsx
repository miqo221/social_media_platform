import { Fragment, useReducer } from "react";
import { Field, Form, Formik } from "formik";
import { signup } from "../../constants/registration";
import { object, string } from "yup";
import { ERROR_MSG } from "../../config/messages";
import { loginReducer, ACTIONS } from "../../helpers/reducer";

import "./RegistrationForm.scss";

const RegistrationForm = ({ handleClick, defaultValue, initialState }) => {
  const [state, dispatch] = useReducer(loginReducer, initialState);

  const {
    email,
    name,
    surname,
    birthday,
    address,
    postalCode,
    city,
    country,
    image,
    phone,
    password,
  } = defaultValue;

  const initialValues = {
    email,
    name,
    surname,
    birthday,
    address,
    postalCode,
    city,
    country,
    image,
    phone,
    password,
    sequrityQuestion: "",
    securityAnswer: "",
  };

  const validationSchema = object(
    signup.reduce((acc, field) => {
      switch (field.name) {
        case "name":
        case "surname":
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
            .required("E-mail is a required field");
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
        case "address":
          acc[field.name] = string()
            .min(5, "Address must be at least 5 characters")
            .max(100, "Address cannot exceed 100 characters")
            .required("Address is a required field");
          break;
        case "postalCode":
          acc[field.name] = string()
            .matches(/^\d{4,6}$/, "Postal code must be between 4 and 6 digits")
            .min(4, "Postal code must be at least 4 digits")
            .max(6, "Postal code cannot exceed 6 digits")
            .required("Postal code is a required field");
          break;

        case "country":
        case "city":
          acc[field.name] = string()
            .matches(/^[\p{L}\p{M}\s\-]{2,50}$/u, `Invalid format`)
            .min(2, `Invalid format`)
            .max(50, `Invalid format`)
            .required(`Required field`)
            .test(
              "capitalize",
              "Cities and countries starting with uppercase",
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
            .required("Mobile is a required field");
          break;
        case "securityQuestion":
          string().required("Security question is required");
        case "password":
          acc[field.name] = string()
            .matches(
              /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,16}$/,
              "Invalid Password, Use A,a,1,-,_"
            )
            .min(8, "Password must be at least 8 characters")
            .max(16, "Password cannot exceed 16 characters")
            .required("Password is a required field");
          break;

        default:
          break;
      }
      return acc;
    }, {})
  );

  const createUser = (values, formikEvent) => {
    if (values.password !== values.password2) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: ERROR_MSG.PASS_ERROR });
      return;
    }
    //TODO: to be continued
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, formikEvent) => createUser(values, formikEvent)}>
      <Form className="reg-form">
        {signup.map((elm, index) =>
          elm.type === "select" ? (
            <Field as="select" required key={index + elm.name}>
              <option hidden>Select a security question</option>
              {elm.value.map((value, i) => (
                <option value={value} key={i}>
                  {value}
                </option>
              ))}
            </Field>
          ) : elm.type === "file" ? (
            <Fragment key={index + elm.name}>
              <Field type={elm.type} name={elm.name} id={elm.id} required />
              <label htmlFor={elm.id}>
                <span>{elm.placeholder}</span>
                <span>
                  <i className="bi bi-camera"></i>
                </span>
              </label>
            </Fragment>
          ) : (
            <Field
              key={index + elm.name}
              type={elm.type}
              name={elm.name}
              placeholder={elm.placeholder}
              required
            />
          )
        )}
        {handleClick && (
          <button onClick={handleClick} type="button">
            Sign up with Google
          </button>
        )}
      </Form>
    </Formik>
  );
};

export default RegistrationForm;
