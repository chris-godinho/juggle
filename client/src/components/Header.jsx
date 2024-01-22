// Header.jsx

import { Link } from "react-router-dom";

import Auth from "../utils/auth";
import AuthService from "../utils/auth.js";

const Header = () => {
  
  const logout = (event) => {
    // Log user out and return them to welcome page
    event.preventDefault();
    Auth.logout();
    window.location.href = "/";
  };

  return (
    <header className="header-jg">
      <img
        src="/logo_1024x1024_transparent.png"
        alt="juggler logo"
        className="header-logo-jg"
      />
      <div className="header-brand-name-jg">
        <Link to="/">
          <h2>Juggler</h2>
        </Link>
      </div>
      <div>
        {Auth.loggedIn() ? (
          <>
            <p className="loggedin-text-jg">{AuthService.getProfile().data.username}</p>
            <button onClick={logout} className="button-jg header-button-jg">
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="button-jg header-button-jg">
              <Link to="/login">Login</Link>
            </button>
            <button className="button-jg header-button-jg">
              <Link to="/signup">Signup</Link>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
