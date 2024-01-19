import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";

import Auth from "../utils/auth";
import Header from "../components/Header";

const Login = (props) => {
  const [formState, setFormState] = useState({ username: "", password: "" });
  const [login, { error, data }] = useMutation(LOGIN_USER);

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);
    try {
      const { data } = await login({
        variables: { ...formState },
      });

      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    // clear form values
    setFormState({
      username: "",
      password: "",
    });
  };

  return (
    <main className="main-jg">
      <Header />
      <div className="login-signup-box-container-jg">
        <div className="box-jg login-signup-box-jg">
          <h4>Login</h4>
          <div className="login-signup-form-jg">
            {data ? (
              <p>Login successful! Preparing your dashboard... </p>
            ) : (
              <form
                className="login-signup-form-fields-jg"
                onSubmit={handleFormSubmit}
              >
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
                  placeholder="Your password"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                />
                <button
                  className="button-jg login-signup-button-jg"
                  style={{ cursor: "pointer" }}
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

export default Login;
