// ContactUs.jsx
// HeroTofu-powered contact form

import { useState } from "react";
import { validateEmail } from "../../utils/helpers.js";

// Define HeroTofu form endpoint
const FORM_ENDPOINT =
  "https://public.herotofu.com/v1/555ff790-bcb1-11ee-870a-ff8e0d81300a";

function ContactUs() {
  // Define fields state variables for the form
  const [senderName, setSenderName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Define functions for handling form input changes and form submission
  const handleInputChange = (e) => {
    const { target } = e;
    const inputType = target.name;
    const inputValue = target.value;

    setErrorMessage("");

    if (inputType === "senderName") {
      setSenderName(inputValue);
    } else if (inputType === "email") {
      setEmail(inputValue);
    } else {
      setMessage(inputValue);
    }
  };

  const handleFormSubmit = (e) => {
    // Prevent default form submission behavior
    e.preventDefault();

    // Validate form input
    if (!senderName) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!validateEmail(email) || !email) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!message) {
      setErrorMessage("Please enter a message.");
      return;
    }

    // Define data object for form submission
    const inputs = e.target.elements;
    const data = {};

    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].name) {
        data[inputs[i].name] = inputs[i].value;
      }
    }

    // Submit form data to HeroTofu form endpoint
    fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Form response was not ok");
        }

        setSenderName("");
        setEmail("");
        setMessage("");
        setSuccessMessage("Your message has been sent, thank you.");
      })
      .catch((err) => {
        e.target.submit();
      });
  };

  return (
    <div className="modal-inner-content-jg">
      <h1 className="contact-title-jg">Contact Us</h1>
      {errorMessage !== "" && (
        <p className="contact-user-message-jg work-text-jg">{errorMessage}</p>
      )}
      {successMessage !== "" && (
        <p className="contact-user-message-jg life-text-jg">{successMessage}</p>
      )}
      <form className="contact-form-container-jg" onSubmit={handleFormSubmit}>
        <label htmlFor="exampleFormControlInput2" className="hidden-jg">
          Name
        </label>
        <input
          value={senderName}
          name="senderName"
          onChange={handleInputChange}
          type="senderName"
          placeholder="name"
          className="form-control"
          id="exampleFormControlInput1"
        />
        <label htmlFor="exampleFormControlInput2" className="hidden-jg">
          E-mail
        </label>
        <input
          value={email}
          name="email"
          onChange={handleInputChange}
          type="email"
          placeholder="email address"
          className="form-control"
          id="exampleFormControlInput2"
        />
        <label htmlFor="exampleFormControlTextarea1" className="hidden-jg">
          Message
        </label>
        <textarea
          value={message}
          name="message"
          onChange={handleInputChange}
          type="message"
          placeholder="your message"
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="10"
        />
        <button type="submit" className="button-jg">
          Submit
        </button>
      </form>
    </div>
  );
}

export default ContactUs;
