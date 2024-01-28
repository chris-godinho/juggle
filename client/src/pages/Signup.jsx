import { useState } from "react";

import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";

import Auth from "../utils/auth";

import Header from "../components/other/Header";

const Signup = () => {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    middleName: "",
    lastName: "",
  });
  const [addUser, { error, data }] = useMutation(ADD_USER);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      Auth.login(data.addUser.token, true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="main-jg">
      <Header />
      <div className="login-signup-jg">
        <div className="box-jg login-signup-box-jg signup-box-jg">
          <h4>Sign Up</h4>
          <div className="login-signup-form-jg">
            {data ? (
              <p>Sign up successful! Preparing your dashboard... </p>
            ) : (
              <form
                className="login-signup-form-fields-jg"
                onSubmit={handleFormSubmit}
              >
                <div className="login-signup-row-jg">
                  <input
                    className="form-input login-signup-input-jg"
                    placeholder="Your username"
                    name="username"
                    type="text"
                    value={formState.name}
                    onChange={handleChange}
                  />
                  <input
                    className="form-input login-signup-input-jg"
                    placeholder="Your email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="login-signup-row-jg">
                  <input
                    className="form-input login-signup-input-jg"
                    placeholder="Your first name"
                    name="firstName"
                    type="text"
                    value={formState.name}
                    onChange={handleChange}
                  />
                  <input
                    className="form-input login-signup-input-jg"
                    placeholder="Your middle name"
                    name="middleName"
                    type="text"
                    value={formState.name}
                    onChange={handleChange}
                  />
                  <input
                    className="form-input login-signup-input-jg"
                    placeholder="Your last name"
                    name="lastName"
                    type="text"
                    value={formState.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="login-signup-row-jg">
                  <input
                    className="form-input login-signup-input-jg"
                    placeholder="Your password"
                    name="password"
                    type="password"
                    value={formState.password}
                    onChange={handleChange}
                  />
                </div>
                <button
                  className="button-jg login-signup-button-jg"
                  type="submit"
                >
                  Submit
                </button>
              </form>
            )}

            {error && <div>{error.message}</div>}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
