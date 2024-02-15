// Signup.jsx
// User signup form

import { useState } from "react";
import { useMutation } from "@apollo/client";

import { useNotification } from "../components/contextproviders/NotificationProvider.jsx";

import Header from "../components/other/Header";

import { ADD_USER } from "../utils/mutations";

import Auth from "../utils/auth";

const Signup = () => {

  // Notification context for error messages
  const { openNotification } = useNotification();

  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    middleName: "",
    lastName: "",
  });

  // Mutation for adding new user
  const [addUser, { error, data }] = useMutation(ADD_USER);

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // Handle error messages for signup form
  const handleSignupError = (error) => {
    let errorMessage = "";

    if (
      error.message.includes("Path `username` is required") &&
      !errorMessage
    ) {
      errorMessage = "Please enter a username.";
    } else if (
      error.message.includes(
        "E11000 duplicate key error collection: workflow-db.users index: username_1 dup key"
      ) &&
      !errorMessage
    ) {
      errorMessage =
        "This username is already taken, please choose a different one.";
    } else if (
      error.message.includes("Path `email` is required") &&
      !errorMessage
    ) {
      errorMessage = "Please enter an e-mail address.";
    } else if (
      error.message.includes(
        "This field must contain a valid e-mail address"
      ) &&
      !errorMessage
    ) {
      errorMessage = "Invalid e-mail address. Please try again.";
    } else if (
      error.message.includes(
        "E11000 duplicate key error collection: workflow-db.users index: email_1 dup key"
      ) &&
      !errorMessage
    ) {
      errorMessage =
        "There is already an account for that e-mail address, please log in instead.";
    } else if (
      error.message.includes("Path `firstName` is required.") &&
      !errorMessage
    ) {
      errorMessage = "Please enter your first name.";
    } else if (
      error.message.includes("Path `password` is required") &&
      !errorMessage
    ) {
      errorMessage = "Please enter a password.";
    } else if (
      error.message.includes(
        "is shorter than the minimum allowed length (8)"
      ) &&
      !errorMessage
    ) {
      errorMessage = "Your password must be at least 8 characters long.";
    } else {
      console.log(error);
      errorMessage = "An error occurred. Please try again.";
    }

    openNotification(errorMessage, "error");
  };

  // Handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);

    // Add user to database
    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      // Log user in and redirect to welcome page
      Auth.login(data.addUser.token, true);
    } catch (e) {
      console.error(e);
      handleSignupError(e);
    }
  };

  return (
    <main className="main-jg">
      <Header />
      <div className="login-signup-jg">
        <div className="box-jg login-signup-box-jg signup-box-jg">
          <h4>Sign Up</h4>
          <div className="signup-form-jg">
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
                    className="form-input login-signup-input-jg signup-left-margin-input-jg"
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
                    className="form-input login-signup-input-jg signup-left-margin-input-jg"
                    placeholder="Your middle name"
                    name="middleName"
                    type="text"
                    value={formState.name}
                    onChange={handleChange}
                  />
                  <input
                    className="form-input login-signup-input-jg signup-left-margin-input-jg"
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
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
