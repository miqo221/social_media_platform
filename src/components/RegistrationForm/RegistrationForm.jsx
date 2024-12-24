import { Field, Form, Formik } from "formik";
import { signup } from "../../constants/registration";

import "./RegistrationForm.scss";

const RegistrationForm = () => {
  return (
    <Formik>
      <Form className="reg-form">
        {signup.map((elm, index) =>
          elm.type === "select" ? (
            <Field as="select" required>
              <option disabled selected>
                Select a security question
              </option>
              {elm.value.map((value) => (
                <option value={value}>{value}</option>
              ))}
            </Field>
          ) : (
            <Field
              key={index}
              type={elm.type}
              name={elm.name}
              placeholder={elm.placeholder}
              required
            />
          )
        )}
      </Form>
    </Formik>
  );
};

export default RegistrationForm;
