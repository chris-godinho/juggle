import { useRouteError } from "react-router-dom";

import BackButton from "../components/other/BackButton";

import Auth from "../utils/auth";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  const logout = (event) => {
    // Log user out and return them to welcome page
    event.preventDefault();
    Auth.logout();
    window.location.href = "/";
  };

  return (
    <main className="main-jg">
      <div id="error-page-jg">
        <div>
          <img
            className="clown-error-jg"
            src="/clown_welcome.png"
            alt="clown"
          />
        </div>
        <div>
          <h1>Oops!</h1>
          <p>Sorry, an unexpected error has occurred.</p>
          <p>
            <i>{error.statusText || error.message}</i>
          </p>
          <div className="error-button-tray-jg">
            <BackButton />
            <button onClick={logout} className="button-jg error-button-jg">
              Logout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
